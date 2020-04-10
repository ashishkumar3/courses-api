const Joi = require('@hapi/joi');

const userSchema = Joi.object({
    name: Joi.string()
        .alphanum()
        .min(3)
        .max(30),
    password: Joi.string()
        .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
    role: Joi.string().valid('user', 'admin'),
    active: Joi.boolean()
});

module.exports = userSchema;