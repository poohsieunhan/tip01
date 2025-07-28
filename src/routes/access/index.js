const express = require('express');
const accessController = require('../../controllers/accesscontroller.js');
const router = express.Router();

router.post('/shop/signup',accessController.signUp);

module.exports = router;