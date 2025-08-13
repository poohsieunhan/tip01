require('dotenv').config();
const mongoose = require('mongoose');
const {db:{host,port,name}} = require('../configs/config.mongodb.js');
const connectionString = `mongodb://${host}:${port}/${name}`;
const apikeyModel = require('../models/apikey.model');

console.log('=== Testing Server Database Connection ===');
console.log('Environment:', process.env.NODE_ENV);
console.log('Config:', {host, port, name});
console.log('Connection string:', connectionString);

const testServerDb = async () => {
    try {
        // Kết nối database giống như server
        await mongoose.connect(connectionString);
        console.log('✅ Connected to database successfully');
        
        // Test tìm kiếm API key
        const testKey = '8a4fbc2ac065c254ca1c067e000f15bcd2db4f54c612dac2a588de9e71cf8d4e3c5d64277dc4d1c0d3809aa047d8a9366bf6020916eb7d2ee4205d369c26184e';
        console.log('\n--- Testing API key search ---');
        console.log('Looking for key:', testKey.substring(0, 20) + '...');
        
        const key = await apikeyModel.findOne({key: testKey, status: true}).lean();
        if (key) {
            console.log('✅ API key found!');
            console.log('   Status:', key.status);
            console.log('   Permission:', key.permission);
        } else {
            console.log('❌ API key NOT found!');
            
            // Kiểm tra xem có key nào không
            const allKeys = await apikeyModel.find({}).lean();
            console.log('Total keys in database:', allKeys.length);
            
            if (allKeys.length > 0) {
                console.log('First key:', allKeys[0].key.substring(0, 20) + '...');
                console.log('First key status:', allKeys[0].status);
            }
        }
        
    } catch (error) {
        console.error('❌ Error testing server database:', error);
    } finally {
        await mongoose.connection.close();
        console.log('Database connection closed');
    }
};

// Chạy script
testServerDb();
