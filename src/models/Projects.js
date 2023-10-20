const mongoose = require('mongoose');

const projectsSchema = new mongoose.Schema({
    name: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    enum: ['pending', 'in progress', 'completed'],
    default: 'pending',
},
  members: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    max: 4, 
  }],
});

const Project = mongoose.model('Project', projectsSchema);

module.exports = Project;
