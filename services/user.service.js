const userModel = require('../models/user.model');

module.exports.createUser = async ({
    firstname, lastname, email, password
}) => {

    if (!firstname || !email || !password) {
        throw new Error('All fields are required');
    }

    let user = await userModel.findOne({ email });
    if (user) {
        throw new Error('Email already exists');
    }

    user = userModel.create({
        fullname: {
            firstname,
            lastname
        },
        email,
        password
    })

    return user;
}