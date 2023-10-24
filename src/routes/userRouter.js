const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');
const notAuthenticated = require('../middlewares/notAuth');

router.post('/update-user', notAuthenticated, userController.updateUser);
router.post('/update-pass', notAuthenticated, userController.changePass);
router.post('/delete-user', notAuthenticated, userController.deleteUser);

module.exports = router;