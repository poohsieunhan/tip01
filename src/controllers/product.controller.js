'use strict';
const { CREATED, SuccessResponse } = require('../core/success.response');
const ProductService = require('../services/product.service');

class ProductController {
    
    
    creatProduct = async (req, res, next) => {
         // Sử dụng x-client-id từ header thay vì req.user.userId
        const product_shop = req.headers['x-client-id'];
        if (!product_shop) {
            throw new Error('Client ID is missing in headers');
        }
        
        // Kiểm tra xem product_shop có phải là ObjectId hợp lệ không
        if (!/^[0-9a-fA-F]{24}$/.test(product_shop)) {
            throw new Error(`Invalid ObjectId format: ${product_shop}`);
        }
               
        new SuccessResponse({
            message: "Create Product Successfully",
            metadata: await ProductService.createProduct(req.body.product_type,{
                ...req.body,
                product_shop: product_shop
            })
        }).send(res)
    }    
}

module.exports = new ProductController(); 
