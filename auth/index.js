const express = require('express');
const router = express.Router();

// Controllers
const authController = require('../controller/auth.controller');

router.get('/', (req, res, next) => {
    res.json({
        message: 'This is auth page bitches🔒🔒🔒'
    });
});

// POST /auth/signup
router.post('/signup', authController.signup);

router.post('/login', authController.login);

module.exports = router;