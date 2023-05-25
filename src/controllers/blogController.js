const express = require('express')
const blogModel = require('../models/blogModel');
const authorModel = require('../models/authorModel');

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
module.exports.getBlog=getBlog;
module.exports.createBlog = createBlog;