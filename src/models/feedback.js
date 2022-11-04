const mongoose = require('mongoose');

const { toJSON, paginate } = require('./plugins');

const feedbackSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, { timestamps: true });

feedbackSchema.plugin(toJSON);
feedbackSchema.plugin(paginate);

const Feedback = mongoose.model('Feedback', feedbackSchema);

module.exports = Feedback;