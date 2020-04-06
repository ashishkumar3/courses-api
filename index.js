const express = require('express');
const volleyball = require('volleyball');
const cors = require('cors');

// Routes
const authRoute = require('./auth');

const app = express();

app.use(cors({
    origin: 'http://localhost:4200'
}));
app.use(volleyball);
app.use(express.json());

const PORT = process.env.PORT || 3000;

app.get('/', (req, res, next) => {
    res.json({
        message: 'This is home page bitches😎😎😎'
    });
});

app.use('/auth', authRoute);

function notFound(req, res, next) {
    res.status(404);
    const error = new Error('Not Found - ' + req.originalUrl);
    next(error);
}

function errorHandler(err, req, res, next) {
    res.status(res.statusCode || 500);
    res.json({
        message: err.message,
        stack: err.stack
    });
}

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Server running on PORT ${PORT}`);
});