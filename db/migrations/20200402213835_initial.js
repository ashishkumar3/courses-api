const Knex = require('knex');

const tableNames = require('../../contants/tableNames');
const tableUtils = require('../../lib/tableUtils');

/**
 * @param {Knex} knex
 */



exports.up = async (knex) => {
    await Promise.all([
        knex.schema.createTable(tableNames.user, table => {
            table.increments().notNullable();
            table.string('name').notNullable();
            tableUtils.email(table, 'email').notNullable().unique();
            tableUtils.password(table, 'password').notNullable();
            table.string('role').notNullable();
            table.boolean('active').notNullable();
            // url(table, 'image_url');
            // url(table, 'website_url');
            // rating(table, 'rating');
            // references(table, 'state');
            // references(table, 'country');
            tableUtils.addDefaultColumns(table);
        }),
        knex.schema.createTable(tableNames.country, table => {
            table.increments().notNullable();
            table.string('name').notNullable();
            table.string('code').notNullable();
        })
        // createNameTable(knex, tableNames.student_type),
        // createNameTable(knex, tableNames.state),
        // createNameTable(knex, tableNames.country),
        // createNameTable(knex, tableNames.course_tag)
    ]);

    // await knex.schema.createTable(tableNames.student, table => {
    //     table.increments().notNullable();
    //     table.string('name').notNullable();
    //     email(table, 'email').notNullable().unique();
    //     password(table, 'password').notNullable();
    //     url(table, 'image_url');
    //     references(table, 'student_type');
    //     references(table, 'state');
    //     references(table, 'country');
    //     addDefaultColumns(table);
    // });

    // await knex.schema.createTable(tableNames.course, table => {
    //     table.increments().notNullable();
    //     table.string('name').notNullable();
    //     table.string('description').notNullable();
    //     rating(table, 'rating');
    //     references(table, 'course_tag');
    //     references(table, 'instructor');
    // });

    // Notes Table
    await knex.schema.createTable(tableNames.notes, table => {
        table.increments().notNullable();
        table.string('title');
        table.string('description');
        tableUtils.references(table, tableNames.user);
        tableUtils.addDefaultColumns(table);
    });

    // Question
    await knex.schema.createTable(tableNames.question, table => {
        table.increments().notNullable();
        table.string('title');
        table.string('description');
        tableUtils.rating(table, 'rating');
        tableUtils.references(table, tableNames.user);
        tableUtils.addDefaultColumns(table);
    });

    // answer
    await knex.schema.createTable(tableNames.answer, table => {
        table.increments().notNullable();
        table.string('title');
        table.string('description');
        tableUtils.rating(table, 'rating');
        tableUtils.references(table, tableNames.user);
        tableUtils.references(table, tableNames.question);
        tableUtils.addDefaultColumns(table);
    });

    // Comment
    await knex.schema.createTable(tableNames.comment, table => {
        table.increments().notNullable();
        table.string('description');
        tableUtils.rating(table, 'rating');
        tableUtils.references(table, tableNames.user);
        tableUtils.references(table, tableNames.question);
        tableUtils.references(table, tableNames.answer);
        tableUtils.addDefaultColumns(table);
    });
};

exports.down = async (knex) => {
    await Promise.all([
        // tableNames.course_tag,
        // tableNames.course,
        // tableNames.instructor,
        // tableNames.student_type,
        // tableNames.student,
        // tableNames.state,
        tableNames.comment,
        tableNames.answer,
        tableNames.question,
        tableNames.country,
        tableNames.notes,
        tableNames.user,
    ].map(table_name => knex.schema.dropTable(table_name)));
};
