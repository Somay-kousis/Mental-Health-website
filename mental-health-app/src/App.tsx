import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

import Dashboard from './components/Dashboard';
import Profile from './components/Profile';
import EditProfile from './components/EditProfile'; 
import Challenges from './components/Challenges';
import ChallengeDetails from './components/ChallengeDetails'; 
import Achievements from './components/Achievements';
import ChatRoom from './components/ChatRoom';
import SearchRoom from './components/SearchRoom';
import CreateRoom from './components/CreateRoom';
import Home from './components/Home';
import Signup from './components/Signup';

import AnimatedCursor from './components/AnimatedCursor';
import PageTransition from './components/PageTransition';


import { AuthProvider } from './context/AuthContext';


import './css/main.css';
import './css/main-dashboard.css';
import './css/profile-page.css';
import './css/wellness-challenges.css';
import './css/achievements.css';
import './css/chatroom.css';
import './css/search-room.css';
import './css/components.css';
import './css/animations.css';
import './App.css';

function App() {
  return (
      <div className="App">
        <AnimatedCursor />
        <AnimatePresence mode="wait">
          <Routes>
            {/* --- Core  Routes --- */}
            <Route path="/" element={<PageTransition><Home /></PageTransition>} />
            <Route path="/signup" element={<PageTransition><Signup /></PageTransition>} />
            <Route path="/dashboard" element={<PageTransition><Dashboard /></PageTransition>} />
            
            {/* --- Profile Routes --- */}
            <Route path="/profile" element={<PageTransition><Profile /></PageTransition>} />
            <Route path="/edit-profile" element={<PageTransition><EditProfile /></PageTransition>} />
            
            {/* --- Challenges Routes --- */}
            <Route path="/challenges" element={<PageTransition><Challenges /></PageTransition>} />
            <Route path="/challenges/:id" element={<PageTransition><ChallengeDetails /></PageTransition>} />
            
            <Route path="/achievements" element={<PageTransition><Achievements /></PageTransition>} />
            
            {/* --- Chat & Room Routes (Corrected and Merged) --- */}
            <Route path="/rooms" element={<PageTransition><SearchRoom /></PageTransition>} />
            <Route path="/search-room" element={<PageTransition><SearchRoom /></PageTransition>} />
            <Route path="/create-room" element={<PageTransition><CreateRoom /></PageTransition>} />
            {/* This is the correct dynamic route for a specific chat room */}
            <Route path="/chatroom/:roomId" element={<PageTransition><ChatRoom /></PageTransition>} />


            {/* --- Convenience Redirects --- */}
            <Route path="/home" element={<Navigate to="/" replace />} />
            <Route path="/main" element={<Navigate to="/dashboard" replace />} />
            <Route path="/search" element={<Navigate to="/search-room" replace />} />
            <Route path="/create" element={<Navigate to="/create-room" replace />} />
            <Route path="/user" element={<Navigate to="/profile" replace />} />
            <Route path="/account" element={<Navigate to="/profile" replace />} />
            
            {/* Fallback route for a generic /chat path, could redirect to search */}
            <Route path="/chat" element={<Navigate to="/rooms" replace />} /> 

          </Routes>
        </AnimatePresence>
      </div>
  );
}

export default App;
