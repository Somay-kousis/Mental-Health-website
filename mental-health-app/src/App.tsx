import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Dashboard from './components/Dashboard';
import Profile from './components/Profile';
import Challenges from './components/Challenges';
import Achievements from './components/Achievements';
import ChatRoom from './components/ChatRoom';
import SearchRoom from './components/SearchRoom';
import CreateRoom from './components/CreateRoom';
import Home from './components/Home';
import AnimatedCursor from './components/AnimatedCursor';
import PageTransition from './components/PageTransition';
import EditProfile from './components/EditProfile';
import ChallengeDetails from './components/ChallengeDetails';

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
import Signup from './components/Signup';

function App() {
  return (
    <div className="App">
      <AnimatedCursor />
      <AnimatePresence mode="wait">
        <Routes>
          <Route path="/" element={
            <PageTransition>
              <Home />
            </PageTransition>
          } />
          <Route path="/dashboard" element={
            <PageTransition>
              <Dashboard />
            </PageTransition>
          } />
          
          <Route path="/profile" element={
  <PageTransition>
    <Profile />
  </PageTransition>
} />

<Route path="/edit-profile" element={
  <PageTransition>
    <EditProfile />
  </PageTransition>
} />
          <Route path="/challenges" element={
            <PageTransition>
              <Challenges />
            </PageTransition>
          } />
          <Route path="/edit-profile" element={
  <PageTransition>
    <EditProfile />
  </PageTransition>
} />
<Route path="/challenges/:id" element={<ChallengeDetails />} />

          <Route path="/achievements" element={
            <PageTransition>
              <Achievements />
            </PageTransition>
          } />
          <Route path="/chatroom" element={
            <PageTransition>
              <ChatRoom />
            </PageTransition>
          } />
          <Route path="/search-room" element={
            <PageTransition>
              <SearchRoom />
            </PageTransition>
          } />
          <Route path="/create-room" element={
            <PageTransition>
              <CreateRoom />
            </PageTransition>
          } />
          <Route path="/signup" element={
            <PageTransition>
              <Signup />
            </PageTransition>
          } />
          {/* Additional routes for full functionality */}
          <Route path="/rooms" element={
            <PageTransition>
              <SearchRoom />
            </PageTransition>
          } />
          <Route path="/chat" element={
            <PageTransition>
              <ChatRoom />
            </PageTransition>
          } />
          <Route path="/wellness" element={
            <PageTransition>
              <Challenges />
            </PageTransition>
          } />
          <Route path="/daily-log" element={
            <PageTransition>
              <Dashboard />
            </PageTransition>
          } />
          <Route path="/community" element={
            <PageTransition>
              <SearchRoom />
            </PageTransition>
          } />
          {/* Redirects for common navigation patterns */}
          <Route path="/home" element={<Navigate to="/" replace />} />
          <Route path="/main" element={<Navigate to="/dashboard" replace />} />
          <Route path="/search" element={<Navigate to="/search-room" replace />} />
          <Route path="/create" element={<Navigate to="/create-room" replace />} />
          <Route path="/achievement" element={<Navigate to="/achievements" replace />} />
          <Route path="/challenge" element={<Navigate to="/challenges" replace />} />
          <Route path="/user" element={<Navigate to="/profile" replace />} />
          <Route path="/account" element={<Navigate to="/profile" replace />} />
        </Routes>
      </AnimatePresence>
    </div>
  );
}

export default App;
