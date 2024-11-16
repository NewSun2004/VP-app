const express = require("express");
const router = express.Router();
const { Product, Product_line } = require("../model/model");

// Route để lấy tất cả sản phẩm
router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Route để lấy các sản phẩm best-seller cùng product_lines
router.get("/best-selling", async (req, res) => {
  try {
    // Lấy danh sách sản phẩm best-selling
    const bestSellingProducts = await Product.find({
      is_best_seller: true,
    }).lean();

    // Lấy thông tin product_lines cho từng sản phẩm
    const productsWithLines = await Promise.all(
      bestSellingProducts.map(async (product) => {
        const productLines = await Product_line.find({
          product_id: product._id,
        }).lean();
        return {
          ...product,
          product_lines: productLines, // Gắn thông tin product_lines vào từng sản phẩm
        };
      })
    );

    res.json(productsWithLines);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Route để lấy chi tiết một sản phẩm theo ID
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
