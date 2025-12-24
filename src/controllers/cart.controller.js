'use strict'

const CartService = require("../services/cart.service")
const {SuccessResponse} = require("../core/success.response");

class CartController {
    addToCart = async (req,res,next) => {
        new SuccessResponse({
            message:"Add to cart successfully",
            metadata: await CartService.addToCart(req.body)
        }).send(res)
    }

    updateCart = async (req,res,next) => {
        new SuccessResponse({
            message:"Update cart successfully",
            metadata: await CartService.addToCardtV2(req.body)
        }).send(res)
    }

    deleteCart = async (req,res,next) => {
        new SuccessResponse({
            message:"Delete cart successfully",
            metadata: await CartService.deleteUserCart(req.body)
        }).send(res)
    }

    listCart = async (req,res,next) => {
        new SuccessResponse({
            message:"Get list cart successfully",
            metadata: await CartService.getListUserCart(req.query)
        }).send(res)
    }
}

module.exports = new CartController()