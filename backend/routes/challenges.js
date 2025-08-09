const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/auth');
const DailyLog = require('../models/DailyLogs');
router.post('/join', authenticateToken, async (req, res) => {
  const { challengeId } = req.body;

  if (!challengeId) {
    return res.status(400).json({ message: 'Missing challenge ID' });
  }

  try {
    // check if already joined
    const existing = await JoinedChallenge.findOne({
      userId: req.user.id,
      challengeId
    });

    if (existing) {
      return res.status(400).json({ message: 'You have already joined this challenge' });
    }

    const join = new JoinedChallenge({
      userId: req.user.id,
      challengeId
    });
    await join.save();

    res.json({ message: 'Challenge joined successfully', join });
  } catch (err) {
    console.error('Error joining challenge:', err);
    res.status(500).json({ message: 'Failed to join challenge' });
  }
});
router.post('/log', authenticateToken, async (req, res) => {
  console.log("Authenticated user:", req.user);
  console.log("Incoming log request:", req.body);

  const { challengeId, date, entry } = req.body;

  if (!challengeId || !date || !entry) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    const log = await DailyLog.findOneAndUpdate(
      { userId: req.user.id, challengeId, date },
      { entry },
      { upsert: true, new: true }
    );

    res.json({ message: 'Log saved', log });
  } catch (err) {
    console.error("Error saving daily log:", err);
    res.status(500).json({ message: 'Failed to save log', error: err.message });
  }
});


router.get('/logs/:challengeId', authenticateToken, async (req, res) => {
  try {
    const logs = await DailyLog.find({
      userId: req.user.id,
      challengeId: req.params.challengeId
    }).sort({ date: 1 });

    res.json({ logs });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch logs' });
  }
});

module.exports = router;

