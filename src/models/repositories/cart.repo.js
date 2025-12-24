const {convertToObjectIdMongoose} = require("../../ultis");
const cartModel = require("../../models/cart.model");

const findCartById = async ({cartId}) => {
    return await cartModel.findOne({
        _id: convertToObjectIdMongoose(cartId),
        cart_status: 'active'
    }).lean();
}

module.exports = {
    findCartById
};