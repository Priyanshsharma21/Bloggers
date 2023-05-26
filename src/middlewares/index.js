const authorModel = require('../models/authorModel.js')
const blogModel = require('../models/blogModel.js')
require('dotenv').config();

const {
    JWT_SECRET
} = process.env



const isLoggedIn = async (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1] || req.headers['x-api-key']

        if (!token) return res.status(404).json({
            Message: "Token Not Found"
        })

        const decoded = jwt.verify(token, JWT_SECRET)

        console.log(decoded._id)

        const author = await authorModel.findById(decoded._id)

        if (!author) {
            return res.status(401).json({
                message: 'Unauthorized access'
            });
        }

        const {blogId} = req.params; 
        if(blogId){
            const blog = await blogModel.findOne({
                _id: blogId
            });
    
            if (!blog || blog.authorId.toString() !== author._id.toString()) {
                return res.status(401).json({
                    message: 'Unauthorized access'
                });
            }
    
        }

        req.author = author

        next()

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
}



module.exports.isLoggedIn = isLoggedIn