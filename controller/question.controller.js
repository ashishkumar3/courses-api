// Tables
const tableNames = require('../contants/tableNames');

// Schemas


// DB Config
const knex = require('../db/dbConfig');


// Add a question to the database.
exports.createQuestion = async (req, res, next) => {

    const { title, description } = req.body;

    if (!req.user) {
        res.status(401);
        return next(new Error("You need to login first!"));
    }
    const user_id = req.user.id;

    // validate the question schema?
    // ...

    try {
        const exists = await knex.schema.hasTable(tableNames.question);

        if (!exists) {
            res.status(404);
            next(new Error('I think you are lost!'));
            return;
        }

        const row = await knex(tableNames.question).insert({
            title, description, user_id, rating: 0
        }).returning('*');

        if (row.length < 1) {
            throw new Error('Something went wrong! Try again later.');
        }
        res.json({
            success: true,
            question: {
                created_at: row[0].created_at,
                updated_at: row[0].updated_at,
                description: row[0].description,
                title: row[0].title,
                rating: row[0].rating
            }
        });

    } catch (error) {
        res.status(500);
        next(error);
    }

};

// Get all questions from the database.
exports.getAllQuestions = async (req, res, next) => {
    try {
        const exists = await knex.schema.hasTable(tableNames.question);

        if (!exists) {
            res.status(404);
            next(new Error('I think you are lost!'));
            return;
        }

        const rows = await knex(tableNames.question).select('*');

        res.json(rows);

    } catch (error) {
        res.status(500);
        next(error);
    }
};

// Get a specific question
// GET /api/v1/questions/:id

exports.getQuestion = async (req, res, next) => {

    const ques_id = req.params.id;

    // check if the question exists with that id
    // const ques = 

    try {
        const exists = await knex.schema.hasTable(tableNames.question);

        if (!exists) {
            res.status(404);
            next(new Error('I think you are lost!'));
            return;
        }

        const rows = await knex(tableNames.question).select('*').where({
            id: ques_id
        });

        res.json(rows);

    } catch (error) {
        res.status(500);
        next(error);
    }

};