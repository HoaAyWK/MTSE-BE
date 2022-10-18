const User = require("../models/user")


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

    
}

module.exports = new UserService