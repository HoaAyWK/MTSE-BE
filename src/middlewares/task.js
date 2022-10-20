const ApiError = require('../utils/ApiError');
const taskService = require('../services/taskService');


class TaskMiddleware {
    async requestWithTaskFromParams(req, res, next) {
        try {
            const id = req.params.id;

            if (!id) {
                throw new ApiError(400, 'Params must have id');
            }
            
            const task = await taskService.getTask(id);

            if (!task) {
                throw new ApiError(404, 'Task not found');
            }

            req.task = task;

            next();
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new TaskMiddleware;