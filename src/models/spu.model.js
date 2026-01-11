'use strict';

const { Schema, model } = require('mongoose');
const slugify = require('slugify');
const { product } = require('./product.model');

const DOCUMENT_NAME = 'Spu';
const COLLECTION_NAME = 'spus'; // Define the collection name

const productSchema = new Schema({
    product_id: {type: String,default: '',},
    product_name: {type: String,required: true,},
    product_thumbnail: {type: String,required: true,},
    product_description: {type: String,},
    product_slug: {type: String},
    product_price: {type: Number,required: true,},
    product_category: {type: Array,required: [],},
    product_quantity: {type: Number,required: true,},
    product_shop: {type: Schema.Types.ObjectId,ref: 'Shop',},
    product_attributes: {
        type: Schema.Types.Mixed,required: false,},
    product_ratingsAverage: {
        type: Number,
        default: 4.5,
        min: [1, "Rating must be above 1.0"],
        max: [5, "Rating must be below 5.0"],
        set: (val) => Math.round(val * 10) / 10,
    },
    product_variations: {type: Array,default: [],},
    isDraft: {type: Boolean,default: true,index: true,select: false,},
    isPublished: {type: Boolean,default: false,index: true,select: false,},
    isDelete: {type: Boolean,default: false,index: true,select: false,},
}, { 
    timestamps: true,
    collection: COLLECTION_NAME // Use the defined collection name

})

productSchema.index({product_name: 'text'})
productSchema.pre('save', function(next){
    this.product_slug = slugify(this.product_name, { lower: true });
    next();
}

module.exports = {
    product: model(DOCUMENT_NAME, productSchema),
};