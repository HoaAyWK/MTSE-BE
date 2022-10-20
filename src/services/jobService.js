const ApiError = require('../utils/ApiError');
const Job = require('../models/job');
const { jobStatus } = require('../config/jobStatus');
const offerService = require('./offerService');
const { offerStatus } = require('../config/offerStatus');

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

    async offerJob(offerBody) {
        const { job, freelancer } = offerBody;
        const offerExist = await offerService.getOfferByJobAndFreelancer(job, freelancer);

        if (offerExist) {
            throw new ApiError(400, 'You already sent an offer for this job');
        }

        return await offerService.createOffer(offerBody);
    }

    async cancelOfferJob(offerId) {
        const offer = await offerService.getOfferById(offerId);

        if (!offer) {
            throw new ApiError(404, 'Offer not found');
        }

        if (offer.status === offerStatus.ACCEPTED) {
            throw new ApiError(400, 'The Employer already accepts your offer');
        }

        await offerService.deleteOffer(offerId);
    }

    async getOffer(offerId) {
        const offer = await offerService.getOfferById(offerId);

        if (!offer) {
            throw new ApiError(404, 'Offer not found');
        }

        return offer;
    }

    async getOffersByFreelancer(freelancerId) {
        return await offerService.getOffersByFreelancer(freelancerId);
    }

    async getOffersByJob(jobId) {
        return await offerService.getOffersByJob(jobId);
    }

    async selectOffer(jobId, offerId) {
        const isSelected = await offerService.getOfferByJobAndNeStatus(jobId, offerStatus.PENDING);

        if (isSelected) {
            throw new ApiError(400, 'This job already select freelancer');
        }

        await Job.findByIdAndUpdate(jobId, { $set: { status: jobStatus.SELECTED_FREELANCER }});
        return await offerService.updateOffer(offerId, { status: offerStatus.ACCEPTED });
    }
};

module.exports = new JobService;