const express = require("express");
const router = express.Router();
const orderController = require("../controllers/order");

// Route để tạo đơn hàng mới
router.post("/create", orderController.createOrder);

// Route để cập nhật trạng thái thanh toán
router.put("/payment/update", orderController.updatePaymentStatus);

// Route để cập nhật trạng thái vận chuyển
router.put("/shipping/update", orderController.updateShippingStatus);

// Route để lấy chi tiết đơn hàng
router.get("/:order_id", orderController.getOrderDetails);

module.exports = router;
