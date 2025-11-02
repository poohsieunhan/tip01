'use strict'

const {
    getSelectData,unGetSelectData
} = require('../../ultis')

const findAllDiscountCodeUnSelect = async ({
    filter,limit=50,page=1,sort='ctime',unSelect,model
}) => {
    const skip = (page - 1) * limit
    const sortBy = sort === 'ctime' ? {_id: -1} : {_id: -1}
    const documents = await model.find(filter)
    .sort(sortBy)
    .skip(skip)
    .limit(limit)
    .select(getSelectData(unSelect))
    .lean()

    return documents
}

const findAllDiscountCodeSelect = async ({
    filter,limit=50,page=1,sort='ctime',select,model
}) => {
    const skip = (page - 1) * limit
    const sortBy = sort === 'ctime' ? {_id: -1} : {_id: -1}
    const documents = await model.find(filter)
    .sort(sortBy)
    .skip(skip)
    .limit(limit)
    .select(getSelectData(select))
    .lean()

    return documents
}

const checkDiscountCodeExists = async ({
    model,filter
}) => { 
    return await model.findOne(filter).lean()
}


module.exports ={
    findAllDiscountCodeUnSelect,
    findAllDiscountCodeSelect,
    checkDiscountCodeExists
}