'use strict'

const {model,Schema,Types} = require('mongoose'); // Erase if already required

const DOCUMENT_NAME = 'Inventory'; // Define the document name
const COLLECTION_NAME = 'Inventories';

// Declare the Schema of the Mongo model
var inventorySchema = new mongoose.Schema({
    inven_productId:{
        type:Schema.Types.ObjectId,
        ref:'Product'
    },
    inven_location:{
        type:String,
        default:'unKnow'
    },
    inven_stock:{
        type:Number,
        required:true,
    },
    inven_shopId:{
        type:Schema.Types.ObjectId,
        ref:'Shop'
    },
    inven_reservations:{
        type:Array,
        default:[]
    }
},{  
        collection: COLLECTION_NAME,
        timestamps: true // Automatically manage createdAt and updatedAt fields 
});

//Export the model
module.exports = mongoose.model(DOCUMENT_NAME, inventorySchema);