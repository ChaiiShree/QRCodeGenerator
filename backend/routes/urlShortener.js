const express = require('express');
const { saveShortUrl, findOriginalUrl } = require('../utils/urlUtils');
const router = express.Router();
const validUrl = require('valid-url');

// POST to create a shortened URL
router.post('/shorten', async (req, res) => {
  const { originalUrl } = req.body;

  // Validate URL
  if (!validUrl.isUri(originalUrl)) {
    return res.status(400).json({ message: 'Invalid URL' });
  }

  try {
    const shortCode = await saveShortUrl(originalUrl);
    const shortUrl = `${req.protocol}://${req.get('host')}/u/${shortCode}`;

    res.status(201).json({ originalUrl, shortUrl }); // Return both URLs
  } catch (error) {
    console.error('Error saving short URL:', error);
    res.status(500).json({ message: 'Failed to shorten URL' });
  }
});

// GET to handle short URL redirection
router.get('/u/:shortCode', async (req, res) => {
  const { shortCode } = req.params;

  try {
    const originalUrl = await findOriginalUrl(shortCode);

    if (originalUrl) {
      return res.redirect(originalUrl); // Redirect to the original URL
    } else {
      return res.status(404).json({ message: 'Short URL not found' });
    }
  } catch (error) {
    console.error('Error finding original URL:', error);
    res.status(500).json({ message: 'Failed to redirect' });
  }
});

module.exports = router;
