const categoryService = require('../services/categoryService')
const {ResponseCreateCategory, ResponseCategoryById, ResponseEditCategory} = require("../DTOs/categoryDTO")

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

    async editCategory(req, res){
        const response = new ResponseEditCategory()
        try{
            const {name, parent} = req.body

            const id = req.params.id
            if (!id){
                response.message = "Invalid Category Id"
                return res.status(400).json(response)
            }

            const editedCategory = await categoryService.editCategory(id, name, parent)

            if (!editedCategory){
                response.message = "Category Not Found"
                return res.status(404).json(response)
            }

            response.success = true
            response.message = "Edit Category Successfully"
            response.category = editedCategory

            return res.status(200).json(response)
        }
        catch(error){
            response.message = "Error Internal Server"

            return res.status(500).json(response)
        }
    }
}

module.exports = new CategoryController