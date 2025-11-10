'use strict';

const express = require('express')  
const router = express.Router()
const cartController = require('../../controllers/cart.controller.js');
const { apiKey, checkPermission} = require('../../auth/checkAuth.js');
const asyncHandler = require('../../helpers/asyncHandler.js');
const {authenticationV2 } = require('../../auth/authUltis');
const { route } = require('../access');

// router.use(apiKey);
// router.use(checkPermission('0000'));

router.post('',asyncHandler(cartController.addToCart));
router.delete('',asyncHandler(cartController.deleteCart));
router.post('/update',asyncHandler(cartController.updateCart));
router.get('',asyncHandler(cartController.listCart));

module.exports = router;