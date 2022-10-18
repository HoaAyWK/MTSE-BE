const User = require("../models/user");
const ApiError = require("../utils/ApiError");
const { roles } = require('../config/roles');

class UserService{
    async createUser(user){
        const newUser = new User(user)
        await newUser.save()

        return newUser
    }

    async getUserByEmail(email){
        const user = await User.findOne({email})

        return user
    }

    async getUserById(id) {
        return await User.findById(id);
    }

    async queryUsers(filter, options) {
        return await User.paginate(filter, options);
    }

    async updateUser(id, updateBody) {
        const { email } = updateBody;
        const user = await User.findById(id).lean();

        if (!user) {
            throw new ApiError(404, 'User not found');
        }

        if (email && (await User.isEmailTaken(email, id))) {
            throw new ApiError(400, 'Email already taken');
        }

        return await User.findByIdAndUpdate(
            id,
            {
                $set: updateBody
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
}

module.exports = new UserService 