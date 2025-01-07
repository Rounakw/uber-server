const userModel = require('../models/user.model');
const userService = require('../services/user.service');
const { validationResult } = require('express-validator');
const blackListTokenModel = require('../models/blacklistToken.model');

module.exports.registerUser = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ message: errors.errors[0].msg });
        }

        const { fullname, email, password } = req.body;

        const hashedPassword = await userModel.hashPassword(password);

        const user = await userService.createUser({
            firstname: fullname.firstname,
            lastname: fullname.lastname,
            email,
            password: hashedPassword
        });

        const token = user.generateAuthToken();

        delete user._doc.password;
        res.status(201).json({ user, token });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports.loginUser = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ message: errors.errors[0].msg });
        }

        const { email, password } = req.body;
        const user = await userModel.findOne({ email }).select('+password');
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const isMatch = await user.comparePassword(password);

        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        delete user._doc.password;

        const token = user.generateAuthToken();
        res.status(200).json({ user, token });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports.getUserProfile = async (req, res) => {
    try {
        res.status(200).json(req.user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports.logoutUser = async (req, res) => {
    try {
        const token = req.header('Authorization').split(' ')[1];
        await blackListTokenModel.create({ token });
        res.status(200).json({ message: 'Logged out successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}