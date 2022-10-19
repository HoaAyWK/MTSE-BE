const { Router } = require('express');

const authMiddleware = require('../../middlewares/auth');
const checkoutController = require('../../controllers/checkoutController');
const { checkoutValidation } = require('../../validations');
const validate = require('../../middlewares/validate');

const router = Router();

router.post('/checkout',
    authMiddleware.isAuthenticated,
    validate(checkoutValidation.checkout),
    checkoutController.checkoutWithStripe
);

router.get('/checkout/success', checkoutController.checkoutSuccess);
router.get('/checkout/cancel', checkoutController.checkoutCancel);

module.exports = router;