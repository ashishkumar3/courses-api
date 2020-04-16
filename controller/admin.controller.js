// Tables
const tableNames = require('../contants/tableNames');

// Database configurations.
const knex = require('../db/dbConfig');

// Schema
const userSchema = require('../schemas/user.schema');

// Returns all users in the database --- only admins can access this route.
exports.getUsers = async (req, res, next) => {
    const exists = await knex.schema.hasTable(tableNames.user);

    if (!exists) {
        res.status(404);
        return next(new Error('You have are lost!'));
    }

    const users = await knex(tableNames.user).select('id', 'name', 'email', 'created_at', 'updated_at', 'role', 'active');

    res.json(users);
};

// Update a user --- only admin can update.
exports.updateUser = async (req, res, next) => {

    try {

        const exists = await knex.schema.hasTable(tableNames.user);
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
            const hashedPassword = await bcrypt.hash(req.body.password, 12);
            updatedUser.password = hashedPassword;
            console.log('Creating hash...');

            const rows = await knex(tableNames.user).select('*').where('id', req.params.id);

            if (!rows[0]) {
                res.status(404);
                return next(new Error('User not found!'));
            }

            const rowsUpdated = await knex(tableNames.user).update({
                ...rows[0], ...updatedUser
            }).where({
                id: rows[0].id
            });

            res.json(rowsUpdated);

        } else {

            const rows = await knex(tableNames.user).select('*').where('id', req.params.id);

            if (!rows[0]) {
                res.status(404);
                return next(new Error('User not found!'));
            }

            const rowsUpdated = await knex(tableNames.user).update({
                ...rows[0], ...updatedUser
            }).where({
                id: rows[0].id
            });

            res.json(rowsUpdated);
        }

    } catch (error) {
        next(error);
    }
};