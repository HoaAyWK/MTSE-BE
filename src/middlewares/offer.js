const ApiError = require('../utils/ApiError');
const offerService = require('../services/offerService');
const { offerStatus } = require('../config/offerStatus');


class OfferMiddleware {
    async requestWithOfferFromParams(req, res, next) {
        try {
            const id = req.params.id;

            if (!id) {
                throw new ApiError(400, 'Params must have id');
            }

            const offer = await offerService.getOfferById(req.params.id);

            if (!offer) {
                throw new ApiError(404, 'Offer not found');
            }

            req.offer = offer;
            next();

        } catch (error) {
            next(error);
        }
    }

    async requestWithOfferFromQuery(req, res, next) {
        try {
            const offerId = req.query.offer;

            if (!offerId) {
                throw new ApiError(400, 'Query must have offer');
            }

            const offer = await offerService.getOfferById(offerId);

            if (!offer) {
                throw new ApiError(404, 'Offer not found');
            }

            req.offer = offer;

            next();
        } catch (error) {
            next(error)
        }
    }

    async isOfferSelected(req, res, next) {
        try {
            const offer = await offerService.getOfferByJobAndNeStatus(req.query.jobId, offerStatus.PENDING);

            if (offer) {
                throw new ApiError(400, 'This job already select freelancer');
            }

            next();
        } catch (error) {
            next(error);
        }
    }

    async isOfferFreelancer(req, res, next) {
        try {
            if (req.offer.freelancer.toString() !== req.user.id.toString()) {
                throw new ApiError(400, 'You do not have permission to start this job');
            }

            next();
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new OfferMiddleware;