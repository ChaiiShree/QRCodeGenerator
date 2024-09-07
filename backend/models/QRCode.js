const mongoose = require('mongoose');

// Define QRCode Schema
const qrCodeSchema = new mongoose.Schema({
  qrCodeImage: {
    type: Buffer, // Store image as binary data
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const QRCode = mongoose.model('QRCode', qrCodeSchema);

module.exports = { QRCode };
