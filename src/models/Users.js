const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
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
