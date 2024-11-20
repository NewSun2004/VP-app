const express = require('express');
const router = express.Router();
const { registerTemporaryUser, verifyToken } = require('../controllers/temporary_user');

router.post('/', registerTemporaryUser);
router.post('/verify', verifyToken);

module.exports = router;
