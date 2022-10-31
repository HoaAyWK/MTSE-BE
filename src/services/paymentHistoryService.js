const ApiError = require('../utils/ApiError');
const PaymentHistory = require('../models/paymentHistory');

class PaymentHistoryService {
    async createPaymentHistory(paymentHistoryBody) {
        return PaymentHistory.create(paymentHistoryBody);
    }

    async queryPaymentHistories(filter, options) {
        return PaymentHistory.paginate(filter, options);
    }

    async getPaymentHistories() {
        return PaymentHistory.find().populate('user credit');
    }

    async getPaymentHistoriesByUserId(userId) {
        return PaymentHistory.find({ user: userId });
    }

    async getPaymentHistoryById(id) {
        return PaymentHistory.findById(id);
    }

    async getPaymentHistoryByPaymentIntent(paymentIntent) {
        return PaymentHistory.findOne({ paymentIntent });
    }

    async updatePaymentHistory(id, updateBody) {
        const paymentHistory = await PaymentHistory.findById(id).lean();

        if (!paymentHistory) {
            throw new ApiError(404, 'PaymentHistory not found');
        }

        return await PaymentHistory.findByIdAndUpdate(
            id,
            {
                $set: updateBody
            },
            {
                new: true,
                runValidators: true
            }
        );
    }
}

module.exports = new PaymentHistoryService;