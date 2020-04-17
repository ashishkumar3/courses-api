const express = require('express');
const router = express.Router();

// Controllers
const answerController = require('../controller/answer.controller');

// GET /api/v1/answers - Return all the answers in the database.
router.get('/', answerController.getAllAnswers);

module.exports = router;