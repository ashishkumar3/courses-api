const bcrypt = require('bcryptjs');

require('dotenv').config();

const knex = require('../db/dbConfig');

function createAdminUser() {
    knex('user').select().where({
        role: 'admin'
    }).then(rows => {
        if (rows.length > 0) {
            console.log('Admin already exists!');
            return;
        }

        bcrypt.hash(process.env.ADMIN_PASSWORD, 12).then(hashedPassword => {
            knex('user').insert({
                name: 'admin',
                email: 'admin@admin.com',
                password: hashedPassword,
                role: 'admin',
                active: true
            }).then(updatedRows => {
                console.log(updatedRows);
            });
        }).catch(err => next(err));
    }).catch(err => next(err));
}

createAdminUser();
