'use strict';  
const UserModel = require('../models/user.model');
const {ErrorResponse, SuccessResponse} = require('../core/error.response');

const newUserService = async({email = null,captcha=null}) => {
    //check email exist
    const user = await UserModel.findOne({email}).lean();
    if (user) {
        throw new ErrorResponse('Email already registered', 409);
    }

    //send token via email user
    const result = await sendEmailToken({email});

    return {
        message: 'Verify User registered successfully',
        metadata: {token}
    }
}

module.exports = {
    newUserService
}