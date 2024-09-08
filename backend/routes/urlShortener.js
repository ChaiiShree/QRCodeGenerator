const express = require('express');
const { ShortURL } = require('../models/ShortUrl');
const validUrl = require('valid-url');
const { generateShortCode } = require('../utils/urlUtils');
const router = express.Router();

// POST to create a shortened URL
router.post('/shorten', async (req, res) => {
  const { originalUrl, label, userId } = req.body;

  // Validate URL
  if (!validUrl.isUri(originalUrl)) {
    return res.status(400).json({ message: 'Invalid URL' });
  }

  try {
    const shortCode = await generateShortCode();

    // Create a new short URL entry
    const shortUrl = new ShortURL({
      originalUrl,
      shortCode,
      label: label || '',
      userId: userId || 'anonymous', // Use 'anonymous' if userId is not provided
      clicks: 0, // Initialize clicks to 0
    });

    await shortUrl.save();
    const shortUrlFull = `${req.protocol}://${req.get('host')}/${shortCode}`;
    res.status(201).json({ originalUrl, shortUrl: shortUrlFull, label });
  } catch (error) {
    console.error('Error saving short URL:', error);
    res.status(500).json({ message: 'Failed to shorten URL' });
  }
});

// GET to handle short URL redirection
router.get('/:shortCode', async (req, res) => {
  const { shortCode } = req.params;
  console.log(`Attempting to redirect: ${shortCode}`);

  try {
    const shortUrl = await ShortURL.findOne({ shortCode });
    console.log(`ShortURL found:`, shortUrl);

    if (shortUrl) {
      shortUrl.clicks += 1;
      await shortUrl.save();

      console.log(`Redirecting to: ${shortUrl.originalUrl}`);
      return res.redirect(shortUrl.originalUrl);
    } else {
      console.log(`Short URL not found: ${shortCode}`);
      return res.status(404).json({ message: 'Short URL not found' });
    }
  } catch (error) {
    console.error('Error finding original URL:', error);
    res.status(500).json({ message: 'Failed to redirect' });
  }
});

module.exports = router;
