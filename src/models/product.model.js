'use strict';

const { Schema, model } = require('mongoose');

const DOCUMENT_NAME = 'Product';
const COLLECTION_NAME = 'Products'; // Define the collection name

const productSchema = new Schema({
    product_name: {
        type: String,
        required: true,
    },
    product_thumbnail: {
        type: String,
        required: true,
    },
    product_description: {
        type: String,
    },
    product_price: {
        type: Number,
        required: true,
    },
    product_quantity: {
        type: Number,
        required: true,
    },
    product_type: {
        type: String,
        required: true,
        enum: ['electronic', 'clothing', 'funiture'], // Example product types 
    },
    product_shop: {
        type: Schema.Types.ObjectId,
        ref: 'Shop', // Reference to the Shop model
    },
    product_attributes: {
        type: Schema.Types.Mixed, // Use Mixed type for flexible attributes
        required: false, // Optional field for additional attributes
    }, 
}, { 
    timestamps: true,
    collection: COLLECTION_NAME // Use the defined collection name

})

const clothingSchema = new Schema({
    brand: {
        type: String,
        required: true,
    },
    size: {
        type: String,
    },
    meterial: {
        type: String,
    }, 
    product_shop: {
        type: Schema.Types.ObjectId,
        ref: 'Shop', // Reference to the Shop model
    },
},{
    collection: "clothes",
    timestamps: true
})

const electronicSchema = new Schema({
    manufacture: {
        type: String,
        required: true,
    },
    model: {
        type: String,
    },
    color: {
        type: String,
    },   
    product_shop: {
        type: Schema.Types.ObjectId,
        ref: 'Shop', // Reference to the Shop model
    },
},{
    collection: "electronics",
    timestamps: true
})

module.exports = {
    product: model(DOCUMENT_NAME, productSchema),  
    clothing: model('Clothing', clothingSchema),
    electronic: model('Electronic', electronicSchema) 
};