const express = require('express');
const router = express.Router();

// Controllers
const userController = require('../controller/user.controller');

// GET /api/v1/users/:id/answers
router.get('/:id/answers', userController.getAnswersByUser);

module.exports = router;