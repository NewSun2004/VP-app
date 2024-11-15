const orderController = require("../controllers/order")

const router = require("express").Router()

router.post('/',orderController.addOrder)

module.exports = router