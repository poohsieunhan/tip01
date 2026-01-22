'use strict'
const shopModel = require('../models/shop.model');

const selectStruct ={
    email:1,name:1,status:1,roles:1
}

const findShopById = async ({
    shopId,
    select = selectStruct
})=> {
    return await shopModel.findById(shopId).select(select);
}

module.exports = {
    findShopById
}