const Joi = require('joi');

const createTransaction = {
    body: Joi.object().keys({
        creditCardReceiver: Joi.string().required(),
        total: Joi.number().required(),
        status: Joi.boolean().required()
    })
};

module.exports = {
    createTransaction
}