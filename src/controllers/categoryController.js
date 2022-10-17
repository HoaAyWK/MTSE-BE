const categoryService = require('../services/categoryService')
const {ResponseCreateCategory, ResponseCategoryById} = require("../DTOs/categoryDTO")

class CategoryController{
    async addCategory(req, res){
        const response = new ResponseCreateCategory()
        try{
            const category = req.body

            const addedCategory = await categoryService.createCategory(category)

            if (addedCategory){
                if (category.parent){
                    const updatedParentCategory = await categoryService.addChild(category.parent, addedCategory._id)
                    if (!updatedParentCategory){
                        response.messgae = "Not Found Category Parent"
                        return res.status(400).json(response)
                    }
                }
                response.success = true
                response.category = addedCategory
                response.message = "Create Category Successfully"

                return res.status(200).json(response)
            }

            response.message = "Internal Error Server"
            return res.status(500).json(response)
        }
        catch(error){
            response.messgage = error
            return res.status(500).json(response)
        }
    }

    async getCategoryById(req, res){
        const response = new ResponseCategoryById()
        try{
            const id = req.params.id
            if (!id){
                response.message = "Invalid Category Id"

                return res.status(400).json(response)
            }

            const category = await categoryService.getCategoryById(id)
            response.category = category
            return res.status(200).json(response)
        }
        catch(error){

        }
    }
}

module.exports = new CategoryController