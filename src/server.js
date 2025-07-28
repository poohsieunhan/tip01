'use strict';
require('dotenv').config(); // Load environment variables from .env file
const app = require('./app');
const {app:{port}} = require('./configs/config.mongodb.js'); // Importing the port from the configuration

const PORT = port || 2811; // Use the port from the configuration or default to 2811

const server = app.listen(PORT,()=>{
    console.log(`Server is running on port: ${PORT}`);
})



