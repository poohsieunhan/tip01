const userModel = require('../models/user.model');

const createUser = async ({
    user_id,
    user_slug,
    user_name,
    user_password,
    user_role
}) => {
    const user = await userModel.create({
        user_id,
        user_slug,
        user_name,
        user_password,
        user_role
    });
    return user;
}

module.exports = {
    createUser

}