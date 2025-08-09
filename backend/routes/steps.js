const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/auth');
const Step = require('../models/Step');
const User = require('../models/User');

router.post('/log', authenticateToken, async (req, res) => {
  const { date, steps, distanceKm } = req.body;

  try {
    const step = await Step.findOneAndUpdate(
      { userId: req.user.id, date },
      { steps, distanceKm },
      { upsert: true, new: true }
    );

    const xpEarned = Math.floor(distanceKm * 10);
    await User.findByIdAndUpdate(req.user.id, {
      $inc: { xp: xpEarned },
    });

    res.json({ step, xpEarned });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to log steps' });
  }
});

router.get('/', authenticateToken, async (req, res) => {
  try {
    const steps = await Step.find({ userId: req.user.id }).sort({ date: -1 });
    res.json(steps);
  } catch (err) {
    res.status(500).json({ error: 'Could not fetch step data' });
  }
});

module.exports = router;
