const mongoose = require("mongoose");
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    user_name: {
        type: String,
        required: true
    },
    user_email: {
        type: String,
        required: true,
        match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address']
    },
    user_phone_number: {
        type: String,
        required: true,
        match: [/^\d{10}$/, 'Phone number must contain 10 digits']
    },
    user_password: {
        type: String,
        required: true
    },
    user_address: {
        type: String,
        required: true
    },
    registration_datetime: {
        type: Date,
        default: Date.now
    },
    cart:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Cart"
    }
})
// Middleware để mã hóa mật khẩu trước khi lưu
userSchema.pre('save', async function (next) {
    if (this.isModified('user_password')) {
      const saltRounds = 10;
      this.user_password = await bcrypt.hash(this.user_password, saltRounds);
    }
    // Tạo giỏ hàng nếu chưa có giỏ hàng nào
    if (!this.cart) {
        const newCart = new Cart({ user_id: this._id });
        await newCart.save();
        this.cart = newCart._id; // Gán cart_id cho user
    }

    next();
  });

const categorySchema = new mongoose.Schema({
    category_name: {
        type: String,
        required: true
    },
    products: [
        {
            type: mongoose.Schema.Types. ObjectId,
            ref: "Product"
        }
    ]
})

const productSchema = new mongoose.Schema({
    product_name: {
        type: String,
        required: true
    },
    product_description: {
        type: String
    },
    product_price:{
        type: Number,
        required: true,
        min: 0
    },
    category_id: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Category"
    },
    product_gender: {
        type: String
    },
    customizable:{
        type: Boolean,
        required: true
    },
    product_material: {
        type: String
    },
    product_shape: {
        type: String 
    },
    creation_datetime: {
        type: Date
    },
    product_lines:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product_line"
    }]
})

const product_lineSchema = new mongoose.Schema({
    product_id: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Product"
    },
    product_line_name: {
        type: String,
        required: true
    },
    color: {
        type: String
    },
    hexa_code : {
        type: String
    },
    imgs:{
        type: [String]
    }
})

const cartSchema = new mongoose.Schema({
    user_id:{
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User"
    },
    cart_line : [{
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Cart_line"
    }]
})

const cart_lineSchema = new mongoose.Schema({
    cart_id:{
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Cart"
    },
    has_customized: {
        type: Boolean,
        required: true
    },
    product_line_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product_line"
    },
    for_customize_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Customize"
    },
    quantity:{
        type: Number,
        required: true,
        min: 1
    }
})

const customizeSchema = new mongoose.Schema({
    product_id:{
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Product"
    },
    frame_color:String,
    temple_color: String,
    frame_hexa_color: String,
    temple_hexa_color: String,
    engraving_text: String
 })

 const orderSchema = new mongoose.Schema({
    user_id:{
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User"
    },
    order_Datetime: {
        type: Date,
        default: Date.now
    },
    order_line: [{
        type: mongoose.Schema.Types.ObjectId,
        ref:"Order_line"
    }]
})

const order_lineSchema = new mongoose.Schema({
    order_id:{
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Order"
    },
    has_customized: {
        type: Boolean,
        required: true
    },
    product_line_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product_line"
    },
    for_customize_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Customize"
    },
    quantity:{
        type: Number,
        required: true,
        min: 1
    }
})

const invoiceSchema = new mongoose.Schema({
    order_id:[{
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Order"
    }],
    creation_datetime:{
        type: Date,
        default: Date.now
    },
    total_amount: {
        type: Number,
        required: true
    },
    payment_id:{
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Payment"
    },
    payment_status:{
        type: String,
        required: true
    }
})

const paymentSchema = new mongoose.Schema({
    payment_method: {
        type: String,
        required: true
    },
    transaction_code: String,
    account_name: String,
    account_number: Number,
    bank_name: String,
    payment_datetime: {
        type: Date,
        default: Date.now
    }
})

const shippingSchema = new mongoose.Schema({
    invoice_id: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Invoice"
    },
    tracking_number:{
        type: String,
        required: true
    },
    shipping_carrier: {
        type: String,
        required: true
    },
    shipping_method:{
        type: String,
        required: true
    },
    receiver_name:{
        type: String,
        required: true
    },
    receiver_phone_number:{
        type: Number,
        required: true
    },
    destination:{
        type: String,
        required: true
    },
    shipping_fee:{
        type: Number,
        required: true,
        min: 0
    },
    shipping_status:{
        type: String,
        required: true
    },
    creation_datetime:{
        type: Date,
        required: true
    },
    delivery_success_datetime:{
        type: Date,
        required: true
    }
})

const reviewSchema = new mongoose.Schema({
    order_id: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Order"
    },
    rating:{
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    review_text: String,
    creation_datetime: {
        type: Date,
        default: Date.now
    }
})

let User = mongoose.model("User", userSchema);
let Category = mongoose.model("Category", categorySchema)
let Product = mongoose.model("Product", productSchema)
let Product_line = mongoose.model("Product_line", product_lineSchema)
let Cart = mongoose.model("Cart", cartSchema)
let Cart_line = mongoose.model("Cart_line", cart_lineSchema)
let Customize = mongoose.model("Customize", customizeSchema)
let Order = mongoose.model("Order", orderSchema)
let Order_line = mongoose.model("Order_line", order_lineSchema)
let Invoice = mongoose.model("Invoice", invoiceSchema)
let Payment = mongoose.model("Payment", paymentSchema)
let Shipping = mongoose.model("Shipping", shippingSchema)
let Review = mongoose.model("Review", reviewSchema)

module.exports = { User, Category, Product, Product_line, Cart, Cart_line, Customize, 
    Order, Order_line, Invoice, Payment, Shipping, Review
}