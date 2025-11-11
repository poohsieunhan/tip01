'use strict'

const inventoryModel = require('../inventory.model');
const {convertToObjectMongo} = require('../../ultis');

const insertInventory = async ({productId, shopId, stock, location = 'unKnow'}) => {
    return await inventoryModel.create({
        inven_productId: productId,
        inven_shopId: shopId,
        inven_stock: stock,
        inven_location: location
    });
}

const reservationInventory = async ({productId, cartId, quantity}) => {
    const query = {
        inven_productId: convertToObjectMongo(productId),
        inven_stock: {$gte: quantity}
    },updateSet={
        $inc: {inven_stock: -quantity
        },$push: {
            inven_reservations: {
                quantity,
                cartId,
                creatOn: new Date()
            }
        }
    },options={new: true,upsert : true}
    return await inventoryModel.updateOne(query,updateSet,options).lean();
}

module.exports = {
    insertInventory,
    reservationInventory
}