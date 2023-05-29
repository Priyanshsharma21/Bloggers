const express = require('express')
const router = express.Router()
const { login,createAuthor,getAuthor } = require('../controllers/authorController.js')
const { deleteBlogById,deleteByQuerying,createBlog,getBlog,getAllBlogs,updateBlog } = require('../controllers/blogController.js')
const { isLoggedIn , authorization} = require('../middlewares/index.js')




// author routes
router.post("/authors", createAuthor)

router.get("/authors",isLoggedIn, getAuthor)

router.post('/login', login) // login author


//blog routes
router.post('/blogs', createBlog)

router.get('/blogs' ,isLoggedIn, getBlog);

router.put('/blogs/:blogId', updateBlog);

router.delete('/blogs/:blogId',isLoggedIn,deleteBlogById)

router.delete('/blogs',isLoggedIn,deleteByQuerying)



module.exports = router