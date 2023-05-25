const app = require('./app.js')
const mongoose = require('mongoose')
require('dotenv').config();

const { PORT, MONGODB_URL } = process.env


const startServer = async()=>{
    try {
        await mongoose.connect(MONGODB_URL)
        console.log("Database Connected")
        app.listen(PORT,()=>{
            console.log(`Server Started At Port ${PORT}`)
        })
    } catch (error) {
        console.log(error)
    }
}
startServer()