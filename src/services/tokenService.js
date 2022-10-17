const jwt = require('jsonwebtoken');
const moment = require('moment');
const mongoose = require('mongoose');

const ApiError = require('../utils/ApiError');
const Token = require('../models/token');
const { tokenTypes } = require('../config/tokens');
const userService = require('./userService');


class TokenService {

    /**
     * Generate token
     * @param {ObjectId} userId 
     * @param {Moment} expires 
     * @param {string} type 
     * @param {string} secret 
     */
    generateToken(userId, expires, type, secret = process.env.JWT_SECRET) {
        const payload = {
            sub: userId,
            iat: moment().unix(),
            exp: expires.unix(),
            type
        };
    
        return jwt.sign(payload, secret);
    }


    /**
     * Save a token
     * @param {string} token 
     * @param {ObjectId} userId 
     * @param {Moment} expires 
     * @param {string} type 
     * @returns {Promise<Token>}
     */
    async saveToken(token, userId, expires, type) {
        const tokenDoc = await Token.create({
            content: token,
            user: userId,
            expires: expires.toDate(),
            type
        });

        return tokenDoc;
    }


    /**
     * Verify token and return token (or throw an error if it is not valid)
     * @param {string} token 
     * @param {string} type 
     * @returns {Promise<Token>}
     */
    async verifyToken(token, type) {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        const tokenDoc = await Token.findOne({ content: token, type, user: payload.sub }).lean();

        if (!tokenDoc) {
            throw new ApiError(404, 'Token not found');
        }

        return tokenDoc;
    }


    /**
     * Generate auth token
     * @param {User} user 
     * @returns {Promise<Token>}
     */
    generateAuthToken(user) {
        const accessTokenExpires = moment().add(process.env.JWT_ACCESS_EXPIRATION_DAYS, 'days');
        const accessToken = this.generateToken(user.id, accessTokenExpires, tokenTypes.ACCESS);

        return {
            token: accessToken,
            expires: accessTokenExpires.toDate()
        };
    }


    /**
     * Generate reset password token
     * @param {string} email 
     * @returns {Promise<Token>}
     */
    async generateResetPasswordToken(email) {
        const user = await userService.getUserByEmail(email);
    
        if (!user) {
            throw new ApiError(404, 'User not found');
        }

        const expires = moment().add(process.env.JWT_RESET_PASSWORD_EXPIRATION_MINUTES, 'minutes');
        const resetPasswordToken = this.generateToken(user.id, expires, tokenTypes.RESET_PASSWORD);

        await this.saveToken(resetPasswordToken, user.id, expires, tokenTypes.RESET_PASSWORD);

        return resetPasswordToken;
    }

    /**
     * Generate verify email token
     * @param {User} user 
     * @returns 
     */
    async generateVerifyEmailToken(user) {
        const expires = moment().add(process.env.JWT_VERIFY_EMAIL_EXPIRATION_MINUTES, 'minutes');
        const verifyEmailToken = this.generateToken(user.id, expires, tokenTypes.VERIFY_EMAIL);

        await this.saveToken(verifyEmailToken, user.id, expires, tokenTypes.VERIFY_EMAIL);

        return verifyEmailToken;
    }

    async deleteTokens(userId, type) {
        await Token.deleteMany({ user: userId, type });
    }
}

module.exports = new TokenService;