const express = require("express");

const router = express.Router();

const authMiddleware = require('../../middlewares/auth');
const userController = require('../../controllers/userController');
const { roles } = require('../../config/roles');

router
    .route('/profile')
    .get(
        authMiddleware.isAuthenticated,
        userController.getUserProfile);

router
    .route('/password/change')
    .post(
        authMiddleware.isAuthenticated,
        userController.changePassword);

router
    .route('/admin/users')
    .get(
        authMiddleware.isAuthenticated,
        authMiddleware.authorizeRoles(roles.ADMIN),
        userController.getUsers);

router
    .route('/admin/users/:id')
    .get(
        authMiddleware.isAuthenticated,
        authMiddleware.authorizeRoles(roles.ADMIN),
        userController.getUser);


module.exports = router;