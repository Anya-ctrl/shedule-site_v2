import models from '../models/index.js'
import bcrypt from "bcryptjs"

async function createNewUser(user) {
    try {
        const emailExists = await checkEmailUser(user);
        
        if (emailExists) {
            throw new Error(`This email ${user.email} has already existed.`);
        } else {
            let salt = bcrypt.genSaltSync(10);
            user.password = bcrypt.hashSync(user.password, salt);

            const USER = await models.User.create(user);

            return USER;
        }
    } catch (error) {
        throw error;
    }
}

async function checkEmailUser(userCheck) {
    try {

        const currentUser = await models.User.findOne({
            where: {
                email: userCheck.email
            }
        });

        return !!currentUser;
    } catch (error) {
        throw error;
    }
}

export default {
    createNewUser
}