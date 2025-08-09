const mongoose = require('mongoose');

const moodEntrySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  mood: {
    type: Number,
    required: true,
    min: 1,
    max: 10,
  },
  timeOfDay: {
    type: String,
    enum: ['morning', 'night'],
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
});

module.exports = mongoose.model('MoodEntry', moodEntrySchema);
