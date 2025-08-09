// routes/log.js
const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/auth');
const Log = require('../models/Log');
const { updateXP } = require('../utils/xpUtils');

router.post('/', authenticateToken, async (req, res) => {
  const { content } = req.body;

  if (!content) {
    return res.status(400).json({ error: 'Log content is required' });
  }

  try {
    const newLog = new Log({
      user: req.user.id,
      content,
      date: new Date().toISOString().split('T')[0],
    });

    await newLog.save();

    await updateXP(req.user.id, 15);

    res.status(201).json({ message: 'Log saved and XP awarded!' });
  } catch (err) {
    console.error('Error saving log:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/', authenticateToken, async (req, res) => {
  try {
    const logs = await Log.find({ user: req.user.id }).sort({ date: -1 });
    res.json(logs);
  } catch (err) {
    console.error('Error fetching logs:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
