const jwt = require('jsonwebtoken');

const ApiError = require('../utils/ApiError');
const userService = require('../services/userService');
const accountService = require('../services/accountService');

class AuthMiddleware {
    async isAuthenticated(req, res, next) {
        const { token } = req.cookies;

        if (!token) {
            return next(new ApiError(401, 'You are not logged in'));
        }

        const { sub } = jwt.verify(token.token, process.env.JWT_SECRET);
        const user = await userService.getUserById(sub);
        const account = await accountService.getAccountByUserId(sub);

        req.account = account;
        req.user = user;

        next();
    }

    authorizeRoles(...roles) {
        if (roles.length === 1) {
            return (req, res, next) => {
                if (!req.account.roles.includes(roles[0])) {
                    return next(new ApiError(403, 'You do not have permission to access this resource'));
                }
    
                return next();
            }
        } else {
            return (req, res, next) => {
                for (let r of roles) {
                    if (req.account.roles.includes(r)) {
                        return next();
                    }
                }
        
                return next(new ApiError(403, 'You do not have permission to access this resource.'));
            }
        }
    }
}

module.exports = new AuthMiddleware;