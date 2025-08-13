'use strict';

const express = require('express')
const router = express.Router()



router.use('/api/v1', require('./access')) // Import access routes

router.use('/api/v1/product', require('./product')) // Import access routes

module.exports = router