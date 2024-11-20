const { Cart, Cart_line } = require("../model/model")

const cartController = {
  getCart: async (req, res) => {
    const {userId} = req.params
    console.log(req.session.user)

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
      const cartLines = await Cart_line.find({ _id : cartId })
      res.status(200).json(cartLines)
    }
    catch (error)
    {
      res.status(500).json({ error : error })
    }
  },
  addCartLineToCart: async (req, res) => {
    const { cartID } = req.params

    try
    {
      const cartLine = new Cart_line(req.body);
      const saveCartLine = await cartLine.save();
      const cartUpdate = Cart.updateOne(
        {user_id : userId},
        {$push : {cart_line : saveCartLine._id}}
      )
      res.status(200).json(saveCartLine, cartUpdate);
    }
    catch (error)
    {
      res.status(500).json({ error : error });
    }
  }
}

module.exports = cartController;
