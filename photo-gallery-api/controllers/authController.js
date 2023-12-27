/**
 * Module dependencies.
 */
const User = require('../models/user')
const jwtHelpers = require('../utils/jwtHelpers')
const bcrypt = require('bcrypt')
const fs = require('fs'); // Node.js file system module
const path = require('path')

/**
 * User login
 */
exports.login = async (req, res) => {
    const { email, password } = req.body
    const user = await User.findOne({ email })
    if (user && bcrypt.compareSync(password, user.password)) {
        res.json({
            success: true,
            data: {
                id: user.id,
                name: user.name,
                accessToken: jwtHelpers.sign({ sub: user.id })
            }
        })
    } else {
        res.status(401).json({
            message: 'Invalid credentials!'
        })
    }
}

/**
 * Create new account
 */
exports.register = async (req, res) => {
    const { name, email, password } = req.body;

    // Check if the email already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
        // Email is already in use, return a response
        return res.status(400).json({
            success: false,
            message: 'Email is already in use. Please use a different email.',
        });
    }

    // Email is not in use, continue with user registration
    if (req.file) {
        const { filename } = req.file;
        const url = `/images/${filename}`; // Assuming the images are served from a '/images' endpoint
        const user = User({
            name,
            email,
            password: bcrypt.hashSync(password, 8),
            profilePicture: url ? url : null,
        });

        try {
            await user.save();
            res.json({
                success: true,
                data: user,
            });
        } catch (e) {
            if (req.file) fs.unlinkSync(req.file.path);
            console.error('Error during user registration:', e);
            res.status(500).json({
                message: 'Something went wrong!',
            });
        }
    } else {
        const user = User({
            name,
            email,
            password: bcrypt.hashSync(password, 8),
            profilePicture: null,
        });

        try {
            await user.save();
            res.json({
                success: true,
                data: user,
            });
        } catch (e) {
            if (req.file) fs.unlinkSync(req.file.path);
            console.error('Error during user registration:', e);
            res.status(500).json({
                message: 'Something went wrong!',
            });
        }
    }
};

/**
 * Get user information
 */
exports.me = async (req, res) => {
    const user = await User.findById(req.userId).select('-password')
    res.json({
        success: true,
        data: user
    })
}