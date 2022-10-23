const ApiError = require('../utils/ApiError');
const Task = require('../models/task');
const { jobStatus } = require('../config/jobStatus');
const offerService = require('./offerService');
const { offerStatus } = require('../config/offerStatus');
const { roles } = require('../config/roles');
const { taskStatus } = require('../config/taskStatus');
const walletService = require('./walletService');
const pointHistoryService = require('./pointHistoryService');

class TaskService {
    async createTask(job, taskBody) {
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
        const task = await Task.findById(taskId).populate('job');

        if (!task) {
            throw new ApiError(404, 'Task not found');
        }


        if (!task.job) {
            throw new ApiError(404, 'Job not found');
        }

        if (task.job.owner.toString() !== user.id) {

            if (!user.roles.includes(roles.ADMIN)) {
                const offer = await offerService.getOfferByJobAndNeStatus(task.job.id, offerStatus.PENDING);
    
                if (!offer) {
                    throw new ApiError(403, `Offer not found`);
                }
    
                if (offer.freelancer !== user.id) {
                    throw new ApiError(403, `You don't have permission to access this job's tasks`);
                }
            }
        }
    }

    async getTasksByJob(jobId) {
        return Task.find({ job: jobId });
    }

    async getTasksByJobAndStatus(jobId, status) {
        return Task.find({ job: jobId, status });
    }

    async countDeadlinedTaskByJob(jobId) {
        return Task.count({ job: jobId, status: taskStatus.PROCESSING, endDate: { $lt: Date.now() }});
    }

    async countTasksByJob(jobId) {
        return Task.count({ job: jobId });
    }

    async countTasksByJobAndStatus(jobId, status) {
        return Task.count({ job: jobId, status });
    }

    async doneTask(userId, taskId) {
        const task = await Task.findById(taskId);

        if (!task) {
            throw new ApiError(404, 'Task not found');
        }

        const offer = await offerService.getOfferByJobAndStatus(task.job, offerStatus.ACCEPTED);

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

    async finishTask(userId, job, taskId) {
        const task = await Task.findById(taskId);

        if (!task) {
            throw new ApiError(404, 'Task not found');
        }

        if (task.job.toString() !== job.id.toString()) {
            throw new ApiError(400, 'This job does not contain this task');
        }

        const tasksCount = await this.countTasksByJob(task.job);
        const tasksFinishedCount = await this.countTasksByJobAndStatus(task.job, taskStatus.FINISHED);

        // If finished tasks + this task >= 0.5
        const threshold = (tasksFinishedCount + 1) / tasksCount;
        
        if (threshold >= 0.5 && job.half === false) {
            job.half = true;

            const employerWallet = await walletService.getWalletByUser(userId);

            if (!employerWallet) {
                throw new ApiError(404, 'Employer wallet not found');
            }

            const offer = await offerService.getOfferByJobAndStatus(task.job, offerStatus.ACCEPTED);

            if (!offer) {
                throw new ApiError(404, 'Offer not found');
            }

            const mustPay = 0.2 * offer.price;

            if (employerWallet.points < mustPay) {
                throw new ApiError(400, `To finished this task, your account must have ${mustPay} points`);
            }

            const adminWallet = await walletService.getAdminWallet();

            if (!adminWallet) {
                throw new ApiError(404, 'Admin wallet not found');
            }

            await walletService.handlePoint(employerWallet, mustPay, false);
            await walletService.handlePoint(adminWallet, mustPay, true);

            await pointHistoryService.createPointHistory({ wallet: adminWallet.id, sender: userId, point: mustPay });
            await job.save();
        }

        task.status = taskStatus.FINISHED;
        await task.save();

        return task;
    }

    async getTaskFinishedsByJob(jobId) {
        return Task.find({ job: jobId, status: taskStatus.FINISHED });
    }

    async countTasksByJob(jobId) {
        return Task.count({ job: jobId });
    }

    async countTaskFinshedByJob(jobId) {
        return Task.count({ job: jobId, status: taskStatus.FINISHED });
    }

    async deleteTask(userId, id) {
        const task = await Task.findById(id).populate('job');

        if (!task) {
            throw new ApiError(404, 'Task not found');
        }

        if (!task.job) {
            throw new ApiError(404, 'Job not found');
        }

        if (task.job.owner.toString() !== userId) {
            throw new ApiError(400, 'You are not the onwer of this task');
        }

        if (task.job.status !== jobStatus.OPEN && task.job.status !== jobStatus.SELECTED_FREELANCER) {
            throw new ApiError(400, 'This job is not able to delete task');
        }

        await task.remove();
    }
}

module.exports = new TaskService;
