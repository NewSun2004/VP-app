// backend/routes/temporary_user.js
const express = require('express');
const router = express.Router();
const temporaryUserController = require('../controllers/temporary_user');

// Sử dụng endpoint gốc "/"
router.post('/', temporaryUserController.registerTemporaryUser);

// Route xác thực email
router.get('/verify', temporaryUserController.verifyToken);

module.exports = router;
