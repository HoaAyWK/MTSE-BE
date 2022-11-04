const commentService = require('../services/commentService');
const ApiError = require('../utils/ApiError');
const pick = require('../utils/pick');

class CommentController {
    async queryComments(req, res, next) {
        try {
            const filter = pick(req.query, ['content', 'stars', 'user', 'creator', 'isCommented']);
            const options = pick(req.query, ['sortBy', 'limit', 'page', 'populate']);

            const result = await commentService.queryComments(filter, options);

            res.status(200).json({
                success: true,
                ...result
            });
        } catch (error) {
            next(error);
        }
    }

    async getCommentsByUser(req, res, next) {
        try {
            const comments = await commentService.getCommentsByUser(req.params.id);

            res.status(200).json({
                success: true,
                count: comments.length,
                comments
            })
        } catch {
            next(error);
        }
    }

    async getCommentsAboutMe(req, res, next) {
        try {
            const comments = await commentService.getCommentsByUser(req.user.id);

            res.status(200).json({
                success: true,
                count: comments.length,
                comments
            });
        } catch (error) {
            next(error);
        }
    }

    async getCommentsCreated(req, res, next) {
        try {
            const comments = await commentService.getCommentsByCreator(req.user.id);

            res.status(200).json({
                success: true,
                count: comments.length,
                comments
            });
        } catch (error) {
            next(error);
        }
    }

    async getCommentsNoStarsYet(req, res, next) {
        try {
            const comments = await commentService.getCreatorCommentsNoStarsYet(req.user.id);

            res.status(200).json({
                success: true,
                count: comments.length,
                comments
            });
        } catch (error) {
            next(error);
        }
    }

    async getComment(req, res, next) {
        try {
            const comment = await commentService.getCommentById(req.params.id);

            if (!comment) {
                throw new ApiError(404, 'Comment not found');
            }

            res.status(200).json({
                success: true,
                comment
            });
        } catch (error) {
            next(error);
        }
    }

    async starAndWriteComment(req, res, next) {
        try {
            const comment = await commentService.updateComment(req.params.id, req.body);

            res.status(200).json({
                success: true,
                comment
            });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new CommentController;