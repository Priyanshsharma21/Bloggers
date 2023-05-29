const express = require('express')
const router = express.Router()
const { login,createAuthor,getAuthor } = require('../controllers/authorController.js')
const { deleteBlogById,deleteByQuerying,createBlog,getBlog,getAllBlogs,updateBlog } = require('../controllers/blogController.js')
const { isLoggedIn , authorization } = require('../middlewares/authMiddleware.js')




// author routes
router.post("/authors", createAuthor)

router.get("/authors", getAuthor)

router.post('/login', login) // login author


//blog routes
router.post('/blogs',isLoggedIn, createBlog)

router.get('/blogs' ,isLoggedIn, getBlog);

router.put('/blogs/:blogId',isLoggedIn,authorization, updateBlog);

router.delete('/blogs/:blogId',isLoggedIn,authorization,deleteBlogById)

router.delete('/blogs',isLoggedIn,deleteByQuerying)



module.exports = router