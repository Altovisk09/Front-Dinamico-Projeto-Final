const mongoose = require('mongoose');

const tasksSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    enum: ['pending', 'in progress', 'completed'],
    default: 'pending',
  },
  working: [{
    type: String,
    ref: 'User',
  }],
  creator: {
    type: String, 
    required: true,
  },
  deadline: {
    type: Date,
    required: true,
  },
  description: {
    type: String,
    maxlength: 100, 
    required: true,
  }
});

const Task = mongoose.model('Task', tasksSchema);

module.exports = Task;
