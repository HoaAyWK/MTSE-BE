const ApiError = require('../utils/ApiError');
const creditService = require('../services/creditService');

class CreditController {
    async getCredits(req, res, next) {
        try {
            const num = req.query.num
            if(num == null){
                num = 3
            }
            const credits = await creditService.getCredits(num);

            res.status(200).json({
                success: true,
                count: credits.length,
                credits
            });
        } catch (error) {
            next(error);
        }
    }

    async getCredit(req, res, next) {
        try {
            const credit = await creditService.getCreditById(req.params.id);

            if (!credit) {
                throw new ApiError(404, 'Credit not found');
            }

            res.status(200).json({
                success: true,
                credit
            });
        } catch (error) {
            next(error);
        }
    }

    async createCredit(req, res, next) {
        try {
            const credit = await creditService.createCredit(req.body);

            res.status(201).json({
                success: true,
                credit
            });
        } catch (error) {
            next(error);
        }
    }

    async deleteCredit(req, res, next) {
        try {

            // TODO: check if there is any PaymentHistory reference to this credit

            await creditService.deleteCredit(req.params.id);

            res.status(200).json({
                success: true,
                message: `Deleted credit with id: ${req.params.id}`
            });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new CreditController;