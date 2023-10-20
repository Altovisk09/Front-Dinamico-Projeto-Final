const User = require('../models/users');

const userController = {
  teste: (req, res) => {
    const novoUsuario = new User({
      nome: 'Nome do Usuário',
      email: 'usuario@email.com',
      senha: 'senha123',
      projetos: [],
    });

    novoUsuario.save()
      .then((user) => {
        console.log('Usuário cadastrado com sucesso:', user);
      })
      .catch((error) => {
        console.error('Erro ao cadastrar o usuário:', error);
      });
  },
};

module.exports = userController;
