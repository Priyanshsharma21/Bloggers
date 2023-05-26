const blogModel = require('../models/blogModel.js');
const authorModel = require('../models/authorModel.js')





const getAllBlogs = async(req,res)=>{
    try {
        const blogs = await blogModel.find()


        res.status(200).json({success : true, blogs : blogs})
    } catch (error) {
        console.log(errpr)
        res.status(500).json({success: false, error: error})
    }
}


const createBlog = async function (req, res) {
    try {
        let authorId = req.body.authorId;
        // console.log(authorId)
        let author = await authorModel.findById(authorId);

       if (!author) return res.status(404).send({ status: false, message : "No Author Found With This ID" });

        let newBlog = await blogModel.create(req.body);
        res.status(201).send({ status: true, data: newBlog });
    }
    catch (err) {
        res.status(500).send({ status : false, message: "Invalid request. Please check your request parameters."});
    }
}




const getBlog = async function (req, res) {
    try {
      const filters = req.query;
      const query = {
        isDeleted: false,
        isPublished: true
      };
  
      // Apply filters
      if (filters.authorId) {
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
  
      console.log(query)
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
      console.log(req.params)
      const { title, body, tags, subcategory, isPublished } = req.body;
  
      const blog = await blogModel.findOneAndUpdate(
        { _id: blogId, isDeleted: false },
        // addToSet  - check if the item already exist or not, if not then push it to array
        { $set: { title, body }, $addToSet: { tags, subcategory } },
        { new: true }
      );
  
      console.log(isPublished)
      if (!blog) {
        return res.status(404).json({ status: false, message: "Blog not found" });
      }
  
      if (blog.isPublished===false) {
        blog.isPublished = true;
        blog.publishedAt = new Date();
        await blog.save();
      }
  
      res.status(200).json({ status: true, message: "Blog updated successfully", data: blog });
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
                msg: 'no such blog exists'
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
        return res.status(500).send({
            status: false,
            msg: err.message
        })
    }

}


//  delete blog by querying
const deleteByQuerying = async function (req, res) {
    try {
        const data = req.query

        const {
            category,
            authorId,
            tagName,
            subcategory,
            isPublished
        } = req.query
        //check if the query field is empty
        if (Object.keys(data).length == 0) return res.status(400).send({
            status: false,
            msg: "Enter the details of blog that you would like to delete"
        })

        //finding document using query params
        const ToBeDeleted = await blogModel.findOneAndUpdate({
            $or: [{
                category: category
            }, {
                authorId: authorId
            }, {
                tags: tagName
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
        })

        if (ToBeDeleted == null) return res.status(404).send({
            status: false,
            msg: "Blog not found"
        })

        res.status(200).send({
            status: true,
            msg: "deletion successfull"
        })
    } catch (err) {
        return res.status(500).send({
            status: false,
            msg: err.message
        })
    }
}


module.exports.deleteBlogById = deleteBlogById;
module.exports.deleteByQuerying = deleteByQuerying;
module.exports.createBlog = createBlog;
module.exports.getBlog = getBlog;
module.exports.getAllBlogs = getAllBlogs;
module.exports.updateBlog = updateBlog;


