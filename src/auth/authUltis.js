'use strict'

const JWT = require('jsonwebtoken');
const asyncHandler = require('../helpers/asyncHandler');
const { AuthenticationFailedError, NotFoundError } = require('../core/error.response');
const { findById } = require('../services/apikey.service');
const { findByUserId } = require('../services/keyToken.service');

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
    const userId = req.headers[HEADER.CLIENT_ID]
    if(!userId) throw new AuthenticationFailedError('Client ID is missing');
    //console.log(`userIddddd:`, userId);

    // Check token missing
    const keyStore = await findByUserId(userId);
    if(!keyStore) throw new NotFoundError('Key not found for this user');
    //console.log(`keyStore:`, keyStore);

    //Verify token
    const accessToken = req.headers[HEADER.AUTHORIZATION];
    if(!accessToken) throw new AuthenticationFailedError('Access token is missing');    

    try {
        const decodeUser= JWT.verify(accessToken, keyStore.publicKey);
        if(!decodeUser) throw new AuthenticationFailedError('Access token is invalid');
        req.keyStore = keyStore;
        console.log(`decodeUserssssss:`, decodeUser, keyStore);
        
        return next();
    } catch (error) {
        throw error;
    }

})


module.exports = {
    createTokenPair,
    authentication
}