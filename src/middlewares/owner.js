const ApiError = require('../utils/ApiError');
const paymentHistoryService = require('../services/paymentHistoryService');

class OwnerMiddleware {
    async isPaymentHistoryOwner(req, res, next) {
        const paymentHistory = await paymentHistoryService.getPaymentHistoryById(req.params.id);

        if (!paymentHistory) {
            return next(new ApiError(404, 'PaymentHistory not found'));
        }

        if (paymentHistory.user.toString() !== req.user.id) {
            return next(new ApiError(403, 'You are not the owner of this payment'));
        }

        next();
    }
}

module.exports = new OwnerMiddleware;