const express = require('express');
const discountController = require('../../controllers/discount.controller.js');
const { apiKey, checkPermission} = require('../../auth/checkAuth.js');
const asyncHandler = require('../../helpers/asyncHandler.js');
const {authenticationV2 } = require('../../auth/authUltis');
const router = express.Router();


router.use(apiKey);
router.use(checkPermission('0000'));

router.post('/amount',asyncHandler(discountController.getDiscountAmount));
router.post('/list_product_code',asyncHandler(discountController.getAllDiscoutCodeWithProduct));


router.use(authenticationV2);
router.get('',asyncHandler(discountController.createDiscountCode));
router.get('/shop',asyncHandler(discountController.getAllDiscountCodeByShop));
    

module.exports = router;