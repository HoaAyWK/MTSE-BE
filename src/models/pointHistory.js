const mongoose = require('mongoose')
const Schema = mongoose.Schema

const PointHistorySchema = new Schema({
    wallet: {
        type: mongoose.Types.ObjectId,
        ref: 'Wallet'
    },
    sender: {
        type: mongoose.Types.ObjectId,
        ref: 'User'
    },
    point: {
        type: Number,
        required: true
    }, 
    createdAt: {
        type: Date,
        default: Date.now()
    }
});

const PointHistory = mongoose.model('PointHistory', PointHistorySchema)

module.exports = PointHistory;