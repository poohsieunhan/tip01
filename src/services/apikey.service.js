'use strict';

const apikeyModel = require('../models/apikey.model');
const crypto = require('crypto');

const findById = async (key)=>{
    // Loại bỏ dấu ngoặc kép nếu có
    const cleanKey = key ? key.replace(/^["']|["']$/g, '') : key;
    
    console.log(`Original key:`, key);
    console.log(`Clean key:`, cleanKey);
    console.log(`Key type:`, typeof cleanKey);
    console.log(`Key length:`, cleanKey ? cleanKey.length : 'undefined');
    
    try {
        // Test 1: Tìm kiếm không có điều kiện status
        const keyWithoutStatus = await apikeyModel.findOne({key: cleanKey}).lean();
        console.log(`Key without status condition:`, keyWithoutStatus);
        
        // Test 2: Tìm kiếm với điều kiện status: true
        const objKey = await apikeyModel.findOne({key: cleanKey, status: true}).lean();
        console.log(`Found API key with status: true:`, objKey);
        
        // Test 3: Tìm kiếm tất cả keys để so sánh
        const allKeys = await apikeyModel.find({}).lean();
        console.log(`Total keys in database:`, allKeys.length);
        
        if (allKeys.length > 0) {
            console.log(`First key in DB:`, allKeys[0].key.substring(0, 20) + '...');
            console.log(`First key status:`, allKeys[0].status);
            console.log(`First key permission:`, allKeys[0].permission);
            
            // So sánh chi tiết với key đang tìm
            console.log(`\n--- Detailed Comparison ---`);
            console.log(`Searching for key length:`, cleanKey.length);
            console.log(`Searching for key:`, cleanKey);
            
            allKeys.forEach((dbKey, index) => {
                console.log(`\nDB Key ${index + 1}:`);
                console.log(`  Length:`, dbKey.key.length);
                console.log(`  Key:`, dbKey.key);
                console.log(`  Status:`, dbKey.status);
                console.log(`  Permission:`, dbKey.permission);
                
                // Kiểm tra xem có khớp không
                if (dbKey.key === cleanKey) {
                    console.log(`  ✅ EXACT MATCH!`);
                } else if (dbKey.key.includes(cleanKey.substring(0, 20))) {
                    console.log(`  🔍 Partial match (first 20 chars)`);
                } else {
                    console.log(`  ❌ No match`);
                }
            });
        }
        
        return objKey;
    } catch (error) {
        console.error(`Error in findById:`, error);
        return null;
    }
}

const createApiKey = async () => {
    const newKey = await apikeyModel.create({
        key: crypto.randomBytes(64).toString('hex'),
        permission: ['0000']
    });
    console.log(`Created new API key:`, newKey);
    return newKey;
}

module.exports = {
    findById,
    createApiKey
}