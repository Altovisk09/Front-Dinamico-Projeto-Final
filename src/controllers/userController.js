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
  createTask: async (req, res, next) => {
    const { name, members, deadline, description} = req.body;
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

      // Associa o ID da tarefa a todos os membros
      await User.updateMany({ apelido: { $in: membersList } }, { $push: { projetos: taskID } });

      console.log('Tarefa criada com sucesso:', task);
      res.redirect('/projects');
    } catch (error) {
      console.error('Erro ao criar a tarefa:', error);
      return next(error);
    }
  },
  updateTask: async (req, res) => {
    const taskId = req.params.id;
    const { name, description, deadline } = req.body;

    try {
      const updatedTask = await Task.findByIdAndUpdate(
        taskId,
        { name, description, deadline },
        { new: true } // Retorna o documento atualizado
      );

      if (!updatedTask) {
        return console.error('Tarefa não encontrada');
      }
      res.redirect('/projects');

    } catch (error) {
      console.error('Erro ao atualizar a tarefa:', error);
      console.error('Erro interno do servidor');
    }
  },
  DeleteTask: async (req, res) => {
    const taskId = req.params.id;

    try {
      const deletedTask = await Task.findByIdAndDelete(taskId);

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
    const taskId = req.params.id;
    const { members } = req.body;

    try {
      const updatedTask = await Task.findByIdAndUpdate(
        taskId,
        { $addToSet: { members: members } },
        { new: true }
      );

      if (!updatedTask) {
        return console.error('Tarefa não encontrada');
      }

      console.log('Membros adicionados com sucesso');
    } catch (error) {
      console.error('Erro ao adicionar membros à tarefa:', error);
      console.error('Erro interno do servidor');
    }
  },
  removeMembers: async (req, res) => {
    const taskId = req.params.id;
    const { members } = req.body;

    try {
      const updatedTask = await Task.findByIdAndUpdate(
        taskId,
        { $pullAll: { members: members } },
        { new: true }
      );

      if (!updatedTask) {
        return console.error('Tarefa não encontrada');
      }

      console.log('Membros removidos com sucesso');
    } catch (error) {
      console.error('Erro ao remover membros da tarefa:', error);
      console.error('Erro interno do servidor');
    }
  },
  changeAdmTask: async (req, res) => {
    const taskId = req.params.id;
    const { leader } = req.body;

    try {
      const updatedTask = await Task.findByIdAndUpdate(
        taskId,
        { leader: leader },
        { new: true }
      );

      if (!updatedTask) {
        return console.error('Tarefa não encontrada');
      }

      console.log('Administrador da tarefa alterado com sucesso');
    } catch (error) {
      console.error('Erro ao alterar o administrador da tarefa:', error);
      console.error('Erro interno do servidor');
    }
  }
};

module.exports = userController;
