const express = require('express');
const router = express.Router();

const { registerUser, loginUser, getCurrentUser } = require('../controller/userController');
const validateToken = require('../middleware/validateTokenHandler');

// Route to register a new user
router.post('/register', registerUser);

// Route for user login
router.post('/login', loginUser);

// Route to get the current logged in user
router.get('/current', validateToken, getCurrentUser);

module.exports = router;