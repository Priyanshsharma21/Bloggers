const authorModel = require('../models/authorModel.js')
const blogModel = require('../models/blogModel.js')
const jwt = require('jsonwebtoken');
require('dotenv').config();

const {
    JWT_SECRET
} = process.env


const isLoggedIn = async (req, res, next) => {
    try {
        const token = req.headers['X-Api-Key'] || req.headers['x-api-key']
        console.log(token)
        if (!token) return res.status(404).json({
            Message: "Token Not Found"
        })

        const decoded = jwt.verify(token, JWT_SECRET)
        console.log(decoded)
        console.log(decoded.id)
        if(decoded == null) return res.status(401).send({ status: false, msg: "Invalid Token Authentication failed" })

        const author = await authorModel.findById(decoded.id)

        if (!author) {
            return res.status(401).json({
                message: 'Unauthorized access'
            });
        }

        next()

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
            err : error
            
        })
    }
}



const authorization = async function (req, res, next) {
    try {
        let token = req.headers["x-api-key"]
        const decoded = jwt.verify(token, JWT_SECRET)
        console.log(decoded)

        let decodedAuthor = decoded.id
        let blogId = req.params.blogId

        //get author Id by searching in database 
        let getBlog = await blogModel.findById(blogId)

        if (getBlog == null) return res.status(404).send({ status: false, msg: "Blog not found" });

        let author = getBlog.authorId.toString()
        console.log(decodedAuthor);
        console.log(author)
        if (decodedAuthor !== author) return res.status(400).send({ status: false, msg: "You are not authorised to perform this action" })
        next();

    } catch (error) {
        res.status(500).send({ status: false, error: error.message })
    }
}

// const isLoggedIn = async (req, res, next) => {
//     try {
//         // const token = req.headers.authorization.split(" ")[1] || req.headers['x-api-key']
//         const token = req.headers['X-Api-Key'] || req.headers['x-api-key']
//         console.log(token)
//         if (!token) return res.status(404).json({
//             Message: "Token Not Found"
//         })

//         const decoded = jwt.verify(token, JWT_SECRET)
//         if(!decoded) return res.status(401).send({ status: false, msg: "Invalid Token Authentication failed" })
//         console.log(decoded._id)

//         const author = await authorModel.findById(decoded._id)

//         if (!author) {
//             return res.status(401).json({
//                 message: 'Unauthorized access'
//             });
//         }

//         const {blogId} = req.params; 
//         if(blogId){
//             const blog = await blogModel.findOne({
//                 _id: blogId
//             });
    
//             if (!blog || blog.authorId.toString() !== author._id.toString()) {
//                 return res.status(401).json({
//                     message: 'Unauthorized access'
//                 });
//             }
    
//         }

//         req.author = author

//         next()

//     } catch (error) {
//         // console.log(error)
//         res.status(500).json({
//             success: false,
//             message: "Internal Server Error",
//             err : error
            
//         })
//     }
// }



module.exports.isLoggedIn = isLoggedIn
module.exports.authorization = authorization;