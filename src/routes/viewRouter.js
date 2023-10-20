    const express = require('express');
    const router = express.Router();
    const viewController = require('../controllers/viewController');
    const userController = require('../controllers/userController');
    const validationRegister = require('../middlewares/singupValidation');

    router.get('/', viewController.index);

    router.get('/signup', viewController.signup);
    router.post('/signup', validationRegister, userController.signup);

    router.get('/signin', viewController.signin);
    router.post('/signin', userController.signin);

    router.get('/projects', viewController.logged);
    module.exports = router;