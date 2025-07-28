'use strict';

const express = require('express')
const router = express.Router()

router.use('/api/v1', require('./access')) // Import access routes

// router.get('/', (req, res) => {
    
//     const strStr = "Cong hoa xa hoi chu nghia Viet Nam";

//     return res.status(200).json({
//         message: "Welcome to the Express App",
//         //metadata: strStr.repeat(100000) // Repeat the string 1000 times
//     });
// })

module.exports = router