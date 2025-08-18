'use strict'
const keyTokenModel = require('../models/keytoken.model');

const {Types} = require('mongoose')

class KeyTokenService {

    static createKeyToken = async({userId, publicKey, privateKey, refreshToken})=>{
        // try {
        //     //const publicKeyString = publicKey.toString();
        //     const tokens = await keyTokenModel.create ({
        //         user: userId,
        //         privateKey: privateKey,
        //         publicKey: publicKey              
        //     })
        //     return tokens ? tokens.publicKey : null;
        // } catch (error) {
        //     console.error(`Error creating key token: ${error.message}`);
        //     return error;           
        // }
        try {
            const filter = {user: userId},update={
                user:userId,
                publicKey: publicKey,
                privateKey: privateKey,
                refreshTokensUsed: [],
                refreshToken
            },options ={
                upsert: true, // Create a new document if no match is found
                new: true, // Return the modified document rather than the original
            }
            const tokens = await keyTokenModel.findOneAndUpdate(filter, update, options);

            return tokens? tokens.publicKey : null;

        } catch (err) {
            return err;
        }

    }

    static findByUserId = async (userId) => {
        return await keyTokenModel.findOne({ user: new Types.ObjectId(userId)}).lean();
    }

    static removeKeyById = async (id)=>{
        return await keyTokenModel.deleteOne({_id:id})
    }   

    static findByRefreshTokenUsed = async (refreshToken) => {
        return await keyTokenModel.findOne({refreshTokensUsed: refreshToken}).lean();
    }

     static findByRefreshToken = async (refreshToken) => {
        return await keyTokenModel.findOne({refreshToken});
    }

    static deleteKeyById = async (userId) => {
        return await keyTokenModel.deleteOne({user : userId});
    }

    static updateKeyToken = async ({userId, refreshToken, refreshTokenUsed}) => {
        try {
            const filter = { user: userId };
            const update = {
                $set: {
                    refreshToken: refreshToken
                },
                $addToSet: {
                    refreshTokensUsed: refreshTokenUsed
                }
            };
            
            const result = await keyTokenModel.findOneAndUpdate(filter, update, {
                new: true,
                upsert: false
            });
            
            return result;
        } catch (error) {
            console.error('Error updating key token:', error);
            throw error;
        }
    }
}

module.exports = KeyTokenService;