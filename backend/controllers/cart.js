const { Cart, Cart_line } = require("../model/model")

const cartController = {
  getCart: async (req, res) => {
    const {userId} = req.params

    try
    {
      const cart = await Cart.find({ user_id : userId })
      res.status(200).json(cart)
    }
    catch (error)
    {
      res.status(500).json({ error : error })
    }
  },
  getCartLine: async (req, res) => {
    const { cartId } = req.params;

    try
    {
      const cartLines = await Cart_line.find({ cart_id : cartId })
      res.status(200).json(cartLines)
    }
    catch (error)
    {
      res.status(500).json({ error : error })
    }
  },
  addCartline: async (req, res) => {
    try {
        // Tạo mới một cart_line từ dữ liệu gửi lên
        const newCart_line = new Cart_line(req.body);
        const savedCart_line = await newCart_line.save();

        // Sau khi lưu cart_line, thêm ID của nó vào cart tương ứng
        await Cart.findByIdAndUpdate(
            req.body.cart_id, // cart_id được gửi trong body
            { $push: { cart_line: savedCart_line._id } }, // Thêm cart_line ID vào cart_line array
            { new: true } // Trả về document sau khi cập nhật
        );

        res.status(200).json({
            message: "Cart line đã được thêm thành công và cập nhật vào cart!",
            cart_line: savedCart_line,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Lỗi server!", error: err.message });
    }
  },
  deleteCartLine: async (req, res) => {
    const { id: cartLineId } = req.params;  // Get cartLineId from params

    try {
      // First, find and delete the cart line
      const deletedCartLine = await Cart_line.findByIdAndDelete(cartLineId);

      // If no cart line was found and deleted, return a 404 error
      if (!deletedCartLine) {
        return res.status(404).json({ message: 'Cart line not found.' });
      }

      // After deleting the cart line, we also need to remove the reference from the associated cart
      const updatedCart = await Cart.findOneAndUpdate(
        { cart_line: cartLineId },  // Find the cart that references this cart line ID
        { $pull: { cart_line: cartLineId } },  // Remove the cart line reference
        { new: true }  // Return the updated cart document
      );

      // If no cart was found that referenced this cart line, return a 404 error
      if (!updatedCart) {
        return res.status(404).json({ message: 'Associated cart not found or updated.' });
      }

      // Respond with a success message and details of the deleted cart line and updated cart
      res.status(200).json({
        message: 'Cart line deleted successfully and reference removed from cart!',
        deletedCartLine,
        updatedCart,
      });

    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error while deleting cart line.', error: error.message });
    }
  }
}

module.exports = cartController;
