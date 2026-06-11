const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Generate JWT Token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'fallback_secret_key_123', {
        expiresIn: '30d',
    });
};

// @route POST /api/auth/register
// @desc  Register a new user
router.post('/register', async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        const normalizedEmail = (email || '').trim().toLowerCase();

        if (!normalizedEmail) {
            return res.status(400).json({ message: 'Email is required' });
        }

        // Check if user already exists
        const userExists = await User.findOne({ email: normalizedEmail });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Create new user
        const user = await User.create({
            name,
            email: normalizedEmail,
            password,
            role: role || 'customer'
        });

        if (user) {
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user._id),
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        console.error('Registration Error:', error.message);
        res.status(500).json({ message: 'Server error', detail: error.message });
    }
});

// @route POST /api/auth/login
// @desc  Auth user & get token
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const normalizedEmail = (email || '').trim().toLowerCase();

        if (!normalizedEmail || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        // Find user by email
        const user = await User.findOne({ email: normalizedEmail });

        if (user && (await user.comparePassword(password))) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user._id),
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        console.error('Login Error:', error.message);
        res.status(500).json({ message: 'Server error', detail: error.message });
    }
});

module.exports = router;
