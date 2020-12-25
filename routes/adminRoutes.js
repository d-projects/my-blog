const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController.js');


router.get('', adminController.admin_index);
router.get('/login', adminController.admin_login_get);
router.get('/logout', adminController.admin_logout_get);
router.post('/validate', adminController.admin_validate_post);
router.post('/create', adminController.admin_create_post);
router.post('/update', adminController.admin_update_post);
router.delete('/delete/:id', adminController.admin_delete);

module.exports = router;