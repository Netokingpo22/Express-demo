const AsyncHandler = require("express-async-handler");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require("../models/userModel");

//@desc Register a user
//@router POST /api/users/register
//@access public
const registerUser = AsyncHandler(async (req, res) => {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
        res.status(404);
        throw new Error("All fields are required");
    }
    const u = await User.findOne({ email });
    if (u) {
        res.status(400);
        throw new Error("Email already exists");
    }
    const hp = await bcrypt.hash(password, 10)
    const user = await User.create({
        username, email, password: hp,
    })
    if (user) {
        res.status(201).json({ _id: user.id, email: user.email });
    } else {
        res.status(400);
        throw new Error("Server error during user registration");
    }
})

//@desc Post user
//@router POST /api/users/login
//@access public
const loginUser = AsyncHandler(async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        res.status(404);
        throw new Error("All fields are required");
    }
    const u = await User.findOne({ email });
    if (u && (await bcrypt.compare(password, u.password))) {
        const accessT = jwt.sign({
            user: {
                username: u.username,
                email: u.email,
                id: u.id,
            }
        },
            process.env.ACCES_TOKEN_SECRET,
            { expiresIn: "10m" }
        );
        res.status(200).json({ accessT });
    } else {
        res.status(401);
        throw new Error("Email or password not valid");
    }
});

//@desc Get user
//@router GET /api/users/current
//@access private
const currentUser = AsyncHandler(async (req, res) => {
    res.json(req.user);
});

module.exports = { registerUser, loginUser, currentUser }