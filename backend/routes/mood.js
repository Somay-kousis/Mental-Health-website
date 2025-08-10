// // routes/mood.js
// const express = require('express');
// const router = express.Router();
// const authenticateToken = require('../middleware/auth');
// const MoodEntry = require('../models/MoodEntry');
// const { updateXP } = require('../utils/xpUtils');

// router.post('/mood', authenticateToken, async (req, res) => {
//   const { mood, timeOfDay } = req.body;


//   await updateXP(req.user.id, 10);
//   res.json({ message: 'Mood saved and XP awarded!' });
// });

// router.post('/', authenticateToken, async (req, res) => {
//   console.log(' /api/mood route hit');
//   const { mood, timeOfDay } = req.body;
//   const userId = req.user.id;

//   const today = new Date();
//   today.setHours(0, 0, 0, 0);

//   try {
//     const existingEntry = await MoodEntry.findOne({
//       userId,
//       timeOfDay,
//       date: today,
//     });

//     if (existingEntry) {
//       existingEntry.mood = mood;
//       await existingEntry.save();
//       return res.json({ message: 'Mood updated.' });
//     }

//     const newEntry = new MoodEntry({
//       userId,
//       mood,
//       timeOfDay,
//       date: today,
//     });

//     await newEntry.save();
//     res.status(201).json({ message: 'Mood saved.' });
//   } catch (error) {
//     console.error(' Mood save error:', error); 
//     res.status(500).json({ error: 'Server error.' });
//   }
// });

// router.get('/journey', authenticateToken, async (req, res) => {
//   const userId = req.user.id;

//   try {
//     const moodData = await MoodEntry.find({ userId })
//       .sort({ date: 1 })
//       .select('mood timeOfDay date -_id');

//     res.json(moodData);
//   } catch (error) {
//     res.status(500).json({ error: 'Could not fetch mood data.' });
//   }
// });

// module.exports = router;
// routes/mood.js
// routes/mood.js
const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/auth');
const MoodEntry = require('../models/MoodEntry');
const { updateXP } = require('../utils/xpUtils');

// This route is for the mood quiz, but let's keep the logic from your dashboard mood selector too
router.post('/mood', authenticateToken, async (req, res) => {
  const { mood, timeOfDay } = req.body;
  await updateXP(req.user.id, 10);
  res.json({ message: 'Mood saved and XP awarded!' });
});

// This is the main route for saving a mood from the dashboard
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

// This route gets the full history for the chart
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

// This is the new route to get the single most recent mood entry
router.get('/latest', authenticateToken, async (req, res) => {
  try {
    const latestMood = await MoodEntry.findOne({ userId: req.user.id })
      .sort({ createdAt: -1 }); // Sort by creation time to get the newest one

    if (!latestMood) {
      return res.status(404).json({ message: 'No mood entries found.' });
    }
    
    res.json(latestMood);

  } catch (error) {
    console.error("Error fetching latest mood:", error);
    res.status(500).json({ error: 'Server error while fetching latest mood.' });
  }
});

module.exports = router;