const express = require('express')
const router = express.Router()
const { login,createAuthor,getAuthor } = require('../controllers/authorController.js')
const { deleteBlogById,deleteByQuerying,createBlog,getBlog } = require('../controllers/blogController.js')



//blog routes
router.post('/createBlog' , createBlog)
router.get('/getBlog' , getBlog);


// router.post('/createBlog' , blogModel.createBlog)
// router.get('/getBlog' , blogModel.getBlog);


// login author
router.post('/login', login)

// author routes
router.get("/authors", getAuthor)
router.post("/authors", createAuthor)

router.delete('/blogs?queryParams',deleteByQuerying)
router.delete('/blogs/:blogId',deleteBlogById)



module.exports = router;