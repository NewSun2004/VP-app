const { Order, Payment, Invoice, Shipping, Cart_line } = require("../model/model");

const orderController = {
  // Create a new order
  createOrder: async (req, res) => {
    try {
      const {
        user_id,
        cart_line_ids,
        shipping_carrier,
        shipping_method,
        shipping_fee,
        total_amount,
        payment_method,
        payment_details, // For Banking method
        receiver_name,
        receiver_phone_number,
        destination,
      } = req.body;

      // Validate payment_method
      if (!payment_method || (payment_method !== "COD" && payment_method !== "Banking")) {
        return res.status(400).json({
          message: "Invalid or missing payment_method. It must be either 'COD' or 'Banking'.",
        });
      }

      // Validate payment details for Banking
      if (payment_method === "Banking") {
        const { account_name, account_number, bank_name } = payment_details || {};
        if (!account_name || !account_number || !bank_name) {
          return res.status(400).json({
            message: "For Banking payment method, account_name, account_number, and bank_name are required.",
          });
        }
      }

      // Retrieve cart_line information
      const cartLines = await Cart_line.find({ _id: { $in: cart_line_ids } });
      if (cartLines.length === 0) {
        return res.status(400).json({ message: "No cart lines found." });
      }

      // Convert cart_lines to order_lines
      const orderLines = cartLines.map((line) => ({
        has_customized: line.has_customized,
        product_id: line.product_id,
        for_customize_id: line.for_customize_id,
        quantity: line.quantity,
      }));

      // Create Order
      const newOrder = new Order({
        user_id,
        order_lines: orderLines,
        order_status: "Waiting for Payment",
      });
      await newOrder.save();

      // Create Payment
      const paymentDoc = new Payment({
        payment_method,
        payment_status: "Wait to Pay",
        account_name: payment_method === "Banking" ? payment_details.account_name : null,
        account_number: payment_method === "Banking" ? payment_details.account_number : null,
        bank_name: payment_method === "Banking" ? payment_details.bank_name : null,
        transaction_code: null, // Can be updated later
      });
      await paymentDoc.save();

      // Create Invoice
      const newInvoice = new Invoice({
        order_id: [newOrder._id],
        total_amount,
        payment_id: paymentDoc._id,
        payment_status: "Wait to Pay",
      });
      await newInvoice.save();

      // Create Shipping
      const newShipping = new Shipping({
        invoice_id: newInvoice._id,
        shipping_carrier,
        shipping_method,
        shipping_fee,
        receiver_name,
        receiver_phone_number,
        destination,
        shipping_status: "Pending",
      });
      await newShipping.save();

      // Delete cart_lines that were converted to order_lines
      await Cart_line.deleteMany({ _id: { $in: cart_line_ids } });

      res.status(201).json({
        message: "Order, Payment, Invoice, and Shipping created successfully.",
        order: newOrder,
        payment: paymentDoc,
        invoice: newInvoice,
        shipping: newShipping,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "An error occurred while creating the order.", error });
    }
  },

  // Update payment status
  updatePaymentStatus: async (req, res) => {
    try {
      const { payment_id, payment_status, payment_details } = req.body;

      // Find Payment by payment_id
      const payment = await Payment.findById(payment_id);
      if (!payment) {
        return res.status(404).json({ message: "Payment information not found." });
      }

      // Enforce transaction_code for Banking when marking as Completed
      if (payment.payment_method === "Banking" && payment_status === "Completed") {
        if (!payment_details?.transaction_code) {
          return res.status(400).json({
            message: "For Banking payment method, transaction_code is required when marking as Completed.",
          });
        }
        payment.transaction_code = payment_details.transaction_code;
      }

      // Update payment_status and other details
      payment.payment_status = payment_status;

      if (payment_status === "Completed") {
        payment.payment_datetime = new Date(); // Record payment time
      }

      await payment.save();

      // Sync payment status in Invoice
      const invoice = await Invoice.findOne({ payment_id });
      if (invoice) {
        invoice.payment_status = payment_status;
        await invoice.save();
      }

      res.status(200).json({
        message: "Payment status updated successfully.",
        payment,
        invoice,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "An error occurred while updating payment status.", error });
    }
  },

  // Update shipping status
  updateShippingStatus: async (req, res) => {
    try {
      const { shipping_id, shipping_status } = req.body;

      // Find Shipping by shipping_id
      const shipping = await Shipping.findById(shipping_id);
      if (!shipping) {
        return res.status(404).json({ message: "Shipping information not found." });
      }

      // Update shipping_status
      shipping.shipping_status = shipping_status;
      await shipping.save();

      // Find Invoice related to Shipping
      const invoice = await Invoice.findById(shipping.invoice_id);
      if (!invoice) {
        return res.status(404).json({ message: "Invoice related to shipping not found." });
      }

      // Sync order status with shipping status
      const order = await Order.findById(invoice.order_id[0]);
      if (order) {
        switch (shipping_status) {
          case "Pending":
            order.order_status = "Waiting for Shipment";
            break;
          case "In Transit":
            order.order_status = "Shipping";
            break;
          case "Completed":
            order.order_status = "Completed";
            break;
          case "Failed":
            order.order_status = "Shipping Failed";
            break;
          default:
            order.order_status = "Unknown";
        }
        await order.save();
      }

      // Special logic when shipping_method is COD
      if (shipping_status === "Completed" && shipping.shipping_method === "COD") {
        const payment = await Payment.findById(invoice.payment_id);
        if (payment && payment.payment_status !== "Completed") {
          payment.payment_status = "Completed";
          payment.payment_datetime = new Date(); // Record payment time
          await payment.save();

          // Sync payment status in Invoice
          invoice.payment_status = "Completed";
          await invoice.save();
        }
      }

      res.status(200).json({
        message: "Shipping status updated successfully.",
        shipping,
        order,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "An error occurred while updating shipping status.", error });
    }
  },

  // Get order details
  getOrderDetails: async (req, res) => {
    try {
      const { order_id } = req.params;

      const order = await Order.findById(order_id)
        .populate("order_lines.product_id")
        .populate({
          path: "order_lines.for_customize_id",
          select: "frame_color temple_color engraving_text",
        });

      if (!order) {
        return res.status(404).json({ message: "Order not found." });
      }

      const invoice = await Invoice.findOne({ order_id }).populate("payment_id");
      const shipping = await Shipping.findOne({ invoice_id: invoice._id });

      res.status(200).json({
        order,
        invoice,
        shipping,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "An error occurred while retrieving order details.", error });
    }
  },
};

module.exports = orderController;
