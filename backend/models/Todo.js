const mongoose = require('mongoose');

// Define Todo Schema
const todoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true, // Ensure title is provided
  },
  completed: {
    type: Boolean,
    default: false // Set default to `false`
  },
  qrCode: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'QRCode' // Reference the QRCode model
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Create a model for Todo
const Todo = mongoose.model('Todo', todoSchema, 'TodoAppCollections');

module.exports = { Todo };
