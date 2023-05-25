const authorModel = require('../models/authorModel.js')
require('dotenv').config();

const { JWT_SECRET } = process.env



const isLoggedIn = async(req,res,next)=>{
    try {
        const token = req.headers.authorization.split(" ")[1]  || req.header('x_auth_token')

        if(!token) return res.status(404).json({Message : "Token Not Found"})

        const decoded = jwt.verify(token, JWT_SECRET)

        console.log(decoded._id)

        const author = await authorModel.findById(decoded._id)

        req.user = author

        next()

    } catch (error) {
        res.status(500).json({success: false, message : "Internal Server Error"})
    }
}



module.exports.isLoggedIn = isLoggedIn