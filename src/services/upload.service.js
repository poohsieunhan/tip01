'use strict';

const cloudinary = require('../configs/cloudinary.config');

const UploadImageFromUrlService = async () => {
    try {
        const urlImage = 'https://res.cloudinary.com/demo/image/upload/w_300,h_300,c_fill,g_auto/sample.jpg';
        const folderName = 'product/shopId', newFileName = 'custom_name_image';
        const result = await cloudinary.uploader.upload(urlImage, {
            folder: folderName,
            public_id: newFileName
        });
        console.log(result);
        return result;
    } catch (error) {
        console.error(error);   
    }
};

const UploadImageFromLocalService = async ({
    path,
    folderName='product/8409'
}) => {
    try {
        const result = await cloudinary.uploader.upload(path, {
            folder: folderName,
            public_id: 'thumb'
        });
        console.log(result);
        return {
            image_url: result.secure_url,
            shop_Id:8409,
            thumb_url: await cloudinary.url(result.public_id, {
                width: 100, height: 100, crop: 'fill', format: 'jpg'
            })
        }
    } catch (error) {
        console.error(error);   
    }
};

module.exports = {
    UploadImageFromUrlService,
    UploadImageFromLocalService
};