const Joi = require('joi');

const { password } = require('./customValidation');

const promoteToEmployer = {
    body: Joi.object().keys({
        company: Joi.string().required(),
        companyRole: Joi.string().required(),
        identityNumber: Joi.string().required(),
        address: Joi.string().required(),
        city: Joi.string().required(),
        country: Joi.string().required(),
        gender: Joi.string().required().valid('Male', 'Female')
    })
};

const changePassword = {
    body: Joi.object().keys({
        oldPassword: Joi.string().required(),
        newPassword: Joi.string().required().custom(password)
    })
}

module.exports = {
    promoteToEmployer,
    changePassword
};