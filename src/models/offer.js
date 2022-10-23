const mongoose = require('mongoose');

const { toJSON } = require('./plugins');
const { offerStatus } = require('../config/offerStatus');

const offerSchema = new mongoose.Schema({
    job: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Job',
        required: true
    },
    freelancer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: [
            offerStatus.PENDING,
            offerStatus.SELECTED,
            offerStatus.ACCEPTED,
            offerStatus.REJECTED
        ],
        default: offerStatus.PENDING
    }
}, { timestamps: true });

offerSchema.plugin(toJSON);

const Offer = mongoose.model('Offer', offerSchema);

module.exports = Offer;