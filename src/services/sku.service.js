'use strict'
const skuModel = require('../models/sku.model')
const { randomProductId } = require('../ultis')
const _ = require('lodash')

const newSku = async ({
    spu_id,
    sku_list
})=>{
    try{
    const convert_sku_list = sku_list.map(item => {
        return {
            ...sku,product_id: spu_id,sku_id:`${spu_id}-${randomProductId}`
        }       
    })
    const skus = await skuModel.create(convert_sku_list)
    return skus
    }catch(error){
        console.log(error); 
    }         
}

const oneSku = async ({
    sku_id, product_id
})=>{
    try {
        const sku = await skuModel.findOne({sku_id, product_id}).lean()
        if(sku){

        }
        return _.omit(sku,['__v','updatedAt','createdAt','isDeleted'])
    } catch (error) {
        return null
    }
}

const allSkuBySpuId = async ({
    product_id
})=>{
    try {
        const skus = await skuModel.find({product_id}).lean()
        return skus 
    } catch (error) {
        
    }
}

module.exports = {
    newSku,
    oneSku,
    allSkuBySpuId
}