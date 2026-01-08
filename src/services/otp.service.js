'use strict';

const crypto = require('crypto');
const otpModel = require('../models/otp.model');

const generatorTokenRandom = () => {
    const token = crypto.randomInt(0, Math.pow(2, 23));
    return token;
}

const newOtp = async({email}) => {
    const token =  generatorTokenRandom();
    const newToken = await otpModel.create({email, token});
    return newToken;
}

const checkEmailToken = async ({token}) => {
    const token = await otpModel.findOne({otp_token: token}).lean();
    if(!token) throw new Error('token not found')
    otpModel.deleteOne({otp_token: token}).then()
    return token;   
}


module.exports = {
    newOtp,
    checkEmailToken
};