const express = require('express');
const router = express.Router();

// DB Config
const knex = require('../db/dbConfig');

// Schemas
//const profile = require('../schemas');

router.get('/', (req, res, next) => {
    res.json({
        message: 'profile'
    });
});