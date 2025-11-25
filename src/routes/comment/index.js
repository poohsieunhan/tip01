'use strict';

const express = require('express');
const CommentController = require('../../controllers/comment.controller.js');
const { apiKey, checkPermission} = require('../../auth/checkAuth.js');
const asyncHandler = require('../../helpers/asyncHandler.js');
const {authenticationV2 } = require('../../auth/authUltis');
const router = express.Router();

router.use(authenticationV2)

router.post('/create',asyncHandler(CommentController.createComment));
router.get('',asyncHandler(CommentController.getCommentsByParentId));
router.delete('/',asyncHandler(CommentController.deleteComment));

module.exports = router;