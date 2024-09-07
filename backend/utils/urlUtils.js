const crypto = require('crypto');
const { ShortURL } = require('../models/ShortURL');

// Function to generate a random short code
function generateShortCode() {
  return crypto.randomBytes(4).toString('hex'); // Generates a random 8-character code
}

// Function to save the short URL in the database
async function saveShortUrl(originalUrl) {
  const shortCode = generateShortCode();

  const newShortUrl = new ShortURL({
    originalUrl,
    shortCode
  });

  await newShortUrl.save();
  return shortCode; // Return the short code for later use
}

// Function to find the original URL based on the short code
async function findOriginalUrl(shortCode) {
  const shortUrl = await ShortURL.findOne({ shortCode });
  return shortUrl ? shortUrl.originalUrl : null; // Return the original URL if found
}

module.exports = { saveShortUrl, findOriginalUrl };
