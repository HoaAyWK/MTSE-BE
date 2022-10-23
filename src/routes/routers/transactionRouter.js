const { Router } = require('express')

const transactionController = require('../../controllers/transactionController');
const authMiddleware = require('../../middlewares/auth');
const { transactionValidation } = require('../../validations');
const validate = require('../../middlewares/validate');
const { roles } = require('../../config/roles');

const router = Router();

router
    .route('/transactions/create')
    .post(
        authMiddleware.isAuthenticated,
        validate(transactionValidation.createTransaction),
        transactionController.saveTransaction
    )

router
    .route('/admin/transactions')
    .get(
        authMiddleware.isAuthenticated,
        authMiddleware.authorizeRoles(roles.ADMIN),
        transactionController.queryTransactions
    );

router
    .route('/admin/transactions/:id')
    .put(
        authMiddleware.isAuthenticated,
        authMiddleware.authorizeRoles(roles.ADMIN),
        transactionController.submitTransaction
    );

module.exports = router;