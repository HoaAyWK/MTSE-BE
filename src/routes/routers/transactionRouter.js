const express = require('express')
const router = express.Router()
const transactionController = require('../../controllers/transactionController')

router.post('/save', transactionController.saveTransaction)
router.post('/submit', transactionController.submitTransaction)

module.exports = router