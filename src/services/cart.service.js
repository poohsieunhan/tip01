'use strict';
const cartModel = require('../models/cart.model');
const {BadRequestError, NotFoundError} = require("../core/error.response");
const {getProductbyId} = require("../models/repositories/product.repo");

class CartService {
    static async createUserCart({userId,product}) {
        const query = {cart_userId: userId, cart_status: 'active'},
        updateOrInsert = {
            $addToSet: {
                cart_products: product
            }
        },
        options = {upsert: true, new: true};
        return await cartModel.findOneAndUpdate(query, updateOrInsert, options);
    }

    static async updateUserCartQuantity({userId, product}) {
        const {productId, quantity} = product;
        const query = {
            cart_userId: userId,
            'cart_products.productId': productId,
            cart_status: 'active'
        },updateSet={
            $inc: {
                'cart_products.$.quantity': quantity
            }
        },option={upsert: true, new: true};
        return await cartModel.findOneAndUpdate(query, updateSet, option);
    }

    static async addToCart({userId, product =[]}) {
        //check xem da co gio hang chua
        const userCart = await cartModel.findOne({cart_userId: userId, cart_status: 'active'});
        if (!userCart) {
            return await CartService.createUserCart({{userId, product});
        }

        //co gio hang nhung chua co san pham
        if(userCart.cart_products.length === 0) {
            userCart.cart_products = [product];
            return await userCart.save();
        }

        //gio hang ton tai va co san pham thi update so luong
        return await CartService.updateUserCartQuantity({userId, product});
    } 

    static async addToCardtV2({userId, product = {}}) {
        const {productId, quantity,old_quantity} = shop_order_ids[0]?.item_products[0];
        const foundProduct = await getProductbyId(productId);
        if(!foundProduct) throw new NotFoundError("Product not found");
        if(foundProduct.product_shop.toString() !== shop_order_ids[0]?.shopId){
            throw new BadRequestError("Product does not belong to this shop");
        }
        if(quantity < 1){
            throw new BadRequestError("Quantity must be at least 1");
        }
        return await CartService.updateUserCartQuantity({
            userId, 
            product: {
                productId, 
                quantity: quantity - old_quantity
            }
        });
    }

    static async deleteUserCart({userId, productId}) {
        const query = {cart_userId: userId, cart_status: 'active'},
        updateSet={
            $pull: {
                cart_products: {productId: productId}
            }
        }
        const deletedCart = await cartModel.updateOne(query, updateSet);
        return deletedCart;
    }

    static async getListUserCart({userId}) {
        return await cartModel.findOne({
            cart_userId: +userId, 
            cart_status: 'active'
        }).lean();
    }
}

module.exports = CartService;