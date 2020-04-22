const knex = require('knex')({
    client: 'pg',
    connection: {
        database: process.env.DATABASE_URL,
        user: process.env.POSTGRES_USER,
        password: process.env.POSTGRES_PASSWORD
    },
    migrations: {
        directory: './db/migrations'
    },
    seeds: {
        directory: './db/seeds'
    }
});

module.exports = knex;