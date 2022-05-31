const express = require('express');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const router = express.Router();

// Middleware to authenticate and verify the token
const verifyToken = (req, res, next) => {
    console.log("###########In verify Token#############");
    console.log(req);
    console.log(res);
    // Extract the token from the Authorization header
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN_STRING

    if (token == null) return res.sendStatus(401); // No token, unauthorized

    jwt.verify(token, "secret", (err, user) => {
        if (err) return res.sendStatus(403); // Token is no longer valid
        req.user = user;
        next(); // Token is valid, proceed
    });
};

// Define the verifyToken endpoint
router.post('/api/verifyToken', verifyToken, (req, res) => {
    // The request reaches here only if the token is verified
    // req.user contains the decoded token data
    console.log("in api");
    console.log(req);
    res.json({
        message: 'Token is valid',
        user: req.user // Send back the user data
    });
});

module.exports = router;
