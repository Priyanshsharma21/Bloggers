const bcrypt = require('bcryptjs')
const authorModel = require('../models/authorModel')
const jwt = require('jsonwebtoken')
require('dotenv').config();

const { JWT_SECRET, JWT_EXPIRY } = process.env

// const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
const createAuthor = async function (req, res) {
    try {
        let author = req.body
        const {title , fname , lname , email , password} = author;
        if(Object.keys(author).length == 0) {res.status(400).send({status:false, msg:"Enter the Author details"})}
        //checking for
        if (!title) { return res.status(400).send({ status: false, msg: "title is required" }) }

        if (!fname) { return res.status(400).send({ status: false, msg: "author first name is required" }) }

        if (!lname) { return res.status(400).send({ status: false, msg: "author last name is required" }) }

        if (!email) { return res.status(400).send({ status: false, msg: "email is required" }) }

        if (!password) { return res.status(400).send({ status: false, msg: "password is required" }) }

        
        if (!isValid(title)) { return res.status(400).send({ status: false, msg: "title is invalid" }) }
        if( !["Mr", "Mrs", "Miss"].includes(title)) return res.status(400).send({ status: false, msg: "title should be Mr,Miss,Mrs" })
          
        if (!isValid(fname)) { return res.status(400).send({ status: false, msg: "author first name is not valid " }) }
        if (!validString(fname)) { return res.status(400).send({ status: false, msg: "author first name is not valid string" }) }

        if (!isValid(lname)) { return res.status(400).send({ status: false, msg: "author last name is not valid " }) }
        if (!validString(lname)) { return res.status(400).send({ status: false, msg: "author last name is not valid string" }) }

        if (!isValid(password)) { return res.status(400).send({ status: false, msg: "password name is not valid" }) }
        

        if(!validateEmail(email)) { return res.status(400).send({status:false, msg:"Enter the valid email"})}
        const uniqueMail = authorModel.findOne({email : email});
        if(uniqueMail) return res.status(400).send({status : false , msg : "this email already exist"});
        
        const saltRounds = 10; // Number of salt rounds
        const hashedPassword = await bcrypt.hash(data.password, saltRounds);
        author.password = hashedPassword;

        let authorCreated = await authorModel.create(author)
        res.status(201).send({ status:true,data: authorCreated })
        }
     catch (err) { return res.status(500).send({ status: false, msg: err.message }) }

}

// const createAuthor = async function (req,res){
//     try{
//        let data = req.body;
//        const saltRounds = 10; // Number of salt rounds
//        const hashedPassword = await bcrypt.hash(data.password, saltRounds);
//        data.password = hashedPassword;
//        console.log(data)
//        let authorData = await authorModel.create(data);
//        res.status(201).send({ status: true, data: authorData });
//    }
//    catch(error){
//        console.log(error)
//        res.status(500).send({ error: "Internal Server Error" });
//    }
// };




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