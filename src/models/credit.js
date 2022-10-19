const mongoose = require('mongoose');

const { toJSON } = require('./plugins');

const creditSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    price: {
        type: Number,
        required: true
    },
    points: {
        type: Number,
        required: true
    }
});

creditSchema.plugin(toJSON);

const Credit = mongoose.model('Credit', creditSchema);

module.exports = Credit;