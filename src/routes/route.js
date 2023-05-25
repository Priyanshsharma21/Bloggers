const express = require('express')
const router = express.Router()
const { login } = require('../controllers/authorController.js')






// login author
router.post('/login', login)

//Api for authorController to 
router.post("/authors", authorController.createAuthor)
router.get("/authors", authorController.getAuthor)


module.exports = router