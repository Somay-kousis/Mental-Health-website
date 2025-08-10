const express = require('express');
const router = express.Router();
const questions = require('../quiz-questions.json'); // Import the questions
const authenticateToken = require('../middleware/auth'); 
// GET /api/quiz/mood - Sends the list of questions to the frontend
router.get('/mood', (req, res) => {
  res.json(questions);
});

// POST /api/quiz/mood/submit - Receives answers, calculates a score, and returns a result
router.post('/mood/submit', (req, res) => {
  const { answers } = req.body; // Expects an array of answer values, e.g., [5, 4, 3, 2]

  if (!answers || !Array.isArray(answers)) {
    return res.status(400).json({ error: 'Invalid answers format.' });
  }

  // Calculate the total score
  const totalScore = answers.reduce((sum, value) => sum + value, 0);
  const maxScore = questions.length * 5; // Max possible score
  const percentage = (totalScore / maxScore) * 100;

  let result = {
    mood: 'Neutral',
    feedback: 'It seems like you\'re navigating the usual ups and downs. Keep checking in with yourself.'
  };

  if (percentage >= 80) {
    result = {
      mood: 'Positive',
      feedback: 'It sounds like you\'re feeling great and managing things well! Keep up the positive momentum.'
    };
  } else if (percentage >= 60) {
    result = {
      mood: 'Slightly Positive',
      feedback: 'You seem to be in a generally good space. Remember to take time for self-care to keep your spirits high.'
    };
  } else if (percentage < 40) {
    result = {
      mood: 'Struggling',
      feedback: 'It sounds like things are tough right now. Please be kind to yourself and consider talking to a friend, family member, or professional.'
    };
  }
  
  // Here you could also save the result to a new MoodEntry model in the database for tracking over time
  
  res.json({ totalScore, ...result });
});

// Add this new route to routes/mood.js

// GET /api/mood/latest - Fetches the most recent mood entry for the logged-in user
router.get('/latest', authenticateToken, async (req, res) => {
  try {
    const latestMood = await MoodEntry.findOne({ userId: req.user.id })
      .sort({ createdAt: -1 }); // Sort by date descending

    if (!latestMood) {
      return res.status(404).json({ message: 'No mood entries found.' });
    }
    
    res.json(latestMood);

  } catch (error) {
    res.status(500).json({ error: 'Server error.' });
  }
});

module.exports = router;