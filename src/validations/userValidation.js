const Joi = require('joi');

const { password, objectId } = require('./customValidation');

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

const updateUser = {
    body: Joi.object().keys({
        id: Joi.string().custom(objectId),
        name: Joi.string(),
        phone: Joi.string(),
        gender: Joi.string(),
        address: Joi.string(),
        city: Joi.string(),
        country: Joi.string(),
        avatar: Joi.string().allow(null, ''),
        identityNumber: Joi.string(),
        introduction: Joi.string(),
        experience: Joi.string(),
        company: Joi.string(),
        companyRole: Joi.string()
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
    changePassword,
    updateUser
};