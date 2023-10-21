const express = require('express');
const router = express.Router();
const viewController = require('../controllers/viewController');
const userController = require('../controllers/userController');
const validationRegister = require('../middlewares/signupValidation');
const validationLogin = require('../middlewares/signinValidation');
const authenticated = require('../middlewares/auth');
const notAuthenticated = require('../middlewares/notAuth');


router.get('/', viewController.index);

router.get('/signup', authenticated, viewController.signup);
router.post('/signup', authenticated, validationRegister, userController.signup);

router.get('/signin', authenticated, viewController.signin);
router.post('/signin', authenticated, validationLogin, userController.signin);

router.get('/projects', notAuthenticated, viewController.logged);

module.exports = router;