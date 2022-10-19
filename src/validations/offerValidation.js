const Joi = require('joi');

const offerJob = {
    body: Joi.object().keys({
        price: Joi.number().required(),
        content: Joi.string().required()
    })
};

module.exports = {
    offerJob
}