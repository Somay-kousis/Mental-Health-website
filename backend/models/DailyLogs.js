const mongoose = require('mongoose');

const dailyLogSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  challengeId: { type: String, required: true },
  date: { type: String, required: true },
  entry: { type: String, required: true }
});

module.exports = mongoose.model('DailyLog', dailyLogSchema);
