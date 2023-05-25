const express  = require('express')
const morgan = require('morgan')
const app = express()


// Global middlewares
app.use(express.json())
app.use(express.urlencoded({extended : true}))

// Morgan
app.use(morgan("tiny"))

//route middleware

module.exports = app