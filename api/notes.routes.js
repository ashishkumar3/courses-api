const express = require('express');
const router = express.Router();

// Controllers
const notesController = require('../controller/notes.controller');

router.get('/', notesController.getNotes);

router.post('/create', notesController.createNote);

module.exports = router;