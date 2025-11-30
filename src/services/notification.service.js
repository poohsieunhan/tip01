'use strict'
const { create } = require('lodash');
const NotificationModel = require('../models/notification.model');

const pushNotiToSystem = async ({
    type='SHOP-001',
    receiverId=1,
    senderId=1,
    options={},
}) => {
    let noti_content

    if(type === 'ORDER-001'){
        noti_content = `You have a new order #${options.orderId}`;
    } else if(type === 'ORDER-002'){
        noti_content = `Your order #${options.orderId} has been shipped`;
    }

    const newNoti = await NotificationModel.create({
        noti_type: type,
        noti_content,
        noti_receiverId: receiverId,
        noti_senderId: senderId,
        noti_options: options
    });
    return newNoti;
}

const listNotiByUser = async ({ 
    userId = 1, type='ALL',isRead=0
}) => {
    const match = {
        noti_receiverId: userId
    }
    if(type !== 'ALL'){
        match['noti_type'] = type
    }
    return await NotificationModel.aggregate([
        { $match: match },
        { $project: {
            noti_type: 1,
            noti_senderId: 1,
            noti_receiverId: 1,
            noti_content: {
            $concat: [
                {
                $substr: ['$noti_options.shop_name', 0, -1]
            },
            'vừa thêm sp mới:',
            {
                $substr: ['$noti_options.produc_name', 0, -1]
            },
                ]
            },
            createdAt: 1, 
            noti_options: 1,
            }
        }
    ]);
}
    
module.exports = {
    pushNotiToSystem,
    listNotiByUser
}   