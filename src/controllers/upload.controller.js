'use strict'

const UploadImageFromUrlService = require("../services/upload.service")
const {SuccessResponse} = require("../core/success.response")

class UploadController {
    uploadImageFromUrl = async (req,res,next) => {
        new SuccessResponse({
            message:"Upload image from url successfully",
            metadata: await UploadImageFromUrlService.UploadImageFromUrlService()
        }).send(res)
    }
}

module.exports = new UploadController()