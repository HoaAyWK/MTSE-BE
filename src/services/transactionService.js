const transactionSchema = require('../models/transaction')


class TransactionService{
    async saveTransaction(transaction){
        const newTransaction = new transactionSchema(transaction)

        await newTransaction.save()

        return newTransaction
    }


    async changeSubmit(transactionId){
        const transaction = await transactionSchema.findById(transactionId)

        if (!transaction){
            return null
        }
        
        const status = transaction.status

        await transactionSchema.findByIdAndUpdate(transaction._id, {status: !status, submittedDate: Date.now()})

        return await transactionSchema.findById(transactionId)

    }

    async getTransactionByUserId(userId){
        return await transactionSchema.find({userId})
    }

    async getTransactionBySubmit(status){
        return await transactionSchema.find({status})
    }

    async getTransactionByDate(status, date){
        return await transactionSchema.find({status, submittedDate: date})
    }
}

module.exports = new TransactionService