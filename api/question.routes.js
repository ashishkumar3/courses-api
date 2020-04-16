const express = require('express');
const router = express.Router();

// Controllers
const questionController = require('../controller/question.controller');

router.get('/', questionController.getAllQuestions);

router.get('/:id', questionController.getQuestion);

router.post('/ask', questionController.createQuestion);

module.exports = router;