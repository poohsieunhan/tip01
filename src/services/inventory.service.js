'use strict'

const {inventoryModel} = require("../models/inventory.model");
const {getProductbyId} = require("../models/repositories/product.repo");
const { BadRequestError } = require("../core/error.response");

class InventoryService {
    static async addStockToInventory({
        productId, shopId, location = 'unKnow'
    }){
        const product = await getProductbyId(productId);
        if(!product) throw new BadRequestError("Product not found");

        const query = {
            inven_productId: productId,
            inven_shopId: shopId
        },updateSet = {
            $inc: {inven_stock: stock

            },$set:{
                inven_location: location
            }
        },options = {
            upsert: true,
            new: true
        };
        return await inventoryModel.findOneAndUpdate(query,updateSet,options);
    }
}

module.exports = {
    InventoryService
}