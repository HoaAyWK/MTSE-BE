const ApiError = require('../utils/ApiError');
const jobService = require('../services/jobService');
const pick = require('../utils/pick');

class JobController {
    async queryJobs(req, res, next) {
        try {
            const filter = pick(req.query, ['name', 'status']);
            const options = pick(req.query, ['sortBy', 'limit', 'page', 'exclude']);
            const result = await jobService.queryJobs(filter, options);

            res.status(200).json({
                success: true,
                ...result
            });
        } catch (error) {
            next(error);
        }
    }

    async getJobsByUser(req, res, next) {
        try {
            const filter = pick(req.query, ['name', 'status']);
            const options = pick(req.query, ['sortBy', 'limit', 'page', 'exclude']);

            filter.user = req.params.id;
            
            const result = await jobService.queryJobs(filter, options);

            res.status(200).json({
                success: true,
                ...result
            });
        } catch (error) {
            next(error);
        }
    }

    async getCurrentEmployerJobs(req, res, next) {
        try {
            const filter = pick(req.query, ['name', 'status']);
            const options = pick(req.query, ['sortBy', 'limit', 'page', 'exclude']);

            filter.user = req.user.id;

            const result = await jobService.queryJobs(filter, options);

            res.status(200).json({
                success: true,
                ...result
            });
        } catch (error) {
            next(error);
        }
    }

    async getJobsFreelancerWorkingWith(req, res, next) {
        try {
            const filter = pick(req.query, ['name', 'status']);
            const options = pick(req.query, ['sortBy', 'limit', 'page', 'exclude']);

            filter.freelancer = req.user.id;

            const result = await jobService.queryJobs(filter, options);

            res.status(200).json({
                success: true,
                ...result
            });
        } catch (error) {
            next(error);
        }
    }

    async getJob(req, res, next) {
        try {
            const job = await jobService.getJobById(req.params.id);

            if (!job) {
                throw new ApiError(404, 'Job not found');
            }

            res.status(200).json({
                success: true,
                job
            });
        } catch (error) {
            next(error);
        }   
    }

    async createJob(req, res, next) {
        try {
            const jobData = req.body;

            if (jobData.maxPrice < jobData.minPrice) {
                throw new ApiError(400, 'MaxPrice must be lagger than MinPrice');
            }

            jobData.owner = req.user.id;

            const job = await jobService.createJob(jobData);

            res.status(201).json({
                success: true,
                job
            });
        } catch (error) {
            next(error);
        }
    }

    async deleteJob(req, res, next) {
        try {
            await jobService.deleteJob(req.params.id);

            res.status(200).json({
                success: true,
                message: `Deleted job with id: ${req.params.id}`
            })
        } catch (error) {
            next(error);
        }
    }

    async offerJob(req, res, next) {
        try {
            const offerData = req.body;
            offerData.job = req.params.id;
            offerData.freelancer = req.user.id;

            const offer = await jobService.offerJob(offerData);

            res.status(201).json({
                success: true,
                offer
            });
        } catch (error) {
            next(error);
        }
    }

    async cancelOfferJob(req, res, next) {
        try {
            await jobService.cancelOfferJob(req.params.id);

            res.status(200).json({
                success: true,
                message: `Deleted offer with id: ${req.params.id}`
            });
        } catch (error) {
            next(error);
        }
    }

    async getOffer(req, res, next) {
        try {
            const offer = await jobService.getOffer(req.params.id);

            res.status(200).json({
                status: 200,
                offer
            });
        } catch (error) {
            next(error);
        }
    }

    async getFreelancerOffers(req, res, next) {
        try {
            const offers = await jobService.getOffersByFreelancer(req.user.id);

            res.status(200).json({
                success: true,
                count: offers.length,
                offers
            });
        } catch (error) {
            next(error);
        } 
    }
}

module.exports = new JobController;