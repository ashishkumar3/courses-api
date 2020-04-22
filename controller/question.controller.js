// Tables
const tableNames = require('../contants/tableNames');

// Schemas

// DB Config
const knex = require('../db/dbConfig');

// Add a question to the database. GET /api/v1/questions/ask
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
                id: row[0].id,
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

// Get all questions from the database. GET /api/v1/questions
exports.getAllQuestions = async (req, res, next) => {
    try {
        const exists = await knex.schema.hasTable(tableNames.question);

        if (!exists) {
            res.status(404);
            next(new Error('I think you are lost!'));
            return;
        }

        const rows = await knex(tableNames.question).select('*').orderBy('created_at', 'desc');

        // find questioner for each ques/row and append.

        // let questions = rows.map(async row => {
        //     let username = await findUser(row.user_id);
        //     console.log({ ...row, ...username });
        //     // return { ...row, ...username };
        // });

        for (let row of rows) {
            let user = await findUser(row.user_id);
            row.questioner = user.name;
        }

        res.json(rows);

    } catch (error) {
        res.status(500);
        next(error);
    }
};

async function findUser(user_id) {
    const name = await knex(tableNames.user).select('name').where({
        id: user_id
    });
    // console.log(name[0]);
    return name[0];
}

// Get a specific question with answers and comments on that question
// GET /api/v1/questions/:id

exports.getQuestionDetails = async (req, res, next) => {

    const ques_id = req.params.id;

    try {
        const exists = await knex.schema.hasTable(tableNames.question);

        if (!exists) {
            res.status(404);
            next(new Error('I think you are lost!'));
            return;
        }

        // Get the specific question
        const question = await knex(tableNames.question).select('*').where({
            id: ques_id
        });

        // // get all answers to the question
        const answers = await knex(tableNames.answer).select('*').where({
            question_id: ques_id
        });

        const ansIds = [];
        const userIds = [];

        userIds.push(question[0].user_id);

        answers.forEach(answer => {
            ansIds.push(answer.id);
            userIds.push(answer.user_id);
        });

        const uniqueIds = userIds.filter(onlyUnique);

        const users = await knex(tableNames.user).select('id', 'name').whereIn('id', uniqueIds);

        // get all the comments in the question and answers for the question.
        // 2 types of comments 
        // 1. Comment on the question
        // 2. Comment on the answers given to that question.

        const comments = await knex(tableNames.comment).select('*').where({
            question_id: ques_id
        }).orWhereIn('answer_id', ansIds);

        comments.forEach(cmnt => {
            userIds.push(cmnt.user_id);
        });

        res.json({
            question, answers, comments, users
        });

    } catch (error) {
        res.status(500);
        next(error);
    }

};

function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
}

// Answer a question POST /api/v1/questions/:id/answer
exports.answerQuestion = async (req, res, next) => {
    const ques_id = req.params.id;

    // check if table exists, then check if ques exists

    try {
        const table_exists = await knex.schema.hasTable(tableNames.question);

        const ques_exists = await knex(tableNames.question).where({
            id: ques_id
        });

        if (!table_exists || !ques_exists) {
            res.status(404);
            next(new Error('I think you are lost!'));
            return;
        }

        const answer = await knex(tableNames.answer).insert({
            description: req.body.ans,
            user_id: req.user.id,
            question_id: ques_id,
            rating: 0
        }).returning('*');

        res.json(answer);

    } catch (error) {
        res.status(500);
        next(error);
    }
};

// Add comment to a question POST /api/v1/questions/:id/comment
exports.commentOnQuestion = async (req, res, next) => {
    const ques_id = req.params.id;

    try {
        const table_exists = await knex.schema.hasTable(tableNames.question);

        const ques_exists = await knex(tableNames.question).where({
            id: ques_id
        });

        if (!table_exists || !ques_exists) {
            res.status(404);
            next(new Error('I think you are lost!'));
            return;
        }

        const comment = await knex(tableNames.comment).insert({
            description: req.body.comment,
            user_id: req.user.id,
            question_id: ques_id,
            rating: 0
        }).returning('*');

        res.json(comment);

    } catch (error) {
        res.status(500);
        next(error);
    }
};
