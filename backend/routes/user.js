const express = require("express");
const router = express.Router();
const userController = require("../controllers/user"); // Import toàn bộ userController

router.post("/", userController.addUser); // Route để thêm user
router.post("/login", userController.login); // Route để login
router.get("/session", userController.getSession);
router.post("/logout", userController.logOut);
router.post('/forgot-password', userController.forgotPassword);
router.post('/reset-password', userController.resetPassword);
router.post('/verify-forgot', userController.verifyForgot);
module.exports = router;
