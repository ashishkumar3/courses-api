const Knex = require('knex');

const tableNames = require('../../contants/tableNames');

/**
 * @param {Knex} knex
 */

function addDefaultColumns(table) {
    table.timestamps(false, true);
    table.datetime('deleted_at');
}

function createNameTable(knex, table_name) {
    return knex.schema.createTable(table_name, table => {
        table.increments().notNullable();
        table.string('name').notNullable().unique();
        addDefaultColumns(table);
    });
}

function references(table, tableName) {
    table
        .integer(`${tableName}_id`)
        .unsigned()
        .references('id')
        .inTable(tableName)
        .onDelete('cascade');
}

function url(table, columnName) {
    table.string(columnName, 2000);
}

function email(table, columnName) {
    return table.string(columnName, 254);
}

function password(table, columnName) {
    return table.string(columnName, 127);
}

function rating(table, columnName) {
    table.decimal(columnName, 2);
}

exports.up = async (knex) => {
    await Promise.all([
        knex.schema.createTable(tableNames.user, table => {
            table.increments().notNullable();
            table.string('name').notNullable();
            email(table, 'email').notNullable().unique();
            password(table, 'password').notNullable();
            // url(table, 'image_url');
            // url(table, 'website_url');
            // rating(table, 'rating');
            // references(table, 'state');
            // references(table, 'country');
            addDefaultColumns(table);
        }),
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

    await knex.schema.createTable(tableNames.notes, table => {
        table.increments().notNullable();
        table.string('title');
        table.string('description');
        references(table, 'user');
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
        // tableNames.country,
        tableNames.notes,
        tableNames.user,
    ].map(table_name => knex.schema.dropTable(table_name)));
};
