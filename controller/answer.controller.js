// Tables
const tableNames = require('../contants/tableNames');

// Schemas


// DB Config
const knex = require('../db/dbConfig');

// Return all the answers in the database.
// GET /api/v1/answers
exports.getAllAnswers = async (req, res, next) => {
    try {
        const exists = await knex.schema.hasTable(tableNames.answer);

        if (!exists) {
            res.status(404);
            next(new Error('I think you are lost!'));
            return;
        }

        const answers = await knex(tableNames.answer).select('*');

        if (answers.length < 1) {
            throw new Error('Something went wrong! Try again later.');
        }
        res.json(answers);

    } catch (error) {
        res.status(500);
        next(error);
    }
};

// POST comment to an answer. POST /api/v1/answers/:id/comment
exports.commentOnAnswer = async (req, res, next) => {

    const answerId = req.params.id;
    const user_id = req.user.id;

    try {
        const exists = await knex.schema.hasTable(tableNames.answer);

        if (!exists) {
            res.status(404);
            next(new Error('I think you are lost!'));
            return;
        }

        // const answers = await knex(tableNames.answer).select('*');
        const comment = await knex(tableNames.comment).insert({
            description: req.body.comment, rating: 0, user_id, answer_id: answerId
        }).returning('*');

        if (comment.length < 1) {
            throw new Error('Something went wrong! Try again later.');
        }
        res.json(comment);

    } catch (error) {
        res.status(500);
        next(error);
    }
};
