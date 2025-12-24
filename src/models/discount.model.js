'use strict'

const {model,Schema,Types} = require('mongoose'); // Erase if already required
const mongoose = require('mongoose');

const DOCUMENT_NAME = 'Discount'; // Define the document name
const COLLECTION_NAME = 'Discounts';

// Declare the Schema of the Mongo model
var discountSchema = new mongoose.Schema({
    discount_name:{type:String,required:true},
    discount_description:{type:String,required:true}, // Mô tả chiết khấu
    discount_type:{type:String,required:true,enum:['fixed_amount', 'percentage']}, // Loại chiết khấu
    discount_value:{type:Number,required:true}, // Giá trị chiết khấu
    discount_code:{type:String,required:true}, // Mã chiết khấu
    discount_start_date:{type:Date,required:true}, // Ngày bắt đầu
    discount_end_date:{type:Date,required:true}, // Ngày kết thúc
    discount_max_uses:{type:Number,required:true}, // Số lần sử dụng tối đa
    discount_used_count:{type:Number,required:true,default:0}, // Số lần đã sử dụng
    discount_users_used:{type:Array,default:[]}, // Danh sách người dùng đã sử dụng
    discount_max_uses_per_user:{type:Number,required:true,default:1}, // Số lần sử dụng tối đa cho mỗi người dùng
    discount_min_order_value:{type:Number,required:true}, // Giá trị tối thiểu của đơn hàng
    discount_shopId:{type:Schema.Types.ObjectId,ref:'Shop'},
    discount_is_active:{type:Boolean,default:true}, // Trạng thái hoạt động
    discount_applies_to:{type:String,required:true,enum:['all', 'specific']}, // Áp dụng cho tất cả sản phẩm hay chỉ cho các sản phẩm cụ thể
    discount_product_ids:{type:Array,default:[]}, // Danh sách sản phẩm được áp dụng
},{  
        collection: COLLECTION_NAME,
        timestamps: true // Automatically manage createdAt and updatedAt fields 
});

//Export the model
module.exports = mongoose.model(DOCUMENT_NAME, discountSchema);