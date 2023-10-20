const { body } = require('express-validator');
const User = require('../models/users');
const bcrypt = require('bcrypt');

const validation = [
    body('email')
        .notEmpty().withMessage('Insira um email').bail()
        .isEmail().withMessage('Insira um formato de email válido')
        .custom(async (value) => {
            const email = await User.findOne({ email: value });
            if (!email) {
                throw new Error('Email ou credenciais incorretas (email)');
            }
            return true;
        }),
    body('password')
        .notEmpty().withMessage('Insira sua senha').bail()
        .custom(async (value, { req }) => {
            const user = await User.findOne({ email: req.body.email });
            if (user) {
                const passValidation = bcrypt.compareSync(value, user.senha);
                if (!passValidation) {
                    throw new Error('Email ou credenciais incorretas (pass)');
                }
                // Remover a senha do objeto do usuário
                const userWithoutPassword = user.toObject();
                delete userWithoutPassword.senha;

                // Salvar informações na sessão do lado do servidor
                req.session.userLogged = userWithoutPassword;

                return true;
            }
        }),
];

module.exports = validation;
