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

        if (!token) return res.status(404).json({
            Message: "Token Not Found"
        })

        jwt.verify(token, JWT_SECRET, async(error, decoded) => {
            if (error) {
                return res.status(401).json({
                    status: false,
                    message: "Invalid Token Authentication failed"
                });
            }

            const author = await authorModel.findById(decoded.id);

            if (!author) {
                return res.status(401).json({
                    message: 'Unauthorized access'
                });
            }

            req.iD = author._id;
            next();
        });

    } catch (error) {
        console.log(error)
        res.status(500).json({
            status: false,
            message: "Internal Server Error",
        })
    }
}


const authorization = async function (req, res, next) {
    try {
        let token = req.headers["x-api-key"]
        const decoded = jwt.verify(token, JWT_SECRET)

        let decodedAuthor = decoded.id
        let blogId = req.params.blogId

        //get author Id by searching in database 
        let getBlog = await blogModel.findById(blogId)

        if (getBlog == null) return res.status(404).send({
            status: false,
            message: "Blog not found"
        });

        let author = getBlog.authorId.toString()
        if (decodedAuthor !== author) return res.status(400).send({
            status: false,
            message: "You are not authorised to perform this action"
        })

        next();

    } catch (error) {
        res.status(500).send({
            status: false,
            error: error.message
        })
    }
}




module.exports.isLoggedIn = isLoggedIn
module.exports.authorization = authorization;