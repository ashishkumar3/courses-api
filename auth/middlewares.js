const jwt = require('jsonwebtoken');

exports.checkTokenSetUser = (req, res, next) => {
    const authHeader = req.get('authorization');
    if (authHeader) {
        const token = authHeader.split(' ')[1];
        if (token) {
            jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
                if (err) {
                    res.status(401);
                    next(err);
                }
                req.user = user;
            });
        }
    }
    next();
};

exports.isLoggedIn = (req, res, next) => {
    if (req.user) {
        next();
    } else {
        const error = new Error('🛑 Un-Authorized 🛑');
        res.status(401);
        next(error);
    }
};