const mongoose = require('mongoose');

const shortUrlSchema = new mongoose.Schema({
  originalUrl: { type: String, required: true },
  shortCode: { type: String, required: true, unique: true },
  label: { type: String, default: '' },
  userId: { type: String, required: true }, // This can now be 'anonymous' or a user ID
  clicks: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

const ShortURL = mongoose.model('ShortURL', shortUrlSchema);

module.exports = { ShortURL };
