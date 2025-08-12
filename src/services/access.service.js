const bcrypt = require('bcrypt');
const crypto = require('crypto');
const { createTokenPair, verifyJWT } = require("../auth/authUltis");
const shopModel = require("../models/shop.model");
const KeyTokenService = require("./keyToken.service");
const { getInfoData } = require('../ultis');
const { BadRequestError, AuthenticationFailedError, ForbiddenError,NotFoundError } = require('../core/error.response');
const { findByEmail } = require('./shop.service');

const roleShop = {
    SHOP:'SHOP',
    ADMIN:'ADMIN',
    WRITER:'WRITER',
    EDITOR:'EDITOR',
}

class AccessService {  

    static handleRefreshToken = async ({refreshToken}) => {
        const foundToken = await KeyTokenService.findByRefreshTokenUsed(refreshToken);
        console.log(`foundToken:`, foundToken);
        

        if(foundToken) {
           const {userId,email} = await verifyJWT(refreshToken, foundToken.privateKey);
            await KeyTokenService.deleteKeyById(userId);
            throw new ForbiddenError("Refresh Token is used, please login again");
        }

        const holderToken = await KeyTokenService.findByRefreshToken(refreshToken);
        if(!holderToken) throw new AuthenticationFailedError("Shop not found or refresh token invalid");

        console.log(`holderToken:`, holderToken);
        

        const {userId, email} = await verifyJWT(refreshToken, holderToken.privateKey);
        const foundShop = await findByEmail(email);
        if(!foundShop) throw new NotFoundError("Shop not found");

        console.log(`foundShop2:`, foundShop);
        

        const tokens = await createTokenPair({
            userId,
            email: foundShop.email,
        }, holderToken.publicKey, holderToken.privateKey);

        await holderToken.updateOne({
            $set: {
                refreshToken: tokens.refreshToken,
            },
            $addToSet: {
                refreshTokensUsed: refreshToken
            }
        })

        return{
            user: {userId,email},
            tokens
        }
    }

    static logout = async ({keyStore}) => {
        const delKey = await KeyTokenService.removeKeyById(keyStore._id);
        return delKey
    }
    
    static login = async ({email,password}) => {
        const foundShop = await findByEmail({email});
        if(!foundShop) throw new BadRequestError("Shop not Registered");
        console.log('foundShop:', JSON.stringify(foundShop, null, 2));

        const match = await bcrypt.compare(password, foundShop.password);
        if(!match) throw new AuthenticationFailedError("Wrong password");

        const privateKey = crypto.randomBytes(64).toString('hex');
        const publicKey = crypto.randomBytes(64).toString('hex');

        const userId = foundShop._id;
        const tokens = await createTokenPair({
            userId,
            email: foundShop,
        }, publicKey, privateKey);
        console.log(`shop tim duoc:`,foundShop); 

        await KeyTokenService.createKeyToken({
            refreshToken: tokens.refreshToken,
            privateKey,publicKey,userId
        })
        
        return {
            shop: getInfoData({fields: ['_id','name','email'],object: foundShop}),
            tokens
        }

    }
    


    static signUp = async ({name,email,password}) => {
        try {
            console.log(`name:${name}, email:${email}, password:${password}`);
            
            const holderShop = await shopModel.findOne({email:email}).lean();
            if(holderShop){
                // return {
                //     code: '200002',
                //     message: "Email already exists",
                //     status:'error'
                // }
                throw new BadRequestError("Error: Email already exists");
            }

            const hashPassword = await bcrypt.hash(password, 10);
            const newShop = await shopModel.create({
                name:name,
                email:email,
                password:hashPassword,
                roles:[roleShop.SHOP]
            });

            // const {publicKey, privateKey} = crypto.generateKeyPairSync('rsa', {
            //     modulusLength: 4096,
            //     publicKeyEncoding: { type: 'pkcs1', format: 'pem' },
            //     privateKeyEncoding: { type: 'pkcs1', format: 'pem' }
            // });
            
            const publicKey = crypto.randomBytes(64).toString('hex');
            const privateKey = crypto.randomBytes(64).toString('hex');

            console.log(`publicKey:${publicKey}, privateKey:${privateKey}`);
            

            const keyStore = await KeyTokenService.createKeyToken({
                userId: newShop._id,
                publicKey,
                privateKey
            })
            console.log(`keyStore:${keyStore}`);
            

            if(!keyStore){
                return {
                    code: 'xxxx',
                    message: "Error creating keyStore",
                    status:'error'
                }
            } 
            console.log(`To Token:`, newShop._id,email)   
            const tokens = await createTokenPair(                       
                {                 
                    userId: newShop._id,
                    email,
                },publicKey, privateKey
            );
            console.log(`create tokens successfull:${tokens}`);
            
            return {
                code: '201',
                metadata:{
                    shop: getInfoData({fields: ['_id','name','email'],object: newShop}),
                    tokens
              }
            };

        } catch (error) {
            return {
                code: 'xxx',
                message: error.message,
                status:'error'
            }

        }
    }


}

module.exports = AccessService;

