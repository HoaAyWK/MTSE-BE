const { Router } = require('express');
const { roles } = require('../../config/roles');

const authMiddleware = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const { taskValidation } = require('../../validations');
const taskController = require('../../controllers/taskController');

const router = Router();

router
    .route('/tasks/create')
    .post(
        authMiddleware.isAuthenticated,
        authMiddleware.authorizeRoles(roles.EMPLOYER),
        validate(taskValidation.createTask),
        taskController.createTask
    );

router
    .route('/jobs/:id/tasks')
    .get(
        authMiddleware.isAuthenticated,
        taskController.getTasksByJob
    );

router
    .route('/tasks/:id')
    .get(
        authMiddleware.isAuthenticated,
        taskController.getTask
    )
    .put(
        authMiddleware.isAuthenticated,
        taskController.finishTask
    )
    .delete(
        authMiddleware.isAuthenticated,
        taskController.deleteTask
    );

router
    .route('/tasks/:id/done')
    .put(
        authMiddleware.isAuthenticated,
        taskController.doneTask
    )

router
    .route('/tasks/:id/finish')
    .put(
        authMiddleware.isAuthenticated,
        authMiddleware.authorizeRoles(roles.EMPLOYER),
        taskController.finishTask
    );

router
    .route('/admin/tasks')
    .get(
        authMiddleware.isAuthenticated,
        authMiddleware.authorizeRoles(roles.ADMIN),
        taskController.queryTask
    );

module.exports = router;
