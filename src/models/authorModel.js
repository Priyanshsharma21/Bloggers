const mongoose = require('mongoose')
const validator = require('validator');

const {
    Schema,
    model
} = mongoose


const authorSchema = new Schema({
    fname: {
        type: String,
        required: true
    },
    lname: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true,
        enum: ['Mr', 'Mrs', 'Miss']
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate: [{ validator: validator.isEmail, message: 'Please enter email in correct format' }]
    },
    password: {
        type: String,
        required : [true, 'Please enter your password'],
        minLength : [8,'Password length should be greater than 8 characters'],
    }
},{timestamps : true})


module.exports = model('Author', authorSchema)