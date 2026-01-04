'use strict';
const { BadRequestError, ErrorResponse } = require('../core/error.response');
const { CREATED, SuccessResponse } = require('../core/success.response');
const AccessService = require('../services/access.service');

class AccessController {

    handleRefreshTokenV2 = async (req, res, next) => {
        new SuccessResponse({
            message: "Get Token Successfully",
            metadata: await AccessService.handleRefreshTokenV2({
                refreshToken: req.refreshToken,
                user: req.user,
                keyStore: req.keyStore
            })
        }).send(res)
    }

     logout = async (req, res, next) => {
        new SuccessResponse({
            message: "Logout successfully",
            metadata: await AccessService.logout({keyStore: req.keyStore})
        }).send(res);
    }
    
    login = async (req, res, next) => {
        const {email} = req.body;
        if(!email){
            throw new BadRequestError('Missing Email inputs')
        }
        const sendData = Object.assign(
            {requestId: req.requestId},req.body);
        const {code,...result} = await AccessService.login(sendData);
        if(code === 206){
            return new SuccessResponse({
                message: "Login successfully - Need verify OTP",
                metadata: result
            }).send(res);
        }else{
            new ErrorResponse({
                metadata: result,
            }).send(res);
        }
    }
    
    signUp = async (req, res, next) => {
       // console.log(`AccessController`);
        new CREATED ({
            message: "Register successfully",
            metadata: await AccessService.signUp(req.body),
            options:{
                limit:10
            }
        }).send(res)               
    }
}

module.exports = new AccessController(); 
