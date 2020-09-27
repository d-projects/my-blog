const config = require('./settings/config.js');
const express = require('express');
const mongoose = require('mongoose');
const Blog = require('./models/blog.js');
const moment = require('moment');

// set up express and view engine (ejs)
const app = express();
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

// connects to MongoDB
const dbURI = `mongodb+srv://${config.db_user}:${config.db_password}@${config.db_cluster}.ffgxc.mongodb.net/${config.db_name}`;
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(result => {
        console.log('connected');
        app.listen(3000);
    }).catch(err => {
        console.log(err);
    });

    // URL Main Routes
app.get('/', (req, res) => {
    res.redirect('/blogs');
});

app.get('/about', (req, res) => {
    res.render('about');
});

app.get('/contact', (req, res) => {
    res.render('contact');
});

// URL Admin Routes
app.get('/admin', (req, res) => {
    if (req.query.message){
        res.render('admin', { message: req.query.message });
    } else {
        res.render('admin');
    }
});

app.get('/admin-login', (req, res) => {
    res.render('admin-login');
});



// URL Blog Specific Routes
app.get('/blogs', (req, res) => {
    Blog.find()
    .then (result => {
        res.render('index', {blogs: result, moment: moment});
    })
    .catch (err => {
        res.send(err);
    });
    
});

// POST Routes
app.post('/admin', (req, res) => {
    const blogData = req.body;
    const blog = new Blog({
        title: blogData.title,
        body: blogData.body
    });
    blog.save()
    .then ( result => {
        res.redirect('/admin?message=Success!');
    })
    .catch ( err => {
        console.log(err);
    });
});

app.use((req, res) => {
    res.render('404');
});

