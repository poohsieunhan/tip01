'use strict'

const mongoose = require('mongoose'); // Erase if already required

const DOCUMENT_NAME = 'ApiKey'; 
const COLLECTION_NAME = 'ApiKeys'; 

// Declare the Schema of the Mongo model
var apiKeySchema = new mongoose.Schema({
    key:{
        type:String,
        required:true,
        unique:true,
    },
    status:{
        type:Boolean,
        default:true,
    },
    permission:{
        type:[String],
        required:true,
        enum:['0000', '1111', '2222'],
    },
}, {
        timestamps: true,
        collection: COLLECTION_NAME || 'ApiKeys' // Replace COLLECTION_NAME with your desired collection name
    }
);

//Export the model
module.exports = mongoose.model(DOCUMENT_NAME, apiKeySchema);