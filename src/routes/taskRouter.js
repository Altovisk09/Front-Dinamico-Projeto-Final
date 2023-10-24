const express = require('express');
const router = express.Router();
const projectController = require('../controllers/userController');
const notAuthenticated = require('../middlewares/notAuth')

router.post('/create-project', notAuthenticated, projectController.createProject);
router.post('/update-project', notAuthenticated, projectController.updateProject);
router.post('/delete-project', notAuthenticated, projectController.deleteProject);
router.post('/add-members', notAuthenticated, projectController.addMembers);
router.post('/remove-members', notAuthenticated, projectController.removeMembers);
router.post('/change-adm', notAuthenticated, projectController.changeAdmProject);
router.post('/create-task', notAuthenticated, projectController.createTask);
router.post('/create-task', notAuthenticated, projectController.createTask);



module.exports = router;