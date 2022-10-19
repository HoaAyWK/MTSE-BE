const Joi = require('joi');

const starAndWriteComment = {
    body: Joi.object().keys({
        name: Joi.string().required(),
        price: Joi.number().required(),
        points: Joi.number().required(),
    })
};

module.exports = {
    starAndWriteComment
}