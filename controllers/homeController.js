const Blog = require('../models/blog');
const moment = require('moment');
const nodemailer = require('nodemailer');
require('dotenv').config();


const home_index = (req, res) => {
    Blog.find().sort({createdAt: -1})
    .then (result => {
        res.render('index', {title: 'Blogs', blogs: result, moment: moment});
    })
    .catch (err => {
        res.send(err);
    });
};

const home_about_get = (req, res) => {
    res.render('about', {title: 'About'});
};

const home_contact_get = (req, res) => {
    res.render('contact', {title: 'Contact'});
};

const home_blog_get = (req, res) => {
    Blog.findById(req.params.id)
    .then (result => {
        if (result) {
            //const connectedTitle = result.title.replace(' ', '-');
            res.render('blog', {title: result.title, blogPost: result, moment: moment});
        } else {
            res.render('404', {title: 'Error'});
        }
    })
    .catch (err => {
        res.send(err);
    });
}

const home_contact_post = (req, res) => {
    const userName = req.body.name;
    const userEmail = req.body.email;
    const subject = req.body.subject;
    const body = req.body.body;
    
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
            user: process.env.EMAIL,
            pass: process.env.PASSWORD
        }
    });
    
    emailData = {
        from: '',
        to: process.env.EMAIL,
        subject: subject + ' ---- FROM: ' + userName + " (" + userEmail + ") ",
        text: body
    };

    transporter.sendMail( emailData, function (err, emailRes) {
        if (err){
            //console.log(err);
        } else {
            //console.log(emailRes);
        }
    });

    res.redirect('/contact');
};

module.exports = {
    home_index,
    home_about_get,
    home_contact_get,
    home_blog_get,
    home_contact_post
};