const express = require('express')
const router = express.Router()
const walletController = require('../../controllers/walletController')


router.post('/create', walletController.createWallet)
router.get('/info/:id', walletController.getWalletById)

module.exports = router