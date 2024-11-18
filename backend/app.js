const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const fs = require("fs");
require("dotenv").config();
const session = require("express-session");

const app = express();
const categoryRoute = require("./routes/category");
const userRoute = require("./routes/user");
const tempUserRoute = require("./routes/temporary_user");
const { Category, Product, Product_line, Reviews } = require("./model/model");

// Kết nối MongoDB
async function connectDB() {
    try {
        await mongoose.connect(process.env.DB_URL, {});
        console.log("Connected to MongoDB");
    } catch (err) {
        console.error("Connection error:", err.message); // Chi tiết lỗi
        process.exit(1);
    }
}

// Middleware CORS - Đặt ở trên cùng để đảm bảo xử lý trước các route khác
app.use(
    cors({
        origin: "http://localhost:4200", // Địa chỉ frontend
        methods: ["GET", "POST", "PUT", "DELETE"], // Các phương thức được phép
        credentials: true, // Cho phép gửi cookie và session
    })
);

// Middleware khác
app.use(bodyParser.json({ limit: "50mb" }));
app.use(morgan("common"));
app.use(
    session({
        secret: process.env.SESSION_SECRET || "default_secret_key", // Chuỗi bí mật
        resave: false, // Không lưu session nếu không có thay đổi
        saveUninitialized: false, // Không lưu session trống
        cookie: {
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 ngày
            httpOnly: true, // Ngăn cookie bị truy cập từ JavaScript
            secure: false, // Bật khi sử dụng HTTPS
            sameSite: "strict", // Ngăn chặn CSRF
        },
    })
);

// Gắn route
app.use('/category', categoryRoute);
app.use('/user', userRoute);
app.use('/register-temp', tempUserRoute);

// Endpoint kiểm tra server
app.get('/', (req, res) => {
    res.status(200).json({ message: "API is running" });
});

// Hàm nhập dữ liệu từ JSON (nếu IMPORT_DATA = true)
// Hàm nhập dữ liệu từ JSON (nếu IMPORT_DATA = true)
async function importData() {
    console.log("Starting data import...");
    try {
        const dataPath = path.resolve(__dirname, process.env.DATA_FILE_PATH);
        const data = JSON.parse(fs.readFileSync(dataPath, "utf-8"));
        console.log("File JSON loaded successfully");

        for (const productData of data) {
            console.log(`Processing product: ${productData.product_name}`);

            // Kiểm tra nếu sản phẩm đã tồn tại
            let product = await Product.findOne({ product_name: productData.product_name });
            if (!product) {
                product = new Product({
                    product_name: productData.product_name,
                    product_description: productData.product_description,
                    product_price: productData.product_price,
                    category_name: productData.category_name,
                    product_gender: productData.product_gender,
                    customizable: productData.customizable,
                    product_material: productData.product_material,
                    product_shape: productData.product_shape,
                    stock: productData.stock,
                    creation_datetime: productData.creation_datetime || Date.now()
                });
            }

            // Thêm product_lines
            for (const line of productData.product_lines || []) {
                product.product_lines.push({
                    product_line_name: line.product_line_name,
                    image_urls: line.image_urls,
                    image_paths: line.image_paths
                });
            }

            // Thêm reviews
            for (const review of productData.reviews || []) {
                const reviewDoc = await Reviews.create({
                    product_id: product._id, // Liên kết với sản phẩm
                    username: review.username,
                    title: review.title,
                    rating: review.rating,
                    review_text: review.review_text,
                    prescription_type: review["prescription type"], // Lấy từ JSON
                    creation_datetime: new Date() // Hoặc từ JSON nếu có
                });
                product.reviews.push(reviewDoc._id); // Chỉ lưu _id vào sản phẩm
            }

            // Lưu sản phẩm
            await product.save();
            console.log(`Saved product: ${productData.product_name}`);
        }

        console.log("Data import completed successfully.");
    } catch (err) {
        console.error("Error importing data:", err.stack);
    }
}


// Khởi động server và nhập dữ liệu nếu cần
(async () => {
    await connectDB();

    // Kiểm tra flag IMPORT_DATA trong .env
    if (process.env.IMPORT_DATA === "true") {
        await importData();
    }

    app.listen(3001, () => {
        console.log("Server is running on port 3001");
    });
})();
