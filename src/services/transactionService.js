const Transaction = require('../models/transaction')


class TransactionService {
    async queryTransactions(filter, options) {
        return Transaction.paginate(filter, options);
    }

    async saveTransaction(transaction){
        const newTransaction = new Transaction(transaction)

        await newTransaction.save()

        return newTransaction
    }

    async getTransactions() {
        return Transaction.find()
            .populate({ path: 'user', select: 'id name email avatar' })
            .sort({ createdAt: 'desc' });
    }

    async changeSubmit(transactionId){
        const transaction = await Transaction.findById(transactionId);

        if (!transaction) {
            throw new ApiError(400, 'Transaction not found');
        }
        
        transaction.status = true;
        transaction.submittedDate = Date.now();

        await transaction.save();

        return transaction;
    }

    async getTransactionByUserId(userId){
        return await Transaction.find({ user: userId })
    }

    async getTransactionBySubmit(status){
        return await Transaction.find({ status })
    }

    async getTransactionByDate(status, date){
        return await Transaction.find({ status, submittedDate: date })
    }
}

module.exports = new TransactionService;
