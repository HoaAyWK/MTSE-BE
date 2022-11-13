const Category = require("../models/category");
const ApiError = require("../utils/ApiError");
const jobService = require('./jobService');

class CategoryService{
    async createCategory(category){
        const { parent } = category;
        let parentCategory = undefined;


        const newCategory = new Category(category)

        if (parent) {
            parentCategory = await Category.findById(parent);

            if (!parentCategory) {
                throw new ApiError(404, 'Parent category not found')
            }

            parentCategory.children.push(newCategory.id);
            await parentCategory.save();
        }

        await newCategory.save()

        return newCategory
    }

    async addChild(categoryParentId, categoryChildId){
        const category = await this.getCategoryById(categoryParentId)
        if (!category){
            return null
        }

        const lstChildren = category.children

        lstChildren.push(categoryChildId)
        const newCategory = await Category.findOneAndUpdate({_id: category.id}, {children: lstChildren})

        return newCategory
    }

    async getCategoryById(categoryId){
        const category = await Category.findById(categoryId)
        return category
    }

    async editCategory(categoryId, updateBody){
        const { name, parent } = updateBody;
        const category = await Category.findById(categoryId)

        if (!category){
            throw new ApiError(404, 'Category not found');
        }

        if (name) {
            const nameExist = await Category.findOne({ name, _id: { $ne: categoryId } }).lean();

            if (nameExist) {
                throw new ApiError(404, `Category with name: ${name} already exists`);
            }
        }

        let parentCategory = undefined;

        if (parent) {
            parentCategory = await Category.findById(parent);

            if (!parentCategory) {
                throw new ApiError(404, 'Parent category not found');
            }

            if (category.children.length > 0) {
                throw new ApiError(400, `Cannot attach this category to another category because it already has children's category`);
            }
        }

        const updatedCategory = await Category.findByIdAndUpdate(
            categoryId,
            {
                $set: updateBody
            },
            {
                new: true,
                runValidators: true
            }
        );

        if (parentCategory) {
            parentCategory.children.push(updatedCategory.id);
            await parentCategory.save();
        }
    
        return updatedCategory;
    }

    async deleteCategory(id) {
        const category = await Category.findById(id);

        if (!category) {
            throw new ApiError(404, 'Category not found');
        }

        if (category.children.length > 0) {
            throw new ApiError(400, `Please delete all this children's category first!`);
        }

        const jobsCount = await jobService.countJobsByCategory(id);

        if (jobsCount > 0) {
            throw new ApiError(400, 'This category already have jobs')
        }

        if (category.parent) {
            const parentCategory = await Category.findById(category.parent);

            if (!parentCategory) {
                throw new ApiError(404, 'Parent category not found');
            }

            parentCategory.children = parentCategory.children.filter(item => item.toString() !== id);
            await parentCategory.save();
        }

        await category.remove();
    }

    async getCategories() {
        return Category.find().populate('parent');
    }

    async getCategoryWithChildrenById(id) {
        return Category.findById(id).populate('children');
    }

    async getCategoriesNoParentWithChildren() {
        return Category.find({ parent: undefined }).populate('children');
    }

    async getCategoriesIntro(limit){
        const allCategories = await Category.find({parent: null})
        return allCategories.slice(0, limit)
    }

    async filterCategoriesByName(name){
        const categories = await Category.find({'name': new RegExp(name)})
        return categories
    }

    async getAllCategories(){
        return await Category.find()
    }

}

module.exports = new CategoryService