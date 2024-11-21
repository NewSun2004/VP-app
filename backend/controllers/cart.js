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
      const { cart_id, product_id } = req.body;

      // Check if the cart line already exists for the given cart_id and product_id
      const existingCartLine = await Cart_line.findOne({ cart_id, product_id });

      if (existingCartLine) {
        // If the cart line already exists, return the existing cart line
        return res.status(200).json(existingCartLine);
      }

      // If no existing cart line, create a new one
      const newCart_line = new Cart_line(req.body);
      const savedCart_line = await newCart_line.save();

      // After saving the cart line, add its ID to the corresponding cart
      await Cart.findByIdAndUpdate(
        cart_id, // cart_id sent in the request body
        { $push: { cart_line: savedCart_line._id } }, // Add the cart_line ID to the cart's cart_line array
        { new: true } // Return the updated cart document
      );

      res.status(200).json({
        message: "Cart line successfully added and cart updated!",
        cart_line: savedCart_line,
      });

    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error!", error: err.message });
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
