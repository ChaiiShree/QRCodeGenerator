const mongoose = require('mongoose');

// Define the URL Shortener Schema
const shortUrlSchema = new mongoose.Schema({
  originalUrl: {
    type: String,
    required: true
  },
  shortCode: {
    type: String,
    required: true,
    unique: true
  },
  label: {
    type: String,
    default: '' // Optional label for the shortened URL
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: '30d' // URLs will expire in 30 days
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Link to user schema
    required: true
  }
});

// Create the ShortURL model
const ShortURL = mongoose.model('ShortURL', shortUrlSchema);

module.exports = { ShortURL };
