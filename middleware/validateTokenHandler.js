const expressAsyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");

const ValidateToken = expressAsyncHandler(async (req, res, next) => {
    // Check if the ACCESS_TOKEN_SECRET is defined
    if (!process.env.ACCESS_TOKEN_SECRET) {
        console.error('Error: ACCESS_TOKEN_SECRET is not defined in .env file');
        return res.status(500).json({ message: 'Internal server error' });
    }

    let token;
    const authHeader = req.headers.authorization || req.headers.Authorization;

    if (authHeader && authHeader.startsWith("Bearer ")) {
        token = authHeader.split(" ")[1];
        try {
            // Verify token using the secret
            jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
                if (err) {
                    return res.status(401).json({ message: "User is not authorized" });
                }
                req.user = decoded.user;
                next();
            });
        } catch (error) {
            res.status(401).json({ message: "User is not authorized" });
        }
    } else {
        res.status(401).json({ message: "Authorization token is missing" });
    }
});

module.exports = ValidateToken;