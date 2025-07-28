'use strict'

const JWT = require('jsonwebtoken')

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

module.exports = {
    createTokenPair
}