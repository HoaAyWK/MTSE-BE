const userSchema = require("../models/user")


class UserService{
    async createUser(user){
        const newUser = new userSchema(user)
        await newUser.save()

        return newUser
    }

    async getUserByEmail(email){
        const user = await userSchema.findOne({email})

        return user
    }
}

module.exports = new UserService