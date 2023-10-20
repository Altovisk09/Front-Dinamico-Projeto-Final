    const express = require('express');
    const router = express.Router();
    const viewController = require('../controllers/viewController');
    const userController = require('../controllers/userController');


    router.get('/', viewController.index);

    router.get('/signup', viewController.signup);
    router.post('/signup', userController.teste);

    module.exports = router;