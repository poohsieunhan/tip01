'use strict'
const { BadRequestError } = require("../core/error.response")
const discountModel = require("../models/discount.model")
const {convertToObjectIdMongoose} = require("../ultis")
const {findAllProducts} = require("../models/repositories/product.repo")
const {findAllDiscountCodeSelect,findAllDiscountCodeUnSelect} = require("../models/repositories/discount.repo")

class DiscountService {
    static async createDiscount(payload){
        const {
            discount_name,discount_description,discount_type,discount_value,discount_code,
            discount_start_date,discount_end_date,discount_max_uses,discount_used_count,
            discount_users_used,discount_max_uses_per_user,discount_min_order_value,
            discount_shopId,discount_is_active,discount_applies_to,discount_product_ids,
        } = payload;
    
        if(new Date() < new Date(discount_start_date) || new Date() > new Date(discount_end_date)) 
            throw new BadRequestError("Discount start date is in the future")

        if(discount_start_date > discount_end_date)
            throw new BadRequestError("Discount start date is greater than end date")

        const foundDiscount = await discountModel.findOne({
            discount_code:discount_code,
            discount_shopId:convertToObjectIdMongoose(discount_shopId),
        }).lean()

        if(foundDiscount && foundDiscount.discount_is_active) 
            throw new BadRequestError("Discount code already exists")

        const newDiscount = await discountModel.create({
            discount_name,
            discount_description,
            discount_type,
            discount_value,
            discount_code,
            discount_start_date,
            discount_end_date,
            discount_max_uses,
            discount_used_count,
            discount_users_used,
            discount_max_uses_per_user,
            discount_min_order_value,
            discount_shopId,
            discount_is_active,
            discount_applies_to,
            discount_product_ids,
        })
        return newDiscount
    }

    static async updateDiscountCode(){

    }

    static async getAllDiscoutCodeWithProduct({
        discount_code,discount_shopId,user_id,limit=50,page
    }){
        const foundDiscount = await discountModel.findOne({
            discount_code:discount_code,
            discount_shopId:convertToObjectIdMongoose(discount_shopId),
        }).lean()

        if(!foundDiscount || foundDiscount.discount_is_active === false) 
            throw new BadRequestError("Discount code not found or is not active")

        const {discount_applies_to, discount_product_ids} = foundDiscount
        let products
        if(discount_applies_to === 'all' && discount_product_ids.length > 0){
            products = await findAllProducts({
                filter:{
                    product_shop:convertToObjectIdMongoose(discount_shopId),
                    isPublished: true
                },
                limit:+limit,
                page:+page,
                sort:'ctime',
                
            })            
        }

        if(discount_applies_to === 'specific' && discount_product_ids.length > 0){
            products = await findAllProducts({
                filter:{
                    _id:{$in:discount_product_ids},
                    isPublished: true
                },
                limit:+limit,
                page:+page,
                sort:'ctime',
                
            })            
        }
        
        return products
    }

    static async getAllDiscountCodesByShop (
        limit,page,shopId
    ){
        const discount = await findAllDiscountCodeUnSelect({
            limit: +limit,
            page: +page,
            filter:{
                discount_shopId: convertToObjectIdMongoose(shopId),
                discount_is_active: true
            },
            unSelect:['__v','discount_shopId'],
            model:discount
        })
        return discount
    }
}