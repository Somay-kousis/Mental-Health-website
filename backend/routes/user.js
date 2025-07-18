const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/auth');

router.get('/profile', authenticateToken, (req, res) => {
  res.json({ message: 'Profile data', user: req.user });
});

router.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString(), uptime: process.uptime() });
});
router.get('/xp', authenticateToken, async (req, res) => {
  res.json({ xp: req.user.xp });
});
router.post('/xp', authenticateToken, async (req, res) => {
  const { amount } = req.body; // amount of XP to add
  if (typeof amount !== 'number' || amount <= 0) {
    return res.status(400).json({ error: 'Invalid XP amount' });
  }

  req.user.xp += amount;
  await req.user.save();
  res.json({ message: 'XP updated', xp: req.user.xp });
});
module.exports = router;
