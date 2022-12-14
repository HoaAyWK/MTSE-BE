const Account = require('../models/account');
const ApiError = require('../utils/ApiError');
const { roles } = require('../config/roles');
class AccountService {
    async create(accountBody) {
        return Account.create(accountBody);
    }

    async getAccountByUserId(userId) {
        return await Account.findOne({ user: userId });
    }

    async updateAccount(userId, updateBody) {
        const account = await Account.findOne({ user: userId }).lean();

        if (!account) {
            throw new ApiError(404, 'Account not found');
        }

        return await Account
            .findByIdAndUpdate(account._id, { $set: updateBody }, { new: true, runValidators: true });
        
    }

    async changePassword(userId, password) {
        const account = await Account.findOne({ user: userId });

        if (!account) {
            throw new ApiError(404, 'Account not found');
        }

        account.password = password;
        await account.save();
        
        return account;
    }
}

module.exports = new AccountService;