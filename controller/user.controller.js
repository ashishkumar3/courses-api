// Tables
const tableNames = require('../contants/tableNames');

// Schemas


// DB Config
const knex = require('../db/dbConfig');

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