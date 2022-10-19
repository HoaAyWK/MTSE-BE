const mongoose = require('mongoose');

const { toJSON, paginate } = require('./plugins') ;

const commentSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    job: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Job',
        required: true
    },
    stars: {
        type: Number,
        min: 1,
        max: 5
    },
    content: {
        type: String
    },
    isCommented: {
        type: Boolean,
        required: true,
        default: false
    }
}, { timestamps: true });

commentSchema.plugin(toJSON);
commentSchema.plugin(paginate);

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;