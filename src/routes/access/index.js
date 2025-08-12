const express = require('express');
const accessController = require('../../controllers/accesscontroller.js');
const { apiKey, checkPermission} = require('../../auth/checkAuth.js');
const asyncHandler = require('../../helpers/asyncHandler.js');
const { authentication } = require('../../auth/authUltis');
const router = express.Router();

router.use(apiKey)
router.use(checkPermission('0000')) 

router.post('/shop/signup',asyncHandler(accessController.signUp));

router.post('/shop/login',asyncHandler(accessController.login));

router.use(authentication)
router.post('/shop/logout',asyncHandler(accessController.logout));
router.post('/shop/handlerRefeshToken',asyncHandler(accessController.handleRefreshToken));

module.exports = router;