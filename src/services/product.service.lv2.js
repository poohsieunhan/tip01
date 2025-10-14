
const {product,clothing,electronic} = require("../models/product.model")
const {BadRequestError} = require("../core/error.response")
const {findAllDraftForShop,findAllPublishedForShop,publishProductByShop,findAllProducts,updateProductById} = require("../models/repositories/product.repo")    
const {removeUndefinedObject,updateNestedObjectParse} = require("../ultis")

class ProductFactory{
    static productRegister = {}
    static registerProductType(type,classRef){
        ProductFactory.productRegister[type] = classRef
    }

    static async createProduct(type,payload){
        const productClass = ProductFactory.productRegister[type]
        if(!productClass) throw BadRequestError(`Invalid type: ${type}`)
        return new productClass(payload).createProduct()
    }

    static async updateProduct(type,product_id,payload){
        const productClass = ProductFactory.productRegister[type]
        if(!productClass) throw BadRequestError(`Invalid type: ${type}`)
        return new productClass(payload).updateProduct(product_id)
    }

    static async publishProductByShop({product_shop,product_id}){
        return await publishProductByShop({product_shop,product_id})
    }

    static async unpublishProductByShop({product_shop,product_id}){
        return await unpublishProductByShop({product_shop,product_id})
    }

    static async findAllDraftForShop({product_shop,limit=50,skip=0}){
        const query = {product_shop: product_shop,isDraft: true}
        return await findAllDraftForShop({query,limit,skip})
    }

    static async findAllPublishedForShop({product_shop,limit=50,skip=0}){
        const query = {product_shop: product_shop,isPublished: true}
        return await findAllPublishedForShop({query,limit,skip})
    }

    static async searchProduct({keySearch}){
        return await searchProductByUser({keySearch})
    }

    static async findAllProducts({limit=50,sort='ctime',page=1,filter={isPublished: true}}){
        return await findAllProducts({limit,sort,page,filter,
            select:['product_name','product_price','product_thumbnail']})
    }
    
    static async findProduct({product_id}){
        return await findProduct({product_id, unSelect:['__v']})
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

    async updateProduct(productId, bodyUpdate){
        return await updateProductById({productId,bodyUpdate,model:product})
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

    async updateProduct(productID){
        const objectParams = removeUndefinedObject(this)
        if(objectParam.product_attributes){
            await updateProductById({
                productID,
                bodyUpdate: updateNestedObjectParse(objectParams),
                model:clothing
            })
        }   
        const UpdateProduct = await super.updateProduct(productId, updateNestedObjectParse(objectParams))
        return UpdateProduct
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

ProductFactory.registerProductType('Clothing',Clothing)
ProductFactory.registerProductType('Electronic',Electronic)
ProductFactory.registerProductType('Furniture',Furniture)

module.exports = ProductFactory

 