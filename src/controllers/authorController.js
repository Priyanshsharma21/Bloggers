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
       let authorData = await authorModel.create(data);
       res.status(200).send({ status: true, Data: authorData });
   }
   catch(error){
       console.log(error)
       res.status(500).send({ error: "Internal Server Error" });
   }
   };
   
   const getAuthor = async function (req,res){
       try{
           const { email } = req.body;
           const authorData = await authorModel.findOne({ email }).select({ password: 0 });
       
           if (!authorData) {
             return res.status(404).send({ status:false, message: 'Author not found' });
           }
           
           else if (authorData.isDeleted == true) {
           return res.status(403).send({ status: false, msg: "User is deleted" });
           }
       
           res.status(200).send({ status:true, result:authorData });
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
module.exports.createAuthor = createAuthor;
module.exports.getAuthor = getAuthor;