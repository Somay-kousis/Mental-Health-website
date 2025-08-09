const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/auth');
const User = require('../models/User');
function getLevelFromXP(xp) {
  let level = 1;
  let xpRequired = 10;

  while (xp >= xpRequired) {
    level++;
    xpRequired += level * 10;
  }

  return level;
}



router.get('/profile', authenticateToken, (req, res) => {
  res.json({ message: 'Profile data', user: req.user });
});

router.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString(), uptime: process.uptime() });
});
router.get('/xp', authenticateToken, async (req, res) => {
  res.json({ xp: req.user.xp,
    level: req.user.level,
    dailyStreak: req.user.dailyStreak,
   });
});
router.post('/xp', authenticateToken, async (req, res) => {
  const { amount } = req.body; // amount of XP to add
  if (typeof amount !== 'number' || amount <= 0) {
    return res.status(400).json({ error: 'Invalid XP amount' });
  }

  req.user.xp += amount;
  req.user.level = getLevelFromXP(req.user.xp); 
  
await req.user.save();
res.json({ 
  message: 'XP and level updated', 
  xp: req.user.xp, 
  level: req.user.level ,
  dailyStreak: req.user.dailyStreak
});



});
router.put('/update-profile', authenticateToken, async (req, res) => {
  try {
    const { username, email, bio, pronouns, profilePicture } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { username, email, bio, pronouns, profilePicture },
      { new: true, runValidators: true }
    ).select('-password'); // Don't return password

    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ message: 'Profile updated', user: updatedUser });
  } catch (err) {
    console.error('Update error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});
module.exports = router;
