const feedbackService = require('../services/feedbackService');
const ApiError = require('../utils/ApiError');
const pick = require('../utils/pick');

class FeedbackController {
    async getFeedbacks(req, res, next) {
        try {
            const feedbacks = await feedbackService.getFeedbacks();

            res.status(200).json({
                success: true,
                feedbacks
            });
        } catch (error) {
            next(error);
        }
    }

    async queryFeedbacks(req, res, next) {
        try {
            const filter = pick(req.query, ['name', 'content']);
            const options = pick(req.query, ['sortBy', 'limit', 'page']);

            const result = await feedbackService.queryFeedbacks(filter, options);

            res.status(200).json({
                success: true,
                ...result
            });
        } catch (error) {
            next(error);
        }
    }

    async getFeedback(req, res, next) {
        try {
            const id = req.params.id;

            if (!id) {
                throw new ApiError(400, 'Params must have id');
            }

            const feedback = await feedbackService.getFeedbackById(id);

            if (!feedback) {
                throw new ApiError(404, 'Feedback not found');
            }

            res.status(200).json({
                success: true,
                feedback
            });
        } catch (error) {
            next(error);
        }
    }

    async getFeedbackByUser(req, res, next) {
        try {
            const userId = req.query.userId;

            if (!userId) {
                throw new ApiError(400, 'Query must have userId');
            }

            const feedbacks = await feedbackService.getFeedbacksByUser(userId);

            res.status(200).json({
                success: true,
                feedbacks
            });
        } catch (error) {
            next(error);
        }
    }

    async createFeedback(req, res, next) {
        try {
            const data = req.body;
            data.user = req.user.id;

            const feedback = await feedbackService.createFeedback(data);

            res.status(201).json({
                success: true,
                feedback
            });
        } catch (error) {
            next(error);
        }
    }

    async deleteFeedback(req, res, next) {
        try {
            const id = req.params.id;

            if (!id) {
                throw new ApiError(400, 'Params must have id');
            }
            
            await feedbackService.deleteFeedback(id);

            res.status(200).json({
                success: true,
                message: `Deleted feedback with id: ${id}`
            })
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new FeedbackController;