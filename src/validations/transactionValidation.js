const Joi = require('joi');

const createTransaction = {
    body: Joi.object().keys({
        creditCardReceiver: Joi.string().required(),
        total: Joi.number().required()
    })
};

module.exports = {
    createTransaction
}