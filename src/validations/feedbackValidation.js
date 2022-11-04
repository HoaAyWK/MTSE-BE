const Joi = require('joi');

const createFeedback = {
    body: Joi.object().keys({
        name: Joi.string().required(),
        content: Joi.string().required()
    })
};

module.exports = {
    createFeedback
}