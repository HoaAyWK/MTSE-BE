const { Router } = require('express');

const authMiddleware = require('../../middlewares/auth');
const commentController = require('../../controllers/commentController');
const { commentValidation } = require('../../validations');
const ownerMilldeware = require('../../middlewares/owner');
const validate = require('../../middlewares/validate');
const { roles } = require('../../config/roles');

const router = Router();

router
    .route('/comments')
    .get(
        commentController.queryComments
    );

router
    .route('/comments/:id')
    .get(
        commentController.getComment
    )
    .put(
        authMiddleware.isAuthenticated,
        authMiddleware.authorizeRoles(roles.FREELANCER, roles.EMPLOYER),
        ownerMilldeware.isCommentOwner,
        validate(commentValidation.starAndWriteComment),
        commentController.starAndWriteComment
    );

router
    .route('/me/comments/nostars')
    .get(
        authMiddleware.isAuthenticated,
        commentController.getCommentsNoStarsYet
    );

router
    .route('/me/comments')
    .get(
        authMiddleware.isAuthenticated,
        commentController.getCommentsAboutMe
    );

router
    .route('/me/comments/created')
    .get(
        authMiddleware.isAuthenticated,
        commentController.getCommentsCreated
    );

module.exports = router;
