const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');
const { paymentStatus } = require('../config/paymentStatus');

const paymentHistorySchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    credit: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Credit',
        required: true
    },
    status: {
        type: String,
        enum: [
            paymentStatus.PENDING,
            paymentStatus.SUCCESS,
            paymentStatus.CANCEL
        ],
        default: paymentStatus.PENDING
    },
    paymentIntent: {
        type: String
    }
}, { timestamps: true });

paymentHistorySchema.plugin(toJSON);
paymentHistorySchema.plugin(paginate);

const PaymentHistory = mongoose.model('PaymentHistory', paymentHistorySchema);

module.exports = PaymentHistory;