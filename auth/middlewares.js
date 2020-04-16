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

function unAuthorized(res, next) {
    const error = new Error('🛑 Un-Authorized 🛑');
    res.status(401);
    next(error);
}

exports.isLoggedIn = (req, res, next) => {
    if (req.user) {
        console.log('Authorized user!');
        next();
    } else {
        console.log('not logged in!');
        unAuthorized(res, next);
    }
};

exports.isAdmin = (req, res, next) => {
    if (req.user.role === 'admin') {
        console.log('Admin found!');
        next();
    } else {
        console.log(req.user);
        console.log('not an admin!');
        unAuthorized(res, next);
    }
};