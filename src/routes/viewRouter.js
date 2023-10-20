    const express = require('express');
    const router = express.Router();
    const viewController = require('../controllers/viewController');
    const userController = require('../controllers/userController');
    const validationRegister = require('../middlewares/singupValidation');

    router.get('/', viewController.index);

    router.get('/signup', viewController.signup);
    router.post('/signup', validationRegister ,validation, userController.signup);

    module.exports = router;