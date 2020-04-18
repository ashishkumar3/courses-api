// Tables
const tableNames = require('../contants/tableNames');

// Schemas


// DB Config
const knex = require('../db/dbConfig');

// GET /api/v1/users - Returns all the users in the database.
exports.getAllUsers = async (req, res, next) => {
    try {
        const exists = await knex.schema.hasTable(tableNames.user);

        if (!exists) {
            res.status(404);
            next(new Error('I think you are lost!'));
            return;
        }

        const rows = await knex(tableNames.user).select('name');

        res.json(rows);
    } catch (error) {
        res.status(500);
        next(error);
    }
};

// GET /api/v1/users/:id - Returns the information about a particular user in the database.
exports.getUserById = async (req, res, next) => {
    const user_id = req.params.id;

    try {
        const exists = await knex.schema.hasTable(tableNames.user);

        if (!exists) {
            res.status(404);
            next(new Error('I think you are lost!'));
            return;
        }

        const rows = await knex(tableNames.user).select('id', 'name', 'email').where({
            id: user_id
        });

        res.json(rows);

    } catch (error) {
        res.status(500);
        next(error);
    }
};

// GET /api/v1/users/:id/questions
exports.getQuestionsByUser = async (req, res, next) => {
    const user_id = req.params.id;

    try {
        const exists = await knex.schema.hasTable(tableNames.user);

        if (!exists) {
            res.status(404);
            next(new Error('I think you are lost!'));
            return;
        }

        const rows = await knex(tableNames.question).select('*').where({
            user_id: user_id
        });

        res.json(rows);

    } catch (error) {
        res.status(500);
        next(error);
    }
};

// GET /api/v1/users/:id/answers
exports.getAnswersByUser = async (req, res, next) => {
    const user_id = req.params.id;

    try {
        const exists = await knex.schema.hasTable(tableNames.user);

        if (!exists) {
            res.status(404);
            next(new Error('I think you are lost!'));
            return;
        }

        const rows = await knex(tableNames.answer).select('*').where({
            user_id: user_id
        });

        res.json(rows);

    } catch (error) {
        res.status(500);
        next(error);
    }
};

// GET /api/v1/users/:id/comments
exports.getCommentsByUser = async (req, res, next) => {
    const user_id = req.params.id;

    try {
        const exists = await knex.schema.hasTable(tableNames.user);

        if (!exists) {
            res.status(404);
            next(new Error('I think you are lost!'));
            return;
        }

        const rows = await knex(tableNames.comment).select('*').where({
            user_id: user_id
        });

        res.json(rows);

    } catch (error) {
        res.status(500);
        next(error);
    }
};