require('dotenv').config();
const express = require('express');
const cors = require('cors');

const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');

const moodRoutes = require('./routes/mood');

    const logRoutes = require('./routes/log');


const challengeRoutes = require('./routes/challenges');

const app = express();

app.use(express.json());
app.use(cors());
app.use('/api/mood', moodRoutes);
app.use('/api/log', logRoutes);
app.use('/api/user', require('./routes/user'));
app.use('/api/steps', require('./routes/steps'));


connectDB(process.env.MONGODB_URI);

app.use('/api', authRoutes);
app.use('/api', userRoutes);
app.use('/api/daily-logs', require('./routes/challenges'));




app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});





app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});







const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
