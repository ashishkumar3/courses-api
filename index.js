const express = require('express');
const volleyball = require('volleyball');
const cors = require('cors');
const helmet = require('helmet');

// Environment variables
require('dotenv').config();

// Middleware
const middlewares = require('./auth/middlewares');

// Routes
const authRoute = require('./auth');
const notesRoute = require('./api/notes.routes');
const questionRoute = require('./api/question.routes');
// const profileRoute = require('./api/profile.routes');
const adminRoute = require('./api/admin.routes');

const app = express();

app.use(cors({
    origin: 'http://localhost:4200'
}));
app.use(volleyball);
app.use(express.json());
app.use(helmet());
app.use(middlewares.checkTokenSetUser);

const PORT = process.env.PORT || 3000;

app.get('/', (req, res, next) => {
    res.json({
        message: 'This is home page bitches😎😎😎',
        user: req.user
    });
});

app.use('/auth', authRoute);
app.use('/api/v1/notes', middlewares.isLoggedIn, notesRoute);
app.use('/api/v1/admin', middlewares.isLoggedIn, middlewares.isAdmin, adminRoute);
app.use('/api/v1/questions', questionRoute);
// app.use('/api/v1/profile', middlewares.isLoggedIn, profileRoute);


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