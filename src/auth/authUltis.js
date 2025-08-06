'use strict'

const JWT = require('jsonwebtoken');
const asyncHandler = require('../helpers/asyncHandler');
const { AuthenticationFailedError, NotFoundError } = require('../core/error.response');
const { findById } = require('../services/apikey.service');

const HEADER = {
    API_KEY: 'x-api-key',
    CLIENT_ID: 'x-client-id',
    AUTHORIZATION:'authorization'
}

const createTokenPair = async (payload, publicKey, privateKey) => {
    try {
        console.log(`createTokenPair:`, payload, publicKey, privateKey);
        
        // accessToken
        // const accessToken = JWT.sign(payload, privateKey, {
        //     algorithm: 'RS256',
        //     expiresIn: '2 days'
        // });
        const accessToken = JWT.sign(payload, publicKey, {
            expiresIn: '2 days'
        });

        //console.log(`accessToken:`, accessToken);
        

        // const refreshToken = JWT.sign(payload, privateKey, {
        //     algorithm: 'RS256',
        //     expiresIn: '7 days'
        // });
        const refreshToken = JWT.sign(payload, privateKey, {
            expiresIn: '7 days'
        });

        //console.log(`refreshToken:`, refreshToken);

        JWT.verify(accessToken, publicKey, (err, decode) => {
            if (err) {
                console.error(`error verify::`, err);
            } else {
                console.log(`decode verify::`, decode);
            }
        });
        return { accessToken, refreshToken };
    } catch (error) {
        console.error('JWT error:', error);
        return {};
    }
};

const authentication = asyncHandler(async (req, res, next) => {
    // Check ID missing
    const userId = req.header[HEADER.CLIENT_ID]
    if(!userId) throw new AuthenticationFailedError('Client ID is missing');

    // Check token missing
    const keyStore = await findById(userId);
    if(!keyStore) throw new NotFoundError('Key not found for this user');

    //Verify token
    const accessToken = req.header[HEADER.AUTHORIZATION];
    if(!accessToken) throw new AuthenticationFailedError('Access token is missing');    

}


module.exports = {
    createTokenPair
}