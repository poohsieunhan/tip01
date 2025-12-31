'use strict';

const { SuccessResponse } = require("../core/success.response");
const { roleList,createResource,createRole, resourceList } = require("../services/rbac.service");

const newRole = async (req, res, next) => {
    new SuccessResponse({
        message: "Create Role Successfully",
        metadata: await createRole(req.body)
    }).send(res)
}

const newResource = async (req, res, next) => {
    new SuccessResponse({
        message: "Create Resource Successfully",
        metadata: await createResource(req.body)
    }).send(res)
}

const listRoles = async (req, res, next) => {
    new SuccessResponse({
        message: "List Roles Successfully",
        metadata: await roleList(req.query)
    }).send(res)
}

const listResources = async (req, res, next) => {
    new SuccessResponse({
        message: "List Resources Successfully",
        metadata: await resourceList(req.query)
    }).send(res)
}

module.exports = {
    newRole,
    newResource,
    listRoles,
    listResources
}
