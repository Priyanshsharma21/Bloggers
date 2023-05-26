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
        minLength : [7,'Password length should be greater than 7 characters'],
        validate: {
            validator: (value) => {
                const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{7,}$/;
                return passwordRegex.test(value);
            },
            message: 'Please enter a strong password with at least 7 characters, 1 uppercase letter, and 1 special symbol'
        }
    }
},{timestamps : true})


module.exports = model('Author', authorSchema)