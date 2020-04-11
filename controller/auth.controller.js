const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// DB Configs
const knex = require('../db/dbConfig');

// Tables
const tableNames = require('../contants/tableNames');

// Schemas
const signupSchema = require('../schemas/signup.schema');
const loginSchema = require('../schemas/login.schema');

exports.login = (req, res, next) => {
    const { email, password } = req.body;
    const validationResult = loginSchema.validate({ email, password });

    if (!validationResult.error) {
        knex(tableNames.user).where({ email }).then(rows => {
            if (rows.length > 0) {
                if (!rows[0].active) {
                    res.status(422);
                    return next(new Error('Cannot login. User has been deactivated!'));
                }
                // found the email in the database.
                // use brcrypt to compare the passwords
                bcrypt.compare(password, rows[0].password, (err, result) => {
                    if (err) {
                        res.status(500);
                        return next(err);
                    }
                    if (result) {
                        // create a jwt payload
                        const payload = {
                            id: rows[0].id,
                            name: rows[0].name,
                            email: rows[0].email,
                            created_at: rows[0].created_at,
                            role: rows[0].role,
                            active: rows[0].active,
                        };
                        // sign the payload
                        jwt.sign(payload, process.env.TOKEN_SECRET, {
                            expiresIn: '1d'
                        }, (err, token) => {
                            if (err) {
                                // something went wrong!
                                res.status(422);
                                return next(err);
                            }
                            res.json({
                                success: true,
                                message: 'Logged in successfully!',
                                token: token
                            });
                        });
                    } else {
                        res.status(401);
                        return next(new Error('Email and password do not match!'));
                    }
                });
            } else {
                res.status(404);
                next(new Error('The email you entered is not registered! Maybe try signing in first.'));
            }
        }).catch(err => {
            res.status(500);
            next(err.message);
        });
    } else {
        res.status(422);
        next(validationResult.error);
    }
};

exports.signup = (req, res, next) => {
    const validationResult = signupSchema.validate({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
    });
    if (!validationResult.error) {
        knex(tableNames.user).where({
            email: req.body.email
        }).select('id').then(rows => {
            if (rows.length > 0) {
                res.status(409);
                next(new Error('Email already registered. Choose a different one.'));
            } else {
                bcrypt.hash(req.body.password, 12).then(hashedPassword => {
                    knex(tableNames.user).insert({
                        name: req.body.name,
                        email: req.body.email,
                        password: hashedPassword,
                        role: 'user',
                        active: true
                    }).returning('*').then(row => {
                        console.log(row);

                        // create a jwt payload
                        const payload = {
                            id: row[0].id,
                            email: row[0].email
                        };

                        // sign the payload
                        jwt.sign(payload, process.env.TOKEN_SECRET, {
                            expiresIn: '1d'
                        }, (err, token) => {
                            if (err) {
                                // something went wrong!
                                res.status(422);
                                return next(err);
                            }
                            res.json({
                                success: true,
                                message: 'Signed Up successfully!',
                                token: token
                            });
                        });
                    });
                });
            }
        }).catch(err => {
            res.status(500);
            next(err.message);
        });
    } else {
        res.status(422);
        next(validationResult.error);
    }
};