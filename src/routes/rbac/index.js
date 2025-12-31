'use strict';

const express = require('express')
const router = express.Router()
const RbacController = require('../../controllers/rbac.controller');

router.post('/role', RbacController.newRole);
router.post('/resource', RbacController.newResource);
router.get('/roles', RbacController.listRoles);
router.get('/resources', RbacController.listResources);

module.exports = router;
