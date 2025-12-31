'use strict';

const express = require('express')
const router = express.Router()
const ProfileController = require('../../controllers/profile.controller');
const { grantAccess } = require('../../middleware.js/rbac.js');

router.get('/viewAny',grantAccess('readAny','profile') ,ProfileController.profiles);
router.get('/viewOne', grantAccess('readOwn','profile'), ProfileController.profile);

module.exports = router