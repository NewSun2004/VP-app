const express = require("express");
const router = express.Router();
const { Product, Product_line } = require("../model/model");

// Route: Lấy sản phẩm Best-Selling
router.get("/best-selling", async (req, res) => {
  const category = req.query.category; // Query param để lọc theo loại
  const filter = { is_best_seller: true };

  // Nếu có category, thêm điều kiện lọc
  if (category) {
    filter.category_name = category;
  }

  try {
    // Tìm sản phẩm theo filter và chỉ lấy các trường cần thiết
    const bestSellingProducts = await Product.find(filter).populate({
      path: "product_lines",
      select: "image_urls product_line_name", // Lấy trường cần thiết từ product_lines
    });

    // Nếu không có sản phẩm nào, trả về thông báo
    if (!bestSellingProducts || bestSellingProducts.length === 0) {
      return res
        .status(404)
        .json({ message: "No best-selling products found" });
    }

    // Trả về danh sách sản phẩm
    res.status(200).json(bestSellingProducts);
  } catch (error) {
    // Trả về lỗi nếu có vấn đề trong quá trình xử lý
    res.status(500).json({
      message: "Failed to fetch best-selling products",
      error: error.message,
    });
  }
});
// Route: Lấy Best-Selling theo loại (VD: eye glasses, sun glasses)
router.get("/best-selling/:category", async (req, res) => {
  const { category } = req.params;

  try {
    // Tìm sản phẩm theo category và trạng thái best-seller
    const bestSellingProducts = await Product.find({
      is_best_seller: true,
      category_name: category,
    }).populate({
      path: "product_lines",
      select: "image_urls product_line_name",
    });

    // Nếu không có sản phẩm nào, trả về thông báo
    if (!bestSellingProducts || bestSellingProducts.length === 0) {
      return res
        .status(404)
        .json({
          message: `No best-selling products found for category: ${category}`,
        });
    }

    // Trả về danh sách sản phẩm
    res.status(200).json(bestSellingProducts);
  } catch (error) {
    // Trả về lỗi nếu có vấn đề trong quá trình xử lý
    res
      .status(500)
      .json({
        message: `Failed to fetch best-selling products for category: ${category}`,
        error: error.message,
      });
  }
});

// Route: Đếm số lượng sản phẩm Best-Selling theo loại
router.get("/count-best-sellers", async (req, res) => {
  try {
    const totalBestSellers = await Product.countDocuments({
      is_best_seller: true,
    });

    const eyeGlassesCount = await Product.countDocuments({
      is_best_seller: true,
      category_name: "eye glasses",
    });

    const sunGlassesCount = await Product.countDocuments({
      is_best_seller: true,
      category_name: "sun glasses",
    });

    res.status(200).json({
      total: totalBestSellers,
      eyeGlasses: eyeGlassesCount,
      sunGlasses: sunGlassesCount,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Route: Lấy chi tiết một sản phẩm theo ID
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate(
      "product_lines"
    );
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Route: Lấy các dòng sản phẩm (product_lines) theo ID sản phẩm
router.get("/:id/product-lines", async (req, res) => {
  try {
    const productLines = await Product_line.find({ product_id: req.params.id });
    if (!productLines || productLines.length === 0) {
      return res
        .status(404)
        .json({ message: "No product lines found for this product." });
    }
    res.json(productLines);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
