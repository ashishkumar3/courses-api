// Tables
const tableNames = require('../contants/tableNames');

// Database configurations.
const knex = require('../db/dbConfig');

// Schema
const userSchema = require('../schemas/user.schema');

// Returns all users in the database --- only admins can access this route.
exports.getUsers = (req, res, next) => {
    knex.schema.hasTable(tableNames.user).then(exists => {
        if (!exists) {
            res.status(404);
            return next(new Error('You have are lost!'));
        }

        knex(tableNames.user).select('id', 'name', 'email', 'created_at', 'updated_at', 'role', 'active').then(users => {
            res.json(users);
        }).catch(err => next(err));
    });
};

// Update a user --- only admin can update.
exports.updateUser = (req, res, next) => {

    knex.schema.hasTable(tableNames.user).then(exists => {

        if (!exists) {
            res.status(404);
            return next(new Error('You my friend, are lost :)'));
        }

        if (!req.body) {
            res.status(422);
            return res.next(new Error("Provide appropriate data!"));
        }

        let updatedUser = req.body;

        // validate the body
        const validationResult = userSchema.validate(req.body);

        if (validationResult.error) {
            res.status(422);
            return next(validationResult.error);
        }

        if (req.body.password) {
            // create a bcrypt hash.
            bcrypt.hash(req.body.password, 12).then(hashedPassword => {
                updatedUser.password = hashedPassword;
                console.log('Creating hash...');
                knex(tableNames.user).select('*').where('id', req.params.id).then(rows => {
                    if (!rows[0]) {
                        res.status(404);
                        return next(new Error('User not found!'));
                    }
                    return knex(tableNames.user).update({
                        ...rows[0], ...updatedUser
                    }).where({
                        id: rows[0].id
                    }).then(rowsUpdated => {
                        res.json(rowsUpdated);
                    });
                });
            });
        } else {
            knex(tableNames.user).select('*').where('id', req.params.id).then(rows => {
                if (!rows[0]) {
                    res.status(404);
                    return next(new Error('User not found!'));
                }
                return knex(tableNames.user).update({
                    ...rows[0], ...updatedUser
                }).where({
                    id: rows[0].id
                }).then(rowsUpdated => {
                    res.json(rowsUpdated);
                });
            });
        }
    }).catch(err => {
        res.status(500);
        next(err);
    });
};