const mongoose = require('mongoose');
const apikeyModel = require('../models/apikey.model');

// Kết nối MongoDB
mongoose.connect('mongodb://localhost:27017/shopDEV');

const checkApiKeys = async () => {
    try {
        console.log('=== Checking API Keys ===');
        
        const keys = await apikeyModel.find({}).lean();
        console.log(`Total API keys found: ${keys.length}`);
        
        keys.forEach((key, index) => {
            console.log(`\n${index + 1}. API Key:`);
            console.log(`   ID: ${key._id}`);
            console.log(`   Key: ${key.key.substring(0, 20)}...`);
            console.log(`   Status: ${key.status}`);
            console.log(`   Permission: ${key.permission}`);
            console.log(`   Created: ${key.createdAt}`);
        });
        
        // Kiểm tra API key cụ thể
        const specificKey = '8a4fbc2ac065c254ca1c067e000f15bcd2db4f54c612dac2a588de9e71cf8d4e3c5d64277dc4d1c0d3809aa047d8a9366bf6020916eb7d2ee4205d369c26184e';
        console.log(`\n=== Checking Specific Key ===`);
        console.log(`Looking for: ${specificKey.substring(0, 20)}...`);
        
        const foundKey = await apikeyModel.findOne({key: specificKey}).lean();
        if (foundKey) {
            console.log('✅ Key found!');
            console.log(`   Status: ${foundKey.status}`);
            console.log(`   Permission: ${foundKey.permission}`);
        } else {
            console.log('❌ Key NOT found!');
        }
        
    } catch (error) {
        console.error('Error checking API keys:', error);
    } finally {
        mongoose.connection.close();
    }
};

// Chạy script
checkApiKeys();
