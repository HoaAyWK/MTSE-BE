const express = require('express')
const router = express.Router()
const categoryController = require("../../controllers/categoryController")

router.post('/create', categoryController.addCategory)
router.get('/info/:id', categoryController.getCategoryById)
router.put('/info/:id', categoryController.editCategory)

module.exports = router