const userModel = require('../models/user.model');
const captainModel = require('../models/captain.model');
const jwt = require('jsonwebtoken');
const blackListTokenModel = require('../models/blacklistToken.model');

module.exports.authUser = async (req, res, next) => {

    const token = req.header('Authorization').split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    const isBlackListed = await blackListTokenModel.findOne({ token });
    if (isBlackListed) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await userModel.findOne({ _id: decoded._id });

        if (!user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        req.user = user;
        
        return next();
    } catch (error) {
        res.status(401).json({ message: 'Unauthorized' });
    }
}

module.exports.authCaptain = async (req, res, next) => {
    const token = req.header('Authorization').split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    const isBlackListed = await blackListTokenModel.findOne({ token });
    if (isBlackListed) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const captain = await captainModel.findOne({ _id: decoded._id });

        if (!captain) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        req.captain = captain;
        return next();
    } catch (error) {
        console.log(error);

        res.status(401).json({ message: 'Unauthorized' });
    }
}