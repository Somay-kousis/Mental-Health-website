const express = require('express');
const Room = require('../models/Room');
const router = express.Router();

/**
 * @route   GET /api/rooms
 * @desc    Get all public rooms, or search public rooms by name/description
 * @access  Public
 * @query   ?q=<search_term> (optional)
 */
router.get('/', async (req, res) => {
  try {
    const { q } = req.query; // Get search term from the query parameter

    // The base filter is to only find rooms that are 'public'
    const queryFilter = { privacy: 'public' };

    if (q) {
      // If a search term 'q' is provided, we add a search condition.
      // This uses a regular expression to perform a case-insensitive search
      // on both the roomName and roomDescription fields.
      queryFilter.$or = [
        { roomName: { $regex: q, $options: 'i' } },
        { roomDescription: { $regex: q, $options: 'i' } }
      ];
    }

    // Execute the query: find rooms matching the filter and sort by most recent
    const rooms = await Room.find(queryFilter).sort('-createdAt');
    res.json(rooms);

  } catch (error) {
    console.error('Error fetching rooms:', error);
    res.status(500).json({ error: 'Server error while fetching rooms' });
  }
});

// This route to create a room remains the same.
// Anyone can create a room, and it defaults to public.
router.post('/create', async (req, res) => {
  try {
    const room = await Room.create(req.body);
    res.status(201).json({ room });
  } catch(error) {
    console.error('Error creating room:', error);
    res.status(500).json({ error: 'Server error while creating room' });
  }
});

// added feature after correct one
// Add this new route
// GET /api/rooms/:id - Get a single room by its ID
router.get('/:id', async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) {
      return res.status(404).json({ error: 'Room not found' });
    }
    res.json(room);
  } catch (error) {
    console.error('Error fetching single room:', error);
    res.status(500).json({ error: 'Server error' });
  }
});
// till here 


module.exports = router;
