'use strict';
const {SuccessResponse} = require('../core/success.response');
const {newUserService,checkLoginEmailTokenService} = require('../services/user.service');



class UserController {
    newUser = async(req,res,next) => {
        const respond = await newUserService({
            email:req.body.email});
        new SuccessResponse({
            message: 'User registered successfully',
            statusCode: 201,
            metadata: {token}
        }).send(res)
    }

    checkRegisterEmailToken = async(req) => {
        const {token} = req.query;
        const respond = await checkLoginEmailTokenService({
           token});
       new SuccessResponse({
            message: 'User registered successfully',
            statusCode: 201,
            metadata: {token}
        }).send(res)
    }
}

module.exports = new UserController();