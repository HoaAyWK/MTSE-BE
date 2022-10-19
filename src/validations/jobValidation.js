const Joi = require('joi');

const { objectId } = require('./customValidation');

const createJob = {
    body: Joi.object().keys({
        name: Joi.string().required(),
        description: Joi.string().required(),
        category: Joi.string().required().custom(objectId),
        minPrice: Joi.number().positive().required(),
        maxPrice: Joi.number().positive().required(),
        endDate: Joi.date().required()
    })
};

module.exports = {
    createJob
}