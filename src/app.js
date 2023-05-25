const express  = require('express')
const morgan = require('morgan')
const app = express()
const authorRoutes = require('./routes/author.js')
const blogRoutes = require('./routes/blog.js')



// Global middlewares
app.use(express.json())
app.use(express.urlencoded({extended : true}))

// Morgan
app.use(morgan("tiny"))

//route middleware
app.use('/api/v1',authorRoutes)
app.use('/api/v1',blogRoutes)




module.exports = app