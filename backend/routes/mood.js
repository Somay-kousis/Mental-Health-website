// routes/mood.js
const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/auth');
const MoodEntry = require('../models/MoodEntry');
const { updateXP } = require('../utils/xpUtils');

router.post('/mood', authenticateToken, async (req, res) => {
  const { mood, timeOfDay } = req.body;


  await updateXP(req.user.id, 10);
  res.json({ message: 'Mood saved and XP awarded!' });
});

router.post('/', authenticateToken, async (req, res) => {
  console.log(' /api/mood route hit');
  const { mood, timeOfDay } = req.body;
  const userId = req.user.id;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  try {
    const existingEntry = await MoodEntry.findOne({
      userId,
      timeOfDay,
      date: today,
    });

    if (existingEntry) {
      existingEntry.mood = mood;
      await existingEntry.save();
      return res.json({ message: 'Mood updated.' });
    }

    const newEntry = new MoodEntry({
      userId,
      mood,
      timeOfDay,
      date: today,
    });

    await newEntry.save();
    res.status(201).json({ message: 'Mood saved.' });
  } catch (error) {
    console.error(' Mood save error:', error); 
    res.status(500).json({ error: 'Server error.' });
  }
});

router.get('/journey', authenticateToken, async (req, res) => {
  const userId = req.user.id;

  try {
    const moodData = await MoodEntry.find({ userId })
      .sort({ date: 1 })
      .select('mood timeOfDay date -_id');

    res.json(moodData);
  } catch (error) {
    res.status(500).json({ error: 'Could not fetch mood data.' });
  }
});

module.exports = router;
