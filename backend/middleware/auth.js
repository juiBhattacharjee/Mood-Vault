const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Helper to ensure we always have a valid secret key
const getJwtSecret = () => process.env.JWT_SECRET || "temporary_portfolio_secret_key_123";

// REGISTER NEW ACCOUNT
router.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    let user = await User.findOne({ username });
    if (user) return res.status(400).json({ message: 'User already exists' });

    user = new User({ username, password });
    
    // Hash the password before saving
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    await user.save();

    // Create and return JWT Token (Using our safe key function)
    const token = jwt.sign({ userId: user._id }, getJwtSecret(), { expiresIn: '7d' });
    res.status(201).json({ token, username: user.username });
  } catch (err) {
    console.error("❌ Registration Error:", err); // Clear server logging
    res.status(500).json({ error: 'Server Error', message: err.message });
  }
});

// LOGIN EXISTING ACCOUNT
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ message: 'Invalid Credentials' });

    // Verify Password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid Credentials' });

    // Create and return JWT Token (Using our safe key function)
    const token = jwt.sign({ userId: user._id }, getJwtSecret(), { expiresIn: '7d' });
    res.json({ token, username: user.username });
  } catch (err) {
    console.error("❌ Login Error:", err); // Clear server logging
    res.status(500).json({ error: 'Server Error', message: err.message });
  }
});

module.exports = router;