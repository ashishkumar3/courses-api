const bcrypt = require('bcryptjs');

require('dotenv').config();

const knex = require('../db/dbConfig');

async function createAdminUser() {
    try {
        const rows = await knex('user').select().where({
            role: 'admin'
        });

        if (rows.length > 0) {
            console.log('Admin already exists!');
            return;
        }

        const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 12);


        const updatedRows = await knex('user').insert({
            name: 'admin',
            email: 'admin@admin.com',
            password: hashedPassword,
            role: 'admin',
            active: true
        });

        console.log(updatedRows);
    } catch (error) {
        return next(error);
    }
}

createAdminUser();
