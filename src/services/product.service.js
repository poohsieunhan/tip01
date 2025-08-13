
const {product,clothing,electronic} = require("../models/product.model")
const {BadRequestError} = require("../core/error.response")

class ProductFactory{
    static async createProduct(type,payload){
        switch(type){
            case 'clothing':
                return new Clothing(payload).createProduct()
            case 'electronic':
                return new Electronic(payload).createProduct()
            case 'furniture':
                return new Furniture(payload).createProduct()
            default:
                throw BadRequestError(`Invalid type: ${type}`)
        }

    }
}

class Product{
    constructor({
        product_name,product_thumbnail,product_description,product_price,
        product_quantity,product_type,product_shop,product_attributes
    }){
        this.product_name = product_name
        this.product_thumbnail = product_thumbnail
        this.product_description = product_description
        this.product_price = product_price
        this.product_quantity = product_quantity
        this.product_type = product_type
        this.product_shop = product_shop
        this.product_attributes = product_attributes
    }

    async createProduct(product_id){
        return await product.create({
            ...this,
            _id: product_id
        })
    }
}

class Clothing extends Product{
    async createProduct(){
        console.log(`Create Clothing Func`);
        
        const newClothing = await clothing.create(this.product_attributes)
        if(!newClothing) throw BadRequestError("Create Clothing unsuccessfull")

        const newProduct = await super.createProduct() 
        if(!newProduct) throw BadRequestError("Create Product unsuccessfull") 

        return newProduct
    }
}

class Electronic extends Product{
    async createProduct(){
        console.log(`Electronic createProduct - this.product_shop:`, this.product_shop);
        console.log(`Electronic createProduct - this.product_attributes:`, this.product_attributes);
        
        const newElectronic = await electronic.create({
            ...this.product_attributes,
            product_shop: this.product_shop
        })
        if(!newElectronic) throw BadRequestError("Create Electronic unsuccessfull")

        const newProduct = await super.createProduct(newElectronic._id) 
        if(!newProduct) throw BadRequestError("Create Product unsuccessfull") 

        return newProduct
    }
}

class Furniture extends Product{
    async createProduct(){
        const newFurniture = await furniture.create({
            ...this.product_attributes,
            product_shop: this.product_shop
        })
        if(!newFurniture) throw BadRequestError("Create Furniture unsuccessfull")

        const newProduct = await super.createProduct(newFurniture._id) 
        if(!newProduct) throw BadRequestError("Create Product unsuccessfull") 

        return newProduct
    }
}

module.exports = ProductFactory

 