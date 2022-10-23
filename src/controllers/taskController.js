const jobService = require('../services/jobService');
const taskService = require('../services/taskService');
const ApiError = require('../utils/ApiError');
const pick = require('../utils/pick');

class CommentController {
    async createTask(req, res, next) {
        try {
            const task = await jobService.createTask(req.user.id, req.body);

            res.status(201).json({
                success: true,
                task
            });
        } catch (error) {
            next(error);
        }
    }

    async queryTask(req, res, next) {
        try {
            const filter = pick(req.query, ['name', 'status', 'process']);
            const options = pick(req.query, ['sortBy', 'limit', 'page']);

            const result = await taskService.queryTasks(filter, options);

            res.status(200).json({
                success: true,
                ...result
            });
        } catch (error) {
            next(error);
        }
    }

    async getTasksByJob(req, res, next) {
        try {
            const tasks = await taskService.getTasksByJob(req.params.id);

            res.status(200).json({
                success: true,
                tasks
            });
        } catch (error) {
            next(error);
        }
    }

    async getTask(req, res, next) {
        try {
            const task = await taskService.getTask(req.user, req.params.id);

            res.status(200).json({
                success: true,
                task
            });
        } catch (error) {
            next(error);
        }
    }

    // Freelancer marks this task as done and waits for Employer marks as finished
    async doneTask(req, res, next) {
        try {
            const task = await taskService.doneTask(req.user.id, req.params.id);

            res.status(200).json({
                success: true,
                task
            });
        } catch (error) {
            next(error);
        }
    }


    // Employer marks this task as finished
    async finishTask(req, res, next) {
        try {
            const task = await jobService.finishTask(req.user.id, req.params.taskId, req.query.jobId);

            res.status(200).json({
                success: true,
                task
            });
        } catch (error) {
            next(error);
        }
    }

    async deleteTask(req, res, next) {
        try {
            await taskService.deleteTask(req.user.id, req.params.id);

            res.status(200).json({
                success: true,
                message: `Deleted task with id: ${req.query.jobId}`
            });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new CommentController;