const express = require('express');
const productController = require('../../controllers/product.controller.js');
const { apiKey, checkPermission} = require('../../auth/checkAuth.js');
const asyncHandler = require('../../helpers/asyncHandler.js');
const { authentication } = require('../../auth/authUltis');
const router = express.Router();


console.log(`=== Product Route Setup ===`);
console.log(`Setting up API key middleware`);
router.use(apiKey);

console.log(`Setting up permission middleware`);
router.use(checkPermission('0000'));

console.log(`Setting up authentication middleware`);
router.use(authentication);

console.log(`router product`);

console.log(`Setting up POST route for product creation`);
router.post('',asyncHandler(productController.creatProduct));
console.log(`Product route setup complete`);

module.exports = router;