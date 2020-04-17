const express = require('express');
const router = express.Router();

// Controllers
const commentController = require('../controller/comment.controller');

// GET /api/v1/comments - Return all the comments in the database.
router.get('/', commentController.getAllComments);

module.exports = router;