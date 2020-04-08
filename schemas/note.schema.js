const Joi = require('@hapi/joi');

const noteSchema = Joi.object({
    title: Joi.string().trim().max(25).default("DATE"),
    description: Joi.string().trim().max(500).default("Note")
});

module.exports = noteSchema;