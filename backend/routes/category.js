const categoryController = require("../controllers/category")

const router = require("express").Router()

router.post('/',categoryController.addCategory)

module.exports = router