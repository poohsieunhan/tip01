require('dotenv').config();
const express = require('express')
const morgan = require('morgan');
const helmet = require('helmet');
const compression = require('compression');
const { checkOverload } = require('./helpers/checkConnect.js');
const app = express();
const {v4:uuidv4} = require('uuid');
const myLogger = require('./loggers/mylogger.log.js');

app.use(morgan("dev"))
app.use(helmet())
app.use(compression())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req,res,next)=>{
    const requestId = req.headers['x-request-id']
    req.requestId = requestId? requestId : uuidv4();
    myLogger.log('input param',[
        req.path,
        {requestId: req.requestId},
        req.method ==='POST'? req.body : req.query
    ])
    next();
})

require('./dbs/init.mongodb.js'); // Initialize MongoDB connection
//checkOverload(); // Start checking for overload

app.use('',require('./routes')); // Import and use the routes

//handle errors
app.use((req,res,next)=>{   
    const error = new Error('Not Found');
     error.status = 404;
    next(error);   
})

app.use((error, req, res, next) => {
    const statusCode = error.status || 500;
    const processingTime = Date.now() - error.now;
const errorForLog = {
    ...error,
    now: new Date(error.now).toLocaleString()
};
const resMessage = `${error.statusCode} - ${processingTime}ms - Response: ${JSON.stringify(errorForLog)}`;
    myLogger.error(resMessage,[
        req.path,
        {requestId: req.requestId},
        {message: error.message}
    ])
    return res.status(statusCode).json({
        status:error,
        code: statusCode,
        stack: error.stack,
        message: error.message || 'Internal Server Error'
    })
});


module.exports = app