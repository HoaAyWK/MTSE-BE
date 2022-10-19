const mongoose = require('mongoose')
const Schema = mongoose.Schema

const WalletSchema = new Schema({
    userId: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    points: {
        type: Number,
        default: 0
    }
})

module.exports = mongoose.model('wallets', WalletSchema)