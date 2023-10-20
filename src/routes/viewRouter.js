    const express = require('express');
    const router = express.Router();
    const viewController = require('../controllers/viewController');

    router.get('/', viewController.index);

    router.get('/singup', viewController.singup);

    module.exports = router;