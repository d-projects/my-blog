const express = require('express');
const mongoose = require('mongoose');
const { render } = require('ejs');
const session = require('express-session');
const bodyParser = require('body-parser');
const config = require('./settings/config.js');
const adminRoutes = require('./routes/adminRoutes.js');
const homeRoutes = require('./routes/homeRoutes.js');

const { getMaxListeners } = require('./models/blog.js');
const port = process.env.PORT || 3000;

// Set up express
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
        app.listen(port);
        console.log('connected');
    }).catch(err => {
        console.log(err);
    });

// Routers
app.use('/admin', adminRoutes);
app.use('', homeRoutes);
app.use((req, res) => {
    res.render('404');
});

