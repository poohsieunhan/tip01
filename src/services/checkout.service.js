'use strict'
const { BadRequestError, NotFoundError } = require("../core/error.response")
const {findCartById} = require("../models/repositories/cart.repo")
const {getProductbyId, checkProductByServer} = require("../models/repositories/product.repo");
const { checkout } = require("../routes");
const { getDiscountAmount } = require("./discount.service");

class CheckoutService {
    /*  
    {
        cartId,
        userId,
        shop_order_ids: [
            {
                shopId,
                shop_discount:[],
                item_products: [
                    {
                        price,
                        quantity,
                        productId
                    }
                ]
            }
            {
                shopId,
                shop_discount:[
                    "shopId",
                    "discountId",
                    codeId
                ],
                item_products: [
                    {
                        price,
                        quantity,
                        productId
                    }
                ]
            }
        ]
    } 
    */
   static async checkoutReview({
    cartId, userId, shop_order_ids = []
   }){
        //1. check cartId
        const foundCart = await findCartById({cartId});
        if(!foundCart) throw new NotFoundError("Cart not found");

        //2. check userId === cart_userId
        if(foundCart.cart_userId.toString() !== userId){
            throw new BadRequestError("User does not own this cart");
        }

        const checkout_order ={
            totalPrice:0,
            feeShipping:0,
            totalDiscount:0,
            totalCheckout:0,
        },shop_order_ids_new = [];

        //tinh tong tien bill
        for(let i=0;i<shop_order_ids.length;i++){
            const {shopId, shop_discount=[], item_products=[]} = shop_order_ids[i];
            //kiem tra san pham co trong gio hang khong
            const checkProductServer= await checkProductByServer(item_products);
            if(!checkProductServer || checkProductServer.length ===0){
                throw new NotFoundError("No products found in this shop");
            }

            //tinh tong tien san pham
            const checkoutPrice = checkProductServer.reduce((accumulator, product) => {
                return accumulator + (product.quantity * product.price);
            },0);

            //tong tien truoc giam gia
            checkout_order.totalPrice += checkoutPrice;

            const itemCheckout = {
                shopId,
                shop_discount,
                priceRaw: checkoutPrice,
                priceApplyDiscount: checkoutPrice,
                item_products: checkProductServer
            }

            //new shop_discount ton tai >0, xem co ap dung dc khong
            if(shop_discount && shop_discount.length > 0){
                const{totalPrice=0,discount=0}= await getDiscountAmount({
                    codeId: shop_discount[0].codeId,
                    userId,
                    shopId,
                    products: checkProductServer
                })
                //tong discount
                checkout_order.totalDiscount += discount;

                //tien giam gia lon hon 0
                if(discount > 0){
                    itemCheckout.priceApplyDiscount = checkoutPrice - discount;
                }

                //tong tien thanh toan sau giam gia
                checkout_order.totalCheckout += itemCheckout.priceApplyDiscount;
                shop_order_ids_new.push(itemCheckout);
            }
        }
        return {
            checkout_order,
            shop_order_ids,
            shop_order_ids_new
        }
   }
}

module.exports = CheckoutService