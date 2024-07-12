const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Pleas add the user name'],
    },
    email: {
        type: String,
        required: [true, 'Pleas add tje user email'],
        unique: [true, 'Email already exists'],
    },
    password: {
        type: String,
        required: [true, 'Pleas add the password'],
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model("User", userSchema);