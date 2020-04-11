// Tables
const tableNames = require('../contants/tableNames');

// Schemas
const noteSchema = require('../schemas/note.schema');

// DB Config
const knex = require('../db/dbConfig');

exports.getNotes = async (req, res, next) => {

    try {
        const exists = await knex.schema.hasTable(tableNames.notes);

        if (!exists) {
            res.status(404);
            next(new Error('I think you are lost!'));
            return;
        }

        const rows = await knex(tableNames.notes).select('title', 'created_at', 'updated_at', 'description').where({
            user_id: req.user.id
        }).orderBy('id', 'DESC');

        res.json(rows);

    } catch (error) {
        res.status(500);
        next(error);
    }
};

exports.createNote = async (req, res, next) => {

    const { title, description } = req.body;
    const user_id = req.user.id;

    const validationResult = noteSchema.validate({ title, description });

    if (validationResult.error) {
        res.status(422);
        next(validationResult.error);
        return;
    }

    try {
        const exists = await knex.schema.hasTable(tableNames.notes);
        // .then(exists => {
        if (!exists) {
            res.status(404);
            next(new Error('I think you are lost!'));
            return;
        }

        const row = await knex(tableNames.notes).insert({
            title, description, user_id
        }).returning('*');

        if (row.length < 1) {
            throw new Error('Something went wrong! Try again later.');
        }
        res.json({
            success: true,
            note: row[0]
        });
    } catch (error) {
        res.status(500);
        next(error);
    }
};