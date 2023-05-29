const blogModel = require('../models/blogModel.js');
const authorModel = require('../models/authorModel.js')
const { isValid,
    validString,
    validateEmail } = require('../utils/index.js')

const mongoose = require('mongoose');


const createBlog = async function (req, res) {
    try {
        let blogData = req.body;
        if (!Object.keys(blogData).length) return res.send({ status: false, message: "pls provide blog details" })
        // Destructuring the blogData
        const { title, body, authorId, category } = blogData;
        // checking for mandatory fields
        if (!title) return res.status(400).send({ status: false, message: "title is mandatory" });
        if (!body) return res.status(400).send({ status: false, message: "blog body is mandatory" });
        if (typeof body !== "string") return res.status(400).send({ status: false, message: "blog body should be string" });
        if (!authorId) return res.status(400).send({ status: false, message: "authorId is mandatory" });
        if (!category) return res.status(400).send({ status: false, message: "blog category is mandatory" });
        // validating the mandatory fields
        if (!isValid(title)) return res.status(400).send({ status: false, message: "title is in valid" })
        if (!isValid(category)) return res.status(400).send({ status: false, message: "category is in valid" });
        if (!validString(category)) return res.status(400).send({ status: false, message: "category is not a valid string" });
        //check for valid tags
        if (blogData.tags) {
            for (let i = 0; i < blogData.tags.length; i++) {
                if (!isValid(blogData.tags[i])) {
                    return res.status(400).send({ status: false, message: "tag is in valid" });
                }
            } 
        }
        // check for valid subcategory
        if (blogData.subcategory) {
            for (let i = 0; i < blogData.subcategory.length; i++) {
                if (!isValid(blogData.subcategory[i])) {
                    return res.status(400).send({ status: false, message: "subcategory is in valid" });
                }
            }
        }
        //checking if authorId is a valid ObjectId or not
        let id = mongoose.Types.ObjectId.isValid(authorId)
        if (!id) return res.status(400).send({ status: false, message: "authorId is not a valid ObjectId" });
        let author = await authorModel.findById(authorId);
        if (!author) return res.status(404).send({ status: false, message: "No Author Found With This ID" });
        // saving the new blog document in the blog collection
        let newBlog = await blogModel.create(req.body);
        res.status(201).send({ status: true, data: newBlog });
    }
    catch (err) {
        res.status(500).send({ status: false, message: "Invalid request. Please check your request parameters." });
    }
}


const getAllBlogs = async(req,res)=>{
    try {
        const blogs = await blogModel.find()


        res.status(200).json({status : true, blogs : blogs})
    } catch (error) {
        console.log(error)
        res.status(500).json({status: false, error: error})
    }
}



// need to check
const getBlog = async function (req, res) {
    try {
      const filters = req.query;
      const query = {
        isDeleted: false,
        isPublished: true
      };
  
      // Apply filters
      if (filters.authorId) {
        let id = mongoose.Types.ObjectId.isValid(filters.authorId)
        if (!id) return res.status(400).send({ status: false, message: "authorId is not a valid ObjectId" });
        query.authorId = filters.authorId;
      }

      if(filters.title){
        query.title = filters.title;
      }

      if(filters.body){
        query.body = filters.body;
      }
  
      if (filters.category) {
        query.category = filters.category;
      }
  
      if (filters.tags) {
        query.tags = { $in: filters.tags };
      }
  
      if (filters.subcategory) {
        query.subcategory = { $in: filters.subcategory };
      }
  
      const blogs = await blogModel.find(query);
  
      if (blogs.length === 0) {
        return res.status(404).json({ status: false, message: "No blogs found" });
      }
  
      res.status(200).json({ status: true, message: "Blogs list", data: blogs });
    } catch (err) {
      console.log(err);
      res.status(500).json({ status: false, message: "Internal server error" });
    }
};
  


const updateBlog = async function (req, res) {
    try {
      const {blogId} = req.params;
      
      const { title, body, tags, subcategory } = req.body;
  
      const blog = await blogModel.findOneAndUpdate(
        { _id: blogId, isDeleted: false },
        // addToSet  - check if the item already exist or not, if not then push it to array
        { $set: { title, body }, $addToSet: { tags, subcategory } },
        { new: true }
      );
  
      if (!blog) {
        return res.status(404).json({ status: false, message: "Blog not found" });
      }
  
      if (blog.isPublished===false) {
        blog.isPublished = true;
        blog.publishedAt = new Date();
        await blog.save();
      }
  
      res.status(200).json({ status: true, message: "Blog updated statusfully", data: blog });
    } catch (err) {
      console.log(err);
      res.status(500).json({ status: false, message: "Internal server error" });
    }
  };
  
  



//  Deleting blog by ID
const deleteBlogById = async function (req, res) {

    try {
        let {blogId} = req.params;

        let blog = await blogModel.findOne({
            _id: blogId,
            isDeleted: false
        })

        if (blog == null) {
            return res.status(404).send({
                message: 'no such blog exists'
            });
        }

        let deleteUser = await blogModel.findOneAndUpdate(
            {
            _id: blogId,
            isDeleted: false
        }, {
            $set: {
                isDeleted: true,
                deletedAt: new Date()
            }
        }, {
            new: true
        })

        res.status(200).send({
            status: true,
            data: "deletion succesfull"
        })
    } catch (err) {
        console.log(err)
        return res.status(500).send({
            status: false,
            message: err.message
        })
    }

}



const deleteByQuerying = async function (req, res) {
    try {
        const data = req.query
        const iD = req.iD

        const {
            category,
            authorId,
            tags,
            subcategory,
            isPublished
        } = req.query
        

        //check if the query field is empty
        if (Object.keys(data).length == 0) return res.status(400).send({
            status: false,
            message: "Enter the details of blog that you would like to delete"
        })

        if (authorId) {
            if(!mongoose.Types.ObjectId.isValid(authorId))
            return res.status(400).send({
                status: false,
                message: "authorId is not a valid ObjectId"
            });
        }


        //finding document using query params
        const ToBeDeleted = await blogModel.findOneAndUpdate({
            isDeleted: false,
            authorId: iD,
            $or: [{
                category: category
            }, {
                authorId: authorId
            }, {
                tags: tags
            }, {
                subcategory: subcategory
            }, {
                isPublished: isPublished
            }]
        }, {
            $set: {
                isDeleted: true,
                deletedAt: new Date()
            }
        },
        {new  : true})

        if (ToBeDeleted == null) return res.status(404).send({
            status: false,
            message: "Blog not found or it was already deleted"
        })

        res.status(200).send({
            status: true,
            message: "deletion statusfull",
        })
    } catch (err) {
        console.log(err)
        return res.status(500).send({
            status: false,
            message: err.message
        })
    }
}



module.exports.deleteBlogById = deleteBlogById;
module.exports.deleteByQuerying = deleteByQuerying;
module.exports.createBlog = createBlog;
module.exports.getBlog = getBlog;
module.exports.getAllBlogs = getAllBlogs;
module.exports.updateBlog = updateBlog;

