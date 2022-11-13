const Credit = require('../models/credit');
const ApiError = require('../utils/ApiError');

class CreditService {
    async createCredit(creditBody) {
        return Credit.create(creditBody);
    }

    async getCredits(num) {
        const credits = await Credit.find()
        return credits.slice(0, num);
    }

    async getCreditById(id) {
        return Credit.findById(id);
    }

    async deleteCredit(id) {
        const credit = await Credit.findById(id);

        if (!credit) {
            throw new ApiError(404, 'Credit not found');
        }

        await credit.remove();
    }
}

module.exports = new CreditService;