const ApiError = require('../utils/ApiError');
const paymentHistoryService = require('../services/paymentHistoryService');
const jobService = require('../services/jobService');
const offerService = require('../services/offerService');
const commentService = require('../services/commentService');

class OwnerMiddleware {
    async isPaymentHistoryOwner(req, res, next) {
        try {
            const paymentHistory = await paymentHistoryService.getPaymentHistoryById(req.params.id);

            if (!paymentHistory) {
                throw new ApiError(404, 'PaymentHistory not found');
            }

            if (paymentHistory.user.toString() !== req.user.id) {
                throw new ApiError(403, 'You are not the owner of this payment');
            }

            next();
        } catch (error) {
            next(error);
        }
    }

    async isJobOwner(req, res, next) {
        try {
            const job = await jobService.getJobById(req.params.id);

            if (!job) {
                throw new ApiError(404, 'Job not found');
            }

            if (job.owner.toString() !== req.user.id) {
                throw new ApiError(403, 'You are not the owner of this job');
            }

            next();
        } catch (error) {
            next(error);
        }
    }

    async isOfferOwner(req, res, next) {
        try {
            const offer = await offerService.getOfferById(req.params.id);

            if (!offer) {
                throw new ApiError(404, 'Offer not found');
            }

            if (offer.freelancer.toString() !== req.user.id) {
                throw new ApiError(400, 'You are not the owner of this offer');
            }

            next();
        } catch (error) {
            next(error);
        }
    }

    async isCommentOwner(req, res, next) {
        try {
            const comment = await commentService.getCommentById(req.params.id);

            if (!comment) {
                throw new ApiError(404, 'Comment not found');
            }

            if (comment.creator.toString() !== req.user.id) {
                throw new ApiError(400, 'You are not the owner of this comment');
            }

            next();
        } catch (error) {
            next(error);
        }
    }

    async isEmployerProvideEnoughInfo(req, res, next) {
        try {
            if (!(await req.user.isEnoughInfoToPost())) {
                throw new ApiError(400, 'You are not providing enough infomation to create a job');
            }
    
            next();
        } catch (error) {
            next(error);
        }
    }

    async isFreelancerProvideEnoughInfo(req, res, next) {
        try {
            if (!(await req.user.isEnoughInfoToOfferJob())) {
                throw new ApiError(400, 'You are not providing enough information to offer a job');
            }

            next();
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new OwnerMiddleware;