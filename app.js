const express = require('express');
const mongoose = require('mongoose');
const { render } = require('ejs');
const session = require('express-session');
const bodyParser = require('body-parser');
const adminRoutes = require('./routes/adminRoutes.js');
const homeRoutes = require('./routes/homeRoutes.js');
require('dotenv').config();

const { getMaxListeners } = require('./models/blog.js');
const port = process.env.PORT || 3000;

// Set up express
const app = express();
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true}));
app.set('view engine', 'ejs');
app.use(session({secret: process.env.SESSION_SECRET, saveUninitialized: true, resave: true}));
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());


// connect to MongoDB
const dbURI = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_CLUSTER}.ffgxc.mongodb.net/${process.env.DB_NAME}`;
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
.then(result => {
    app.listen(port);
});

// Route the requests
app.use('/admin', adminRoutes);
app.use('', homeRoutes);
app.use((req, res) => {
    res.render('404', {title: 'Error'});
});

