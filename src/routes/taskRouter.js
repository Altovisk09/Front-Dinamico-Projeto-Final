const express = require('express');
const router = express.Router();
const taskController = require('../controllers/userController');
const authenticated = require('../middlewares/auth');
const notAuthenticated = require('../middlewares/notAuth')

router.post('/create-task', notAuthenticated, taskController.createProject);

module.exports = router;