const bcrypt = require('bcryptjs')
const authorModel = require('../models/authorModel')
const jwt = require('jsonwebtoken')
require('dotenv').config();

const { JWT_SECRET, JWT_EXPIRY } = process.env



const login = async(req,res)=>{
    try {
        const { email, password } = req.body

        if(!email || !password ) return res.status(401).json({message : "Please enter email and password"})


        const author = await authorModel.findOne({email}).select('+password')

        if(!author) return next(new CustomError('You are not registered', 400))


        const isValidAuthor = bcrypt.compare(password, author.password)

        if(isValidAuthor){
            const token = jwt.sign({id : author._id}, JWT_SECRET,{
                expiresIn : JWT_EXPIRY
            })


            res.status(200).json({success : true, data : {token}, author : author})
        }


    } catch (error) {
        console.log(error)
        res.status(500).json({message : "Error Occure"})
    }
}



module.exports.login = login