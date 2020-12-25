const express = require('express');
const router = express.Router();
const homeController = require('../controllers/homeController.js');

router.get('', homeController.home_index);
router.get('/about', homeController.home_about_get);
router.get('/contact', homeController.home_contact_get);
router.get('/blog/:id', homeController.home_blog_get);
router.post('/contact', homeController.home_contact_post);


module.exports = router;