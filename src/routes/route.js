const express = require('express')
const router = express.Router()
const { login,createAuthor,getAuthor } = require('../controllers/authorController.js')
const { deleteBlogById,deleteByQuerying,createBlog,getBlog,getAllBlogs,updateBlog } = require('../controllers/blogController.js')
const { isLoggedIn } = require('../middlewares/index.js')



//blog routes
router.post('/createBlog',isLoggedIn, createBlog)
router.get('/getBlog' , getBlog);
router.get('/blogs' , getAllBlogs);
router.put('/blogs/:blogId' ,isLoggedIn, updateBlog);




// login author
router.post('/login', login)

// author routes
router.get("/authors", getAuthor)
router.post("/authors", createAuthor)


router.delete('/blogs?queryParams',isLoggedIn,deleteByQuerying)
router.delete('/blogs/:blogId',isLoggedIn,deleteBlogById)



module.exports = router