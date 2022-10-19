const mongoose = require('mongoose')
const Schema = mongoose.Schema


const TransactionSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        required: true
    },
    creditCardReceiver: {
        type: String,
        required: true
    },
    total: {
        type: Number,
        required: true
    },
    status: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    submittedDate: {
        type: Date,
        default: null
    }
})

module.exports = mongoose.model('transactions', TransactionSchema)