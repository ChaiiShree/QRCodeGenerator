const mongoose = require('mongoose');

const shortUrlSchema = new mongoose.Schema({
  originalUrl: {
    type: String,
    required: true,
  },
  shortCode: {
    type: String,
    required: true,
    unique: true, // Ensure short codes are unique
  },
  label: {
    type: String,
  },
  userId: {
    type: String, // Storing userId from Firebase, which is a string
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const ShortURL = mongoose.model('ShortURL', shortUrlSchema);

module.exports = { ShortURL };
