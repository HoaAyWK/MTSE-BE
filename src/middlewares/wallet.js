const ApiError = require('../utils/ApiError');
const walletService = require('../services/walletService');


class WalletMiddleware {
    async requestWithWalletFromUser(req, res, next) {
        try {
            const wallet = await walletService.getWalletByUser(req.user.id);

            if (!wallet) {
                throw new ApiError(404, 'Wallet not found');
            }

            req.wallet = wallet;
            
            next();
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new WalletMiddleware;