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

module.exports = {
    newOtp
};