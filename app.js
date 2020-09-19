const express = require('express');
const app = express();

app.use(express.static('public'));

app.set('view engine', 'ejs');

app.listen(3000);


// URL Routes
app.get('/', (req, res) => {
    res.render('index');
});

app.get('/about', (req, res) => {
    res.render('about');
});

app.get('/contact', (req, res) => {
    res.render('contact');
});

app.use((req, res) => {
    res.render('404');
});

