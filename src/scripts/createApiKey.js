const mongoose = require('mongoose');
const apikeyModel = require('../models/apikey.model');
const crypto = require('crypto');

// Kết nối MongoDB
mongoose.connect('mongodb://localhost:27017/shopDEV', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const createApiKey = async () => {
    try {
        // Tạo API key mới
        const newKey = await apikeyModel.create({
            key: crypto.randomBytes(64).toString('hex'),
            permission: ['0000'],
            status: true
        });
        
        console.log('=== API Key Created Successfully ===');
        console.log('Key:', newKey.key);
        console.log('Permission:', newKey.permission);
        console.log('Status:', newKey.status);
        console.log('=====================================');
        
        return newKey;
    } catch (error) {
        console.error('Error creating API key:', error);
    } finally {
        mongoose.connection.close();
    }
};

// Chạy script
createApiKey();
