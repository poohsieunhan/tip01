const express = require('express');
const accessController = require('../../controllers/accesscontroller.js');
const { apiKey, checkPermission} = require('../../auth/checkAuth.js');
const asyncHandler = require('../../helpers/asyncHandler.js');
const router = express.Router();

router.use(apiKey)
router.use(checkPermission('0000')) 

router.post('/shop/signup',asyncHandler(accessController.signUp));

router.post('/shop/login',asyncHandler(accessController.login));


router.post('/shop/login',asyncHandler(accessController.logout));

module.exports = router;