const captainModel = require('../models/captain.model');
const captainService = require('../services/captain.service');
const blackListTokenModel = require('../models/blacklistToken.model');
const { validationResult } = require('express-validator');

module.exports.registerCaptain = async (req, res) => {
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ message: errors.errors[0].msg });
    }

    const { fullname, email, password, vehicle } = req.body;
    const hashPassword = await captainModel.hashPassword(password);


    try {
        const captain = await captainService.createCaptain({
            firstname: fullname.firstname,
            lastname: fullname.lastname,
            email,
            password: hashPassword,
            color: vehicle.color,
            plate: vehicle.plate,
            capacity: vehicle.capacity,
            vehicleType: vehicle.vehicleType
        });

        const token = captain.generateAuthToken();
        res.status(201).json({ captain, token });
    } catch (error) {
        
        res.status(400).json({ message: error.message });
    }
}

module.exports.loginCaptain = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ message: errors.errors[0].msg });
    }

    const { email, password } = req.body;

    try {
        const captain = await captainModel.findOne({ email }).select('+password');
        if (!captain) {
            return res.status(404).json({ message: 'Invalid email or password' });
        }

        const isMatch = await captain.comparePassword(password);

        if (!isMatch) {
            return res.status(404).json({ message: 'Invalid email or password' });
        }

        const token = captain.generateAuthToken();
        
        res.status(200).json({ captain, token });
    } catch (error) {
        
        res.status(400).json({ message: error.message });
    }
}

module.exports.getCaptainProfile = async (req, res) => {
    try {
        res.status(200).json(req.captain);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports.logoutCaptain = async (req, res) => {
    try {
        const token = req.header('Authorization').split(' ')[1];
        await blackListTokenModel.create({ token });
        res.status(200).json({ message: 'Logged out successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

