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
  }
}

module.exports = cartController;
