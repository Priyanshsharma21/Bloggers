const express = require('express')
const router = express.Router()
const { login,createAuthor,getAuthor } = require('../controllers/authorController.js')
const { deleteBlogById,deleteByQuerying,createBlog,getBlog,getAllBlogs,updateBlog } = require('../controllers/blogController.js')
const { isLoggedIn , authorization} = require('../middlewares/index.js')




// author routes
router.post("/authors", createAuthor)

router.get("/authors", getAuthor)

router.post('/login', login) // login author


//blog routes
router.post('/blogs', createBlog)

router.get('/blogs' , getBlog);

router.put('/blogs/:blogId', updateBlog);

router.delete('/blogs/:blogId',deleteBlogById)

router.delete('/blogs',deleteByQuerying)



module.exports = router