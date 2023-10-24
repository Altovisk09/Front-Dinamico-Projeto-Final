const express = require('express');
const router = express.Router();
const projectController = require('../controllers/userController');
const notAuthenticated = require('../middlewares/notAuth')

router.post('/create-project', notAuthenticated, projectController.createProject); // esse metodo ficaria em aside pra gerar o projeto na lista de projetos do usuario em aside 
router.get('/:id', notAuthenticated, projectController.getTasks); // esse aqui é pra gerar as tasks do projeto e colocar na view
router.post('/:id/update-project', notAuthenticated, projectController.updateProject);
router.post('/:id/delete-project', notAuthenticated, projectController.deleteProject);
router.post('/:id/add-members', notAuthenticated, projectController.addMembers);
router.post('/:id/remove-members', notAuthenticated, projectController.removeMembers);
router.post('/:id/change-adm', notAuthenticated, projectController.changeAdmProject);
router.get('/:id/create-task', notAuthenticated, projectController.createTask);



module.exports = router;