const express = require('express');
const productController = require('../../controllers/product.controller.js');
const { apiKey, checkPermission} = require('../../auth/checkAuth.js');
const asyncHandler = require('../../helpers/asyncHandler.js');
const { authentication } = require('../../auth/authUltis');
const router = express.Router();


//router.use(authentication)
console.log(`router product`);

router.post('',asyncHandler(productController.creatProduct));

module.exports = router;