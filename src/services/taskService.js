const ApiError = require('../utils/ApiError');
const Task = require('../models/task');
const jobService = require('./jobService');
const { jobStatus } = require('../config/jobStatus');
const offerService = require('./offerService');
const { offerStatus } = require('../config/offerStatus');
const { roles } = require('../config/roles');
const { taskStatus } = require('../config/taskStatus');

class TaskService {
    async createTask(userId, taskBody) {
        const job = await jobService.getJobById(taskBody.job);

        if (!job) {
            throw new ApiError(404, 'Job not found');
        }

        if (job.owner.toString() !== userId) {
            throw new ApiError(400, 'You are not the owner of this job');
        }

        if (job.status !== jobStatus.OPEN && job.status !== jobStatus.SELECTED_FREELANCER) {
            throw new ApiError(400, 'This job is not able to add task');
        }

        const startDate = new Date(taskBody.startDate);
        const endDate = new Date(taskBody.endDate);

        if (startDate < job.startDate) {
            throw new ApiError(400, 'Task start date must be lagger than or equal job start date');
        }

        if (endDate > job.endDate) {
            throw new ApiError(400, 'Task end date must be less than or equal job endDate')
        }

        if (endDate < startDate) {
            throw new ApiError(400, 'EndDate must be lagger than or equal StartDate');
        }

        return Task.create(taskBody);
    }

    async queryTasks(filter, options) {
        return Task.paginate(filter, options);
    }

    async getTasks() {
        return Task.find();
    }

    async getTask(user, taskId) {
        const task = await Task.findById(taskId);

        if (!task) {
            throw new ApiError(404, 'Task not found');
        }

        const job = await jobService.getJobById(task.job);

        if (!job) {
            throw new ApiError(404, 'Job not found');
        }

        if (job.owner.toString() !== user.id) {

            if (!user.roles.includes(roles.ADMIN)) {
                const offer = await offerService.getOfferByJobAndNeStatus(job.id, offerStatus.PENDING);
    
                if (!offer) {
                    throw new ApiError(403, `Offer not found`);
                }
    
                if (offer.freelancer !== user.id) {
                    throw new ApiError(403, `You don't have permission to access this job's tasks`);
                }
            }
        }
    }

    async getTasksByJob(user, jobId) {
        const job = await jobService.getJobById(jobId);

        if (!job) {
            throw new ApiError(404, 'Job not found');
        }

        if (job.owner.toString() !== user.id) {
            
            if (!user.roles.includes(roles.ADMIN)) {
                const offer = await offerService.getOfferByJobAndNeStatus(job.id, offerStatus.PENDING);
    
                if (!offer) {
                    throw new ApiError(403, `Offer not found`);
                }
 
                if (offer.freelancer.toString() !== user.id) {
                    throw new ApiError(403, `You don't have permission to access this job's tasks`);
                }
            }
        }

        return Task.find({ job: jobId });
    }

    async getTaskByJobAndProcess(jobId, process) {
        return Task.find({ job: jobId, process });
    }

    async doneTask(userId, taskId) {
        const task = await Task.findById(taskId).lean();

        if (!task) {
            throw new ApiError(404, 'Task not found');
        }

        const offer = await offerService.getOfferByJobAndNeStatus(task.job, offerStatus.PENDING);

        if (!offer) {
            throw new ApiError(404, 'Offer not found');
        }

        if (offer.freelancer.toString() !== userId) {
            throw new ApiError(400, `Only Freelancer do this job can perform this action`);
        }

        return await Task.findByIdAndUpdate(
            taskId,
            {
                $set: { status: taskStatus.WAITING }
            },
            {
                new: true,
                runValidators: true
            }
        );
    }

    async finishTask(userId, taskId) {
        const task = await Task.findById(taskId).lean();

        if (!task) {
            throw new ApiError(404, 'Task not found');
        }

        const job = await jobService.getJobById(task.job);

        if (!job) {
            throw new ApiError(404, 'Job not found');
        }

        if (job.owner.toString() !== userId) {
           
            throw new ApiError(400, `You are not the owner of this job`);
        }

        return await Task.findByIdAndUpdate(
            taskId,
            {
                $set: { status: taskStatus.FINISHED }
            },
            {
                new: true,
                runValidators: true
            }
        );
    }

    async getTaskFinishedsByJob(jobId) {
        return Task.find({ job: jobId, status: taskStatus.FINISHED });
    }

    async timeToAddPoints(taskId) {
        const task = await Task.findById(taskId).lean();

        if (!task) {
            throw new ApiError(404, 'Task not found');
        }

        const taskFinisheds = await Task.count({job: task.job, status: taskStatus.FINISHED});
        const totalTasks = await Task.count({ job: task.job });

        const threshold = Math.ceil(totalTasks / 2);

        console.log(taskFinisheds, totalTasks, threshold);

        if (taskFinisheds + 1 > threshold) {
            return true;
        }

        return false;
    }

    async deleteTask(userId, id) {
        const task = await Task.findById(id);

        if (!task) {
            throw new ApiError(404, 'Task not found');
        }

        const job = await jobService.getJobById(task.job);

        if (!job) {
            throw new ApiError(404, 'Job not found');
        }

        if (job.owner.toString() !== userId) {
            throw new ApiError(400, 'You are not the onwer of this task');
        }

        if (job.status !== jobStatus.OPEN && job.status !== job.status.SELECTED_FREELANCER) {
            throw new ApiError(400, 'This job is not able to delete task');
        }

        await task.remove();
    }
}

module.exports = new TaskService;
