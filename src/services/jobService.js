const ApiError = require('../utils/ApiError');
const Job = require('../models/job');
const { jobStatus } = require('../config/jobStatus');
const offerService = require('./offerService');
const walletService = require('./walletService');
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

    async countJobsByCategory(categoryId) {
        return Job.count({ category: categoryId });
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

    async selectOffer(userId, jobId, offerId) {
        const wallet = await walletService.getWalletByUser(userId);

        if (!wallet) {
            throw new ApiError(404, 'Wallet not found');
        }

        const isSelected = await offerService.getOfferByJobAndNeStatus(jobId, offerStatus.SELECTED);

        if (isSelected) {
            throw new ApiError(400, 'This job already select freelancer');
        }

        const offer = await offerService.getOfferById(offerId);

        if (!offer) {
            throw new ApiError(404, "Offer not found");
        }

        const threshold = offer.price * 0.3;

        if (wallet.points < threshold) {
            throw new ApiError(400, `This offer requires ${threshold} to select`);
        }

        await Job.findByIdAndUpdate(jobId, { $set: { status: jobStatus.SELECTED_FREELANCER, startDate: Date.now() }});
        offer.status = offerStatus.SELECTED;
        await offer.save();
        
        return offer;
    }

    async updateJob(job){
        await Job.findByIdAndUpdate(job._id, job)
        const job = await Job.findById(jobId)
        return job
    }


};

module.exports = new JobService;