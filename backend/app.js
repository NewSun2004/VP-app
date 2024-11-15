const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");
const bodyParser = require("body-parser");
const morgan = require("morgan");
require("dotenv").config();

const app = express();
const categoryRoute = require("./routes/category");
const userRoute = require("./routes/user");
const tempUserRoute = require("./routes/temporary_user");

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

// Hàm nhập dữ liệu từ JSON (nếu IMPORT_DATA = true)
async function importData() {
    console.log("Starting data import...");

    try {
        const dataPath = path.resolve(__dirname, process.env.DATA_FILE_PATH);
        const data = JSON.parse(fs.readFileSync(dataPath, "utf-8"));
        console.log("File JSON loaded successfully");

        // Lặp qua dữ liệu và xử lý các danh mục và sản phẩm
        for (const categoryData of data) {
            console.log(`Processing category: ${categoryData.category_name}`);

            let category = await Category.findOne({ category_name: categoryData.category_name });
            if (!category) {
                category = new Category({ category_name: categoryData.category_name });
                await category.save();
                console.log(`Saved category: ${categoryData.category_name}`);
            }

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

                if (!category.products.includes(product._id)) {
                    category.products.push(product._id);
                }
            }

            await category.save();
            console.log(`Updated category with products: ${categoryData.category_name}`);
        }

        console.log("Data import completed successfully.");
    } catch (err) {
        console.error("Error importing data:", err.stack);
    }
}

// Middleware
app.use(bodyParser.json({ limit: "50mb" }));
app.use(cors());
app.use(morgan("common"));

// Gắn route
app.use('/category', categoryRoute);
app.use('/user', userRoute);
app.use('/register-temp', tempUserRoute);

// Endpoint kiểm tra server
app.get('/', (req, res) => {
    res.status(200).json({ message: "API is running" });
});

// Khởi động server và nhập dữ liệu nếu cần
(async () => {
    await connectDB();

    // Kiểm tra flag IMPORT_DATA trong .env
    if (process.env.IMPORT_DATA === "true") {
        await importData();
    }

    app.listen(3000, () => {
        console.log("Server is running on port 3000");
    });
})();
