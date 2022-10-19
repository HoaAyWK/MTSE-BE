const ApiError = require('../utils/ApiError');
const Offer = require('../models/offer');

class OfferService {
    async createOffer(offerBody) {
        return Offer.create(offerBody);
    }

    async getOffers() {
        return Offer.find();
    }

    async getOfferById(id) {
        return Offer.findById(id);
    }

    async getOffersByJob(jobId) {
        return Offer.find({ job: jobId });
    }

    async getOffersByFreelancer(freelancerId) {
        return Offer.find({ freelancer: freelancerId });
    }

    async getOfferByJobAndFreelancer(jobId, freelancerId) {
        return Offer.findOne({ job: jobId, freelancer: freelancerId });
    }

    async updateOffer(id, updateBody) {
        const offer = await Offer.findById(id).lean();

        if (!offer) {
            throw new ApiError(404, 'Offer not found');
        }

        return await Offer.findByIdAndUpdate(
            id,
            {
                $set: updateBody
            },
            {
                new: true,
                runValidators: true
            }
        );
    }

    async deleteOffer(id) {
        await Offer.findByIdAndDelete(id);
    }
}

module.exports = new OfferService;