const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    nome: {
      type: String,
      unique: true, // Deve garantir que o nome seja único
      required: true,
    },
    email: {
      type: String,
      unique: true, // Deve garantir que o email seja único
      required: true,
    },
    senha: {
      type: String,
      required: true,
    },
    projetos: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Project' }],
  });
  

const Users = mongoose.model('User', userSchema);

module.exports = Users;
