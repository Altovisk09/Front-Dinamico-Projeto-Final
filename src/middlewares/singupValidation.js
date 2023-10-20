const { body } = require('express-validator');
const User = require('../models/users');

const validation = [
    body('username')
        .notEmpty().withMessage('Insira um nick para o usuário').bail()
        .isLength({ max: 10 }).withMessage('Máximo de caracteres permitidos (10)')
        .custom(async (value) => {
            const user = await User.findOne({ username: value });
            if (user) {
                throw new Error('O usuário já está em uso');
            }
            return true;
        }),
    body('email')
        .notEmpty().withMessage('Insira um email').bail()
        .isEmail().withMessage('Insira um formato de email válido')
        .custom(async (value) => {
            const email = await User.findOne({ email: value });
            if (email) {
                throw new Error('Este email já está em uso');
            }
            return true;
        }),
    body('password')
        .notEmpty().withMessage('Insira uma senha').bail()
        .isLength({ min: 6 }).withMessage('Sua senha deve ter no mínimo 6 caracteres'),
];

module.exports = validation;
