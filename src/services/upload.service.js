'use strict';

const cloudinary = require('../configs/cloudinary.config');
const {s3,PutObjectCommand, GetObjectCommand} = require('../configs/s3.config');
const crypto = require('crypto');
// const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const { getSignedUrl } = require('@aws-sdk/cloudfront-signer');
const _urlPublic = 'https://d16iqvqiqtxned.cloudfront.net';
const randomImgName = () => {
    return crypto.randomBytes(16).toString('hex');
}

const uploadImageFromLocalS3 = async({file}) => {
    try {
        const imageName = randomImgName();
        const command = new PutObjectCommand({
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: imageName, // file.originalname,
            Body: file.buffer,
            ContentType: 'image/jpeg'
        });
        const result = await s3.send(command);

        console.log(result);
        // const signedUrl = new GetObjectCommand({
        //     Bucket: process.env.AWS_BUCKET_NAME,
        //     Key: imageName
        // });

        // const _url = await getSignedUrl(s3, signedUrl, { expiresIn: 3600 });
        const _url = getSignedUrl({
            url: `${_urlPublic}/${imageName}`,
            keyPairId:'KA120XXC7KV6W',
            dateLessThan: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
            privateKey: process.env.AWS_BUCKET_PUBLIC_KEY_ID,
        })

        return {
            _url,//image_url: `https://${_urlPublic}.cloudfront.net/${imageName}`,
            result
        }
        // return {
        //     image_url: result.secure_url,
        //     shop_Id:8409,
        //     thumb_url: await cloudinary.url(result.public_id, {
        //         width: 100, height: 100, crop: 'fill', format: 'jpg'
        //     })
        // }
    } catch (error) {
        console.error(error);
    }
}




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
    UploadImageFromLocalService,
    uploadImageFromLocalS3
};