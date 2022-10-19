const { Router } = require('express');
const { roles } = require('../../config/roles');

const paymentHistoryController = require('../../controllers/paymentHistoryController');
const authMiddleware = require('../../middlewares/auth');
const ownerMiddleware = require('../../middlewares/owner');
const { paymentHistoryValidation } = require('../../validations');
const validate = require('../../middlewares/validate');

const router = Router();

router
    .route('/payments')
    .get(
        authMiddleware.isAuthenticated,
        paymentHistoryController.getCurrentUserPaymentHistories
    );

router
    .route('/payments/:id')
    .get(
        authMiddleware.isAuthenticated,
        ownerMiddleware.isPaymentHistoryOwner,
        paymentHistoryController.getPaymentHistory
    );

router
    .route('/admin/payments')
    .get(
        authMiddleware.isAuthenticated,
        authMiddleware.authorizeRoles(roles.ADMIN),
        paymentHistoryController.queryPaymentHistories
    );

router
    .route('/admin/payments/user/:id')
    .get(
        authMiddleware.isAuthenticated,
        authMiddleware.authorizeRoles(roles.ADMIN),
        paymentHistoryController.getPaymentHistoriesByUser
    );

router
    .route('/admin/payments/:id')
    .get(
        authMiddleware.isAuthenticated,
        authMiddleware.authorizeRoles(roles.ADMIN),
        paymentHistoryController.getPaymentHistory
    )
    .put(
        authMiddleware.isAuthenticated,
        authMiddleware.authorizeRoles(roles.ADMIN),
        validate(paymentHistoryValidation.updatePaymentHistory),
        paymentHistoryController.updatePaymentHistory
    );

module.exports = router;