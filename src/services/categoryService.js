const categorySchema = require("../models/category")

class CategoryService{
    async createCategory(category){
        const newCategory = new categorySchema(category)

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
        const newCategory = await categorySchema.findOneAndUpdate({_id: category._id}, {children: lstChildren})

        return newCategory
    }

    async getCategoryById(categoryId){
        const category = await categorySchema.findById(categoryId)
        return category
    }

    async editCategory(categoryId ,name, parent){
        const category = await categorySchema.findById(categoryId)

        if (!category){
            return null
        }

        await categorySchema.findByIdAndUpdate(category._id, {name, parent, updatedAt: Date.now()})
        const editedCategory = await categorySchema.findById(categoryId)
        return editedCategory
    }
}

module.exports = new CategoryService