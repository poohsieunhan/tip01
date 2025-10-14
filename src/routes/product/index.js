const express = require('express');
const productController = require('../../controllers/product.controller.js');
const { apiKey, checkPermission} = require('../../auth/checkAuth.js');
const asyncHandler = require('../../helpers/asyncHandler.js');
const {authenticationV2 } = require('../../auth/authUltis');
const router = express.Router();


router.use(apiKey);
router.use(checkPermission('0000'));

router.get('/search/:keySearch',asyncHandler(productController.getListSearchProduct));
router.get('',asyncHandler(productController.findAllProducts));
router.get('/:product_id',asyncHandler(productController.findProduct));

router.use(authenticationV2);

router.post('',asyncHandler(productController.creatProduct));
router.patch('/:product_id',asyncHandler(productController.updateProduct));

router.post('/publish/:id',asyncHandler(productController.publishProductByShop));

router.post('/unpublish/:id',asyncHandler(productController.unPublishProductByShop));

router.get('/drafts/all',asyncHandler(productController.getAllDraftForShop));
router.get('/published/all',asyncHandler(productController.getAllPublishedForShop));    

module.exports = router;