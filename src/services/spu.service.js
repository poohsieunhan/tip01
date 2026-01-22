'use strict'
const _ = require('lodash')
const {findShopById} = require('../models/repositories/shop.repo')
const {NotFoundError} = require('../core/error.response')
const spuModel = require('../models/spu.model')
const { randomProductId } = require('../ultis')
const { newSku,allSkuBySpuId} = require('./sku.service')

const newSpu = async ({
    product_id,
    product_name,
    product_thumbnail,
    product_description,
    product_price,
    product_category,
    product_quantity,
    product_shop,
    product_attributes,
    product_variations,
    sku_list=[]
}) => {
    try {
        const foundShop = await findShopById({
            shopId: product_shop
        })
        if(!foundShop) throw new NotFoundError("Shop not found");

        const _spu = await spuModel.create({
                product_id: randomProductId,
    product_name,
    product_thumbnail,
    product_description,
    product_price,
    product_category,
    product_quantity,
    product_shop,
    product_attributes,
    product_variations,
        })
    
        if(spu && sku_list.length > 0){
        newSku({
            spu_id: _spu.product_id,
            sku_list
        }).then()
    }



    return !!_spu
    } catch (error) {
        
    }
}

const oneSpu = async ({
    spu_id
})=>{
    try {
        const spu = await spuModel.findOne({
            product_id: spu_id,
            isPublished: false
        }).lean()
        if(!spu){
            throw new NotFoundError("Spu not found")
        }
        const skus = await allSkuBySpuId({
            product_id: spu.product_id
        })
        return {
            spu_list: _.omit(spu,['__v','updatedAt']),
            sku_list: skus.map(sku=>_.omit(sku,['__v','updatedAt','isDeleted','createdAt']))
        }
    } catch (error) {
        return {}
    }
}

module.exports = {
    newSpu,
    oneSpu
}