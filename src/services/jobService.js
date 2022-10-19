const ApiError = require('../utils/ApiError');
const Job = require('../models/job');
const { jobStatus } = require('../config/jobStatus');

class JobService {
    async queryJobs(filter, options) {
        return Job.paginate(filter, options);
    }

    async getJobById(id) {
        return Job.findById(id);
    }

    async createJob(jobBody) {
        return Job.create(jobBody);
    }

    async deleteJob(id) {
        const job = await Job.findById(id).lean();

        if (!job) {
            throw new ApiError(404, 'Job not found');
        }

        if (job.status !== jobStatus.OPEN) {
            throw new ApiError(403, 'Can not delete the job that already assign freelancer')
        }

        await job.remove();
    }
};

module.exports = new JobService;