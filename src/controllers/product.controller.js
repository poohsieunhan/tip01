'use strict';
const { CREATED, SuccessResponse } = require('../core/success.response');
const ProductService = require('../services/product.service');

class ProductController {
    
    
    creatProduct = async (req, res, next) => {
        console.log(`=== Product Controller - creatProduct ===`);
        console.log(`Request received at:`, new Date().toISOString());
        console.log(`req.user:`, req.user);
        console.log(`req.user.userId:`, req.user.userId);
        console.log(`req.body:`, req.body);
        
        // Sử dụng x-client-id từ header thay vì req.user.userId
        const product_shop = req.headers['x-client-id'];
        if (!product_shop) {
            throw new Error('Client ID is missing in headers');
        }
        
        // Kiểm tra xem product_shop có phải là ObjectId hợp lệ không
        if (!/^[0-9a-fA-F]{24}$/.test(product_shop)) {
            throw new Error(`Invalid ObjectId format: ${product_shop}`);
        }
        
        console.log(`Using product_shop from header:`, product_shop);
        console.log(`product_shop type:`, typeof product_shop);
        console.log(`product_shop length:`, product_shop.length);
        
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
