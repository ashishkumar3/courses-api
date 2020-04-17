const express = require('express');
const router = express.Router();

// Controllers
const answerController = require('../controller/answer.controller');

// GET /api/v1/answers - Return all the answers in the database.
router.get('/', answerController.getAllAnswers);

// POST /api/v1/answers/:id/comment - Post comment on an answer
router.post('/:id/comment', answerController.commentOnAnswer);

module.exports = router;