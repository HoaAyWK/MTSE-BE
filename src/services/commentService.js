const Comment = require('../models/comment');
const ApiError = require('../utils/ApiError');

class CommentService {
    async createComment(commentBody) {
        return Comment.create(commentBody);
    }

    async queryComments(filter, options) {
        return Comment.paginate(filter, options);
    }

    async getCommentById(id) {
        return Comment.findById(id);
    }

    async getCommentsByUser(userId) {
        return Comment.find({ user: userId, isCommented: true });
    }

    async getCommentsByCreator(creatorId) {
        return Comment.find({ creator: creatorId, isCommented: true });
    }

    async getCreatorCommentsNoStarsYet(creatorId) {
        return Comment.find({ creator: creatorId, isCommented: false });
    }

    async updateComment(id, updateBody) {
        const { stars, content } = updateBody;
        const comment = await Comment.findById(id).lean();

        if (!comment) {
            throw new ApiError(404, 'Comment not found');
        }

        return await Comment.findByIdAndUpdate(
            id,
            {
                $set: {
                    stars,
                    content,
                    isCommented: true
                }
            },
            {
                new: true,
                runValidators: true
            }
        );
    }

    async deleteComment(id) {
        return Comment.findByIdAndDelete(id);
    }
}

module.exports = new CommentService;