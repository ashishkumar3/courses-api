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

const signupSchema = Joi.object({
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

const loginSchema = Joi.object({
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
    const validationResult = signupSchema.validate({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
    });
    if (!validationResult.error) {
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

router.post('/login', (req, res, next) => {
    const { email, password } = req.body;
    const validationResult = loginSchema.validate({ email, password });

    if (!validationResult.error) {
        knex('instructor').where({ email }).then(rows => {
            // console.log(rows);
            const hashedPassword = rows[0].password;
            if (rows.length > 0) {
                // found the email in the database.
                // use brcrypt to compare the passwords
                bcrypt.compare(password, hashedPassword, (err, result) => {
                    if (err) {
                        res.status(500);
                        return next(err);
                    }
                    if (result) {
                        res.json({ success: true, message: 'Logged in successfully!' });
                    } else {
                        res.status(401);
                        return next(new Error('Email and password do not match!'));
                    }
                });
            } else {
                res.status(404);
                next(new Error('The email you entered is not registered! Maybe try signing in first.'));
            }
        });
    } else {
        res.status(422);
        next(result.error);
    }
});

module.exports = router;