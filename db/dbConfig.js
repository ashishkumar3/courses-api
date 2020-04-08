const knex = require('knex')({
    client: 'pg',
    version: '8.0.0',
    connection: {
        host: '127.0.0.1',
        user: process.env.POSTGRES_USER,
        password: process.env.POSTGRES_PASSWORD,
        database: process.env.POSTGRES_DB
    }
});

module.exports = knex;