const Blog = require('../models/blog');
const Topic = require('../models/topic');
const moment = require('moment');
const nodemailer = require('nodemailer');
const config = require('../settings/config.js');


const home_index = (req, res) => {
    Blog.find().sort({createdAt: -1})
    .then (result => {
        res.render('index', {blogs: result, moment: moment});
    })
    .catch (err => {
        res.send(err);
    });
};

const home_about_get = (req, res) => {
    res.render('about');
};

const home_contact_get = (req, res) => {
    res.render('contact');
};

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
            user: config.email,
            pass: config.password
        }
    });
    
    emailData = {
        from: '',
        to: config.email,
        subject: subject + ' ---- FROM: ' + userName + " (" + userEmail + ") ",
        text: body
    };

    transporter.sendMail( emailData, function (err, emailRes) {
        if (err){
            console.log(err);
        } else {
            console.log(emailRes);
        }
    });

   
    res.redirect('/contact');
};

module.exports = {
    home_index,
    home_about_get,
    home_contact_get,
    home_contact_post
};