const mongoose = require('mongoose');

const { toJSON } = require('./plugins');
const { tokenTypes } = require('../config/tokens');


const tokenSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true,
        index: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    type: {
        type: String,
        required: true,
        enum: [
            tokenTypes.VERIFY_EMAIL,
            tokenTypes.RESET_PASSWORD
        ]
    },
    expires: {
        type: Date,
        required: true
    }
}, { timestamps: true });

tokenSchema.plugin(toJSON);

const Token = mongoose.model('Token', tokenSchema);

module.exports = Token;