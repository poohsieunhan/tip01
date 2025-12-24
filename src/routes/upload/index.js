const express = require('express');
const uploadController = require('../../controllers/upload.controller.js');
const { apiKey, checkPermission} = require('../../auth/checkAuth.js');
const asyncHandler = require('../../helpers/asyncHandler.js');
const {authenticationV2 } = require('../../auth/authUltis');
const router = express.Router();


// router.use(apiKey);
// router.use(checkPermission('0000'));

router.post('/product',asyncHandler(uploadController.uploadImageFromUrl));


module.exports = router;