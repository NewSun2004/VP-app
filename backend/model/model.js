const mongoose = require("mongoose");
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    first_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
        required: true
    },
    user_email: {
        type: String,
        required: true,
        match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address']
    },
    user_password: {
        type: String,
        required: true
    },
    registration_datetime: {
        type: Date,
        default: Date.now
    },
    resetToken: String,
    resetTokenExpiry: Date,
    cart:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Cart"
    }
},
{versionKey: false})
// Middleware để mã hóa mật khẩu trước khi lưu
userSchema.pre('save', async function (next) {
    // Tạo giỏ hàng nếu chưa có giỏ hàng nào
    if (!this.cart) {
        const newCart = new Cart({ user_id: this._id });
        await newCart.save();
        this.cart = newCart._id; // Gán cart_id cho user
    }

    next();
  },{versionKey: false});

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
    category_name:{
        type: String,
        required: true
    },
    product_shape: {
        type: String
    },
    creation_datetime: {
        type: Date
    },
    reviews:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Reviews"
    }],
    product_lines:[{
        product_line_name: {
            type: String,
            required: true
        },
        image_urls:{
            type: [String]
        },
        image_paths: {type:[String]}

    }],
    stock: {
        type: Number,
        required: true
    }
},{versionKey: false})

const cartSchema = new mongoose.Schema({
    user_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    cart_line : [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Cart_line"
    }]
}, {versionKey: false})

const cart_lineSchema = new mongoose.Schema({
    cart_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Cart"
    },
    has_customized: {
        type: Boolean,
        required: true
    },
    product_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product"
    },
    selected_color_index : {
        type: Number,
        required: true
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
}, {versionKey: false})

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
 }, {versionKey: false})

 const orderSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    order_datetime: {
        type: Date,
        default: Date.now, // Ngày tạo
    },
    order_status: {
        type: String,
        required: true,
    },
    updated_datetime: {
        type: Date, // Cập nhật mỗi khi thay đổi order_status
    },
    order_lines: [{
        has_customized: {
            type: Boolean,
            required: true
        },
        product_id:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product"
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
    }],
}, {versionKey: false});

// Middleware trước khi lưu để cập nhật `updated_datetime` khi `order_status` thay đổi
orderSchema.pre('save', function (next) {
    if (this.isModified('order_status')) {
        this.updated_datetime = new Date();
    }
    next();
}, {versionKey: false});


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
}, {versionKey: false})

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
}, {versionKey: false})

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
}, {versionKey: false})

const reviewsSchema = new mongoose.Schema({
    product_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product"
    },
    username: {
        type: String,
        required: true
    },
    title: {
        type: String
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    review_text: String,
    prescription_type: String, // Thêm trường này
    creation_datetime: {
        type: Date,
        default: Date.now
    }
}, { versionKey: false });


const temporaryUserSchema = new mongoose.Schema({
    first_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
        required: true
    },
    user_email: {
        type: String,
        required: true,
        match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address']
    },
    user_password: {
        type: String,
        required: true
    },
    token: {
        type: String,
        required: true
    },
    token_expiry: {
        type: Date,
        default: Date.now,
        expires: 600 // Xóa sau 600 giây (10 phút)
    }
}, {versionKey: false})
// Middleware để mã hóa mật khẩu trước khi lưu
temporaryUserSchema.pre('save', async function (next) {
    if (this.isModified('user_password')) {
        const saltRounds = 10;
        this.user_password = await bcrypt.hash(this.user_password, saltRounds);
    }
    next();
});

let User = mongoose.model("User", userSchema);
let Product = mongoose.model("Product", productSchema)
let Cart = mongoose.model("Cart", cartSchema)
let Cart_line = mongoose.model("Cart_line", cart_lineSchema)
let Customize = mongoose.model("Customize", customizeSchema)
let Order = mongoose.model("Order", orderSchema)
let Invoice = mongoose.model("Invoice", invoiceSchema)
let Payment = mongoose.model("Payment", paymentSchema)
let Shipping = mongoose.model("Shipping", shippingSchema)
let Review = mongoose.model("Review", reviewsSchema)
let Temporary_user = mongoose.model("Temporary_user", temporaryUserSchema)

module.exports = { User, Product, Cart, Cart_line, Customize,
    Order, Invoice, Payment, Shipping, Review, Temporary_user
}
