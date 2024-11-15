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
const productRoute = require("./routes/product");
const { Product, Product_line, Review } = require("./model/model");

// Kết nối MongoDB
async function connectDB() {
  try {
    await mongoose.connect(process.env.DB_URL, {});
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error("Connection error", err);
    process.exit(1); // Dừng server nếu kết nối thất bại
  }
}

// Hàm cập nhật `is_best_seller` cho các sản phẩm
async function updateBestSellers() {
  console.log("Starting best-seller update...");

  // Đặt số lượng review rating 5 cần thiết để trở thành best-seller
  const MIN_REVIEWS_FOR_BEST_SELLER = 3;

  try {
    const products = await Product.find();
    console.log(`Found ${products.length} products`);

    for (const product of products) {
      // Đếm số lượng review với rating là 5 cho từng sản phẩm
      const fiveStarReviewsCount = await Review.countDocuments({
        product_id: product._id,
        rating: 5,
      });

      // Cập nhật is_best_seller nếu số lượng review rating 5 >= MIN_REVIEWS_FOR_BEST_SELLER
      const isBestSeller = fiveStarReviewsCount >= MIN_REVIEWS_FOR_BEST_SELLER;
      await Product.updateOne(
        { _id: product._id },
        { is_best_seller: isBestSeller }
      );

      console.log(
        `Product ${product.product_name} updated to is_best_seller: ${isBestSeller}`
      );
    }

    console.log("Best-seller update completed.");
  } catch (error) {
    console.error("Error updating best-sellers:", error);
  }
}

// Hàm nhập dữ liệu từ JSON
async function importData() {
  console.log("Starting data import...");
  let successCount = 0;

  try {
    // Lấy đường dẫn từ .env và tạo đường dẫn tuyệt đối
    const dataPath = path.resolve(__dirname, process.env.DATA_FILE_PATH);
    const data = JSON.parse(fs.readFileSync(dataPath, "utf-8"));
    console.log("File JSON loaded successfully");

    for (const productData of data) {
      console.log(`Processing product: ${productData.product_name}`);

      // Kiểm tra xem product đã tồn tại chưa
      let product = await Product.findOne({
        product_name: productData.product_name,
      });
      if (!product) {
        product = new Product({
          product_name: productData.product_name,
          product_description: productData.product_description,
          product_price: productData.product_price,
          category_id: productData.category_id,
          product_gender: productData.product_gender,
          customizable: productData.customizable,
          product_material: productData.product_material,
          product_shape: productData.product_shape,
          creation_datetime: productData.creation_datetime || Date.now(),
        });
      }

      // Lưu các product_line của product và gán vào product
      const productLines = [];
      for (const line of productData.product_lines) {
        const productLine = new Product_line({
          product_id: product._id,
          product_line_name: line.product_line_name,
          color: line.color,
          hexa_code: line.hexa_code,
          imgs: line.imgs,
        });
        await productLine.save();
        console.log(`Saved product line: ${line.product_line_name}`);
        productLines.push(productLine._id);
      }

      product.product_lines = productLines;
      await product.save();
      console.log(`Saved product: ${productData.product_name}`);
      successCount++;
    }

    console.log(
      `Data imported successfully. Total products imported: ${successCount}`
    );
  } catch (err) {
    console.error("Error importing data:", err);
  }
}

// Thiết lập server
app.use(bodyParser.json({ limit: "50mb" }));
app.use(cors());
app.use(morgan("common"));

app.use("/category", categoryRoute);
app.use("/user", userRoute);
app.use("/product", productRoute);

// Khởi động server và nhập dữ liệu nếu cần
(async () => {
  await connectDB();

  // Kiểm tra xem có nên nhập dữ liệu không (có thể sử dụng biến môi trường hoặc tham số)
  if (process.env.IMPORT_DATA === "true") {
    await importData();
  }
  // Kiểm tra xem có nên cập nhật best-seller không
  if (process.env.UPDATE_BEST_SELLERS === "true") {
    await updateBestSellers();
  }
  app.listen(3000, () => {
    console.log("Server is running on port 3000");
  });
})();
