const ApiError = require('../utils/ApiError');
const userService = require('../services/userService');
const accountService = require('../services/accountService');
const pick = require('../utils/pick');


class UserController{
    async getUsers(req, res, next) {
        const filter = pick(req.query, ['name', 'status']);
        const options = pick(req.query, ['sortBy', 'limit', 'page']);
        const result = await userService.queryUsers(filter, options);

        res.status(200).json({
            success: true,
            ...result
        });
    }

    async getUser(req, res, next) {
        const user = await userService.getUserById(req.params.id);

        if (!user) {
            return next(new ApiError(404, 'User not found'));
        }

        res.status(200).json({
            success: true,
            user
        });
    }

    async getUserProfile(req, res, next) {
        const user = await userService.getUserById(req.user.id);

        if (!user) {
            return next(new ApiError(404, 'User not found'));
        }

        res.status(200).json({
            success: true,
            user
        });
    }

    async changePassword(req, res, next) {
        const userId = req.user.id;
        const { oldPassword, newPassword } = req.body;

        try {
            const account = await accountService.getAccountByUserId(userId);

            if (!account) {
                throw new ApiError(404, 'Account not found');
            }
            
            if (!account.isPasswordMatch(oldPassword)) {
                throw new ApiError(400, 'Incorrect password');
            }

            const updatedAccount = await accountService.changePassword(userId, newPassword);

            if (!updatedAccount) {
                throw new ApiError(500, 'Can not change password');
            }

            res.status(200).json({
                success: true,
                message: 'Password changed'
            })
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new UserController;