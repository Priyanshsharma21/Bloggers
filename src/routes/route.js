const express = require('express')
const router = express.Router()
const blogModel = require('../controllers/blogController');


router.post('/createBlog' , blogModel.createBlog)
router.get('/getBlog' , blogModel.getBlog);


module.exports = router