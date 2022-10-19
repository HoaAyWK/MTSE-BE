const checkoutService = require('../services/checkoutService');

class CheckoutController {
    async checkoutWithStripe(req, res, next) {
        try {
            const session = await checkoutService.checkoutWithStripe(req.user.id, req.body.credit);

            res.status(200).json({
                success: true,
                url: session.url
            })
        } catch (error) {
            next(error);
        }
    }

    async stripeWebhook(req, res, next) {
        try {
            await checkoutService.stripeWebhook(req);
    
            console.log('Receive stripe webhook event');
            res.status(200).json({
                message: 'Receive stripe webhook event'
            })
        } catch (error) {
            next(error);
        }
    }

    async checkoutSuccess(req, res) {
        res.status(200).json({
            success: true,
            message: 'Checkout success'
        });
    }

    async checkoutCancel(req, res) {
        res.status(200).json({
            success: true,
            message: 'Checkout cancel'
        });
    }
}

module.exports = new CheckoutController;