// File: app.js (The New, Merged Version)

require('dotenv').config();

// --- 1. CORE MODULES ---
const express    = require('express');
const mongoose   = require('mongoose');
const cors       = require('cors');
const http       = require('http');
const { Server } = require('socket.io');

// --- 2. IMPORT ALL ROUTES FROM BOTH PROJECTS ---
// Routes from your original chat application
const authRoutes     = require('./routes/auth');
const roomRoutes     = require('./routes/roomRoutes');
const messageRoutes  = require('./routes/messageRoutes');
// User route (we will use the 'user.js' version as it's more complete)
const userRoutes     = require('./routes/user'); 
// New routes from your friends' project
const moodRoutes = require('./routes/mood');
const logRoutes = require('./routes/log');
const challengeRoutes = require('./routes/challenges');
const stepsRoutes = require('./routes/steps');


// --- 3. SERVER & SOCKET.IO SETUP ---
// This setup is essential for real-time chat to work
const app    = express();
const server = http.createServer(app);
const io     = new Server(server, {
  cors: {
    origin: '*', // Remember to change this to your frontend URL in production
    methods: ['GET', 'POST']
  }
});


// --- 4. MIDDLEWARE ---
app.use(cors());
app.use(express.json());


// --- 5. MOUNT ALL API ROUTES ---
// Original Routes
app.use('/api', authRoutes);
app.use('/api', userRoutes); // This now uses the more complete user.js file
app.use('/api/rooms', roomRoutes);
app.use('/api/messages', messageRoutes);
// New Integrated Routes
app.use('/api/mood', moodRoutes);
app.use('/api/log', logRoutes);
app.use('/api/steps', stepsRoutes);
app.use('/api/daily-logs', challengeRoutes); // Note the specific path from your friend's file


// --- 6. SOCKET.IO REAL-TIME LOGIC ---
// This block remains unchanged and handles all live chat functionality
io.on('connection', socket => {
  console.log('🟢 Socket connected:', socket.id);

  socket.on('join-room', roomId => {
    console.log(`👥 Socket ${socket.id} joined room ${roomId}`);
    socket.join(roomId);
  });

  socket.on('send-message', async ({ roomId, sender, content }) => {
    try {
      const Message = require('./models/Message');
      const msg = new Message({ 
        roomId, 
        sender: sender._id,
        content 
      });
      await msg.save();

      const messageToSend = {
        _id: msg._id,
        roomId,
        sender,
        content,
        timestamp: msg.createdAt
      };

      io.to(roomId).emit('receive-message', messageToSend);
    } catch (error) {
      console.error('Error saving message:', error);
    }
  });

  socket.on('disconnect', () => {
    console.log('Socket disconnected:', socket.id);
  });
});


// --- 7. ERROR HANDLING & SERVER START ---
// 404 Route Handler for any unhandled routes
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Global Error:', err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// MongoDB Connection and Server Start
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => {
    console.log('✅ MongoDB connected');
    const PORT = process.env.PORT || 5000;
    // We use server.listen() here because of Socket.IO
    server.listen(PORT, () => {
      console.log(`🚀 Full Server (REST API + Socket.IO) running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('❌ MongoDB connection error:', err);
  });