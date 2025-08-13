'use strict'

const HEADER = {
    API_KEY: 'x-api-key',
    AUTHORIZATION:'authorization'
}

const {findById} = require('../services/apikey.service');

const apiKey = async (req, res, next) => {
    try {
        console.log(`=== API Key Middleware ===`);
        console.log(`Headers:`, req.headers);
        console.log(`API Key:`, req.headers[HEADER.API_KEY]);
        
        const key = req.headers[HEADER.API_KEY]?.toString();
        if (!key) {
            console.log(`API key is missing`);
            return res.status(403).json({
                code: '403',
                message: 'Forbidden Error: API key is missing'
            });
        }

        const objKey = await findById(key);
        if (!objKey) {
            console.log(`Invalid API key:`, key);
            return res.status(403).json({
                code: '403',
                message: 'Forbidden Error: Invalid API key'
            });
        }

        console.log(`API key valid, objKey:`, objKey);
        req.objKey = objKey;
        next();
    } catch (error) {
        console.error(`API Key Middleware Error:`, error);
    }
}

const checkPermission = (permission) => {
    return async (req, res, next) => {
        try {
            console.log(`=== Check Permission Middleware ===`);
            console.log(`Required permission:`, permission);
            console.log(`objKey:`, req.objKey);
            
            const objKey = req.objKey;
            if (!objKey || !objKey.permission.includes(permission)) {
                console.log(`Permission denied`);
                return res.status(403).json({
                    code: '403',
                    message: 'Permission Denied: You do not have the required permission'
                });
            }
            
            console.log(`Permission granted, proceeding...`);
            next();
        } catch (error) {
            console.error(`Permission Middleware Error:`, error);
            return res.status(403).json({
                code: '403',
                message: error.message
            });
        }
    }
}



module.exports = {
    apiKey,
    checkPermission
}