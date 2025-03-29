const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { stringify } = require('querystring');
const validator = require('validator');

const userModel = new mongoose.Schema({
    first_name: {
        type: String,
        required: [true, "First Name is required."],
        trim: true,
    },

    last_name: {
        type: String,
        required: [true, "Last Name is required."],
        trim: true,
    },

    email: {
        type: String,
        required: [true, "Email is required."],
        trim: true,
    },

    password: {
        type: String,
        required: [true, "Password is required."],
        trim: true,
    },

    images: [
        {
            public_id: {
                type: String,
                required: true,
            },

            url: {
                type: String,
                required: true,
            }
        }
    ],

    role: {
        type: String,
        default: 'user'
    },
})

// HASH NG PASSWORD
userModel.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next();
    }

    this.password = await bcrypt.hash(this.password, 10);
});

userModel.methods.getJwtToken = function () {
    return jwt.sign({ id: this.id, role: this.role }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_TIME
    });
}

// COMPARE PASSWORD PAG NAG LLOGIN
userModel.methods.comparePassword = async function (inputtedPassword) {
    return await bcrypt.compare(inputtedPassword, this.password);
}


module.exports = mongoose.model('User', userModel)