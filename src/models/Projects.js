const mongoose = require('mongoose');

const projectsSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  members: [{ 
    type: String,
    ref: 'User',
    max: 4,
  }],
  working: [{
    type: String,
    ref: 'User',
  }],
  creator: {
    type: String, 
    required: true,
  },
  leader: {
    type: String, 
    required: true,
  },
  deadline: {
    type: Date,
    required: true,
  },
  description: {
    type: String,
    maxlength: 150, 
    required: true,
  },
  tasks: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task',
    max: 15,
  }]
});

const Project = mongoose.model('Project', projectsSchema);

module.exports = Project;
