const jwt = require('jsonwebtoken'); // Import jwt for token verification

// Middleware to protect routes that require authentication
const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;

    console.log("authheader in middleware req.headers.authorization", authHeader);
    // console.log(authHeader.startsWith('Bearer '));
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: '(401)No token, authorization denied' });
    }

    const token = authHeader.split(' ')[1];
    console.log('Extracted Token:', token);

    console.log('JWT_SECRET in middleware:', process.env.JWT_SECRET);


    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            console.error('JWT Verification Error:', err);
            return res.status(403).json({ message: 'Invalid token' });
        }
        console.log('Decoded User:', user);
        console.log("token matched");
        req.user = user;
        console.log("req.user in middleware", req.user);
        next();
    });
};


module.exports = authMiddleware; // Export the middleware
