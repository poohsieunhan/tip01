require('dotenv').config();
const express = require('express')
const morgan = require('morgan');
const helmet = require('helmet');
const compression = require('compression');
const { checkOverload } = require('./helpers/checkConnect.js');
const app = express();


app.use(morgan("dev"))
app.use(helmet())
app.use(compression())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

require('./dbs/init.mongodb.js'); // Initialize MongoDB connection
//checkOverload(); // Start checking for overload

app.use('',require('./routes')); // Import and use the routes


module.exports = app