const express = require('express');
const User = require('../models/User');
const router = express.Router();

// POST route to create a new user
router.post('/create', async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const newUser = new User({ username, email, password });
    await newUser.save();
    res.status(201).json(newUser);
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ message: 'Failed to create user' });
  }
});

module.exports = router;
