const ApiError = require('../utils/ApiError');
const jobService = require('../services/jobService');
const pick = require('../utils/pick');
const offerService = require('../services/offerService');
const walletService = require('../services/walletService');
const taskService = require('../services/taskService');
const { jobStatus } = require('../config/jobStatus');
const { taskStatus } = require('../config/taskStatus');
const { handlePoint } = require('../services/walletService');

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

    async getOffersByJob(req, res, next) {
        try {
            const offers = await jobService.getOffersByJob(req.params.id);

            res.status(200).json({
                success: true,
                count: offers.length,
                offers
            });
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

    async selectOffer(req, res, next) {
        try {
            const offer = await jobService.selectOffer(req.user.id, req.query.jobId, req.params.id);

            res.status(200).json({
                success: true,
                offer
            });
        } catch (error) {
            next(error);   
        }
    }

    async acceptJob(req, res){
        try{
            const userId = req.user.id
            const {offerId} = req.body
            if (!userId || !offerId){
                return res.status(400).json({
                    success: false,
                    message: "Invalid User or Offer"
                })
            }

            const offer = await jobService.getJobById(offerId)
            if (!offer){
                return res.status(400).json({
                    success: false,
                    message: 'Invalid Offer'
                })
            }

            const acceptedOffer = await offerService.acceptOffer(offerId)

            const palmMoney = offer.point*0.3

            const walletFreelancer = await walletService.getWalletByUser(userId)
            const job = await jobService.getJobById(offer._id)
            const walletEmployer = await walletService.getWalletByUser(job.ownerId)

            await walletService.handlePoint(walletFreelancer._id, palmMoney, false)
            await walletService.handlePoint(walletEmployer._id, palmMoney, false)

            if (acceptedOffer){
                return res.status(200).json({
                    succes: true
                })
            }

        }
        catch(error){
            
        }
    }

    async doneJob(req, res){
        try{
            const userId = req.user.id
            const {jobId} = req.body
            const allTasks = await taskService.getTasksByJob(userId, jobId)
            const completedTasks = await taskService.getTaskFinishedsByJob(jobId)
            if (allTasks.length != completedTasks.length){
                return res.status(400).json({
                    success: false,
                    message: "All Tasks Not Completed"
                })
            }

            const job = await jobService.getJobById(jobId)
            job.status = jobStatus.CLOSED
            const edittedJob = await jobService.updateJob(job)

            const walletFreelancer = await walletService.getWalletById(userId)
            const offer = await offerService.getOffersByJob(jobId)

            const sendMoney = offer.point*1.2

            await walletService.handlePoint(walletFreelancer._id, sendMoney, true)

            return res.status(200).json({
                success: true,
                job: edittedJob
            })
        }
        catch(error){
            return res.status(500).json({
                success: false
            })
        }
    }

    async reportUser(req, res){
        try{
            const {jobId} = req.body
            const job = await jobService.getJobById(jobId)

            const updated = false
            
            const edittedJob = null
            const taskProcessing = await taskService.getTaskByJobAndProcess(jobId, taskStatus.PROCESSING)

            if (taskProcessing.endDate < Date.now()){
                job.numReports = job.numReports + 1
                edittedJob = await jobService.updateJob(job)
                updated=true
            }
            else{
                const allTaskWaiting = await taskService.getTaskByJobAndProcess(jobId, taskStatus.WAITING)
                for (var i =0 ;i < allTaskWaiting.length; i++){
                    if (Date.now() > allTaskWaiting[i].endDate){
                        job.numReports = job.numReports + 1
                        edittedJob = await jobService.updateJob(job)
                        updated=true
                        break
                    }
                }
            }
            if (updated==true && job.numReports == 3){
                job.status = jobStatus.CANCELLED
                await jobService.updateJob(job)
                const offer = await offerService.getOffersByJob(jobId)
                const coeff = 0.3
                if (job.half == true){
                    coeff = 0.5
                }
                const sendMoney = offer.points*coeff

                const walletEmployer = await walletService.getWalletByUser(req.user.id)
                await handlePoint(walletEmployer._id, sendMoney, true)
            }

            if (updated == true){
                return res.status(200).json({
                    success: true,
                    job: edittedJob
                })
            }
            else{
                return res.status(200).json({
                    success: false
                })
            }

        }
        catch(error){
            return res.status(500).json({
                success: false
            })
        }
    }

}

module.exports = new JobController;