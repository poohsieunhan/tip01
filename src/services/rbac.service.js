'use strict';
const { create } = require('lodash');
const Resource = require('../models/resource.model.js');
const Role = require('../models/role.model.js');

const createResource = async ({
    name='profile',
    slug='000001',
    description=''
}) => {
    try {
        const resource = await Resource.create({
            src_name: name,
            src_slug: slug,
            src_description: description
        })
        return resource;
    } catch (error) {
        return error;
    }
}

const resourceList = async ({
    userId=0,
    limit=30,
    offset=0,
    search=''
}) => {
    try {
        const _resources = await Resource.aggregate([
            {
                $project: {
                    _id:0,
                    name:'$src_name',
                    slug:'$src_slug',
                    description:'$src_description',
                    resourceId:'$_id',
                    createdAt:1
                }
            }             
        ]);
        return _resources;
    } catch (error) {
        return []
    } 
}

const createRole = async ({
    name='shop',
    slug='S00001',
    description='',
    grants=[]
}) => {
    try {
        const role = await Role.create({
            role_name: name,
            role_slug: slug,
            role_description: description,
            role_grants: grants
        })
        return role;
    } catch (error) {
        return error;
    }
}

const roleList = async ({
    userId=0,
    limit=30,
    offset=0,
    search=''
}) => {
    try {
        const roles = await Role.aggregate([
            {
                $unwind: '$role_grants'
            },
            {
                $lookup: {
                    from: 'Resources',
                    localField: 'role_grants.resource',
                    foreignField: '_id',
                    as: 'resource'
                }
            },
            {
                $unwind: '$resource'
            },
            {
                $project: {
                    role:'$role_name',
                    resource:'$resource.src_name',
                    action:'$role_grants.actions',
                    attribute:'$role_grants.attribute'
                }
            },
            {
                $unwind: '$action'
            },
            {
                $project: {
                    role:1,
                    resource:1,
                    action:'$action',
                    attribute:1
                }
            }
           
        ])
        return roles;
    } catch (error) {
        return []    
    }
}

module.exports = {
    createResource,
    resourceList,
    createRole,
    roleList
}