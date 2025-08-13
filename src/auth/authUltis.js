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
    console.log(`=== Authentication Middleware ===`);
    console.log(`Headers:`, req.headers);
    
    // Check ID missing
    const userId = req.headers[HEADER.CLIENT_ID]
    console.log(`Client ID from header:`, userId);
    
    if(!userId) throw new AuthenticationFailedError('Client ID is missing');

    // Check token missing
    console.log(`Looking for keyStore with userId:`, userId);
    const keyStore = await findByUserId(userId);
    if(!keyStore) throw new NotFoundError('Key not found for this user');
    console.log(`KeyStore found:`, keyStore);

    //Verify token
    const accessToken = req.headers[HEADER.AUTHORIZATION];
    console.log(`Access token from header:`, accessToken);
    
    if(!accessToken) throw new AuthenticationFailedError('Access token is missing');    

    try {
        console.log(`Verifying JWT token...`);
        const decodeUser= JWT.verify(accessToken, keyStore.publicKey);
        if(!decodeUser) throw new AuthenticationFailedError('Access token is invalid');
        
        console.log(`JWT decoded successfully:`, decodeUser);
        req.keyStore = keyStore;
        req.user = decodeUser; // Gán user info vào req.user
        console.log(`req.user assigned:`, req.user);
        console.log(`req.user.userId:`, req.user.userId);
        
        console.log(`Authentication successful, proceeding...`);
        return next();
    } catch (error) {
        console.error(`JWT verification error:`, error);
        throw error;
    }

})

const verifyJWT = async (token,keySecret)=>{
    return await JWT.verify(token,keySecret)
}

module.exports = {
    createTokenPair,
    authentication,
    verifyJWT
}