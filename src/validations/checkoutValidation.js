const Joi = require('joi');

const checkout = {
    body: Joi.object().keys({
        credit: Joi.string().required()
    })
};

module.exports = {
    checkout
}