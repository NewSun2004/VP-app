const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cart");

router.get("/", cartController.getCart);
router.get("/cart_lines/:cartId", cartController.getCartLine);
router.post("/cart_line/add", cartController.addCartLineToCart);

module.exports = router;
