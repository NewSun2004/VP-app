const express = require("express");
const router = express.Router();
const { addCarrier, getShippingCarriers } = require("../controllers/carrier");

// Route thêm carrier mới
router.post("/add", addCarrier);
router.get('/get', getShippingCarriers)

module.exports = router;
