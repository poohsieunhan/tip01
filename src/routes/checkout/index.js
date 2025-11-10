'use strict'

const express = require('express')
const router = express.Router()
const checkoutController = require('../../controllers/checkout.controller.js');
const asyncHandler = require('../../helpers/asyncHandler.js');
const {authemticationV2 } = require('../../auth/authUltis');

route.post('/review',asyncHandler(checkoutController.checkoutReview));

module.exports = router