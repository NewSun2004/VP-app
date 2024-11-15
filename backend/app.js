const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
const bodyParser = require("body-parser");
const morgan = require("morgan");
require("dotenv").config();

const app = express();
const categoryRoute = require("./routes/category");
const userRoute = require("./routes/user");
const { Category, Product, Product_line, Reviews } = require("./model/model");

// Kết nối MongoDB
async function connectDB() {
    try {
        await mongoose.connect(process.env.DB_URL, {});
        console.log("Connected to MongoDB");
    } catch (err) {
        console.error("Connection error", err);
        process.exit(1);
    }
}

// Hàm nhập dữ liệu từ JSON
async function importData() {
    console.log("Starting data import...");

    try {
        // Lấy đường dẫn từ .env và tạo đường dẫn tuyệt đối
        const dataPath = path.resolve(__dirname, process.env.DATA_FILE_PATH);
        const data = JSON.parse(fs.readFileSync(dataPath, "utf-8"));
        console.log("File JSON loaded successfully");

        for (const categoryData of data) {
            console.log(`Processing category: ${categoryData.category_name}`);

            // Kiểm tra và thêm Category
            let category = await Category.findOne({ category_name: categoryData.category_name });
            if (!category) {
                category = new Category({ category_name: categoryData.category_name });
                await category.save();
                console.log(`Saved category: ${categoryData.category_name}`);
            }

            // Xử lý các sản phẩm trong danh mục
            for (const productData of categoryData.products) {
                console.log(`Processing product: ${productData.product_name}`);

                let product = await Product.findOne({ product_name: productData.product_name });
                if (!product) {
                    product = new Product({
                        product_name: productData.product_name,
                        product_description: productData.product_description,
                        product_price: productData.product_price,
                        category_id: category._id,
                        product_gender: productData.product_gender,
                        customizable: productData.customizable,
                        product_material: productData.product_material,
                        product_shape: productData.product_shape,
                        creation_datetime: productData.creation_datetime || Date.now()
                    });
                }

                // Xử lý Product_lines
                const productLines = [];
                for (const line of productData.product_lines || []) {
                    const productLine = new Product_line({
                        product_id: product._id,
                        product_line_name: line.product_line_name,
                        image_urls: line.image_urls,
                        image_paths: line.image_paths
                    });
                    await productLine.save();
                    productLines.push(productLine._id);
                }
                product.product_lines = productLines;

                // Xử lý Reviews
                const reviews = [];
                for (const review of productData.reviews || []) {
                    const reviewEntry = new Reviews({
                        product_id: product._id,
                        title: review.title,
                        rating: review.rating,
                        review_text: review.review_text,
                        creation_datetime: review.creation_datetime || Date.now()
                    });
                    await reviewEntry.save();
                    reviews.push(reviewEntry._id);
                }
                product.reviews = reviews;

                await product.save();
                console.log(`Saved product: ${productData.product_name}`);

                // Thêm sản phẩm vào danh mục
                if (!category.products.includes(product._id)) {
                    category.products.push(product._id);
                }
            }

            await category.save();
            console.log(`Updated category with products: ${categoryData.category_name}`);
        }

        console.log("Data import completed successfully.");
    } catch (err) {
        console.error("Error importing data:", err.message);
    }
}

// Thiết lập server
app.use(bodyParser.json({ limit: "50mb" }));
app.use(cors());
app.use(morgan("common"));

app.use('/category', categoryRoute);
app.use('/user', userRoute);

// Khởi động server và nhập dữ liệu nếu cần
(async () => {
    await connectDB();

    // Kiểm tra xem có nên nhập dữ liệu không (có thể sử dụng biến môi trường hoặc tham số)
    if (process.env.IMPORT_DATA === "true") {
        await importData();
    }

    app.listen(3000, () => {
        console.log("Server is running on port 3000");
    });
})();
