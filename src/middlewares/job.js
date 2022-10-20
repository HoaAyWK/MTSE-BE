const ApiError = require('../utils/ApiError');
const jobService = require('../services/jobService');
const { jobStatus } = require('../config/jobStatus');


class JobMiddleware {
    async requestWithJobFromParams(req, res, next) {
        try {
            const id = req.params.id;

            if (!id) {
                throw new ApiError(400, 'Params must have id');
            }

            const job = await jobService.getJobById(id);

            if (!job) {
                throw new ApiError(404, 'Job not found');
            }

            req.job = job;

            next();
        } catch (error) {
            next(error);
        }
    }

    async isJobOwner(req, res, next) {
        try {
            if (req.job.owner.toString() !== req.user.id) {
                throw new ApiError(400, 'You are not the owner of this job');
            } 

            next();
        } catch (error) {
            next(error);
        }
    }

    async isAbleForTask(req, res, next) {
        try {
            if (req.job.status !== jobStatus.OPEN && req.job.status !== jobStatus.PENDING_START) {
                throw new ApiError(400, 'This job is not able to add or delete task');
            }

            next();
        } catch (error) {
            next(error);
        }
    }
}


module.exports = new JobMiddleware;