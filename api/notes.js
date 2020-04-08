const express = require('express');
const router = express.Router();

// DB Config
const knex = require('../db/dbConfig');

// Schemas
const noteSchema = require('../schemas/note.schema');

router.get('/', (req, res, next) => {
    res.json({
        message: 'This has your notes📒'
    });
});

router.post('/create', (req, res, next) => {

    const { title, description } = req.body;
    const user_id = req.user.id;

    const validationResult = noteSchema.validate({ title, description });

    if (validationResult.error) {
        res.status(422);
        next(validationResult.error);
        return;
    }

    knex.schema.hasTable('notes').then(exists => {
        if (!exists) {
            res.status(404);
            next(new Error('I think you are lost!'));
            return;
        }

        knex('notes').insert({
            title, description, user_id
        }).returning('*').then(row => {
            if (row.length < 1) {
                throw new Error('Something went wrong! Try again later.');
            }
            res.json({
                success: true,
                note: row[0]
            });
        });
    }).catch(err => {
        res.status(500);
        next(err);
    });
});

module.exports = router;