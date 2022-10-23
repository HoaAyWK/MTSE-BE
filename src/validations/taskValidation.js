const Joi = require('joi');
const { taskProcess } = require('../config/taskProcess');
const { objectId } = require('./customValidation');

const createTask = {
    body: Joi.object().keys({
        name: Joi.string().required(),
        job: Joi.string().required().custom(objectId),
        startDate: Joi.date().required(),
        endDate: Joi.date().required()
    })
};

module.exports = {
    createTask
}