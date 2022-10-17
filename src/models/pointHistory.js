const mongoose = require('mongoose')
const Schema = mongoose.Schema

const PointHistorySchema = new Schema({
    walletId: {
        type: mongoose.Types.ObjectId,
        ref: 'wallets'
    },
    senderId: {
        type: mongoose.Types.ObjectId,
        ref: 'users'
    },
    point: {
        type: Number,
        required: true
    }, 
    createdAt: {
        type: Date,
        default: Date.now()
    }
})

module.exports = mongoose.model('pointHistories', PointHistorySchema)