const { Router } = require('express');

const authMiddleware = require('../../middlewares/auth');
const feedbackController = require('../../controllers/feedbackController');
const { feedbackValidation } = require('../../validations');
const validate = require('../../middlewares/validate');
const { roles } = require('../../config/roles');

const router = Router();

router
    .route('/feedbacks/create')
    .post(
        authMiddleware.isAuthenticated,
        validate(feedbackValidation.createFeedback),
        feedbackController.createFeedback
    );

router
    .route('/admin/feedbacks/all')
    .get(
        authMiddleware.isAuthenticated,
        authMiddleware.authorizeRoles(roles.ADMIN),
        feedbackController.getFeedbacks
    );

router
    .route('/admin/feedbacks')
    .get(
        authMiddleware.isAuthenticated,
        authMiddleware.authorizeRoles(roles.ADMIN),
        feedbackController.queryFeedbacks
    );
    
router
    .route('/admin/feedbacks/:id')
    .get(
        authMiddleware.isAuthenticated,
        authMiddleware.authorizeRoles(roles.ADMIN),
        feedbackController.getFeedback
    )
    .delete(
        authMiddleware.isAuthenticated,
        authMiddleware.authorizeRoles(roles.ADMIN),
        feedbackController.deleteFeedback
    );

module.exports = router;
