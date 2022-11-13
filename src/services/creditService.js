const Credit = require('../models/credit');
const ApiError = require('../utils/ApiError');

class CreditService {
    async createCredit(creditBody) {
        return Credit.create(creditBody);
    }

    async getCredits(num) {
        let credits = [];
        if (num) {
            credits = await Credit.find().limit(num);
        } else {
            credits = await Credit.find();
        }
       
        return credits;
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