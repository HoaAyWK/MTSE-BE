const ApiError = require('../utils/ApiError');
const Job = require('../models/job');
const { jobStatus } = require('../config/jobStatus');
const offerService = require('./offerService');
const walletService = require('./walletService');
const { offerStatus } = require('../config/offerStatus');
const pointHistoryService = require('./pointHistoryService');
const taskService = require('./taskService');
const commentService = require('./commentService');
const { getMonth } = require('../utils/getMonth');

class JobService {
    async queryJobs(filter, options) {
        return Job.paginate(filter, options);
    }

    async getJobs() {
        return Job.find()
            .populate({ path: 'owner', select: 'id name avatar email'})
            .populate({ path: 'category', select: 'id name' });
    }

    async getJobById(id) {
        return Job.findById(id);
    }

    async createJob(jobData) {
        
        if (jobData.maxPrice < jobData.minPrice) {
            throw new ApiError(400, 'MaxPrice must be lagger than MinPrice');
        }
        
        return Job.create(jobData);
    }

    async countJobsByCategory(categoryId) {
        return Job.count({ category: categoryId });
    }

    async updateJobsStatusByUser(user, status) {
        return Job.updateMany({ owner: user, status: jobStatus.OPEN }, { $set: { status }});
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

    async selectOffer(offerId, userId, jobId) {
        if (!offerId) {
            throw new ApiError(400, 'Request must have offerId');
        }

        const offer = await offerService.getOfferById(offerId);

        if (!offer) {
            throw new ApiError(400, 'Offer not found');
        }

        if (!jobId) {
            throw new ApiError(400, 'Query must have jobId');
        }

        const job = await Job.findById(jobId);

        if (!job) {
            throw new ApiError(400, 'Job not found');
        }

        const wallet = await walletService.getWalletByUser(userId);

        if (!wallet) {
            throw new ApiError(400, 'Wallet not found');
        }

        const threshold = offer.price * 0.3;

        if (wallet.points < threshold) {
            throw new ApiError(400, `This offer requires ${threshold} to select`);
        }

        await Job.findByIdAndUpdate(job.id, { $set: { status: jobStatus.SELECTED_FREELANCER, startDate: Date.now() }});
        offer.status = offerStatus.SELECTED;
        await offer.save();
        
        return offer;
    }

    async pendingFreelancerStart(jobId, userId) {
        if (!jobId) {
            throw new ApiError(400, 'Params must have jobId');
        }

        const job = await Job.findById(jobId);

        if (!job) {
            throw new ApiError(404, 'Job not found');
        }

        if (job.owner.toString() !== userId) {
            throw new ApiError(400, 'You are not the owner of this job');
        }

        if (job.status !== jobStatus.SELECTED_FREELANCER) {
            throw new ApiError(400, 'Can not pending start this job');
        }

        job.status = jobStatus.PENDING_START;
        await job.save();

        return job;
    }

    // Freelancer accepts all the job's tasks and start to do the job
    async startJob(userId, offerId) {
        if (!offerId) {
            throw new ApiError(400, 'Query must have offerId');
        }

        const offer = await offerService.getOfferById(offerId);

        if (!offer) {
            throw new ApiError(400, 'Offer not found');
        }

        if (offer.freelancer.toString() !== userId) {
            throw new ApiError(400, 'You do not have permission to start this job');
        }

        const job = await Job.findById(offer.job); 

        if (!job) {
            throw new ApiError(404, 'Job not found');
        }

        if (job.status !== jobStatus.PENDING_START) {
            throw new ApiError(400, 'Can not start this job');
        }

        await offerService.acceptOffer(offer);
        const palmMoney = offer.price * 0.3;
        const freelancerWallet = await walletService.getWalletByUser(userId);

        if (!freelancerWallet) {
            throw new ApiError(404, 'Freelancer wallet not found');
        }

        if (freelancerWallet.points < palmMoney) {
            throw new ApiError(400, `Your account does not have enough points for deposit (${palmMoney} points)`);
        }

        const employerWallet = await walletService.getWalletByUser(job.owner);

        if (!employerWallet) {
            throw new ApiError(404, 'Employer wallet not found');
        }

        const adminWallet = await walletService.getAdminWallet();

        if (!adminWallet) {
            throw new ApiError(404, 'Admin wallet not found');
        }

        const month = getMonth();

        await walletService.handlePoint(freelancerWallet, palmMoney, false);
        await walletService.handlePoint(employerWallet, palmMoney, false);
        await walletService.handlePoint(adminWallet, palmMoney * 2, true);

        await pointHistoryService.createPointHistory({ wallet: adminWallet.id, sender: userId, month, point: palmMoney});
        await pointHistoryService.createPointHistory({ wallet: adminWallet.id, sender: job.owner, month, point: palmMoney});
        
        job.status = jobStatus.PROCESSING;
        await job.save();

        return job;
    }

    async doneJob(userId, jobId) {
        if (!jobId) {
            throw new ApiError(400, 'Params must have jobId');
        }

        const job = await Job.findById(jobId);

        if (!job) {
            throw new ApiError(404, 'Job not found');
        }

        if (job.owner.toString() !== userId) {
            throw new ApiError(400, 'You are not the owner of this job');
        }

        if (job.status !== jobStatus.PROCESSING) {
            throw new ApiError(400, `Can not done this job! Only job with status "Processing" can mark as done.`);
        }

        const tasksCount = await taskService.countTasksByJob(job.id);
        const taskFinishedCount = await taskService.countTaskFinshedByJob(job.id);

        if (tasksCount !== taskFinishedCount) {
            throw new ApiError(400, 'All Tasks Not Completed yet');
        }

        const offer = await offerService.getOfferByJobAndStatus(job.id, offerStatus.ACCEPTED);

        if (!offer) {
            throw new ApiError(404, 'Offer not found');
        }

        const employerWallet = await walletService.getWalletByUser(userId);
        
        if (!employerWallet) {
            throw new ApiError(404, 'Employer wallet not found');
        }

        const employerMustPay = 0.5 * offer.price;

        if (employerWallet.points < employerMustPay) {
            throw new ApiError(400, `Your account not have enough points`);
        }

        const freelancerWallet = await walletService.getWalletByUser(offer.freelancer);

        console.log(userId, offer.freelancer);

        if (!freelancerWallet) {
            throw new ApiError(404, 'Freelancer wallet not found');
        }

        const adminWallet = await walletService.getAdminWallet();

        if (!adminWallet) {
            throw new ApiError(404, 'Admin wallet not found');
        }

        const systemAdminWallet = await walletService.getSystemAdminWalllet();

        if (!systemAdminWallet) {
            throw new ApiError(404, 'SystemAdmin wallet not found');
        }

        const month = getMonth();

        // Employer send 50% left to finish the job
        await walletService.handlePoint(employerWallet.id, employerMustPay, false);

        // Decreasing all the deposits has sent to admin wallet (30% freelancer + 50% employer)
        await walletService.handlePoint(adminWallet.id, 0.8 * offer.price, false);

        // Pay 90% points + 30% deposits for Freelancer
        await walletService.handlePoint(freelancerWallet.id, 1.2 * offer.price, true);

        // 10% comission send to system admin wallets
        await walletService.handlePoint(systemAdminWallet.id, 0.1 * offer.price, true);

        // Save point histories
        await pointHistoryService.createPointHistory({ wallet: adminWallet.id, sender: job.owner, month, point: employerMustPay });
        await pointHistoryService.createPointHistory({ wallet: freelancerWallet.id, sender: adminWallet.user, month, point: 0.9 * offer.price });
        await pointHistoryService.createPointHistory({ wallet: freelancerWallet.id, sender: adminWallet.user, month, point: 0.3 * offer.price });
        await pointHistoryService.createPointHistory({ wallet: systemAdminWallet.id, sender: job.owner, month, point: 0.1 * offer.price });

        await commentService.createComment({ user: offer.freelancer, job: job.id, creator: userId });
        await commentService.createComment({ user: userId, job: job.id, creator: offer.freelancer });

        job.status = jobStatus.CLOSED;
        await job.save();
        
        return job;
    }


    async reportFreelancer(userId, jobId) {
        const job = await Job.findById(jobId);

        if (!job) {
            throw new ApiError(404, 'Job not found');
        }

        if (job.owner.toString() !== userId) {
            throw new ApiError(400, 'You are not the owner of this job');
        }

        const latedTasks = await taskService.countDeadlinedTaskByJob(jobId);

        if (latedTasks > 0) {
            job.numReports = job.numReports + 1;
            await job.save();
        }

        if (job.numReports === 3) {
            const offer = await offerService.getOfferByJobAndStatus(jobId, offerStatus.ACCEPTED);

            if (!offer) {
                throw new ApiError(404, 'Offer not found');
            }

            let employerCompensation = 0.3;
            const freelancerCompensation = 0.3;
            
            if (job.half) {
                employerCompensation = 0.5;
            }

            const freelancerWallet = await walletService.getWalletByUser(offer.freelancer);

            if (!freelancerWallet) {
                throw new ApiError(404, 'Freelance wallet not found');
            }

            const employerWallet = await walletService.getWalletByUser(userId)

            if (!employerWallet) {
                throw new ApiError(404, 'Employer not found');
            }

            const adminWallet = await walletService.getAdminWallet();

            if (!adminWallet) {
                throw new ApiError(404, 'Admin wallet not found');
            }

            const month = getMonth();

            await walletService.handlePoint(adminWallet, (freelancerCompensation + employerCompensation) * offer.price, false);
            await walletService.handlePoint(freelancerWallet, freelancerCompensation * offer.price, true);
            await walletService.handlePoint(employerWallet, employerCompensation * offer.price, true);

            await pointHistoryService
                .createPointHistory({ wallet: freelancerWallet.id, sender: adminWallet.user, month, point: freelancerCompensation * offer.price });
            
            await pointHistoryService
                .createPointHistory({ wallet: employerWallet.id, sender: adminWallet.user, month, price: employerCompensation * offer.price });

            job.status = jobStatus.CANCELLED;
            await job.save();
        }

        return job;
    }

    async createTask(userId, taskBody) {
        const { name, startDate, endDate } = taskBody;
        const job = await Job.findById(taskBody.job);

        if (!job) {
            throw new ApiError(404, 'Job not found');
        }

        if (job.owner.toString() !== userId) {
            throw new ApiError(400, 'You are not the owner of this job');
        }

        if (job.status !== jobStatus.OPEN && job.status !== jobStatus.SELECTED_FREELANCER) {
            throw new ApiError(400, 'This job is not able to add task');
        }

        return await taskService.createTask(job, { name, startDate, endDate, job: taskBody.job });
    }

    async finishTask(userId, taskId, jobId) {
        const job = await Job.findById(jobId);

        if (!job) {
            throw new ApiError(404, 'Job not found');
        }

        if (job.owner.toString() !== userId) {
           
            throw new ApiError(400, `You are not the owner of this job`);
        }

        return await taskService.finishTask(userId, job, taskId);
    }
};

module.exports = new JobService;