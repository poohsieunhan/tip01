const mongoose = require('mongoose');   

const connectionString = 'mongodb://localhost:27017/mydatabase';

mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {   
        console.log('MongoDB connected successfully');
    })
    .catch(err => {
        console.error('MongoDB connection error:', err);
    });     
module.exports = mongoose;  // Export the mongoose instance for use in other files