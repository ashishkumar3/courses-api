const express = require('express');
const router = express.Router();

// Controllers
const questionController = require('../controller/question.controller');

// return all questions
router.get('/', questionController.getAllQuestions);

// get question info
router.get('/:id', questionController.getQuestion);

// ask a question
router.post('/ask', questionController.createQuestion);

// answer a question
router.post('/:id/answer', questionController.answerQuestion);

// comment on a question
router.post('/:id/comment', questionController.commentOnQuestion);

module.exports = router;