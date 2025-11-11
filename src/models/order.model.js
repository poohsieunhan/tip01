'use strict'

const {model,Schema} = require('mongoose');

const DOCUMENT_NAME = 'Order';
const COLLECTION_NAME = 'Orders';

const orderSchema = new Schema(
    {
        order_userId: {type: Number, required: true},
        order_checout: {type: Object, required: true,default:{}},   
        order_shipping: {type: Object, required: true,default:{}},
        order_payment: {type: Object, required: true,default:{}},
        order_products: {type: Array, required: true},
        order_trackingNumber: {type: String, default: null},
        order_status: {type: String, enum:['pending','confirmed','shipped','cancelled','deliverd'], default: 'pending'},
    },
    {
        collection: COLLECTION_NAME,
        timestamps: true
    }    
)

module.exports = model(DOCUMENT_NAME,orderSchema);