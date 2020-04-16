const express = require('express');
const router = express.Router();

// Controllers
const userController = require('../controller/user.controller');

// GET /api/v1/users/:id/questions
router.get('/:id/questions', userController.getQuestionsByUser);

// GET /api/v1/users/:id/answers
router.get('/:id/answers', userController.getAnswersByUser);

// GET /api/v1/users/:id/comments
router.get('/:id/comments', userController.getCommentsByUser);

module.exports = router;