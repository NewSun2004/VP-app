// routes/product.js
const express = require("express");
const router = express.Router();
const { Product } = require("../model/model");

// Route để lấy tất cả sản phẩm
router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Route để lấy các sản phẩm best-seller
router.get("/best-selling", async (req, res) => {
  try {
    const bestSellingProducts = await Product.find({ is_best_seller: true });
    res.json(bestSellingProducts);
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
