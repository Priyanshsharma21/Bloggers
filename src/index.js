const app = require('./app.js')
const mongoose = require('mongoose')
const PORT = 8080

require('dotenv').config();

// const { PORT, MONGODB_URL } = process.env

// console.log(MONGODB_URL)
const startServer = async()=>{
    try {
        mongoose.set('strictQuery', true)
        await mongoose.connect("mongodb+srv://khjp1:3BSJy3TDTOJYRLmd@blog.b9eele7.mongodb.net/group2Database"        ,{
            useNewUrlParser : true,
            useUnifiedTopology : true
        })
        console.log("Database Connected")
        app.listen(PORT,()=>{
            console.log(`Server Started At Port ${PORT}`)
        })
    } catch (error) {
        console.log(error)
    }
}
startServer()