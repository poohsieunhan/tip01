const express = require('express');
const productController = require('../../controllers/product.controller.js');
const { apiKey, checkPermission} = require('../../auth/checkAuth.js');
const asyncHandler = require('../../helpers/asyncHandler.js');
const {authenticationV2 } = require('../../auth/authUltis');
const router = express.Router();


router.use(apiKey);
router.use(checkPermission('0000'));
router.use(authenticationV2);

router.post('',asyncHandler(productController.creatProduct));

module.exports = router;