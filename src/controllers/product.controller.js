'use strict';
const { CREATED, SuccessResponse } = require('../core/success.response');
const ProductService = require('../services/product.service');

class ProductController {
    
    
    creatProduct = async (req, res, next) => {
        console.log(`creatProduct Controller`);
        
        new SuccessResponse({
            message: "Create Product Successfully",
            metadata: await ProductService.createProduct(req.body.product_type,req.body)
        }).send(res)
    }    
}

module.exports = new ProductController(); 
