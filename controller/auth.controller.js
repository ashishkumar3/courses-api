const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// DB Configs
const knex = require('../db/dbConfig');

// Tables
const tableNames = require('../contants/tableNames');

// Schemas
const signupSchema = require('../schemas/signup.schema');
const loginSchema = require('../schemas/login.schema');

exports.login = async (req, res, next) => {
    const { email, password } = req.body;
    const validationResult = loginSchema.validate({ email, password });

    if (!validationResult.error) {

        try {
            const rows = await knex(tableNames.user).where({ email });

            // if the login user email is found in the database.
            if (rows.length > 0) {
                // If found ? only active users can login!
                if (!rows[0].active) {
                    res.status(422);
                    return next(new Error('Cannot login! User has been deactivated!'));
                }

                // use bcrypt to compare the passwords
                const result = await bcrypt.compare(password, rows[0].password);
                if (!result) {
                    res.status(401);
                    return next(new Error('Email and password do not match!'));
                }

                // create a jwt payload.
                const payload = {
                    id: rows[0].id,
                    name: rows[0].name,
                    email: rows[0].email,
                    created_at: rows[0].created_at,
                    role: rows[0].role,
                    active: rows[0].active,
                };

                const token = await jwt.sign(payload, process.env.TOKEN_SECRET, {
                    expiresIn: '1d'
                });
                return res.json({
                    success: true,
                    message: 'Logged in successfully!',
                    token: token
                });
            }

            res.status(404);
            return next(new Error('The email you entered is not registered! Maybe try signing in first.'));

        } catch (error) {
            next(error);
        }

    } else {
        res.status(422);
        next(validationResult.error);
    }
};

exports.signup = async (req, res, next) => {
    const validationResult = signupSchema.validate({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
    });
    if (!validationResult.error) {

        try {
            const rows = await knex(tableNames.user).where({
                email: req.body.email
            }).select('id');

            if (rows.length > 0) {
                res.status(409);
                next(new Error('Email already registered. Choose a different one.'));
            } else {
                const hashedPassword = await bcrypt.hash(req.body.password, 12);
                const row = await knex(tableNames.user).insert({
                    name: req.body.name,
                    email: req.body.email,
                    password: hashedPassword,
                    role: 'user',
                    active: true
                }).returning('*');
                console.log(row);

                // create a jwt payload
                const payload = {
                    id: row[0].id,
                    email: row[0].email
                };

                // sign the payload
                const token = await jwt.sign(payload, process.env.TOKEN_SECRET, {
                    expiresIn: '1d'
                });

                res.json({
                    success: true,
                    message: 'Signed Up successfully!',
                    token: token
                });
            }
        } catch (error) {
            console.log(error);
            return next(error);
        }
    } else {
        res.status(422);
        next(validationResult.error);
    }
};