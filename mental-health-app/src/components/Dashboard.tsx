import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import Chart from 'chart.js/auto';
import AnimatedHeaderVisual from './AnimatedHeaderVisual';

const Dashboard: React.FC = () => {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [selectedTime, setSelectedTime] = useState<'morning' | 'night'>('morning');
  const [dailyLog, setDailyLog] = useState('');
  const [logEntries, setLogEntries] = useState<Array<{date: string, content: string}>>([]);

  useEffect(() => {
    // Initialize mood chart
    if (chartRef.current) {
      const ctx = chartRef.current.getContext('2d');
      if (ctx) {
        // Destroy existing chart if it exists
        if (chartInstance.current) {
          chartInstance.current.destroy();
        }

        // Sample mood data for the last 7 days
        const moodData = [7, 6, 8, 5, 9, 7, 8];
        const labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

        chartInstance.current = new Chart(ctx, {
          type: 'line',
          data: {
            labels: labels,
            datasets: [{
              label: 'Mood Score',
              data: moodData,
              borderColor: 'rgba(99, 102, 241, 1)',
              backgroundColor: 'rgba(99, 102, 241, 0.1)',
              borderWidth: 3,
              fill: true,
              tension: 0.4,
              pointBackgroundColor: 'rgba(99, 102, 241, 1)',
              pointBorderColor: '#fff',
              pointBorderWidth: 2,
              pointRadius: 6,
              pointHoverRadius: 8
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                display: false
              }
            },
            scales: {
              y: {
                beginAtZero: true,
                max: 10,
                ticks: {
                  stepSize: 2,
                  color: '#6B7280'
                },
                grid: {
                  color: 'rgba(107, 114, 128, 0.1)'
                }
              },
              x: {
                ticks: {
                  color: '#6B7280'
                },
                grid: {
                  color: 'rgba(107, 114, 128, 0.1)'
                }
              }
            }
          }
        });
      }
    }

    // Load sample log entries
    setLogEntries([
      { date: '2024-01-15', content: 'Had a great day today! Completed my morning meditation and felt very productive.' },
      { date: '2024-01-14', content: 'Feeling a bit stressed about work, but managed to stay positive.' },
      { date: '2024-01-13', content: 'Spent time with family, which always lifts my mood.' }
    ]);

    // Cleanup function
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, []);

  const handleMoodSelect = (value: number) => {
    setSelectedMood(value);
  };

  const handleTimeSelect = (time: 'morning' | 'night') => {
    setSelectedTime(time);
  };

  const handleSubmitMood = () => {
    if (selectedMood !== null) {
      alert(`Mood saved: ${selectedMood}/10 (${selectedTime})`);
      setSelectedMood(null);
    } else {
      alert('Please select a mood first!');
    }
  };

  const handleSaveLog = () => {
    if (dailyLog.trim()) {
      const newEntry = {
        date: new Date().toISOString().split('T')[0],
        content: dailyLog
      };
      setLogEntries([newEntry, ...logEntries]);
      setDailyLog('');
      alert('Daily log saved successfully!');
    } else {
      alert('Please write something before saving!');
    }
  };

  const moodLabels = ['Terrible', 'Very Bad', 'Bad', 'Not Great', 'Okay', 'Good', 'Very Good', 'Great', 'Amazing', 'Perfect'];

  return (
    <>
      <div className="floating-shapes global-shapes">
        <div className="floating-shape" />
        <div className="floating-shape" />
        <div className="floating-shape" />
        <div className="floating-shape" />
        <div className="floating-shape" />
        <div className="floating-shape" />
      </div>
      <div className="premium-grid" />
      
      {/* Navigation Sidebar */}
      <nav className="navigation">
        <Link to="/" className="nav-item" title="Home">
          <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
            <polyline points="9,22 9,12 15,12 15,22"/>
          </svg>
        </Link>
        <Link to="/dashboard" className="nav-item active" title="Dashboard">
          <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
            <rect x="3" y="13" width="7" height="8"/>
            <rect x="14" y="3" width="7" height="18"/>
          </svg>
        </Link>
        <Link to="/profile" className="nav-item" title="Profile">
          <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
            <circle cx="12" cy="8" r="4"/>
            <path d="M4 20c0-4 8-4 8-4s8 0 8 4"/>
          </svg>
        </Link>
        <Link to="/rooms" className="nav-item" title="Rooms">
          <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="8"/>
            <line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
        </Link>
        <Link to="/create-room" className="nav-item" title="Create Room">
          <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
            <line x1="12" y1="5" x2="12" y2="19"/>
            <line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
        </Link>
        <Link to="/challenges" className="nav-item" title="Challenges">
          <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
            <rect x="2" y="7" width="20" height="14" rx="2"/>
            <path d="M16 3v4"/>
            <path d="M8 3v4"/>
          </svg>
        </Link>
        <Link to="/achievements" className="nav-item" title="Achievements">
          <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
            <circle cx="12" cy="8" r="7"/>
            <polyline points="8.21 13.89 7.5 21 12 18.5 16.5 21 15.79 13.88"/>
          </svg>
        </Link>
      </nav>

      <main className="dashboard-container">
        <header className="dashboard-header" style={{ position: 'relative', overflow: 'hidden' }}>
          <AnimatedHeaderVisual />
          <div className="header-content" style={{ position: 'relative', zIndex: 1, flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
            <div className="welcome-section">
              <h1 className="premium-title">Welcome back, <span className="user-name gradient-text">User</span>! 👋</h1>
              <p className="header-subtitle premium-subtitle">How are you feeling today?</p>
            </div>
            <div className="dashboard-stats-row">
              <div className="stat-card premium-card">
                <div className="stat-icon">🔥</div>
                <div className="stat-info">
                  <span className="stat-value premium-number">7</span>
                  <span className="stat-label premium-text">Day Streak</span>
                </div>
              </div>
              <div className="stat-card premium-card">
                <div className="stat-icon">⭐</div>
                <div className="stat-info">
                  <span className="stat-value premium-number">1,250</span>
                  <span className="stat-label premium-text">XP Points</span>
                </div>
              </div>
              <div className="stat-card premium-card">
                <div className="stat-icon">🏆</div>
                <div className="stat-info">
                  <span className="stat-value premium-number">12</span>
                  <span className="stat-label premium-text">Achievements</span>
                </div>
              </div>
            </div>
          </div>
        </header>

        <section className="mood-section premium-section" id="mood-tracking">
          <div className="section-header">
            <h2 className="premium-section-title">Daily Mood Check</h2>
            <p className="premium-section-subtitle">Rate your mood from 1-10</p>
          </div>
          <div className="mood-selector">
            <div className="mood-dots">
              {[...Array(10)].map((_, i) => (
                <button 
                  key={i}
                  className={`mood-dot ${selectedMood === i + 1 ? 'selected' : ''}`}
                  onClick={() => handleMoodSelect(i + 1)}
                  title={moodLabels[i]}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            <div className="mood-time-selector">
              <button 
                className={`time-btn ${selectedTime === 'morning' ? 'active' : ''}`}
                onClick={() => handleTimeSelect('morning')}
              >
                🌅 Morning
              </button>
              <button 
                className={`time-btn ${selectedTime === 'night' ? 'active' : ''}`}
                onClick={() => handleTimeSelect('night')}
              >
                🌙 Night
              </button>
            </div>
            <button className="submit-mood-btn btn-primary" onClick={handleSubmitMood}>
              Save Mood
            </button>
          </div>
        </section>

        <section className="graph-section premium-section">
          <div className="section-header">
            <h2 className="premium-section-title">Your Mood Journey</h2>
            <p className="premium-section-subtitle">Track your emotional patterns over time</p>
          </div>
          <div className="graph-container premium-card">
            <canvas ref={chartRef} width={400} height={200}></canvas>
          </div>
        </section>

        <section className="daily-log-section premium-section" id="daily-log">
          <div className="section-header">
            <h2 className="premium-section-title">Daily Reflection</h2>
            <p className="premium-section-subtitle">Write about your day, thoughts, or feelings</p>
          </div>
          <div className="log-container">
            <div className="log-input-section premium-card">
              <textarea 
                value={dailyLog}
                onChange={(e) => setDailyLog(e.target.value)}
                placeholder="How was your day? What's on your mind? Write freely..." 
                rows={4}
                className="premium-textarea"
              ></textarea>
              <button className="save-log-btn btn-primary" onClick={handleSaveLog}>
                Save Entry
              </button>
            </div>
            <div className="log-history">
              <h3 className="premium-section-title">Previous Entries</h3>
              <div className="log-entries">
                {logEntries.map((entry, index) => (
                  <div key={index} className="log-entry premium-card">
                    <div className="log-date">{entry.date}</div>
                    <div className="log-content">{entry.content}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="features-section premium-section">
          <div className="section-header">
            <h2 className="premium-section-title">Explore Features</h2>
            <p className="premium-section-subtitle">Everything you need for your wellness journey</p>
          </div>
          <div className="features-grid">
            <Link to="/rooms" className="feature-card premium-card">
              <div className="feature-icon">🔍</div>
              <h3 className="premium-card-title">Search Rooms</h3>
              <p className="premium-card-description">Find and join wellness challenge rooms</p>
              <div className="feature-stats">
                <span>150+ Active Rooms</span>
              </div>
            </Link>
            <Link to="/challenges" className="feature-card premium-card">
              <div className="feature-icon">🎯</div>
              <h3 className="premium-card-title">Wellness Challenges</h3>
              <p className="premium-card-description">Join daily challenges for mental wellness</p>
              <div className="feature-stats">
                <span>25+ Challenges</span>
              </div>
            </Link>
            <Link to="/create-room" className="feature-card premium-card">
              <div className="feature-icon">➕</div>
              <h3 className="premium-card-title">Create Room</h3>
              <p className="premium-card-description">Start your own wellness community</p>
              <div className="feature-stats">
                <span>New!</span>
              </div>
            </Link>
            <Link to="/achievements" className="feature-card premium-card">
              <div className="feature-icon">🏆</div>
              <h3 className="premium-card-title">Achievements</h3>
              <p className="premium-card-description">Track your progress and milestones</p>
              <div className="feature-stats">
                <span>12 Unlocked</span>
              </div>
            </Link>
          </div>
        </section>
      </main>
    </>
  );
};

export default Dashboard; 