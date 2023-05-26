const bcrypt = require('bcryptjs')
const authorModel = require('../models/authorModel')
const jwt = require('jsonwebtoken')
require('dotenv').config();

const { JWT_SECRET, JWT_EXPIRY } = process.env



const createAuthor = async function (req,res){
    try{
       let data = req.body;
       const saltRounds = 10; // Number of salt rounds
       const hashedPassword = await bcrypt.hash(data.password, saltRounds);
       data.password = hashedPassword;
       console.log(data)
       let authorData = await authorModel.create(data);
       res.status(201).send({ status: true, data: authorData });
   }
   catch(error){
       console.log(error)
       res.status(500).send({ error: "Internal Server Error" });
   }
};




const getAuthor = async function (req,res){
       try{
            const authors = await authorModel.find()
           res.status(200).send({ status:true, authors:authors });
       }
       catch(error){
           console.log(error)
           res.status(500).send({ error: 'Internal Server Error' });
       }
};
   



const login = async(req,res)=>{
    try {
        const { email, password } = req.body

        if(!email || !password ) return res.status(401).json({message : "Please enter email and password"})


        const author = await authorModel.findOne({email}).select('+password')

        if(!author) return res.status(500).json({success : false, message : 'You are not registered'})


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
module.exports.createAuthor = createAuthor;
module.exports.getAuthor = getAuthor;