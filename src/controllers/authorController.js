// const bcrypt = require('bcryptjs')
const bcrypt = require('bcrypt')
const authorModel = require('../models/authorModel')
const jwt = require('jsonwebtoken')
require('dotenv').config();

const { JWT_SECRET, JWT_EXPIRY } = process.env

function isValid (data) {
    if(typeof data !== "string" || data.trim().length == "") return false
    else return true
}

function validString(input){
    
    return (/^[a-zA-Z]+$/.test(input))
}

const validateEmail = (email) => {
    return email.match(/^[a-zA-Z0-9.+_-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,15}$/);
};

// const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

const createAuthor = async function (req, res) {
    try {
        let author = req.body
        const { title, fname, lname, email, password } = author;
        if (Object.keys(author).length == 0) { res.status(400).send({ status: false, msg: "Enter the Author details" }) }
        
        //checking for required fields
        if (!title) { return res.status(400).send({ status: false, msg: "title is required" }) }

        if (!fname) { return res.status(400).send({ status: false, msg: "author first name is required" }) }

        if (!lname) { return res.status(400).send({ status: false, msg: "author last name is required" }) }

        if (!email) { return res.status(400).send({ status: false, msg: "email is required" }) }

        if (!password) { return res.status(400).send({ status: false, msg: "password is required" }) }

        // validatiing the required feilds
        if (!isValid(title)) { return res.status(400).send({ status: false, msg: "title is invalid" }) }
        if (!["Mr", "Mrs", "Miss"].includes(title)) return res.status(400).send({ status: false, msg: "title should be Mr,Miss,Mrs" })

        if (!isValid(fname)) { return res.status(400).send({ status: false, msg: "author first name is not valid " }) }
        if (!validString(fname)) { return res.status(400).send({ status: false, msg: "author first name is not valid string" }) }

        if (!isValid(lname)) { return res.status(400).send({ status: false, msg: "author last name is not valid " }) }
        if (!validString(lname)) { return res.status(400).send({ status: false, msg: "author last name is not valid string" }) }

        if (!isValid(password)) { return res.status(400).send({ status: false, msg: "password name is not valid" }) }

        if (!validateEmail(email)) { return res.status(400).send({ status: false, msg: "Enter the valid email" }) }

        //checking for unique mail
        const uniqueMail = await authorModel.findOne({ email: email });
        if (uniqueMail) return res.status(400).send({ status: false, msg: "this email already exist" });

        const saltRounds = 10; // Number of salt rounds
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        author.password = hashedPassword;

        let authorCreated = await authorModel.create(author)
        res.status(201).send({ status: true, data: authorCreated })
    }
    catch (err) { return res.status(500).send({ status: false, msg: err.message }) }

}




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

        if(!email || !password ) return res.status(400).json({message : "Please enter email and password"})

        console.log(email)
        const author = await authorModel.findOne({email : email})//.select('+password')
        if(!author) return res.status(400).json({success : false, message : 'You are not registered'})
        console.log(author.password)

        const isValidAuthor =  bcrypt.compareSync(password, author.password)
        console.log(isValidAuthor)
        if(isValidAuthor){
            const token = jwt.sign({id : author._id}, JWT_SECRET,{
                expiresIn : JWT_EXPIRY
            })

            res.status(200).json({success : true, data : {token}, author : author})
        }else {
            return res.status(401).send({status : false , msg : "not a authenticate user"})
        }

    } catch (error) {
        console.log(error)
        res.status(500).json({message : "Error Occured"})
    }
}



module.exports.login = login
module.exports.createAuthor = createAuthor;
module.exports.getAuthor = getAuthor;