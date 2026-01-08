'use strict';  
const UserModel = require('../models/user.model');
const {ErrorResponse, SuccessResponse} = require('../core/error.response');
const {checkEmailToken} = require('./otp.service');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const { createTokenPair } = require("../auth/authUltis");
const { createUser } = require('../models/repositories/user.repo');

const newUserService = async({email = null,captcha=null}) => {
    //check email exist
    const user = await UserModel.findOne({email}).lean();
    if (user) {
        throw new ErrorResponse('Email already registered', 409);
    }

    //send token via email user
    const result = await sendEmailToken({email});

    return {
        message: 'Verify User registered successfully',
        metadata: {token}
    }
}

const checkLoginEmailTokenService = async ({token}) => {
    try {
        const {otp_email: email,otp_token} = await checkEmailToken({token});
        if(!email) throw new ErrorResponse('Email not found', 404);

        const hasUser = await findUserByEmailWithLogin({email});
        if(hasUser) {
            throw new ErrorResponse('Email already registered', 409)
        }

        const hashPassword = await bcrypt.hash(password, 10);
                 const newUser = await createUser({
                    user_id:1,
                    user_slug:'xxyyzz',
                    user_email:email,
                    user_password:hashPassword,
                    user_role:''
                })
        
           
                    
                    const publicKey = crypto.randomBytes(64).toString('hex');
                    const privateKey = crypto.randomBytes(64).toString('hex');
        
                    console.log(`publicKey:${publicKey}, privateKey:${privateKey}`);
                    
        
                    const keyStore = await KeyTokenService.createKeyToken({
                        userId: newUser.user_id,
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
                            user: getInfoData({fields: ['user_id','user_name','user_email'],object: newUser}),
                            tokens
                      }
                    };
    } catch (error) {
        
    }
}

const findUserByEmailWithLogin = async ({email}) => {
    const user = await UserModel.findOne({usr_email: email}).lean();
    return user;
}


module.exports = {
    newUserService,
    checkLoginEmailTokenService
}