const express = require('express');
const router = express.Router();
const { registerTemporaryUser, verifyToken } = require('../controllers/temporary_user');

router.post('/', registerTemporaryUser);
router.get('/verify', verifyToken);

module.exports = router;
