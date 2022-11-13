const express = require("express");

const authMiddleware = require('../../middlewares/auth');
const userController = require('../../controllers/userController');
const { roles } = require('../../config/roles');
const { userValidation } = require('../../validations');
const validate = require('../../middlewares/validate');
const verifyToken = require('../../middlewares/jwtFilter')
const router = express.Router();

router
    .route('/profile')
    .get(
        /* authMiddleware.isAuthenticated, */
        verifyToken,
        userController.getUserProfile)
    .put(
        authMiddleware.isAuthenticated,
        validate(userValidation.updateUser),
        userController.updateProfile
    )
    .delete(
        authMiddleware.isAuthenticated,
        userController.deleteMyAccount
    );

router
    .route('/password/change')
    .put(
        authMiddleware.isAuthenticated,
        validate(userValidation.changePassword),
        userController.changePassword);

router
    .route('/profile/promote')
    .put(
        authMiddleware.isAuthenticated,
        authMiddleware.authorizeRoles(roles.FREELANCER),
        validate(userValidation.promoteToEmployer),
        userController.promoteToEmployer
    );

router
    .route('/admin/users/:id/ban')
    .delete(
        authMiddleware.isAuthenticated,
        authMiddleware.authorizeRoles(roles.ADMIN),
        userController.banUser
    );

router
    .route('/admin/users/:id/delete')
    .delete(
        authMiddleware.isAuthenticated,
        authMiddleware.authorizeRoles(roles.ADMIN),
        userController.deleteUser
    );

router
    .route('/admin/users')
    .get(
        authMiddleware.isAuthenticated,
        authMiddleware.authorizeRoles(roles.ADMIN),
        userController.getUsers);

router
    .route('/admin/users/all')
    .get(
        authMiddleware.isAuthenticated,
        authMiddleware.authorizeRoles(roles.ADMIN),
        userController.getAllUsers
    );

router
    .route('/admin/users/:id')
    .get(
        authMiddleware.isAuthenticated,
        authMiddleware.authorizeRoles(roles.ADMIN),
        userController.getUser);


module.exports = router;