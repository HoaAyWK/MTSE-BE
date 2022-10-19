const { Router } = require('express');

const authMiddleware = require('../../middlewares/auth');
const creditController = require('../../controllers/creditController');
const { roles } = require('../../config/roles');
const { creditValidation } = require('../../validations');
const validate = require('../../middlewares/validate');

const router = Router();

router
    .route('/credits')
    .get(creditController.getCredits);

router
    .route('/credits/:id')
    .get(creditController.getCredit);


router
    .route('/admin/credits/create')
    .post(
        authMiddleware.isAuthenticated,
        authMiddleware.authorizeRoles(roles.ADMIN),
        validate(creditValidation.createCredit),
        creditController.createCredit
    );


router
    .route('/admin/credits/:id')
    .delete(
        authMiddleware.isAuthenticated,
        authMiddleware.authorizeRoles(roles.ADMIN),
        creditController.deleteCredit
    );

module.exports = router;