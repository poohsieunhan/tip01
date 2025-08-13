const mongoose = require('mongoose');
const apikeyModel = require('../models/apikey.model');

// Kết nối MongoDB
mongoose.connect('mongodb://localhost:27017/shopDEV');

const debugApiKey = async () => {
    try {
        console.log('=== Debug API Key Service ===');
        
        // Kiểm tra kết nối database
        console.log('Database connection state:', mongoose.connection.readyState);
        
        // Kiểm tra model
        console.log('API Key Model:', apikeyModel);
        
        // Tìm tất cả API keys
        console.log('\n--- Finding all API keys ---');
        const allKeys = await apikeyModel.find({}).lean();
        console.log('Total keys found:', allKeys.length);
        
        if (allKeys.length > 0) {
            console.log('First key:', allKeys[0]);
        }
        
        // Test tìm kiếm với điều kiện cụ thể
        const testKey = '8a4fbc2ac065c254ca1c067e000f15bcd2db4f54c612dac2a588de9e71cf8d4e3c5d64277dc4d1c0d3809aa047d8a9366bf6020916eb7d2ee4205d369c26184e';
        console.log('\n--- Testing specific key search ---');
        console.log('Looking for key:', testKey.substring(0, 20) + '...');
        
        // Test 1: Tìm kiếm không có điều kiện
        const keyWithoutStatus = await apikeyModel.findOne({key: testKey}).lean();
        console.log('Key without status condition:', keyWithoutStatus ? 'Found' : 'Not found');
        
        // Test 2: Tìm kiếm với điều kiện status: true
        const keyWithStatus = await apikeyModel.findOne({key: testKey, status: true}).lean();
        console.log('Key with status: true condition:', keyWithStatus ? 'Found' : 'Not found');
        
        // Test 3: Kiểm tra status của key
        if (keyWithoutStatus) {
            console.log('Key status:', keyWithoutStatus.status);
            console.log('Key permission:', keyWithoutStatus.permission);
        }
        
    } catch (error) {
        console.error('Error debugging API key:', error);
    } finally {
        mongoose.connection.close();
    }
};

// Chạy script
debugApiKey();
