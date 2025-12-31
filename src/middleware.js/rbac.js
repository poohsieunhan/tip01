'use strict';
const rbac = require('./role.middleware.js');
const {AuthenticationError} = require('../core/error.response');
const {roleList} = require("../services/rbac.service");

const grantAccess = (action, resource) => {
    return async (req, res, next) => {
        try {
            rbac.setGrants(await roleList({
                userId:9999
            }))
            const role_name = req.query.role; // Lấy role từ query parameter
            const permission = rbac.can(role_name)[action](resource);
            if (!permission.granted) {
                throw new AuthenticationError('You do not have enough permission to perform this action');
            }
            next();
        }catch (error) {
            next(error);
        }
    }
}

module.exports = {
    grantAccess
}