const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cart");

router.get("/:userId", cartController.getCart);
router.get("/cart_lines/:cartId", cartController.getCartLine);
router.post("/cart_line/add", cartController.addCartline);
router.delete("/cart_line/delete/:id", cartController.deleteCartLine);

module.exports = router;
