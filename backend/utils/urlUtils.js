const crypto = require('crypto');
const { ShortURL } = require('../models/ShortUrl');

// Function to generate a random short code
async function generateShortCode() {
  let shortCode;
  let exists;

  do {
    shortCode = crypto.randomBytes(4).toString('hex'); // 8 character code
    exists = await ShortURL.findOne({ shortCode });
  } while (exists);

  return shortCode;
}

module.exports = { generateShortCode };
