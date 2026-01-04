'use strict';
const {SuccessResponse} = require('../core/success.response');
const {newUserService} = require('../services/user.service');



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

    checkRegisterEmailToken = async() => {
        
    }
}

module.exports = new UserController();