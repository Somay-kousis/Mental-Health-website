const mongoose = require('mongoose');

const joinedChallengeSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  challengeId: { type: String, required: true },
  joinedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('JoinedChallenge', joinedChallengeSchema);