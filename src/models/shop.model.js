const mongoose = require('mongoose'); // Erase if already required

const COLLECTION_NAME = 'Shops'; // Define the collection name
const DOCUMENT_NAME = 'Shop'

// Declare the Schema of the Mongo model
var shopSchema = new mongoose.Schema({
    name:{
        type:String,
        trim:true,
        maxlength:150,
    },
    email:{
        type:String,
        trim:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
    },
    status:{
        type:String,
        enum:['active','inactive'],
        default:'inactive',
    },
    verfify:{
        type:mongoose.Schema.Types.Boolean,
        default:false,
    },
    roles:{
        type:Array,
        default:[]
    }
}, {
    timestamps: true,
    collection:COLLECTION_NAME || 'Shops' // Replace COLLECTION_NAME with your desired collection name

});


//Export the model
module.exports = mongoose.model(DOCUMENT_NAME, shopSchema);