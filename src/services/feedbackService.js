const ApiError = require('../utils/ApiError');
const Feedback = require('../models/feedback');


class FeedbackService {
    async getFeedbacks() {
        return Feedback.find()
            .sort({ createdAt: 'desc'})
            .populate({path: 'user', select: 'id name avatar roles'});
    }

    async queryFeedbacks(filter, options) {
        return Feedback.paginate(filter, options);
    }

    async getFeedbackById(id) {
        return Feedback.findById(id);
    }

    async getFeedbacksByUser(userId) {
        return Feedback.find({ user: userId }).sort({ createdAt: 'desc' });
    }

    async createFeedback(feedback) {
        return Feedback.create(feedback);
    }

    async deleteFeedback(id) {
        const feedback = await Feedback.findById(id);

        if (!feedback) {
            throw new ApiError(404, 'Feedback not found');
        }

        await feedback.remove();
    }
}


module.exports = new FeedbackService;