const mongoose = require('mongoose')
const Schema = mongoose.Schema

const { toJSON, paginate } = require('./plugins');

const UserSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        enum: [
            'None',
            'Male',
            'Female'
        ],
        default: 'None'
    },
    phone: {
        type: String,
        required: true
    },
    address: {
        type: String
    },
    bDate: {
        type: Date
    },
    city: {
        type: String
    },
    country: {
        type: String
    },
    stars: {
        type: Number,
        default: 0
    },
    status: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

UserSchema.plugin(toJSON);
UserSchema.plugin(paginate);

module.exports = mongoose.model('User', UserSchema)