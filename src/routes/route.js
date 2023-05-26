const express = require('express')
const router = express.Router()
const { login,createAuthor,getAuthor } = require('../controllers/authorController.js')
const { deleteBlogById,deleteByQuerying,createBlog,getBlog,getAllBlogs,updateBlog } = require('../controllers/blogController.js')



//blog routes
router.post('/createBlog' , createBlog)
router.get('/getBlog' , getBlog);
router.get('/blogs' , getAllBlogs);
router.put('/blogs/:blogId' , updateBlog);




// login author
router.post('/login', login)

// author routes
router.get("/authors", getAuthor)
router.post("/authors", createAuthor)


router.delete('/blogs?queryParams',deleteByQuerying)
router.delete('/blogs/:blogId',deleteBlogById)



module.exports = router