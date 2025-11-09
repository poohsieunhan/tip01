'user strict';

const {model,Schema} = require('mongoose');

const DOCUMENT_NAME = 'Cart';
const COLLECTION_NAME = 'Carts';

const cartSchema = new Schema({
    cart_status:{type:String,require:true,enum:['active','completed','failed','pending'], default:'active'},
    cart_products:{type:Array,default:[],require:true},
    cart_count_products:{type:Number,default:0,require:true},
    cart_userId:{type:Schema.Types.ObjectId,ref:'User',require:true}
}, {
    timestamps:true,
    collection:COLLECTION_NAME
});

module.exports = model(DOCUMENT_NAME,cartSchema);