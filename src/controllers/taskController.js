const taskService = require('../services/taskService');
const ApiError = require('../utils/ApiError');
const pick = require('../utils/pick');
const { taskStatus } = require('../config/taskStatus');

class CommentController {
    async createTask(req, res, next) {
        try {
            const task = await taskService.createTask(req.user.id, req.body);

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
            const tasks = await taskService.getTasksByJob(req.user, req.params.id);

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

    // Freelancer marks this task as done and waits for Employer mark as finished
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
            const isTimeToAddPoints = await taskService.timeToAddPoints(req.params.id);

            if (isTimeToAddPoints) {
                throw new ApiError(400, 'You need to add points')
            }

            const task = await taskService.finishTask(req.user.id, req.params.id);

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