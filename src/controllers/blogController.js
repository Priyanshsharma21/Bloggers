const blogModel = require('../models/blogModel');







const createBlog = async function (req, res) {
    try {
        let input = req.body;
        let authorId = input.authorId;
        // console.log(authorId)
        let data1 = await authorModel.findById(authorId);

       if (!data1) return res.status(404).send({ status: false });

        let data = await blogModel.create(input);
        res.status(200).send({ status: true, "data": data });
    }
    catch (err) {
        res.status(500).send({ status : false,message: "Invalid request. Please check your request parameters."});
    }
}


const getBlog = async function (req, res) {
    try {
        let getblog = await blogModel.find({ isDeleted: true, isPublished: true });

        if (!getBlog) return res.status(200).send({status: true,message: "Blogs list","data":getblog});

    }
    catch (err) {
        res.status(500).send(err);
    }
}





//  Deleting blog by ID
const deleteBlogById = async function (req, res) {

    try {
        let blogId = req.params.blogId;

        let blog = await blogModel.findOne({
            _id: blogId,
            isDeleted: false
        })

        if (blog == null) {
            return res.status(404).send({
                msg: 'no such blog exists'
            });
        }

        let deleteUser = await blogModel.findOneAndUpdate({
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


