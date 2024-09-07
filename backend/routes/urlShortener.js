const express = require('express');
const { ShortURL } = require('../models/ShortUrl'); // Adjust path as needed
const validUrl = require('valid-url');
const router = express.Router();
const mongoose = require('mongoose');

// POST to create a shortened URL
router.post('/shorten', async (req, res) => {
  const { originalUrl, label, userId } = req.body;

  // Validate URL
  if (!validUrl.isUri(originalUrl)) {
    return res.status(400).json({ message: 'Invalid URL' });
  }

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ message: 'Invalid user ID' });
  }

  try {
    const shortCode = Math.random().toString(36).substr(2, 8); // Simple random short code generator

    const shortUrl = new ShortURL({
      originalUrl,
      shortCode,
      label: label || '', // Use provided label or default to empty string
      userId
    });

    await shortUrl.save();
    
    const url = `${req.protocol}://${req.get('host')}/u/${shortCode}`;
    res.status(201).json({ originalUrl, shortUrl: url, label }); // Return both URLs and label
  } catch (error) {
    console.error('Error saving short URL:', error);
    res.status(500).json({ message: 'Failed to shorten URL' });
  }
});

// GET to handle short URL redirection
router.get('/u/:shortCode', async (req, res) => {
  const { shortCode } = req.params;

  try {
    const shortUrl = await ShortURL.findOne({ shortCode });

    if (shortUrl) {
      return res.redirect(shortUrl.originalUrl); // Redirect to the original URL
    } else {
      return res.status(404).json({ message: 'Short URL not found' });
    }
  } catch (error) {
    console.error('Error finding original URL:', error);
    res.status(500).json({ message: 'Failed to redirect' });
  }
});

// DELETE to remove a URL
router.delete('/u/:shortCode', async (req, res) => {
  const { shortCode } = req.params;

  try {
    const result = await ShortURL.deleteOne({ shortCode });

    if (result.deletedCount > 0) {
      return res.status(200).json({ message: 'Short URL deleted successfully' });
    } else {
      return res.status(404).json({ message: 'Short URL not found' });
    }
  } catch (error) {
    console.error('Error deleting URL:', error);
    res.status(500).json({ message: 'Failed to delete URL' });
  }
});

module.exports = router;
