const jwt = require('jsonwebtoken');

const ApiError = require('../utils/ApiError');
const userService = require('../services/userService');
const accountService = require('../services/accountService');
const { userStatus } = require('../config/userStatus');

class AuthMiddleware {
    async isAuthenticated(req, res, next) {
        const { token } = req.cookies;

        if (!token) {
            return next(new ApiError(401, 'You are not logged in'));
        }

        const { sub } = jwt.verify(token.token, process.env.JWT_SECRET);
        const user = await userService.getUserById(sub);

        if (user.status === userStatus.BANNED) {
            return next(new ApiError(403, 'Your account is banned'));
        }

        if (user.status === userStatus.DELETED) {
            return next(new ApiError(404, 'Your account no longer exists'));
        }

        const account = await accountService.getAccountByUserId(sub);

        if (!account.emailConfirmed) {
            return next(new ApiError(401, 'Your email is not verified. Please verify your email!'))
        }
        
        req.user = user;

        next();
    }

    authorizeRoles(...roles) {
        if (roles.length === 1) {
            return (req, res, next) => {
                if (!req.user.roles.includes(roles[0])) {
                    return next(new ApiError(403, 'You do not have permission to access this resource'));
                }
    
                return next();
            }
        } else {
            return (req, res, next) => {
                for (let r of roles) {
                    if (req.user.roles.includes(r)) {
                        return next();
                    }
                }
        
                return next(new ApiError(403, 'You do not have permission to access this resource.'));
            }
        }
    }
}

module.exports = new AuthMiddleware;