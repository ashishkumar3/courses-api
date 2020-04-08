const Joi = require('@hapi/joi');

const noteSchema = Joi.object({
    title: Joi.string().trim().max(25),
    description: Joi.string().trim().max(500)
});

module.exports = noteSchema;