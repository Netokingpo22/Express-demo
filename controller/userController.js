const AsyncHandler = require("express-async-handler");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require("../models/userModel");

// @desc    Register a new user
// @route   POST /api/users/register
// @access  Public
const registerUser = AsyncHandler(async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        res.status(400);
        throw new Error("All fields are required");
    }

    const userExists = await User.findOne({ email });

    if (userExists) {
        res.status(400);
        throw new Error("Email already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
        username,
        email,
        password: hashedPassword,
    });

    if (user) {
        res.status(201).json({
            _id: user.id,
            username: user.username,
            email: user.email,
        });
    } else {
        res.status(500);
        throw new Error("Server error during user registration");
    }
});

// @desc    Authenticate user and get token
// @route   POST /api/users/login
// @access  Public
const loginUser = AsyncHandler(async (req, res) => {
    const { email, password } = req.body;

    // Check if email and password are provided
    if (!email || !password) {
        res.status(400);
        throw new Error("All fields are required");
    }

    // Find the user by email
    const user = await User.findOne({ email });

    // Check if user exists and password is correct
    if (user && (await bcrypt.compare(password, user.password))) {
        // Generate an access token
        const accessToken = jwt.sign(
            {
                user: {
                    id: user.id,
                    username: user.username,
                    email: user.email,
                },
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: "100m" } // Token expiration time
        );

        // Respond with the access token
        res.status(200).json({ accessToken });
    } else {
        // If user is not found or password is incorrect
        res.status(401);
        throw new Error("Invalid email or password");
    }
});

// @desc    Get current logged in user
// @route   GET /api/users/current
// @access  Private
const getCurrentUser = AsyncHandler(async (req, res) => {
    res.json(req.user);
});

module.exports = { registerUser, loginUser, getCurrentUser };