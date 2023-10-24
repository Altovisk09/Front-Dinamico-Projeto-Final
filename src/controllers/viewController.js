const Project = require('../models/Projects');

const viewController = {
    index: (req, res) => {
        res.render('index')
    },
    signup: (req, res) => {
        res.render('signup')
    },
    signin: (req, res) => {
        res.render('signin')
    },
    logged: async (req, res) => {
        try {
          const user = req.session.userLogged.apelido;
          console.log('ID do usuário logado:', req.session.userLogged._id);
          const userProjects = await Project.find({ members: user });
          console.log('projetos do usuário logado:',userProjects)  
          res.render('projects', { userProjects });
        } catch (error) {
          console.error('Erro ao carregar projetos do usuário:', error);
        }
      },
      profile: (req, res) => {
        res.render('profile')
      }
}

module.exports = viewController;