const accountService = require('../services/accountService');
const authService = require('../services/authService');
const tokenService = require('../services/tokenService');
const userService = require('../services/userService');
const ApiError = require('../utils/ApiError');
const sendToken = require('../utils/sendToken');

class AuthController {
    async login(req, res, next) {
        try {
            const user = await authService.login(req.body.email, req.body.password);
            const accessToken = tokenService.generateAuthToken(user);

            sendToken(user, accessToken, 200, res);

        } catch (error) {
            next(error);
        }
    }

    async register(req, res, next) {
        try {
            const { email, name, password, phone } = req.body;
            const userExist = await userService.getUserByEmail(email);

            if (userExist) {
                throw new ApiError(400, 'Email already in use');
            }

            const user = await userService.createUser({ name, email, phone });
            const account = await accountService.create({ user: user._id, password });
            const token = await tokenService.generateVerifyEmailToken(user);

            res.status(200).json({
                success: true,
                confirmEmailToken: token,
                user,
                account
            });
        } catch (error) {
            next(error);
        }
    }

    async confirmEmail(req, res, next) {
        try {
            const user = await authService.verifyEmail(req.params.token);
            const accessToken = tokenService.generateAuthToken(user);

            sendToken(user, accessToken, 200, res);
        } catch (error) {
            next(error);
        }
    }

    async forgotPassword(req, res, next) {
        try {
            const { email } = req.body;
            const resetToken = await tokenService.generateResetPasswordToken(email);

            res.status(200).json({
                success: true,
                resetPasswordToken: resetToken
            });
        } catch (error) {
            next(error);
        }
    }

    async resetPassowrd(req, res, next) {
        try {
            const user = await authService.resetPassword(
                req.params.token,
                req.body.password,
                req.body.confirmPassword
            );
    
            const accessToken = tokenService.generateAuthToken(user);
    
            sendToken(user, accessToken, 200, res);
        } catch (error) {
            next(error);
        }
    }   

    logout(req, res) {
        res.cookie('token', null, {
            httpOnly: true
        });
    
        res.status(200).json({
            success: true,
            message: 'Logged out'
        });
    }
}

module.exports = new AuthController;