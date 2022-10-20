const transactionService = require('../services/transactionService')


class TransactionController{
    async saveTransaction(req, res){
        try{
            const transaction = req.body

            const savedTransaction = await transactionService.saveTransaction(transaction)

            if (!savedTransaction){
                return res.status(400).json({success: false})
            }

            return res.status(200).json({success: true, transaction: savedTransaction})
        }
        catch(error){
            return res.status(500).json({success: false, message:error.message})
        }
    }

    async submitTransaction(req, res){
        try{
            const {transactionId} = req.body
            if (!transactionId){
                return res.status(400).json({success: false, message: "Invalid Transaction"})
            }

            const submittedTransaction = await transactionService.changeSubmit(transactionId)

            if (!submittedTransaction){
                return res.status(400).json({success: false, message: 'Failed Submit'})
            }

            return res.status(200).json({success: true, transaction: submittedTransaction})
        }
        catch(error){
            return res.status(500).json({success: false, message: error.message})
        }
    }
}

module.exports = new TransactionController