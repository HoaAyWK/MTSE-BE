const Joi = require('joi');
const { paymentStatus } = require('../config/paymentStatus');

const updatePaymentHistory = {
    body: Joi.object().keys({
        status: Joi
            .string()
            .required()
            .valid(paymentStatus.PENDING, paymentStatus.SUCCESS, paymentStatus.CANCEL)
    })
};

module.exports = {
    updatePaymentHistory
}