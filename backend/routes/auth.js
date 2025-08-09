const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this-in-production';

const generateToken = (userId) => jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' });
const { updateXP } = require('../utils/xpUtils');

router.post('/signup', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password)
      return res.status(400).json({ error: 'Username, email, and password are required' });

    if (password.length < 6)
      return res.status(400).json({ error: 'Password must be at least 6 characters long' });

    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser)
      return res.status(409).json({ error: 'User with this email or username already exists' });

    const user = new User({ username, email, password });
    await user.save();

    const token = generateToken(user._id);

    res.status(201).json({
      message: 'User created successfully',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error('Signup error:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        error: 'Validation error',
        details: Object.values(error.errors).map(err => err.message)
      });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/signin', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ error: 'Email and password are required' });

    const user = await User.findOne({ email });
    if (!user)
      return res.status(401).json({ error: 'Invalid email or password' });

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid)
      return res.status(401).json({ error: 'Invalid email or password' });

    await updateXP(user._id, 5); // 5 XP for login

    const today = new Date().toISOString().split('T')[0];
    const lastLogin = user.lastLoginDate ? user.lastLoginDate.toISOString().split('T')[0] : null;

    if (lastLogin !== today) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const isYesterday = lastLogin === yesterday.toISOString().split('T')[0];

      if (isYesterday) {
        user.dailyStreak += 1;
      } else {
        user.dailyStreak = 1; 
      }

      user.lastLoginDate = new Date();
      await user.save();
    }

    const token = generateToken(user._id);

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        createdAt: user.createdAt,
        dailyStreak: user.dailyStreak,
        lastLoginDate: user.lastLoginDate,
      },
    });
  } catch (error) {
    console.error('Signin error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


router.post('/logout', (req, res) => {
  res.json({ message: 'Logout successful. Please remove the token from client-side storage.' });
});

module.exports = router;
