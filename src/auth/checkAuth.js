'use strict'

const HEADER = {
    API_KEY: 'x-api-key',
    AUTHORIZATION:'authorization'
}

const {findById} = require('../services/apikey.service');

const apiKey = async (req, res, next) => {
    try {
        const key = req.headers[HEADER.API_KEY]?.toString();
        if (!key) {
            return res.status(403).json({
                code: '403',
                message: 'Forbidden Error: API key is missing'
            });
        }

        const objKey = await findById(key);
        if (!objKey) {
            return res.status(403).json({
                code: '403',
                message: 'Forbidden Error: Invalid API key'
            });
        }

        req.objKey = objKey;
        next();
    } catch (error) {
        
    }
}

const checkPermission = (permission) => {
    return async (req, res, next) => {
        try {
            const objKey = req.objKey;
            if (!objKey || !objKey.permission.includes(permission)) {
                return res.status(403).json({
                    code: '403',
                    message: 'Permission Denied: You do not have the required permission'
                });
            }
            next();
        } catch (error) {
            return res.status(403).json({
                code: '403',
                message: error.message
            });
        }
    }
}

const asyncHandler = (fn) => {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};

module.exports = {
    apiKey,
    checkPermission,
    asyncHandler
}