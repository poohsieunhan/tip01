'user strict';
const {SuccessResponse } = require('../core/success.response');

const dataProfile = [
    {usr_id:1, usr_name:'John Doe',usr_avatar:'image/usr/1'},
    {usr_id:2, usr_name:'Jane Smith',usr_avatar:'image/usr/2'},
    {usr_id:3, usr_name:'Bob Johnson',usr_avatar:'image/usr/3'},
]

class ProfileController {
    profiles = async (req, res, next) => {
        new SuccessResponse({
            message: "Get profile successfully",
            metadata: dataProfile
        }).send(res)
    }

    profile = async (req, res, next) => {
        new SuccessResponse({
            message: "Get one successfully",
            metadata: {usr_id:2, usr_name:'Jane Smith',usr_avatar:'image/usr/2'},
        }).send(res)
    }
}

module.exports = new ProfileController();  