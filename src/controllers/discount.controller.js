'use strict'

const DiscountService = require("../services/discount.service")
const {SuccessResponse} = require("../core/success.response")

class DiscountController {
    createDiscountCode = async (req,res,next) => {
        new SuccessResponse({
            message:"Create discount code successfully",
            metadata: await DiscountService.createDiscount({
                ...req.body,
                discount_shopId:req.user.userId
            })
        }).send(res)
    }

    // getAllDiscountCode = async (req,res,next) => {
    //     new SuccessResponse({
    //         message:"Get all discount code successfully",   
    //     }).send(res)
    // }

    getAllDiscountCodeByShop = async (req,res,next) => {
        new SuccessResponse({
            message:"Get all discount code successfully",
            metadata: await DiscountService.getAllDiscountCodesByShop({
                ...req.query,
                discount_shopId:req.user.userId
            })
        }).send(res)
    }

    getAllDiscoutCodeWithProduct = async (req,res,next) => {
        new SuccessResponse({
            message:"Get all discount code with product successfully",
            metadata: await DiscountService.getAllDiscoutCodeWithProduct({
                ...req.query
            })
        }).send(res)
    }

    getDiscountAmount = async (req,res,next) => {
        new SuccessResponse({
            message:"Get discount amount successfully",
            metadata: await DiscountService.getDiscountAmount({
                ...req.body
            })
        }).send(res)
    }   
}

module.exports = new DiscountController()