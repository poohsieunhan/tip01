const express = require('express');
const accessController = require('../../controllers/accesscontroller.js');
const { apiKey, checkPermission } = require('../../auth/checkAuth.js');
const router = express.Router();

router.use(apiKey)
router.use(checkPermission('0000')) 

router.post('/shop/signup',accessController.signUp);

module.exports = router;