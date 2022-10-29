const categoryService = require('../services/categoryService')
const {ResponseCreateCategory, ResponseCategoryById, ResponseEditCategory} = require("../DTOs/categoryDTO")
const ApiError = require('../utils/ApiError')

class CategoryController{
    async addCategory(req, res, next){
        const response = new ResponseCreateCategory()
        try{
            const category = req.body

            const addedCategory = await categoryService.createCategory(category)

            if (addedCategory){
                response.success = true
                response.category = addedCategory
                response.message = "Create Category Successfully"

                return res.status(200).json(response)
            }

            response.message = "Internal Error Server"
            return res.status(500).json(response)
        }
        catch(error){
            next(error);
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
            next(error);
        }
    }

    async editCategory(req, res, next){
        const response = new ResponseEditCategory()
        try{
            const id = req.params.id
            if (!id){
                response.message = "Invalid Category Id"
                return res.status(400).json(response)
            }

            const editedCategory = await categoryService.editCategory(id, req.body)

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
            next(error);
        }
    }

    async getCategories(req, res, next) {
        try {
            const categories = await categoryService.getCategories();

            res.status(200).json({
                success: true,
                count: categories.length,
                categories
            });
        } catch (error) {
            next(error);
        }
    }

    async getCategoriesNoParentWithChildren(req, res, next) {
        try {
            const categories = await categoryService.getCategoriesNoParentWithChildren();

            res.status(200).json({
                success: true,
                count: categories.length,
                categories
            });
        } catch (error) {
            next(error);
        }
    }

    async getCategoryWithChildren(req, res, next) {
        try {
            const category = await categoryService.getCategoryWithChildrenById(req.params.id);

            if (!category) {
                throw new ApiError(404, 'Category not found');
            }

            res.status(200).json({
                success: true,
                category
            });
        } catch (error) {
            next(error);
        }
    }

    async deleteCategory(req, res, next) {
        try {
            const id = req.params.id;
            await categoryService.deleteCategory(id);

            res.status(200).json({
                success: true,
                message: `Deleted category with id: ${id}`
            });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new CategoryController