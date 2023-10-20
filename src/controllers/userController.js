const User = require('../models/users');
const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');


const userController = {
  signup: (req, res) => {
    let {username, email} = req.body;
    let securityPass = bcrypt.hashSync(req.body.password, 10)
    let resultValidation = validationResult(req)

    if(resultValidation.errors.length > 0){
        console.log(resultValidation.array()); 
    }else{
        const newUser = new User({
            nome: `${username}`,
            email: `${email }`,
            senha: `${securityPass}`,
            projetos: [],
          });
      
          newUser.save()
            .then((user) => {
            res.redirect('/projects')
              console.log('Usuário cadastrado com sucesso:', user);
            })
            
            .catch((error) => {
              console.error('Erro ao cadastrar o usuário:', error);
            });
    }
  },
  signin:(req, res) => {

  },
};

module.exports = userController;
