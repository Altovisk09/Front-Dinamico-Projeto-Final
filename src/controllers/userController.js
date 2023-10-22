const User = require('../models/users');
const Task = require('../models/Projects');
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
  updateUser: (req, res) => {

  },
  deleteUser: (req, res) => {

  },
  logout: (req, res) => {

  },
   createTask:  async (req, res, next) => {
    const { name, members, deadline, description} = req.body;
    const creator = req.session.userLogged.apelido;
    const leader = creator;
  
    let membersList = [];
  
    if (members) {
      // Divide os membros por vírgula e remova os espaços em branco
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
      const newTask = new Task({
        name,
        members: membersList,
        working: [],
        deadline,
        description,
        creator,
        leader,
      });
  
      const task = await newTask.save();
      const taskID = task._id;
  
      const user = await User.findOne({ apelido: creator });
  
      if (user) {
        user.projetos.push(taskID);
        const updateUser = await user.save();
        console.log('Tarefa atrelada aos envolvidos', updateUser);
      } else {
        console.error('Usuário não encontrado.');
      }
  
      console.log('Tarefa criada com sucesso:', task);
      res.redirect('/projects');
    } catch (error) {
      console.error('Erro ao criar a tarefa:', error);
      return next(error);
    }
  },
  updateTask: () => {

  },
  DeleteTask: () => {

  },
  addMembers: () => {

  },
  removeMembers: () => {

  },
  changeAdmTask: () => {
    
  }
};

module.exports = userController;
