'use strict';

const {product,electronic,clothing} = require('../product.model');
const { Types } = require('mongoose');
const {getSelectData, convertToObjectIdMongo} = require('../../ultis');

const findAllDraftForShop = async ({query,limit,skip}) => {
    return await product.find(query)
    .populate('product_shop', 'name email -_id')
    .sort({createdAt: -1})
    .skip(skip)
    .limit(limit)
    .lean()
    .exec();
}

const findAllPublishedForShop = async ({query,limit,skip}) => {
    return await product.find(query)
    .populate('product_shop', 'name email -_id')
    .sort({createdAt: -1})
    .skip(skip)
    .limit(limit)
    .lean()
    .exec();
}

const publishProductByShop = async ({product_shop,product_id}) => {
  const foundShop = await product.findOne(
    {
        product_shop: new Types.ObjectId(product_shop),
        _id: new Types.ObjectId(product_id) 
    })
    if(!foundShop) return null
    foundShop.isPublished = true
    foundShop.isDraft = false
    
    const {modifiedCount} = await foundShop.updateOne(foundShop)
    return modifiedCount        
}

const unPublishProductByShop = async ({product_shop,product_id}) => {
    const foundShop = await product.findOne(
      {
          product_shop: new Types.ObjectId(product_shop),
          _id: new Types.ObjectId(product_id) 
      })
      if(!foundShop) return null
      foundShop.isPublished = false
      foundShop.isDraft = true
      
      const {modifiedCount} = await foundShop.updateOne(foundShop)
      return modifiedCount        
}

const searchProductByUser = async ({keySearch}) => {
    const regexSearch = new RegExp(keySearch)
    const products = await product.find({
        $text: {$search: regexSearch},      
    },{score: {$meta: 'textScore'}})
    .sort({score: {$meta: 'textScore'}})
    .lean()
    .exec();
    return products
}

const findAllProducts = async ({limit,sort,page,filter,select}) => {
  const skip = (page - 1) * limit
  const sortBy = sort === 'ctime' ? {_id: -1} : {_id: -1}
  const products = await product.find(filter)
  .sort(sortBy)
  .skip(skip)
  .limit(limit)
  .select(getSelectData(select))
  .lean().exec()
  return products
}

const findProduct = async ({product_id, unSelect}) => {
  return await product.findById(product_id).select(UnGetSelectData(unSelect))
}

const updateProductById = async (productId, bodyUpdate,model,isNew=true) => {
  return await model.findByIdAndUpdate(productId,bodyUpdate,{
    new: isNew
  })
}

const getProductbyId = async ({productId}) => {
    return await product.findOne({_id: convertToObjectIdMongo(productId)}).lean()
}

module.exports = {
    findAllDraftForShop,
    findAllPublishedForShop,
    publishProductByShop,
    unPublishProductByShop,
    searchProductByUser,
    findAllProducts,
    findProduct,
    updateProductById,
    getProductbyId
}
