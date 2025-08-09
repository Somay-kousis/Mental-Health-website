const express = require('express');
const User = require('../models/User');
const router = express.Router();
// You might need your auth middleware here as well
const authenticateToken = require('../middleware/auth');

// ... your other routes like /api/profile may be here ...


// --- ADD THIS NEW ROUTE ---
// It finds a user by their ID and returns their public info.
router.get('/users/:id', async (req, res) => {
  try {
    // Find the user by the ID from the URL parameter
    const user = await User.findById(req.params.id).select('-password'); // .select('-password') prevents sending the password hash
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;