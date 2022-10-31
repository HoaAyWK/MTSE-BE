const { Router } = require('express');
const { roles } = require('../../config/roles');

const jobController = require('../../controllers/jobController');
const authMiddleware = require('../../middlewares/auth');
const ownerMiddleware = require('../../middlewares/owner');
const { jobValidation, offerValidation } = require('../../validations');
const validate = require('../../middlewares/validate');

const router = Router();

router
    .route('/jobs')
    .get(jobController.queryJobs);

router
    .route('/jobs/:id')
    .get(jobController.getJob)
    .delete(
        authMiddleware.isAuthenticated,
        authMiddleware.authorizeRoles(roles.EMPLOYER),
        ownerMiddleware.isJobOwner,
        jobController.deleteJob
    );

router
    .route('/my/jobs')
    .get(
        authMiddleware.isAuthenticated,
        authMiddleware.isAuthenticated,
        authMiddleware.authorizeRoles(roles.EMPLOYER),
        jobController.getCurrentEmployerJobs
    );

router
    .route('/jobs/freelancer')
    .get(
        authMiddleware.isAuthenticated,
        authMiddleware.authorizeRoles(roles.FREELANCER),
        jobController.getJobsFreelancerWorkingWith
    );

router
    .route('/jobs/create')
    .post(
        authMiddleware.isAuthenticated,
        authMiddleware.authorizeRoles(roles.EMPLOYER),
        ownerMiddleware.isEmployerProvideEnoughInfo,
        validate(jobValidation.createJob),
        jobController.createJob
    );

router
    .route('/jobs/:id/offer')
    .post(
        authMiddleware.isAuthenticated,
        authMiddleware.authorizeRoles(roles.FREELANCER),
        ownerMiddleware.isFreelancerProvideEnoughInfo,
        validate(offerValidation.offerJob),
        jobController.offerJob
    );

router.route('/jobs/:id/offers')
    .get(
        jobController.getOffersByJob
    )

router
    .route('/my/offers')
    .get(
        authMiddleware.isAuthenticated,
        jobController.getFreelancerOffers
    );

router
    .route('/offers/:id')
    .get(
        authMiddleware.isAuthenticated,
        authMiddleware.authorizeRoles(roles.FREELANCER, roles.EMPLOYER),
        ownerMiddleware.isOfferOwner,
        jobController.getOffer
    )
    .put(
        authMiddleware.isAuthenticated,
        authMiddleware.authorizeRoles(roles.EMPLOYER),
        jobController.selectOffer
    )
    .delete(
        authMiddleware.isAuthenticated,
        authMiddleware.authorizeRoles(roles.FREELANCER),
        ownerMiddleware.isOfferOwner,
        jobController.cancelOfferJob
    );

router
    .route('/jobs/:id/pending-start')
    .put(
        authMiddleware.isAuthenticated,
        authMiddleware.authorizeRoles(roles.EMPLOYER),
        jobController.pendingFreelancerStart
    );

router
    .route('/jobs/:id/start')
    .put(
        authMiddleware.isAuthenticated,
        jobController.startJob
    );

router
    .route('/jobs/:id/finish')
    .put(
        authMiddleware.isAuthenticated,
        authMiddleware.authorizeRoles(roles.EMPLOYER),
        jobController.doneJob
    );

router
    .route('/jobs/:id/report')
    .put(
        authMiddleware.isAuthenticated,
        authMiddleware.authorizeRoles(roles.EMPLOYER),
        jobController.reportUser
    );


router
    .route('/admin/jobs')
    .get(
        authMiddleware.isAuthenticated,
        authMiddleware.authorizeRoles(roles.ADMIN),
        jobController.getJobs
    );

router
    .route('/admin/jobs/:id')
    .delete(
        authMiddleware.isAuthenticated,
        authMiddleware.authorizeRoles(roles.ADMIN),
        jobController.deleteJob
    );

module.exports = router;