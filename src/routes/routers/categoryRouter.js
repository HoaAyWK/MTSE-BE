const express = require('express')
const router = express.Router()
const categoryController = require("../../controllers/categoryController")
const authMiddleware = require('../../middlewares/auth');
const { roles } = require('../../config/roles');

router
    .route('/admin/categories/create')
    .post(
        authMiddleware.isAuthenticated,
        authMiddleware.authorizeRoles(roles.ADMIN),
        categoryController.addCategory
    );

router
    .route('/admin/categories')
    .get(
        authMiddleware.isAuthenticated,
        authMiddleware.authorizeRoles(roles.ADMIN),
        categoryController.getCategories
    );

router
    .route('/admin/categories/:id')
    .put(
        authMiddleware.isAuthenticated,
        authMiddleware.authorizeRoles(roles.ADMIN),
        categoryController.editCategory
    )
    .delete(
        authMiddleware.isAuthenticated,
        authMiddleware.authorizeRoles(roles.ADMIN),
        categoryController.deleteCategory
    );

router
    .route('/categories')
    .get(categoryController.getCategoriesNoParentWithChildren);

router
    .route('/categories/:id')
    .get(categoryController.getCategoryWithChildren);

router.put('/:id', categoryController.editCategory)

module.exports = router