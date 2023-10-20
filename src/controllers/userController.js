const User = require('../models/users');
const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');


const userController = {
  signup: (req, res) => {
    let {nameUser, emailUser} = req.body;
    let securityPass = bcrypt.hashSync(req.body.password, 10)
    let resultValidation = validationResult(req)

    if(resultValidation.errors.length > 0){
        return res.render('signup', {
            errors: locals.resultValidation.mapped(),
            oldData: req.body
        })
    }else{
        const newUser = new User({
            nome: `${nameUser}`,
            email: `${emailUser}`,
            senha: `${securityPass}`,
            projetos: [],
          });
      
          newUser.save()
            .then((user) => {
            res.redirect('projects')
              console.log('Usuário cadastrado com sucesso:', user);
            })
            
            .catch((error) => {
              console.error('Erro ao cadastrar o usuário:', error);
            });
    }
  },
};

module.exports = userController;
