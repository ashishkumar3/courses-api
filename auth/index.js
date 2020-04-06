const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');

const knex = require('knex')({
    client: 'pg',
    version: '8.0.0',
    connection: {
        host: '127.0.0.1',
        user: 'postgres',
        password: 'Ashish@123',
        database: 'test'
    }
});

const Joi = require('@hapi/joi');

const schema = Joi.object({
    name: Joi.string()
        .alphanum()
        .min(3)
        .max(30)
        .required(),
    email: Joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
    password: Joi.string()
        .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'))

});

router.get('/', (req, res, next) => {
    res.json({
        message: 'This is auth page bitches🔒🔒🔒'
    });
});

// POST /auth/signup
router.post('/signup', (req, res, next) => {
    const result = schema.validate({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
    });
    if (!result.error) {
        knex('instructor').where({
            email: req.body.email
        }).select('id').then(rows => {
            if (rows.length > 0) {
                res.status(409);
                next(new Error('Email already registered. Choose a different one.'));
            } else {
                bcrypt.hash(req.body.password.trim(), 12).then(hashedPassword => {
                    knex('instructor').insert({
                        name: req.body.name,
                        email: req.body.email,
                        password: hashedPassword
                    }).returning('*').then(row => {
                        console.log(row);
                        res.json({
                            message: 'User registered!'
                        });
                    });
                });
            }
        });
    } else {
        res.status(422);
        next(result.error);
    }
});

module.exports = router;