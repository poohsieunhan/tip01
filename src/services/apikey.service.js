'use strict';

const apikeyModel = require('../models/apikey.model');

const findById = async (key)=>{
    const newKey = await apikeyModel.create({key: crypto.randombytes(16).toString('hex'),permission:['0000']});
    console.log(`newKey:${newKey}`);
    
    const objKey = await apikeyModel.findOne({key,status:true}).lean()
    return objKey;
}

module.exports = {
    findById
}