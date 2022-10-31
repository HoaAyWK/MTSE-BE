const ApiError = require('../utils/ApiError');
const paymentHistoryService = require('../services/paymentHistoryService');
const pick = require('../utils/pick');

class PaymentHistoryController {
    async queryPaymentHistories(req, res, next) {
        try {
            const filter = pick(req.query, ['status']);
            const options = pick(req.query, ['sortBy', 'limit', 'page']);
            const result = await paymentHistoryService.queryPaymentHistories(filter, options);

            res.status(200).json({
                success: true,
                ...result
            });
        } catch (error) {
            next(error);
        }
    }

    async getPaymentHistories(req, res, next) {
        try {
            const paymentHistories = await paymentHistoryService.getPaymentHistories();

            res.status(200).json({
                success: true,
                count: paymentHistories.length,
                paymentHistories
            });
        } catch(error) {
            next(error);
        }
    }

    async getPaymentHistory(req, res, next) {
        try {
            const paymentHistory = await paymentHistoryService.getPaymentHistoryById(req.params.id);

            if (!paymentHistory) {
                throw new ApiError(404, 'PaymentHistory not found');
            }

            res.status(200).json({
                success: true,
                paymentHistory
            });
        } catch (error) {
            next(error);
        }
    }

    async getCurrentUserPaymentHistories(req, res, next) {
        try {
            const paymentHistories = await paymentHistoryService.getPaymentHistoriesByUserId(req.user.id);

            res.status(200).json({
                success: true,
                paymentHistories
            });
        } catch (error) {
            next(error);
        }
    }

    async getPaymentHistoriesByUser(req, res, next) {
        try {
            const paymentHistories = await paymentHistoryService.getPaymentHistoriesByUserId(req.params.id);

            res.status(200).json({
                success: true,
                paymentHistories
            });
        } catch (error) {
            next(error);
        }
    }

    async updatePaymentHistory(req, res, next) {
        try {
            const paymentHistory = await paymentHistoryService.updatePaymentHistory(req.params.id, req.body);

            res.status(200).json({
                success: true,
                paymentHistory
            });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new PaymentHistoryController;
