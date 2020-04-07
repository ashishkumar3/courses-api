const express = require('express');
const router = express.Router();

const knex = require('knex')({
    client: 'pg',
    version: '8.0.0',
    connection: {
        host: '127.0.0.1',
        user: 'postgres',
        password: 'Ashish@123',
        database: 'test'
    }
});

router.get('/', (req, res, next) => {
    res.json({
        message: 'This has your notes📒'
    });
});

router.post('/create', (req, res, next) => {

    const { title, description } = req.body;
    const user_id = req.user.id;

    knex.schema.hasTable('notes').then(exists => {
        console.log('DOES EXIST?', exists);
        if (!exists) {
            res.status(404);
            next(new Error('I think you are lost!'));
            return;
        }

        console.log('READY TO ADD', title, description, user_id);

        knex('notes').insert({
            title, description, user_id
        }).returning('*').then(row => {
            console.log('INSERTED ONE NOTE', row[0]);
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