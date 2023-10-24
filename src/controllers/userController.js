const User = require('../models/users');
const Project = require('../models/Projects');
const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');
const createError = require('http-errors');
const Task = require('../models/Tasks');

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
    req.session.destroy(err=>{
      console.error('Erro ao finalizar sessão')
    })
    res.clearCookie('futuroCookie');
    res.redirect('/')
  },
  createProject: async (req, res, next) => {
    const { name, members, description} = req.body;
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
        members: membersList,
        description,
        creator,
        leader,
        tasks: [],
      });

      const Project = await newProject.save();
      const ProjectID = Project._id;

      // Associa o ID da tarefa a todos os membros
      await User.updateMany({ apelido: { $in: membersList } }, { $push: { projetos: ProjectID } });

      console.log('Tarefa criada com sucesso:', task);
      res.redirect('/projects');
    } catch (error) {
      console.error('Erro ao criar a tarefa:', error);
      return next(error);
    }
  },
  updateProject: async (req, res) => {
    const ProjectId = req.params.id;
    const { name, description } = req.body;

    try {
      const updatedProject = await Project.findByIdAndUpdate(
        ProjectId,
        { name, description },
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
    } catch (error) {
      console.error('Erro ao excluir a tarefa:', error);
      console.error('Erro interno do servidor');
    }
  },
  addMembers: async (req, res) => {
    const ProjectId = req.params.id;
    const { members } = req.body;

    try {
      const updatedProject = await Project.findByIdAndUpdate(
        ProjectId,
        { $addToSet: { members: members } },
        { new: true }
      );

      if (!updatedProject) {
        return console.error('Tarefa não encontrada');
      }

      console.log('Membros adicionados com sucesso');
    } catch (error) {
      console.error('Erro ao adicionar membros à tarefa:', error);
      console.error('Erro interno do servidor');
    }
  },
  removeMembers: async (req, res) => {
    const ProjectId = req.params.id;
    const { members } = req.body;

    try {
      const updatedProject = await Project.findByIdAndUpdate(
        ProjectId,
        { $pullAll: { members: members } },
        { new: true }
      );

      if (!updatedProject) {
        return console.error('Tarefa não encontrada');
      }

      console.log('Membros removidos com sucesso');
    } catch (error) {
      console.error('Erro ao remover membros da tarefa:', error);
      console.error('Erro interno do servidor');
    }
  },
  changeAdmProject: async (req, res) => {
    const ProjectId = req.params.id;
    const { leader } = req.body;

    try {
      const updatedProject = await Project.findByIdAndUpdate(
        ProjectId,
        { leader: leader },
        { new: true }
      );

      if (!updatedProject) {
        return console.error('Tarefa não encontrada');
      }

      console.log('Administrador da tarefa alterado com sucesso');
    } catch (error) {
      console.error('Erro ao alterar o administrador da tarefa:', error);
      console.error('Erro interno do servidor');
    }
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
      let {name, deadline, description} = req.body;
      const creatorTask = req.session.userLogged.apelido;

      const newTask = new Task({
        name: name,
        creator: creatorTask,
        deadline: deadline, 
        description: description,      
      });

      //Salva a nova tarefa e atrela ao projeto
      const task = await newTask.save();
      project.tasks.push(task._id);
        await project.save();
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
      
      res.render('projects', { userProjects, project, tasks });
    } catch (error) {
      console.error('Erro ao buscar tarefas do projeto:', error);
      return res.status(500).send('Erro interno do servidor');
    }
  },
};

module.exports = userController;
