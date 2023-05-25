const express = require('express')
const router = express.Router()
const { login } = require('../controllers/authorController.js')


router.post('/createBlog' , blogModel.createBlog)
router.get('/getBlog' , blogModel.getBlog);


// login author
router.post('/login', login)



module.exports = router