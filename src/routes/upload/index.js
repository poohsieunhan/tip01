const express = require('express');
const uploadController = require('../../controllers/upload.controller.js');
const { apiKey, checkPermission} = require('../../auth/checkAuth.js');
const asyncHandler = require('../../helpers/asyncHandler.js');
const {authenticationV2 } = require('../../auth/authUltis');
const router = express.Router();
const {uploadDisk,uploadMemory} = require('../../configs/multer.config.js');


// router.use(apiKey);
// router.use(checkPermission('0000'));

router.post('/product',asyncHandler(uploadController.uploadImageFromUrl));
router.post('/thumb', uploadDisk.single('file'), asyncHandler(uploadController.uploadImageFromLocal));
router.post('/product/bucket', uploadMemory.single('file'), asyncHandler(uploadController.uploadImageFromLocalS3));



module.exports = router;