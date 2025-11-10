'use strict';

const express = require('express')
const router = express.Router()



router.use('/api/v1', require('./access')) // Import access routes
router.use('/api/v1/cart', require('./cart')) // Import cart routes
router.use('/api/v1/checkout', require('./checkout')) // Import checkout routes
router.use('/api/v1/discount', require('./discount')) // Import discount routes
router.use('/api/v1/product', require('./product')) // Import product routes

module.exports = router