const cloudinary = require('cloudinary');

const User = require("../models/user");
const ApiError = require("../utils/ApiError");
const { roles } = require('../config/roles');
const { adminEmail, systemAdminEmail } = require('../config/constants');


class UserService{
    async createUser(user){
        const newUser = new User(user)
        await newUser.save()

        return newUser
    }

    async getTotalUsers() {
        return User.count();
    }

    async getUsers(userId) {
        return User.find({ _id: { $ne: userId }});
    }

    async getUserByEmail(email){

        const user = await User.findOne({email})

        return user
    }

    async getUserById(id) {
        return await User.findById(id);
    }

    async getAdmin() {
        return await User.findOne({ email: adminEmail}).lean();
    }

    async getSystemAdmin() {
        return await User.findOne({ email: systemAdminEmail }).lean();
    }

    async queryUsers(filter, options) {
        return await User.paginate(filter, options);
    }

    async updateUser(id, updateBody) {

        const user = await User.findById(id).lean();

        if (!user) {
            throw new ApiError(404, 'User not found');
        }


        const updateData = updateBody;
        if (updateBody.avatar) {
            if (user.avatar)  {
                await cloudinary.v2.uploader.destroy(user.avatar.public_id);
            }
        
            const result = await cloudinary.v2.uploader.upload(updateBody.avatar, { folder: 'avatars' });
            updateData.avatar = {
                public_id: result.public_id,
                url: result.secure_url
            };
        }

        return await User.findByIdAndUpdate(
            id,
            {
                $set: updateData
            },
            {
                new: true,
                runValidators: true
            }
        );
    }

    async changeUserStatus(id, status) {
        const user = await User.findById(id);

        if (!user) {
            throw new ApiError(404, 'User not found');
        }

        // TODO: check if the current user is working with other

        user.status = status;
        await user.save();

        return user;
    }

    async promoteToEmployer(id, promoteBody) {
        const user = await User.findById(id).lean();

        if (!user) {
            throw new ApiError(404, 'User not found');
        }

        if (user.roles.includes(roles.EMPLOYER)) {
            throw new ApiError(400, 'Your account already promoted to Employer');
        }

        const userRoles = user.roles;
        userRoles.push(roles.EMPLOYER);
        promoteBody.roles = userRoles;

        return await User.findByIdAndUpdate(id, { $set: promoteBody }, { new: true, runValidators: true });
    }


    async getNumOfCompanies(){
        const users = await User.find({})
        var count = 0
        users.forEach((user) => {
            if (user.roles.includes('employer')){
                count += 1
            }
        })

        return count
    }

}

module.exports = new UserService 