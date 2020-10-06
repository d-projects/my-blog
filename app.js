const config = require('./settings/config.js');
const express = require('express');
const mongoose = require('mongoose');
const Blog = require('./models/blog.js');
const User = require('./models/user.js');
const moment = require('moment');
const session = require('express-session');
const bodyParser = require('body-parser');
const Topic = require('./models/topics.js');
const nodemailer = require('nodemailer');
const { render } = require('ejs');
const { getMaxListeners } = require('./models/blog.js');

// set up express
const app = express();
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true}));
app.set('view engine', 'ejs');
app.use(session({secret: config.session_secret, saveUninitialized: true, resave: true}));
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());

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
    res.redirect('blogs');
});

app.get('/about', (req, res) => {
    res.render('about');
});

app.get('/contact', (req, res) => {
    res.render('contact');
});

// URL Admin Routes
app.get('/admin', (req, res) => {
    if (req.session.loggedIn === true) {
        Topic.find()
        .then (result => {       
           const topics = result;
           Blog.find()
           .then (result => {
               res.render('admin', {blogs: result, moment: moment, uniqueTopics: topics});
           })
           .catch (err => {
               res.send(err);
           });
        })
        .catch(err => {
            res.send(err);
        });

    } else {
        res.render('admin-login');
    }
});

app.get('/admin-login', (req, res) => {
    const failMessage = req.query.message;
    res.render('admin-login', { message: failMessage });
});

app.post('/validate', (req, res) => {
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
            res.redirect('admin');
        } else {
            const uriParameter = encodeURIComponent('That username and/or password is incorrect');
            res.redirect('admin-login?message=' + uriParameter);
        }
    })
    .catch(err => {
        console.log(err);
    });

})

app.post('/admin', (req, res) => {
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
    .catch ( err => {
        console.log(err);
        // const uriParameter = encodeURIComponent('There seems to have been an error');
        // res.redirect('/admin?message=' + uriParameter);
    });
});

app.post('/admin/update', (req, res) => {
    const updateData = req.body;
    console.log("here");
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
    })
    .catch ( err => {
        console.log(err);
        // const uriParameter = encodeURIComponent('There seems to have been an error');
        // res.redirect('/admin?message=' + uriParameter);
    });
});

app.delete('/admin/delete/:id', (req, res) => {
    const deleteId = req.params.id;

    Blog.findByIdAndDelete(deleteId)
    .then ( result => {
        const message = 'Success!';
        res.send(message);
    })
    .catch ( err => {
        console.log(err);
    });
});

app.post('/contact', (req, res) => {
    const userName = req.body.name;
    const userEmail = req.body.email;
    const subject = req.body.subject;
    const body = req.body.body;
    


        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            //service: 'gmail',
            auth: {
                user: config.email,
                pass: config.password
            }
        });
        

        emailData = {
            from: config.email,
            to: config.email,
            subject: subject,
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
;})


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

app.use((req, res) => {
    res.render('404');
});

