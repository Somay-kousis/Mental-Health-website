import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Chart, registerables } from 'chart.js';
import profilePic from '../images/somay.jpg';





// Register Chart.js components
Chart.register(...registerables);

const Profile: React.FC = () => {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);
  const [user, setUser] = useState({
  username: '',
  pronouns: '',
  bio: '',
  profilePicture: ''
});


  useEffect(() => {
    if (chartRef.current) {
      const ctx = chartRef.current.getContext('2d');
      if (ctx) {
        // Destroy existing chart if it exists
        if (chartInstance.current) {
          chartInstance.current.destroy();
        }
        const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/user/profile', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!res.ok) throw new Error('Failed to fetch profile');
      const data = await res.json();
      setUser(data.user);  // assuming backend returns { user: { ... } }
    } catch (err) {
      console.error('Profile fetch error:', err);
    }
  };

  fetchProfile();

        // Create new chart
        chartInstance.current = new Chart(ctx, {
          type: 'line',
          data: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            datasets: [{
              label: 'Daily Progress',
              data: [8, 7, 9, 6, 8, 9, 7],
              borderColor: 'rgba(147, 51, 234, 1)',
              backgroundColor: 'rgba(147, 51, 234, 0.1)',
              borderWidth: 3,
              fill: true,
              tension: 0.4,
              pointBackgroundColor: 'rgba(147, 51, 234, 1)',
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
                grid: {
                  color: 'rgba(255, 255, 255, 0.1)'
                },
                ticks: {
                  color: 'rgba(255, 255, 255, 0.7)',
                  font: {
                    size: 12
                  }
                }
              },
              x: {
                grid: {
                  color: 'rgba(255, 255, 255, 0.1)'
                },
                ticks: {
                  color: 'rgba(255, 255, 255, 0.7)',
                  font: {
                    size: 12
                  }
                }
              }
            },
            elements: {
              point: {
                hoverBackgroundColor: 'rgba(147, 51, 234, 0.8)'
              }
            }
          }
        });
      }
    }

    // Cleanup function
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, []);

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
        <Link to="/dashboard" className="nav-item" title="Dashboard">
          <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
            <rect x="3" y="13" width="7" height="8"/>
            <rect x="14" y="3" width="7" height="18"/>
          </svg>
        </Link>
        <Link to="/profile" className="nav-item active" title="Profile">
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

      <main className="profile-container">
        <div className="profile-header-progress-row">
          <section className="profile-header glass">
            <div className="profile-info">
<img src={user.profilePicture || profilePic} alt="Profile" className="profile-pic" width={140} height={140} />
              <div className="profile-details">
<h1 className="profile-name premium-title">{user.username}</h1>
<span className="profile-pronouns">{user.pronouns}</span>
<p className="profile-bio">{user.bio}</p>


<Link to="/edit-profile">
  <button className="btn btn-primary edit-profile-btn">Edit Profile</button>
</Link>


              </div>
            </div>
          </section>
          <section className="profile-progress glass">
            <div className="section-header">
              <h2 className="premium-section-title">Daily Logs & Progress</h2>
            </div>
            <div className="progress-graph-container">
              <canvas ref={chartRef} width={400} height={180} aria-label="Progress Graph"></canvas>
            </div>
            <div className="log-history">
              <h3>Recent Daily Logs</h3>
              <ul className="log-entries">
                <li className="log-entry glass">Had a great meditation session today. Felt calm and focused.</li>
                <li className="log-entry glass">Went for a 30-minute walk. Energy levels up!</li>
                <li className="log-entry glass">Practiced gratitude journaling. Mood improved.</li>
              </ul>
            </div>
          </section>
        </div>
        <section className="profile-achievements glass">
          <div className="section-header">
            <h2 className="premium-section-title">Achievements</h2>
          </div>
          <div className="achievements-grid">
            <div className="achievement-card glass">
              <span className="achievement-icon">🌱</span>
              <div className="achievement-info">
                <h3>Streak Master</h3>
                <p>Logged in for 30 days straight</p>
              </div>
            </div>
            <div className="achievement-card glass">
              <span className="achievement-icon">🫧</span>
              <div className="achievement-info">
                <h3>Mindfulness Guru</h3>
                <p>Completed 10 meditation sessions</p>
              </div>
            </div>
            <div className="achievement-card glass">
              <span className="achievement-icon">🐳</span>
              <div className="achievement-info">
                <h3>Hydration Hero</h3>
                <p>Met water goal for 7 days</p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default Profile; 