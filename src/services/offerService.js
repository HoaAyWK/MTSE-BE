const ApiError = require('../utils/ApiError');
const Offer = require('../models/offer');
const { offerStatus } = require('../config/offerStatus');

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
        return Offer.find({ job: jobId }).populate({ path: 'freelancer', select: 'id name avatar email rating'});
    }

    async getOffersByFreelancer(freelancerId) {
        return Offer.find({ freelancer: freelancerId });
    }

    async getOfferByJobAndFreelancer(jobId, freelancerId) {
        return Offer.findOne({ job: jobId, freelancer: freelancerId });
    }

    async getOfferByJobAndStatus(jobId, status) {
        return Offer.findOne({ job: jobId, status });
    }

    async getOfferByJobAndNeStatus(jobId, status) {
        return Offer.findOne({ job: jobId, status: { $ne: status }});
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

    async acceptOffer(offer) {
        const lstOffers = await Offer.find({job: offer.job});

        lstOffers.forEach(async (item) => {
            await Offer.findByIdAndUpdate(item.id, { status: offerStatus.REJECTED });
        });

        offer.status = offerStatus.ACCEPTED;
        await offer.save();
    }
}

module.exports = new OfferService;