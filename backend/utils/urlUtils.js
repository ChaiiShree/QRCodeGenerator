const crypto = require('crypto');
const { ShortURL } = require('../models/ShortUrl');

// Function to generate a random short code
async function generateShortCode(length = 6) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let shortCode;
  let exists;
  let attempts = 0;
  const maxAttempts = 10;

  do {
    shortCode = '';
    for (let i = 0; i < length; i++) {
      shortCode += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    exists = await ShortURL.findOne({ shortCode });
    attempts++;

    if (attempts >= maxAttempts) {
      throw new Error('Failed to generate a unique short code after multiple attempts');
    }
  } while (exists);

  return shortCode;
}

module.exports = { generateShortCode };
