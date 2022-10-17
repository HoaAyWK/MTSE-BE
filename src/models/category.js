const mongoose = require('mongoose')
const Schema = mongoose.Schema


const CategorySchema = new Schema({
    name: {
        type: String,
        required: true
    },
    parent: {
        type: Schema.Types.ObjectId,
        ref: 'categories'
    },
    children: {
        type: [{type: Schema.Types.ObjectId, ref: "categories"}],
        required: true,
        default: []
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    updatedAt: {
        type: Date,
        default: Date.now()
    }

})

module.exports = mongoose.model('categories', CategorySchema)