// Tables
const tableNames = require('../contants/tableNames');

// Schemas


// DB Config
const knex = require('../db/dbConfig');

exports.getAnswersToQuestion = async (req, res, next) => {

    // GET /api/v1/questions/:id 
    const ques_id = req.params.id;

    try {
        const exists = await knex.schema.hasTable(tableNames.answer);

        if (!exists) {
            res.status(404);
            next(new Error('I think you are lost!'));
            return;
        }

        const row = await knex(tableNames.answer).insert({
            title, description, user_id, rating: 0, question_id: ques_id
        }).returning('*');

        if (row.length < 1) {
            throw new Error('Something went wrong! Try again later.');
        }
        res.json({
            success: true,
            answer: {
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