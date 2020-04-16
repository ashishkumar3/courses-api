const express = require('express');
const router = express.Router();

// Controllers
const questionController = require('../controller/question.controller');

router.get('/', questionController.getAllQuestions);

router.post('/ask', questionController.createQuestion);

module.exports = router;