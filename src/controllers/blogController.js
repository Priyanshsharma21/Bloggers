const blogModel = require('../models/blogModel.js');
const authorModel = require('../models/authorModel.js')

var mongoose = require('mongoose');
// var isValid = mongoose.Types.ObjectId.isValid();

function isValid(data) {
    if (typeof data !== "string" || data.trim().length == "") return false
    else return true
}

function validString(input) {

    return (/^[a-zA-Z]+$/.test(input))
}

const validateEmail = (email) => {
    return email.match(/^[a-zA-Z0-9.+_-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,15}$/);
};

const createBlog = async function (req, res) {
    try {
        let blogData = req.body;
        if (!Object.keys(blogData).length) return res.send({ status: false, msg: "pls provide blog details" })

        const { title, body, authorId, category } = blogData;

        if (!title) return res.status(400).send({ status: false, msg: "title is mandatory" });
        if (!body) return res.status(400).send({ status: false, msg: "blog body is mandatory" });
        if (!authorId) return res.status(400).send({ status: false, msg: "authorId is mandatory" });
        if (!category) return res.status(400).send({ status: false, msg: "blog category is mandatory" });

        if (!isValid(title)) return res.status(400).send({ status: false, msg: "title is in valid" })
        if (!isValid(category)) return res.status(400).send({ status: false, msg: "category is in valid" });
        if (!validString(category)) return res.status(400).send({ status: false, msg: "category is not a valid string" });

        if (blogData.tags) {
            for (let i = 0; i < blogData.tags.length; i++) {
                if (!isValid(blogData.tags[i])) {
                    return res.status(400).send({ status: false, msg: "tag is in valid" });
                }
            }
        }

        if (blogData.subcategory) {
            for (let i = 0; i < blogData.subcategory.length; i++) {
                if (!isValid(blogData.subcategory[i])) {
                    return res.status(400).send({ status: false, msg: "subcategory is in valid" });
                }
            }
        }


        let id = mongoose.Types.ObjectId.isValid(authorId)
        if (!id) return res.status(400).send({ status: false, msg: "authorId is not a valid ObjectId" });
        console.log(authorId)
        // authorId = req.body.authorId;
        let author = await authorModel.findById(authorId);
        if (!author) return res.status(404).send({ status: false, message: "No Author Found With This ID" });


        let newBlog = await blogModel.create(req.body);
        res.status(201).send({ status: true, data: newBlog });
        // res.send({data : blogData})
    }
    catch (err) {
        res.status(500).send({ status: false, message: "Invalid request. Please check your request parameters." });
    }
}


const getAllBlogs = async (req, res) => {
    try {
        const blogs = await blogModel.find()


        res.status(200).json({ success: true, blogs: blogs })
    } catch (error) {
        console.log(errpr)
        res.status(500).json({ success: false, error: error })
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
            if (!id) return res.status(400).send({ status: false, msg: "authorId is not a valid ObjectId" });
            query.authorId = filters.authorId;
        }

        if (filters.title) {
            query.title = filters.title;
        }

        if (filters.body) {
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
        const { blogId } = req.params;

        const { title, body, tags, subcategory, isPublished } = req.body;

        const blog = await blogModel.findOneAndUpdate(
            { _id: blogId, isDeleted: false },
            // addToSet  - check if the item already exist or not, if not then push it to array
            { $set: { title, body }, $addToSet: { tags, subcategory } },
            { new: true }
        );

        if (!blog) {
            return res.status(404).json({ status: false, message: "Blog not found" });
        }

        if (blog.isPublished === false) {
            blog.isPublished = true;
            blog.publishedAt = new Date();
            await blog.save();
        }

        res.status(200).json({ status: true, message: "Blog updated successfully", data: blog });
    } catch (err) {
        console.log(err);
        res.status(500).json({ status: false, message: "Internal server error", err: err });
    }
};






//  Deleting blog by ID
const deleteBlogById = async function (req, res) {

    try {
        let { blogId } = req.params;

        let blog = await blogModel.findOne({
            _id: blogId,
            isDeleted: false
        })
        let id = mongoose.Types.ObjectId.isValid(authorId)
        if (!id) return res.status(400).send({ status: false, msg: "Author is not a registered!!" });

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
            tags,
            subcategory,
            isPublished
        } = req.query



        //check if the query field is empty
        if (Object.keys(data).length == 0) return res.status(400).send({
            status: false,
            msg: "Enter the details of blog that you would like to delete"
        })

        let id = mongoose.Types.ObjectId.isValid(authorId)
        if (!id) return res.status(400).send({ status: false, msg: "Author is not a registered!!" });
         authorId = mongoose.Types.ObjectId.isValid(authorId)
        if (!authorId) return res.status(400).send({ status: false, msg: "authorId is not a valid ObjectId" });
        //finding document using query params
        const ToBeDeleted = await blogModel.findOneAndUpdate({
            isDeleted: false,
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
            { new: true })

        if (ToBeDeleted == null) return res.status(404).send({
            status: false,
            msg: "Blog not found or it was already deleted"
        })

        res.status(200).send({
            status: true,
            msg: "deletion successfull",
            data: ToBeDeleted
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


