const mongoose = require('mongoose');

const { toJSON, paginate } = require('./plugins');
const { taskProcess } = require('../config/taskProcess');
const { taskStatus } = require('../config/taskStatus');

const taskSchema = new mongoose.Schema({
    job: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Task',
        required: true
    },
    name: {
        type: String,
        required: true
    },
    process: {
        type: String,
        required: true,
        enum: [
            taskProcess.HALF,
            taskProcess.FINISH
        ]
    },
    status: {
        type: String,
        required: true,
        default: taskStatus.PROCESSING,
        enum: [
            taskStatus.PROCESSING,
            taskStatus.WAITING,
            taskStatus.FINISHED
        ]
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    }
}, { timestamps: true });

taskSchema.plugin(toJSON);
taskSchema.plugin(paginate);

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;
