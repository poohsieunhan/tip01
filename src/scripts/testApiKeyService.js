const mongoose = require('mongoose');
const { findById } = require('../services/apikey.service');

// Kết nối MongoDB
mongoose.connect('mongodb://localhost:27017/shopDEV');

const testApiKeyService = async () => {
    try {
        console.log('=== Testing API Key Service ===');
        
        const testKey = '8a4fbc2ac065c254ca1c067e000f15bcd2db4f54c612dac2a588de9e71cf8d4e3c5d64277dc4d1c0d3809aa047d8a9366bf6020916eb7d2ee4205d369c26184e';
        console.log(`Testing key: ${testKey.substring(0, 20)}...`);
        
        const result = await findById(testKey);
        console.log('Service result:', result);
        
        if (result) {
            console.log('✅ Service found the key!');
            console.log(`   Status: ${result.status}`);
            console.log(`   Permission: ${result.permission}`);
        } else {
            console.log('❌ Service did NOT find the key!');
        }
        
    } catch (error) {
        console.error('Error testing API key service:', error);
    } finally {
        mongoose.connection.close();
    }
};

// Chạy script
testApiKeyService();
