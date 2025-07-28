'use strict';
require('dotenv').config();
const mongoose = require('mongoose');   
const {db:{host,port,name}} = require('../configs/config.mongodb.js'); // Importing the database configuration    
const connectionString = `mongodb://${host}:${port}/${name}`;
const {countConnect,checkOverload} = require('../helpers/checkConnect.js');

class Database {
    constructor() {
        this.connect();
    }

    connect(type = 'mongodb') {
        mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true })
            .then(() => {                 
                console.log('MongoDB connected successfully:',connectionString);
            })
            .catch(err => {
                console.error('MongoDB connection error:', err);
            });
    }

    static getInstance() {
        if (!Database.instance) {
            Database.instance = new Database();
        }
        return Database.instance;
    }   
}

const dbInstance = Database.getInstance();
module.exports = dbInstance;  // Export the singleton instance for use in other files