const Joi = require('joi');

const starAndWriteComment = {
    body: Joi.object().keys({
        stars: Joi.number().required().min(1).max(5),
        content: Joi.string().required()
    })
};

module.exports = {
    starAndWriteComment
}