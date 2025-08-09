import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';

interface Room {
  _id: string;
  roomName: string;
  roomDescription: string;
  type: string;
}

const SearchRoom: React.FC = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRooms = useCallback(async (query: string = '') => {
    setIsLoading(true);
    setError(null);
    try {
      const url = `http://localhost:5000/api/rooms?q=${encodeURIComponent(query)}`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Something went wrong. Could not fetch rooms.');
      }
      const data: Room[] = await response.json();
      setRooms(data);
    } catch (err: any) {
      setError(err.message);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRooms();
  }, [fetchRooms]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchRooms(searchQuery);
  };
  
  const renderRoomCards = () => {
    if (isLoading) {
      return <p style={{ textAlign: 'center', padding: '40px', color: '#ccc' }}>Loading rooms...</p>;
    }

    if (error) {
      return <p style={{ textAlign: 'center', padding: '40px', color: '#ff6b6b' }}>Error: {error}</p>;
    }

    if (rooms.length === 0) {
      return <p style={{ textAlign: 'center', padding: '40px', color: '#ccc' }}>No rooms found. Try a different search or create one!</p>;
    }

    return (
      <div className="featured-grid">
        {rooms.map((room) => (
          <div className="room-card featured" key={room._id}>
            <div className="room-banner">
              <div className="room-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2L2 7L12 12L22 7L12 2Z"/><path d="M2 17L12 22L22 17"/><path d="M2 12L12 17L22 12"/>
                </svg>
              </div>
            </div>
            <div className="room-content">
              <h3 className="premium-card-title">{room.roomName}</h3>
              <p className="premium-card-description">{room.roomDescription}</p>
              <div className="room-stats">
              </div>
              <Link to={`/chatroom/${room._id}`} className="btn-primary">Join Room</Link>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <>
      <style>{`
        /* Re-using the original CSS file names for consistency */
        /* From ./css/search-room.css */
        .search-container {
          padding-left: 100px; /* Space for the nav */
          padding-right: 2rem;
          padding-top: 2rem;
          padding-bottom: 2rem;
          max-width: 1400px; /* Control max width to prevent huge gaps */
          margin: 0 auto; /* Center the container */
        }
        .search-header {
          margin-bottom: 2rem;
        }
        .header-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 2rem;
        }
        .search-stats {
          display: flex;
          gap: 1rem;
        }
        .stat-card {
          display: flex;
          align-items: center;
          gap: 1rem;
          background: rgba(255, 255, 255, 0.05);
          padding: 1rem;
          border-radius: 12px;
        }
        .search-section {
          margin-bottom: 2rem;
        }
        .search-input-group {
          display: flex;
          max-width: 800px; /* Limit width of search bar */
          margin: 0 auto 1.5rem auto; /* Center it */
        }
        .filter-tags {
          display: flex;
          justify-content: center;
          gap: 0.5rem;
          flex-wrap: wrap;
        }
        .featured-rooms .section-header {
          text-align: center;
          margin-bottom: 2rem;
        }
        .featured-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 1.5rem;
        }
        .room-card {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 12px;
          overflow: hidden;
        }
        .room-banner {
          height: 80px;
          background: rgba(255, 255, 255, 0.05);
          display: flex;
          align-items: center;
          padding: 1rem;
        }
        .room-content {
          padding: 1.5rem;
        }
        .btn-primary {
          display: block;
          text-align: center;
          margin-top: 1rem;
          background-color: #007acc;
          color: white;
          padding: 0.75rem;
          border-radius: 8px;
          text-decoration: none;
        }
        
        /* Navigation styles to keep it floating */
        .navigation {
          position: fixed;
          left: 1rem;
          top: 50%;
          transform: translateY(-50%);
          background: rgba(30, 30, 30, 0.7);
          backdrop-filter: blur(10px);
          border-radius: 16px;
          padding: 1rem 0.5rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
          z-index: 100;
        }
        .nav-item {
          color: #888;
          padding: 0.5rem;
        }
        .nav-item.active {
          color: #00aaff;
        }
        
        /* Added from previous turn to make search button work */
        .search-input {
          flex-grow: 1;
          background: transparent;
          border: 1px solid #333;
          border-right: none;
          border-radius: 8px 0 0 8px;
          color: #fff;
          font-size: 1rem;
          padding: 0.75rem;
        }
        .search-input:focus {
          outline: none;
        }
        .search-btn {
          background-color: #007acc;
          border: none;
          border-radius: 0 8px 8px 0;
          padding: 0 1.5rem;
          cursor: pointer;
          color: #fff;
        }
      `}</style>

      <div className="floating-shapes global-shapes">
        <div className="floating-shape" /><div className="floating-shape" /><div className="floating-shape" /><div className="floating-shape" /><div className="floating-shape" /><div className="floating-shape" />
      </div>
      <div className="premium-grid" />
      
      <nav className="navigation">
        <Link to="/" className="nav-item" title="Home"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9,22 9,12 15,12 15,22"/></svg></Link>
        <Link to="/dashboard" className="nav-item" title="Dashboard"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="13" width="7" height="8"/><rect x="14" y="3" width="7" height="18"/></svg></Link>
        <Link to="/profile" className="nav-item" title="Profile"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 8-4 8-4s8 0 8 4"/></svg></Link>
        <Link to="/rooms" className="nav-item active" title="Rooms"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg></Link>
        <Link to="/create-room" className="nav-item" title="Create Room"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg></Link>
        <Link to="/challenges" className="nav-item" title="Challenges"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 3v4"/><path d="M8 3v4"/></svg></Link>
        <Link to="/achievements" className="nav-item" title="Achievements"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7.5 21 12 18.5 16.5 21 15.79 13.88"/></svg></Link>
      </nav>

      <main className="search-container">
        <header className="search-header">
          <div className="header-content">
            <div className="welcome-section">
              <h1 className="premium-title">Find Wellness Rooms</h1>
              <p className="header-subtitle premium-subtitle">Discover and join communities that support your mental health journey</p>
            </div>
            <div className="search-stats">
              <div className="stat-card">
                <div className="stat-icon"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z"/><path d="M9 22V12H15V22"/></svg></div>
                <div className="stat-info">
                  <span className="stat-value premium-number">{isLoading ? '...' : rooms.length}</span>
                  <span className="stat-label premium-text">Active Rooms</span>
                </div>
              </div>
            </div>
          </div>
        </header>
        <section className="search-section">
          <div className="search-input-group" >
            <form className="search-input-group" onSubmit={handleSearch} style={{width: '100%'}}>
              <input 
                type="text" 
                id="searchInput" 
                placeholder="Search for rooms, topics, or keywords..." 
                className="search-input premium-input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button type="submit" className="search-btn" id="searchBtn">
                {/* --- NEW, IMPROVED ICON --- */}
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </form>
          </div>
          <div className="filter-tags">
            <button className="filter-tag active premium-tag" data-filter="all">All Rooms</button>
            <button className="filter-tag premium-tag" data-filter="mindfulness">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2L2 7L12 12L22 7L12 2Z"/><path d="M2 17L12 22L22 17"/><path d="M2 12L12 17L22 12"/></svg>
              Mindfulness
            </button>
          </div>
        </section>
        <section className="featured-rooms">
          <div className="section-header">
            <h2 className="premium-section-title">Discover Rooms</h2>
            <p className="premium-section-subtitle">Popular and trending wellness communities</p>
          </div>
          {renderRoomCards()}
        </section>
      </main>
    </>
  );
};

export default SearchRoom;
