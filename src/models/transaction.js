const mongoose = require('mongoose')
const Schema = mongoose.Schema

const { toJSON, paginate } = require('./plugins');


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
});

TransactionSchema.plugin(toJSON);
TransactionSchema.plugin(paginate);

const Transaction = mongoose.model('Transaction', TransactionSchema);

module.exports = Transaction;