const transactionService = require('../services/transactionService')
const pick = require('../utils/pick');

class TransactionController{
    async queryTransactions(req, res, next) {
        try {
            const filter = pick(req.query, ['user', 'status', 'credidCardReceiver']);
            const options = pick(req.query, ['sortBy', 'limit', 'page']);
            const result = await transactionService.queryTransactions(filter, options);

            res.status(200).json({
                success: true,
                ...result
            });
        } catch(error) {
            next(error);
        }
    }

    async saveTransaction(req, res, next) {
        try {
            const transaction = req.body;
            transaction.user = req.user.id;
            const savedTransaction = await transactionService.saveTransaction(transaction);

            res.status(200).json({ success: true, transaction: savedTransaction });
        } catch(error) {
            next(error);
        }
    }

    async submitTransaction(req, res, next) {
        try {
            const transaction = await transactionService.changeSubmit(req.params.id);

            res.status(200).json({ success: true, transaction });
        }
        catch(error) {
            next(error);
        }
    }
}

module.exports = new TransactionController;