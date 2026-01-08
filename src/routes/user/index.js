'use strict'

const express = require('express')
const router = express.Router()
const asyncHandler = require('../../helpers/asyncHandler.js');
const UserController = require('../../controllers/user.controller');




router.post('/new_user',asyncHandler(UserController.newUser))
router.get('/check_register_email_token',asyncHandler(UserController.checkRegisterEmailToken)

module.exports = router;