'use strict';

const { Schema, model } = require('mongoose');
const { slugify } = require('slugify');

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
    product_slug: {
        type: String
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
    product_ratingsAverage: {
        type: Number,
        default: 4.5,
        min: [1, "Rating must be above 1.0"],
        max: [5, "Rating must be below 5.0"],
        set: (val) => Math.round(val * 10) / 10,
    },
    product_variations: {
        type: Array,
        default: [],
    },
    isDraft: {
        type: Boolean,
        default: true,
        index: true,
        select: false,
    },
    isPublished: {
        type: Boolean,
        default: false,
        index: true,
        select: false,
    }, 
}, { 
    timestamps: true,
    collection: COLLECTION_NAME // Use the defined collection name

})

productSchema.pre('save', function(next){
    this.product_slug = slugify(this.product_name, { lower: true });
    next();
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

const furnitureSchema = new Schema({
    brand: {
        type: String,
        required: true,
    },
    size: {
        type: String,
    },
    material: {
        type: String,
    },   
    product_shop: {
        type: Schema.Types.ObjectId,
        ref: 'Shop', // Reference to the Shop model
    },
},{
    collection: "furnitures",
    timestamps: true
})

module.exports = {
    product: model(DOCUMENT_NAME, productSchema),  
    clothing: model('Clothing', clothingSchema),
    electronic: model('Electronic', electronicSchema),
    furniture: model('Furniture', furnitureSchema)
};