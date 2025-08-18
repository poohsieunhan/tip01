'use strict'

const JWT = require('jsonwebtoken');
const asyncHandler = require('../helpers/asyncHandler.js');
const { AuthenticationFailedError, NotFoundError } = require('../core/error.response');
const { findById } = require('../services/apikey.service');
const { findByUserId } = require('../services/keyToken.service');

const HEADER = {
    API_KEY: 'x-api-key',
    CLIENT_ID: 'x-client-id',
    AUTHORIZATION:'authorization',
    REFRESHTOKEN:'x-token-id'
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

// const authentication = asyncHandler(async (req, res, next) => {
//     // Check ID missing
//     const userId = req.headers[HEADER.CLIENT_ID]
//     if(!userId) throw new AuthenticationFailedError('Client ID is missing');

//     // Check token missing
//     const keyStore = await findByUserId(userId);
//     if(!keyStore) throw new NotFoundError('Key not found for this user');

//     if(req.headers[HEADER.REFRESHTOKEN]){
//         try {
//             const refreshToken = req.headers[HEADER.REFRESHTOKEN];
//             console.log(`refreshToken:`, refreshToken);
//             const decodeUser= JWT.verify(refreshToken, keyStore.privateKey);
//             if(userId !== decodeUser.userId) throw new AuthenticationFailedError('Invalid User ID');
            
//             req.keyStore = keyStore;
//             req.user = decodeUser; // Gán user info vào req.user
//             req.refreshToken = refreshToken;
//             return next();
//         } catch (error) {
//             throw error;
//         }
//     }

//     //Verify token
//     // const accessToken = req.headers[HEADER.AUTHORIZATION];    
//     // console.log(`accessToken:`, accessToken);
//     // if(!accessToken) throw new AuthenticationFailedError('Access token is missing');    

//     // try {
//     //     const decodeUser= JWT.verify(accessToken, keyStore.publicKey);
//     //     if(!decodeUser) throw new AuthenticationFailedError('Access token is invalid');
        
//     //     console.log(`JWT decoded successfully:`, decodeUser);
//     //     req.keyStore = keyStore; 
//     //     return next();
//     // } catch (error) {
//     //     throw error;
//     // }

// })

const authenticationV2 = asyncHandler(async (req, res, next) => {
    // Check ID missing
    const userId = req.headers[HEADER.CLIENT_ID]
    
    if(!userId) throw new AuthenticationFailedError('Client ID is missing');

    // Check token missing
    const keyStore = await findByUserId(userId);
    if(!keyStore) throw new NotFoundError('Key not found for this user');

    // Kiểm tra refreshToken trước
    if(req.headers[HEADER.REFRESHTOKEN]){
        try {
            const refreshToken = req.headers[HEADER.REFRESHTOKEN];
            console.log(`Using refresh token:`, refreshToken);
            const decodeUser = JWT.verify(refreshToken, keyStore.privateKey);
            if(userId !== decodeUser.userId) throw new AuthenticationFailedError('Invalid User ID');
            
            console.log(`JWT decoded successfully with refresh token:`, decodeUser);
            req.keyStore = keyStore;
            req.user = decodeUser;
            req.refreshToken = refreshToken;
            return next();
        } catch (error) {
            throw new AuthenticationFailedError('Invalid refresh token');
        }
    }

    // Kiểm tra accessToken
    const accessToken = req.headers[HEADER.AUTHORIZATION];
    if(!accessToken) {
        throw new AuthenticationFailedError('Access token is missing');    
    }

    try {
        const decodeUser = JWT.verify(accessToken, keyStore.publicKey);
        if(!decodeUser) throw new AuthenticationFailedError('Access token is invalid');
        
        console.log(`JWT decoded successfully with access token:`, decodeUser);
        req.keyStore = keyStore;
        req.user = decodeUser;
        
        return next();
    } catch (error) {
        throw new AuthenticationFailedError('Invalid access token');
    }
})

const verifyJWT = async (token,keySecret)=>{
    return await JWT.verify(token,keySecret)
}

module.exports = {
    createTokenPair,
    verifyJWT,
    authenticationV2
}