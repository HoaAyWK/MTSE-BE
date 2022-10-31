const ApiError = require('../utils/ApiError');
const userService = require('../services/userService');
const accountService = require('../services/accountService');
const pick = require('../utils/pick');
const { userStatus } = require('../config/userStatus');


class UserController{
    async getUsers(req, res, next) {
        const filter = pick(req.query, ['name', 'status']);
        const options = pick(req.query, ['sortBy', 'limit', 'page']);

        // Exclude current user
        filter._id = { $ne: req.user.id };

        const result = await userService.queryUsers(filter, options);

        res.status(200).json({
            success: true,
            ...result
        });
    }

    async getAllUsers(req, res, next) {
        try {
            const users = await userService.getUsers(req.user.id);

            res.status(200).json({
                success: true,
                users
            });
        } catch (error) {
            next(error);
        }
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
            
            if (!(await account.isPasswordMatch(oldPassword))) {
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

    async updateProfile(req, res, next) {
        try {
            const user = await userService.updateUser(req.user.id, req.body);

            res.status(200).json({
                success: true,
                user
            });
        } catch (error) {
            next(error);
        }
    }

    // This method is only used once when the user registers and doesn't use anywhere else
    async promoteToEmployer(req, res, next) {
        try {
            const user = await userService.promoteToEmployer(req.user.id, req.body);

            res.status(200).json({
                success: true,
                user
            });
        } catch (error) {
            next(error);
        }
    }

    async banUser(req, res, next) {
        try {
            const user = await userService.changeUserStatus(req.params.id, userStatus.BANNED);

            res.status(200).json({
                success: true,
                user
            });
        } catch (error) {
            next(error);
        }
    }

    async deleteUser(req, res, next) {
        try {
            const user = await userService.changeUserStatus(req.params.id, userStatus.DELETED);

            res.status(200).json({
                success: true,
                user
            });
        } catch (error) {
            next(error);
        }
    }

    async deleteMyAccount(req, res, next) {
        try {
            const user = await userService.changeUserStatus(req.user.id, userStatus.DELETED);

            res.status(200).json({
                success: true,
                user
            });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new UserController;