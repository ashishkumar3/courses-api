const express = require('express');
const bcrypt = require('bcryptjs');

const router = express.Router();

// Controllers
const adminController = require('../controller/admin.controller');

router.get('/users', adminController.getUsers);

router.patch('/user/:id', adminController.updateUser);


module.exports = router;
