const mongoose = require('mongoose');

const StepSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  date: {
    type: String,
    required: true, 
  },
  steps: {
    type: Number,
    required: true,
  },
  distanceKm: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model('Step', StepSchema);
