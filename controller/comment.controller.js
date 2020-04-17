// Tables
const tableNames = require('../contants/tableNames');

// Schemas


// DB Config
const knex = require('../db/dbConfig');


// GET /api/v1/comments - Return all comments in the database.
exports.getAllComments = async (req, res, next) => {
    try {
        const exists = await knex.schema.hasTable(tableNames.comment);

        if (!exists) {
            res.status(404);
            next(new Error('I think you are lost!'));
            return;
        }

        const comments = await knex(tableNames.comment).select('*');

        if (comments.length < 1) {
            throw new Error('Something went wrong! Try again later.');
        }
        res.json(comments);

    } catch (error) {
        res.status(500);
        next(error);
    }
};