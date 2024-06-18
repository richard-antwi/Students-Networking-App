const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Register API
router.post('/register', async (req, res) => {
  console.log('Received data:', req.body);  
  try {
    const user = await User.create(req.body);
    res.json(user);
  } catch (err) {
    console.error('Error during registration:', err);
    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: 'Validation Error', errors: err.errors });
    }
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Login API
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    if (await user.checkPassword(password)) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
      return res.json({
        message: "Login successful",
        token,
        userId: user._id 
      });
    } else {
      return res.status(401).json({ error: "Invalid credentials" });
    }
  } catch (err) {
    console.error('Error during login:', err);
    res.status(500).json({ error: 'Server error', message: err.message });
  }
});

module.exports = router;
