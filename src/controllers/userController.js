const User = require('../models/users');
const Project = require('../models/Projects');
const Task = require('../models/Tasks');
const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');
const createError = require('http-errors');



const userController = {
  signup: (req, res) => {
    let { name, username, email } = req.body;
    let securityPass = bcrypt.hashSync(req.body.password, 10)
    let resultValidation = validationResult(req)

    if (resultValidation.errors.length > 0) {
      console.log(resultValidation.array());
    } else {
      const newUser = new User({
        nome: `${name}`,
        apelido: `${username}`,
        email: `${email}`,
        senha: `${securityPass}`,
        projetos: [],
      });

      newUser.save()
        .then((user) => {
          res.redirect('/signup')
          console.log('Usuário cadastrado com sucesso:', user);
        })

        .catch((error) => {
          console.error('Erro ao cadastrar o usuário:', error);
        });
    }
  },
  signin: (req, res) => {
    let resultValidation = validationResult(req)

    if (resultValidation.errors.length > 0) {
      console.log(resultValidation.array());
    } else {
      console.log(req.session.userLogged)
      res.redirect('/projects');
    }
  },
  updateUser: async (req, res) => {
    const userId = req.session.userLogged._id;
    const { name, username, email} = req.body;

    try{
      const updateUser = User.findByIdAndUpdate(userId, {
        nome: name, 
        apelido: username,
        email: email,
      },{
        new: true
      });
      if(!updateUser){
        return console.error('Usuario não encontrado');
      }else{
        console.log('Usuario atualizado', updateUser)
      }
    }catch(err){
      console.error('Erro ao atualizar o usuário:', err);
    }
  },
  changePass: async (req, res) => {
    const userId = req.session.userLogged._id;
    const { currentPass, newPass } = req.body;

    try{
      const user = await User.findById(userId);

      const valdationPass = bcrypt.compareSync(currentPass, user.senha);
      if(!valdationPass){
        console.error('Senha inserida não está correta')
      }else{
        const hashPass = bcrypt.hashSync(newPass, 10);
        user.senha = hashPass;
        await user.save();

        console.log('Senha atualizada com sucesso', hashPass);
      }
    }catch(err){
      console.error('Erro ao atualizar o usuário:', err);
    }
  },
  deleteUser: async (req, res) => {
    const userId = req.session.userLogged._id;

    try{
      const deleteUser = await User.findByIdAndDelete(userId);
      if(!deleteUser){
        console.log('Erro ao apagar usuario ')
      }

      console.log(`Usuario de username: ${deleteUser.apelido} deletado com sucesso.`)
    }catch(err){
      console.error('Erro ao apagar usuario')
    }
  },
  logout: async (req, res) => {
  req.session.destroy(err => {
    if (err) {
      console.error('Erro ao finalizar sessão:', err);
    } else {
      res.clearCookie('futuroCookie');
      res.redirect('/');
    }
  });
},
  createProject: async (req, res, next) => {
    const { name, members, description, deadline} = req.body;
    const creator = req.session.userLogged.apelido;
    const leader = creator;

    let membersList = [];

    if (members) {
      // Divide os membros por vírgula e remove os espaços em branco
      membersList = members.split(',').map(member => member.trim());

      // Verifica se o criador já está na lista de membros
      if (!membersList.includes(creator)) {
        membersList.push(creator);
      }
    } else {
      // Se não houver membros, define o criador como o único membro
      membersList = [creator];
    }

    try {
      // Valida se os membros existem no db
      const users = await User.find({ apelido: { $in: membersList } }, 'apelido');

      // Verifica se todos os membros na lista foram encontrados no db
      if (users.length !== membersList.length) {
        const missingMembers = membersList.filter(member => !users.some(user => user.apelido === member));
        return console.error('Usuários inexistentes:', missingMembers);
      }

      const newProject = new Project({
        name,
        deadline,
        members: membersList,
        description,
        creator,
        leader,
        tasks: [],
      });

      const project = await newProject.save();
      const projectID = Project._id;

      // Associa o ID da tarefa a todos os membros
      await User.updateMany({ apelido: { $in: membersList } }, { $push: { projetos: projectID } });

      console.log('Tarefa criada com sucesso:', project);
      res.redirect('/projects');
    } catch (error) {
      console.error('Erro ao criar a tarefa:', error);
      return next(error);
    }
  },
  updateProject: async (req, res) => {
    const ProjectId = req.params.id;
    const { name, description, deadline } = req.body;

    try {
      const updatedProject = await Project.findByIdAndUpdate(
        ProjectId,
        { name, description, deadline },
        { new: true } // Retorna o documento atualizado
      );

      if (!updatedProject) {
        return console.error('Tarefa não encontrada');
      }
      res.redirect('/projects');

    } catch (error) {
      console.error('Erro ao atualizar a tarefa:', error);
      console.error('Erro interno do servidor');
    }
  },
  deleteProject: async (req, res) => {
    const ProjectId = req.params.id;

    try {
      const deletedTask = await Project.findByIdAndDelete(ProjectId);

      if (!deletedTask) {
        return console.error('Tarefa não encontrada');
      }

      console.log('Tarefa excluída com sucesso');
      res.redirect('/projects');

    } catch (error) {
      console.error('Erro ao excluir a tarefa:', error);
    }
  },
  addMembers: async (req, res) => {
    const projectId = req.params.id;
    const { members } = req.body;
    const project = await Project.findById(projectId);
  
    if (!project) {
      return console.error('Projeto não encontrado.');
      
    }
  
    if (project.leader !== req.session.userLogged.apelido) {
      console.error('Você não tem permissão para adicionar membros a este projeto.');
      return res.status(403, 'Você não tem permissão para adicionar membros a este projeto.');
    }
  
    const membersList = members.split(',').map(member => member.trim());
    const users = await User.find({ apelido: { $in: membersList } });
  
    const errorMembers = [];
    const existingMembers = project.members;
  
    membersList.forEach((member) => {
      if (!users.find((user) => user.apelido === member)) {
        errorMembers.push(member + ' (Usuário não existe)');
      } else if (existingMembers.includes(member)) {
        errorMembers.push(member + ' (Já é membro deste projeto)');
      }
    });
  
    if (errorMembers.length > 0) {
      const errorMessage = 'Erro ao adicionar membros: ' + errorMembers.join(', ');
      return console.error(errorMessage);
    }
  
    project.members.push(...membersList);
  
    if (!membersList.includes(project.leader)) {
      membersList.push(project.leader);
    }
  
    await project.save();
    console.log('Membros adicionados com sucesso.');
    res.redirect(`/projects/${projectId}`);
  },
  removeMembers: async (req, res) => {
    const projectId = req.params.id;
    const { members } = req.body;

    try {
      if (!members) {
        return console.error('Nenhum membro especificado.');
      }

      const membersList = members.split(',').map(member => member.trim());
      const project = await Project.findById(projectId);

      if (!project) {
        return res.status(404);
      }
      if (!project.leader.includes(req.session.userLogged.apelido)) {
        return res.status(403);
      }

      project.members = project.members.filter(memberApelido => !membersList.includes(memberApelido));

      await project.save();

      console.log('Membros removidos com sucesso.');
      res.redirect(`/projects/${projectId}`)
    } catch (error) {
      console.error('Erro ao remover membros do projeto:', error);
    }
  },
  changeAdmProject: async (req, res) => {
    const projectId = req.params.id;
    const { leader } = req.body;
    const project = await Project.findById(projectId);
  
    if (!project) {
      return console.error('Projeto não encontrado.');
    }
  
    if (project.leader !== req.session.userLogged.apelido) {
      return console.error('Você não tem permissão para alterar o administrador deste projeto.');
    }
    if (project.leader === leader) {
      return console.error('Você não pode se tornar líder do projeto atual.');
    }
  
    if (!project.members.includes(leader)) {
      return console.error('O novo líder não é um membro deste projeto.');
    }
  
    const updatedProject = await Project.findByIdAndUpdate(
      projectId,
      { leader: leader },
      { new: true }
    );
  
    if (!updatedProject) {
      return console.error('Projeto não encontrado.');
    }
  
    console.log('Administrador do projeto alterado com sucesso.');
    res.redirect(`/projects/${projectId}`);
  },
  createTask: async (req, res) => {
    const projectId = req.params.id;
    try{
      const project = await Project.findById(projectId);
      if(!project){
        return console.error('Projeto não encontrado')
      }
      if(project.tasks.length >= 15){
      return  console.error('Limite de tarefas do projeto atingido (15)')
      }
      let {taskName, taskDeadline, taskDescription} = req.body;
      const taskCreator = req.session.userLogged.apelido;

      const newTask = new Task({
        name: taskName,
        creator: taskCreator,
        deadline: taskDeadline, 
        description: taskDescription,      
      });

      //Salva a nova tarefa e atrela ao projeto
      const task = await newTask.save();
      project.tasks.push(task._id);
        await project.save();
        res.redirect(`/projects/${project._id}`)
    }catch(err){
      console.error('Erro ao criar nova tarefa',err)
    }
  },
  getTasks: async (req, res) => {
    try {
      const projectId = req.params.id;
      const user = req.session.userLogged.apelido;

      // Busque o projeto pelo ID
      const project = await Project.findById(projectId);
      const userProjects = await Project.find({ members: user });
      if (!project) {
        return res.status(404).send('Projeto não encontrado');
      }
  
      // Busque as tarefas associadas a esse projeto
      const tasks = await Task.find({ _id: { $in: project.tasks } });
      
      res.render('userArea', { userProjects, project, tasks});
    } catch (error) {
      console.error('Erro ao buscar tarefas do projeto:', error);
      return res.status(500).send('Erro interno do servidor');
    }
  },
  editTask: async (req, res) => {
    const projectId = req.params.id
    const taskId = req.query.task;

    const {name, description, deadline} = req.body;
    try {
      const task = await Task.findByIdAndUpdate(taskId,
      { name, description, deadline },
        { new: true }
      );
      
      if (!task) {
        return console.error('Tarefa não encontrada');
      }

      res.redirect(`/projects/${projectId}`);
    } catch (error) {
      console.error('Erro ao editar tarefa:', error);
      res.status(500).send('Erro interno do servidor');
    }
  },
  deleteTask: async (req, res) => {
    const projectId = req.params.id
    const taskId = req.query.task;

    try {
      const task = await Task.findByIdAndDelete(taskId,
        { new: true }
      );
      
      if (!task) {
        return console.error('Tarefa não encontrada');
      }

      res.redirect(`/projects/${projectId}`);
    } catch (error) {
      console.error('Erro ao deletar tarefa:', error);
      res.status(500).send('Erro interno do servidor');
    }
  },
};

module.exports = userController;
