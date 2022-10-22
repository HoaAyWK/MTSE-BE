const mongoose = require('mongoose');

const { toJSON, paginate } = require('./plugins');
const { jobStatus } = require('../config/jobStatus');

const jobSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    description:{
        type: String,
        require: true
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: String,
        required: true,
        default: jobStatus.OPEN,
        enum: [
            jobStatus.OPEN,
            jobStatus.PROCESSING,
            jobStatus.CLOSED,
            jobStatus.CANCELLED
        ]
    },
    startDate: {
        type: Date
    },
    endDate: {
        type: Date,
        required: true
    },
    minPrice: {
        type: Number,
        required: true
    },
    maxPrice: {
        type: Number,
        required: true
    },
    numReports: {
        type: Number,
        default: 0,
        min: 0,
        max: 3
    },
    freelancer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    half: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

jobSchema.plugin(toJSON);
jobSchema.plugin(paginate);

const Job = mongoose.model('Job', jobSchema);

module.exports = Job;