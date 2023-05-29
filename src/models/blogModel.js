const mongoose = require('mongoose')


const { Schema, model } = mongoose


const blogSchema = new Schema({
    title : {
        type: String,
        required: true
    },
    body : {
        type: String,
        required: true
    },
    authorId : {
        type : Schema.Types.ObjectId,
        ref : 'Author',
        required: true
    },
    tags : [{type : String}],
    category : {type : String, required: true},
    subcategory : [{type : String}],

    deletedAt: { type: Date , default : ""},
    isDeleted: { type: Boolean, default: false },
    publishedAt: { type: Date , default : "" },
    isPublished: { type: Boolean, default: false }

},{ timestamps: true })


module.exports = model('Blog', blogSchema)