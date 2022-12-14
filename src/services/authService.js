const ApiError = require('../utils/ApiError');
const accountService = require('./accountService');
const userService = require('./userService');
const tokenService = require('./tokenService');
const walletService = require('./walletService');
const { tokenTypes } = require('../config/tokens');
const { userStatus } = require('../config/userStatus');

class AuthService {
    async login(email, password) {
        const user = await userService.getUserByEmail(email);
        if (!user) {
            throw new ApiError(400, 'Incorrect Email or Password');
        }

        const account = await accountService.getAccountByUserId(user.id);

        if (!account) {
            throw new ApiError(400, 'Account not found');
        }

        if (!(await account.isPasswordMatch(password))) {
            throw new ApiError(400, 'Incorrect Email or Password');
        }

        if (!account.emailConfirmed) {
            throw new ApiError(401, 'Your email is not verified. Please, verify your email!')
        }

        if (user.status === userStatus.BANNED) {
            throw new ApiError(403, 'Your account is banned');
        }

        if (user.status === userStatus.DELETED) {
            throw new ApiError(400, 'Your account no longer exists');
        }

        return user;
    }

    async register(email, name, phone, password) {
        const existingUser = await userService.getUserByEmail(email);

        if (existingUser) {
            const existingAccount = await accountService.getAccountByUserId(existingUser.id);

            if (!existingAccount) {
                throw new ApiError(404, 'Account not found');
            }

            if (!existingAccount.emailConfirmed) {
                existingAccount.password = password;
                existingUser.name = name;
                existingUser.phone = phone;

                await existingAccount.save();
                await existingUser.save();

                return await tokenService.generateVerifyEmailToken(existingUser);
            }

            throw new ApiError(400, 'Email already in use');
        }

        const user = await userService.createUser({ name, email, phone });

        await walletService.createWallet({user: user.id});
        await accountService.create({ user: user.id, password });

        return await tokenService.generateVerifyEmailToken(user);
    }

    async resetPassword(resetPasswordToken, password, confirmPassword) {
        if (password !== confirmPassword) {
            throw new ApiError(400, 'Password and ConfirmPassword are not matching');
        }

        try {
            const resetPasswordDoc = await tokenService
                .verifyToken(resetPasswordToken, tokenTypes.RESET_PASSWORD);

            const userId = resetPasswordDoc.user;
            const user = await userService.getUserById(userId);

            if (!user) {
                throw new Error();
            }

            const updatedAccount = await accountService.changePassword(userId, password);

            if (!updatedAccount) {
                throw new Error();
            }

            await tokenService.deleteTokens(userId, tokenTypes.RESET_PASSWORD);

            return user;
        } catch (error) {
            console.log(error.message);
            throw new ApiError(401, 'Password reset failed');
        }
    }

    async verifyEmail(verifyEmailToken) {
        try {
            const verifyEmailTokenDoc = await tokenService
                .verifyToken(verifyEmailToken, tokenTypes.VERIFY_EMAIL);

            const userId = verifyEmailTokenDoc.user;
            const user = await userService.getUserById(userId);

            if (!user) {
                throw new Error();
            }

            const udpateAccount = await accountService.updateAccount(userId, { emailConfirmed: true });
            
            if (!udpateAccount) {
                throw new Error();
            }

            await tokenService.deleteTokens(userId, tokenTypes.VERIFY_EMAIL);

            return user;
        } catch (error) {
            console.log(error.message);
            throw new ApiError(401, 'Email verification failed');
        }
    }
}

module.exports = new AuthService;