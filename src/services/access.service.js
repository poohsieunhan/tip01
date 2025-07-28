const bcrypt = require('bcrypt');
const crypto = require('crypto');
const { createTokenPair } = require("../auth/authUltis");
const shopModel = require("../models/shop.model");
const KeyTokenService = require("./keyToken.service");
const { getInfoData } = require('../ultis');

const roleShop = {
    SHOP:'SHOP',
    ADMIN:'ADMIN',
    WRITER:'WRITER',
    EDITOR:'EDITOR',
}

class AccessService {   
    static signUp = async ({name,email,password}) => {
        try {
            console.log(`name:${name}, email:${email}, password:${password}`);
            
            const holderShop = await shopModel.findOne({email:email}).lean();
            if(holderShop){
                return {
                    code: '200002',
                    message: "Email already exists",
                    status:'error'
                }
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
                    shop: getInfoData({fields: ['id','name','email'],object: newShop}),
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

