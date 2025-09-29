'use strict';

const { createApiKey } = require('../services/apikey.service');
const dbInstance = require('../dbs/init.mongodb');

const createNewApiKey = async () => {
    try {
        console.log('🚀 Đang kết nối đến MongoDB...');
        // Database sẽ tự động kết nối khi import
        
        console.log('🔑 Đang tạo API key mới...');
        const newApiKey = await createApiKey();
        
        console.log('\n✅ API Key đã được tạo thành công!');
        console.log('📋 Thông tin API Key:');
        console.log(`   - Key: ${newApiKey.key}`);
        console.log(`   - Permission: ${JSON.stringify(newApiKey.permission)}`);
        console.log(`   - Status: ${newApiKey.status}`);
        console.log(`   - Created At: ${newApiKey.createdAt}`);
        
        console.log('\n💡 Bạn có thể sử dụng API key này trong header:');
        console.log(`   x-api-key: ${newApiKey.key}`);
        
        process.exit(0);
    } catch (error) {
        console.error('❌ Lỗi khi tạo API key:', error);
        process.exit(1);
    }
};

// Chạy hàm tạo API key
createNewApiKey();