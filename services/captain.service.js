const captainModel = require('../models/captain.model');

module.exports.createCaptain = async ({
    firstname, lastname, email, password,
    color, plate, capacity, vehicleType
}) =>{
    if (!firstname || !email || !password) {
        throw new Error('All fields are required');
    }

    let captain = await captainModel.findOne({ email });
    if (captain) {
        throw new Error('Email already exists');
    }

    captain = captainModel.create({
        fullname: {
            firstname,
            lastname
        },
        email,
        password,
        vehicle:{
            color,
            plate,
            capacity,
            vehicleType
        }
    })
    
    return captain;
}