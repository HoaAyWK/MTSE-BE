const mongoose = require('mongoose')
const Schema = mongoose.Schema

const { toJSON } = require('./plugins');

const WalletSchema = new Schema({
    user: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    points: {
        type: Number,
        default: 0
    }
});

WalletSchema.plugin(toJSON);

const Wallet = mongoose.model('Wallet', WalletSchema)

module.exports = Wallet;