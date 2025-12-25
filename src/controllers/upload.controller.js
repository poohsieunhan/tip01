'use strict'

const {UploadImageFromUrlService, UploadImageFromLocalService} = require("../services/upload.service")
const {SuccessResponse} = require("../core/success.response")
const {BadRequestError} = require("../core/error.response")

class UploadController {
    uploadImageFromUrl = async (req,res,next) => {
        new SuccessResponse({
            message:"Upload image from url successfully",
            metadata: await UploadImageFromUrlService()
        }).send(res)
    }

    uploadImageFromLocal = async (req,res,next) => {
        const {file} = req
        if(!file) {
            throw new BadRequestError("No file uploaded")
        }
        new SuccessResponse({
            message:"Upload image from local successfully",
            metadata: await UploadImageFromLocalService({file})            
        }).send(res)
    }
}

module.exports = new UploadController()