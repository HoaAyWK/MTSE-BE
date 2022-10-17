const { Router } = require('express');
const { valid } = require('joi');

const authController = require('../../controllers/authController');
const validate = require('../../middlewares/validate');
const { authValidation } = require('../../validations');

const router = Router();

router.post(
    '/login',
    validate(authValidation.login),
    authController.login
);

router.post(
    '/register',
    validate(authValidation.register),
    authController.register
);

router.get(
    '/email/confirm/:token',
    authController.confirmEmail
);

router.post(
    '/password/forgot',
    validate(authValidation.forgotPassword),
    authController.forgotPassword
);

router.put(
    '/password/reset/:token', 
    validate(authValidation.resetPassword),
    authController.resetPassowrd
);

router.get('/logout', authController.logout);

module.exports = router;