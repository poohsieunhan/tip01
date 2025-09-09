'use strict';
const { CREATED, SuccessResponse } = require('../core/success.response');
const ProductService = require('../services/product.service.lv2');

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

    getAllDraftForShop = async (req, res, next) => {
        new SuccessResponse({
            message: "Get All Draft For Shop Successfully",
            metadata: await ProductService.findAllDraftForShop({
                product_shop: req.user.userId
            })
        }).send(res)
    }

    getAllPublishedForShop = async (req, res, next) => {
        new SuccessResponse({
            message: "Get All Published For Shop Successfully",
            metadata: await ProductService.findAllPublishedForShop({
                product_shop: req.user.userId
            })
        }).send(res)
    }

    publishProductByShop = async (req, res, next) => {
        new SuccessResponse({
            message: "Get publish Product By Shop Successfully",
            metadata: await ProductService.publishProductByShop({
                product_id: req.params.id,
                product_shop: req.user.userId
            })
        }).send(res)
    }

    unPublishProductByShop = async (req, res, next) => {
        new SuccessResponse({
            message: "Get Unpublish Product By Shop Successfully",
            metadata: await ProductService.unPublishProductByShop({
                product_id: req.params.id,
                product_shop: req.user.userId
            })
        }).send(res)
    }

    getListSearchProduct = async (req, res, next) => {
        new SuccessResponse({
            message: "Get List Search Product Successfully",
            metadata: await ProductService.searchProduct({
                keySearch: req.params
            })
        }).send(res)
    }
}

module.exports = new ProductController(); 
