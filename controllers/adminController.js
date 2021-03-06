const Blog = require('../models/blog');
const User = require('../models/user');
const moment = require('moment');

const admin_index = (req, res) => {
    if (req.session.loggedIn === true) {
        Blog.find()
        .then (result => {
            res.render('admin/index', {title: 'Admin', blogs: result, moment: moment});
        })
        .catch (err => {
            res.send(err);
        });

    } else {
        res.redirect('/admin/login');
    }
};

const admin_login_get = (req, res) => {
    const failMessage = req.query.message;
    res.render('admin/login', {title: 'Admin Login', message: failMessage});
};

const admin_logout_get = (req, res) => {
    if (req.session.loggedIn) {
        req.session.destroy();
    }
    res.redirect('/');
};

const admin_validate_post = (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    const query = { username: username };
    const options = {
        projection: { username: 1, password: 1 }
    };
    User.findOne(query)
    .then(result => {
        if (result && result.username === username && result.password === password){
            req.session.loggedIn = true;
            req.session.user = username;
            res.redirect('/admin');
        } else {
            const uriParameter = encodeURIComponent('That username and/or password is incorrect');
            res.redirect('/admin/login?message=' + uriParameter);
        }
    });

};

const admin_create_post = (req, res) => {
    const blogData = req.body;
    const blog = new Blog({
        title: blogData.title,
        topic: blogData.topic,
        body: blogData.body
    });
    blog.save()
    .then ( result => {
        const uriParameter = encodeURIComponent('Success!');
        res.redirect('/admin?message=' + uriParameter);
    })
};

const admin_update_post = (req, res) => {
    const updateData = req.body;
    const id = {
        _id: updateData.id
    }
    const toUpdate = {
        title: updateData.title,
        topic: updateData.topic,
        body: updateData.body
    };
    Blog.findByIdAndUpdate(id, toUpdate)
    .then ( result => {
        const uriParameter = encodeURIComponent('Success!');
        res.redirect('/admin?message=' + uriParameter);
    });
};

const admin_delete = (req, res) => {
    const deleteId = req.params.id;

    Blog.findByIdAndDelete(deleteId)
    .then ( result => {
        const message = 'Success!';
        res.send(message);
    });
};

module.exports = {
    admin_index,
    admin_login_get,
    admin_logout_get,
    admin_validate_post,
    admin_create_post,
    admin_update_post,
    admin_delete
};