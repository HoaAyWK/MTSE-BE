const userService = require('../services/userService')
const {ResponseRegisterUser} = require("../DTOs/userDTO")



class UserController{
    async registerUser(req, res){
        var response = new ResponseRegisterUser()
        try{
            const user = req.body

            const existedUser = await userService.getUserByEmail(user.email)

            if (existedUser){
                response.message = "Existed Email"
                return res.status(200).json(response)
            }

            const addedUser = await userService.createUser(user)

            if (addedUser){
                response.user = addedUser
                response.success = true
                response.message = "Register User Successfully"
                return res.status(200).json(response)
            }
            response.message = "Register User Failed"
            return res.status(200).json(response)
        }
        catch(error){
            response.message = "Internal Error Server"
            return res.status(500).json(response)
        }
    }
}

module.exports = new UserController