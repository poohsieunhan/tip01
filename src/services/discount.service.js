'use strict'
const { BadRequestError, NotFoundError } = require("../core/error.response")
const discountModel = require("../models/discount.model")
const {convertToObjectIdMongoose} = require("../ultis")
const {findAllProducts} = require("../models/repositories/product.repo")
const {findAllDiscountCodeSelect,findAllDiscountCodeUnSelect, checkDiscountCodeExists} = require("../models/repositories/discount.repo")
const { product } = require("../models/product.model")

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
        const discounts = await findAllDiscountCodeUnSelect({
            limit: +limit,
            page: +page,
            filter:{
                discount_shopId: convertToObjectIdMongoose(shopId),
                discount_is_active: true
            },
            unSelect:['__v','discount_shopId'],
            model:discount
        })
        return discounts
    }

    static async getDiscountAmount({codeId,userId,shopId,products}){
        const foundDiscount = await checkDiscountCodeExists({
            model:discountModel,
            filter:{
                discount_code:codeId,
                discount_shopId:convertToObjectIdMongoose(shopId),
            }
        })
        
        if(!foundDiscount) throw new NotFoundError("Discount code not found")
        const{
            discount_is_active,
            discount_max_uses,
            discount_min_order_value
        }= foundDiscount
        
        if(!discount_is_active) throw new NotFoundError("Discount code is not active")
        if(!discount_max_uses) throw new NotFoundError("Discount code has reached maximum usage limit")
        
        let totalOrderValue = 0
        if(discount_min_order_value > 0){
            totalOrderValue = products.reduce((accumulator,product)=>{
                return accumulator += product.quantity * product.product_price
            },0)

            if(totalOrderValue < discount_min_order_value)
                throw new NotFoundError(`Order value must be at least ${discount_min_order_value} to use this discount code`)
        }
        
        if(discount_max_uses_per_user > 0){
            const userUsedCount = discount_users_used.filter(user=>user.toString()===userId).length
            if(userUsedCount >= discount_max_uses_per_user)
                throw new NotFoundError("You have reached the maximum usage limit for this discount code")
        }

        const amount

        return foundDiscount
    }
}