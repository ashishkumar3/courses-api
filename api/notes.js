const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
    res.json({
        message: 'This has your notes📒'
    });
});

router.post('/create', (req, res, next) => {
    const { title, description } = req.body;
    res.json(req.body);
});

module.exports = router;