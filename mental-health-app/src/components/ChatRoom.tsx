import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { io, Socket } from 'socket.io-client';
import { jwtDecode } from 'jwt-decode'; 

interface User {
  id: string;
  username: string;
}

interface Message {
  _id: string;
  sender: { _id: string; username: string; };
  content: string;
  timestamp: string;
}

interface Room {
  _id: string;
  roomName: string;
  roomDescription?: string;
}


const ChatRoom: React.FC = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();

  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [currentRoom, setCurrentRoom] = useState<Room | null>(null);
  const [allRooms, setAllRooms] = useState<Room[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  
  const socketRef = useRef<Socket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // --- All the React logic (useEffect, handlers) remains the same ---
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    const authenticateAndFetchUser = async () => {
      try {
        setAuthError(null);
        const decoded: { userId: string } = jwtDecode(token);
        const userId = decoded.userId;

        if (!userId) {
          throw new Error("Token is invalid or does not contain a userId.");
        }

        const response = await fetch(`http://localhost:5000/api/users/${userId}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to fetch user details.');
        }

        const userData = await response.json();
        setCurrentUser({ id: userData._id, username: userData.username });

      } catch (error: any) {
        console.error("Authentication failed:", error);
        setAuthError(error.message);
        localStorage.removeItem('token');
      }
    };

    authenticateAndFetchUser();
  }, [navigate]);

  useEffect(() => {
    if (!currentUser) return;

    socketRef.current = io('http://localhost:5000');
    const socket = socketRef.current;

    const fetchAllRooms = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/rooms');
        const data = await response.json();
        setAllRooms(data);
      } catch (error) {
        console.error("Failed to fetch rooms:", error);
      }
    };
    fetchAllRooms();

    socket.on('receive-message', (msg: Message) => {
      if (msg.sender._id !== currentUser.id) {
        setMessages(prevMessages => [...prevMessages, msg]);
      }
    });

    return () => {
      socket.disconnect();
      socket.off('receive-message');
    };
  }, [currentUser]);

  useEffect(() => {
    const socket = socketRef.current;
    if (roomId && socket && currentUser) {
      socket.emit('join-room', roomId);
      const fetchRoomData = async () => {
        setIsDataLoading(true);
        try {
          const roomRes = await fetch(`http://localhost:5000/api/rooms/${roomId}`);
          const roomData = await roomRes.json();
          setCurrentRoom(roomData);

          const messagesRes = await fetch(`http://localhost:5000/api/messages/${roomId}`);
          const messagesData = await messagesRes.json();
          setMessages(messagesData);
        } catch (error) {
          console.error("Failed to fetch room data:", error);
        } finally {
          setIsDataLoading(false);
        }
      };
      fetchRoomData();
    }
  }, [roomId, currentUser]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = useCallback(() => {
    const socket = socketRef.current;
    if (!newMessage.trim() || !currentUser || !roomId || !socket) return;
    
    const optimisticMessage: Message = {
      _id: `optimistic-${Date.now()}`,
      sender: {
        _id: currentUser.id,
        username: currentUser.username,
      },
      content: newMessage,
      timestamp: new Date().toISOString(),
    };

    setMessages(prevMessages => [...prevMessages, optimisticMessage]);

    socket.emit('send-message', {
      roomId,
      sender: optimisticMessage.sender,
      content: optimisticMessage.content,
    });

    setNewMessage('');
  }, [newMessage, currentUser, roomId]);

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const formatTimestamp = (timestamp: string): string => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    if (isNaN(date.getTime())) return '';
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (authError) {
    return (
        <div style={{ padding: '2rem', textAlign: 'center', color: 'red' }}>
            <h1>Authentication Error</h1>
            <p>{authError}</p>
            <Link to="/login">Go to Login</Link>
        </div>
    );
  }

  if (!currentUser) {
    return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading User...</div>;
  }

  return (
    <>
      <style>{`
        body {
          background-color: #121212;
          color: #e0e0e0;
          font-family: 'Inter', sans-serif;
        }

        /* --- Floating Navigation Dock --- */
        .main-navigation {
          position: fixed;
          left: 0;
          top: 0;
          bottom: 0;
          width: 80px;
          background-color: rgba(31, 31, 31, 0.8);
          backdrop-filter: blur(10px);
          border-right: 1px solid #333;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 1.5rem 0;
          gap: 1.5rem;
          z-index: 1000;
        }
        .main-navigation .nav-item {
          color: #888;
          transition: color 0.2s, transform 0.2s;
        }
        .main-navigation .nav-item:hover {
          color: #fff;
          transform: scale(1.1);
        }
        .main-navigation .nav-item.active {
          color: #00aaff;
        }

        /* --- Chat Layout (Padded for the dock) --- */
        .chat-layout-wrapper {
          padding-left: 80px; /* Leave space for the floating dock */
        }
        .chat-layout {
          display: grid;
          grid-template-columns: 320px 1fr; /* Rooms List | Chat Area */
          width: 100%;
          height: 100vh;
        }

        /* --- Sidebar (Rooms List) --- */
        .rooms-sidebar { 
          background-color: #1a1a1a; 
          border-right: 1px solid #333; 
          display: flex; 
          flex-direction: column; 
          padding: 1.5rem;
        }
        .sidebar-header { margin-bottom: 1.5rem; }
        .sidebar-header h2 { font-size: 1.5rem; margin: 0; color: #fff; }
        .sidebar-header a { font-size: 0.9rem; color: #00aaff; text-decoration: none; }
        .room-list { flex-grow: 1; overflow-y: auto; }
        .room-list-item { display: block; padding: 0.8rem 1rem; margin-bottom: 0.5rem; border-radius: 8px; text-decoration: none; color: #ccc; transition: background-color 0.2s; }
        .room-list-item:hover { background-color: #2a2a2a; }
        .room-list-item.active { background-color: #007acc; color: white; font-weight: 600; }

        /* --- Chat Area --- */
        .chat-area { display: flex; flex-direction: column; height: 100%; background-color: #121212; }
        .chat-header { 
          padding: 1.25rem 2rem; 
          border-bottom: 1px solid #333; 
          background-color: #1a1a1a;
          box-shadow: 0 2px 5px rgba(0,0,0,0.1);
          z-index: 10;
        }
        .chat-header h3 { margin: 0; font-size: 1.3rem; color: #fff; }
        .chat-header p { margin: 0.25rem 0 0; color: #999; font-size: 0.9rem; }
        
        .messages-container { flex-grow: 1; overflow-y: auto; padding: 1.5rem 2rem; }
        
        .message { display: flex; margin-bottom: 1.5rem; max-width: 75%; align-items: flex-end; gap: 0.75rem; }
        .avatar { width: 40px; height: 40px; border-radius: 50%; background-color: #3a3a3a; display: flex; align-items: center; justify-content: center; font-weight: 600; flex-shrink: 0; color: #fff; }
        
        .message-content { padding: 0.75rem 1.25rem; border-radius: 18px; }
        
        .message.from-me { margin-left: auto; flex-direction: row-reverse; }
        .message.from-me .message-content { background: linear-gradient(to right, #0088ff, #0055cc); color: white; border-bottom-right-radius: 4px; }
        
        .message.from-other { margin-right: auto; }
        .message.from-other .message-content { background-color: #2c2c2e; border-bottom-left-radius: 4px; }
        
        .message-sender { font-weight: 600; font-size: 0.9rem; margin-bottom: 0.3rem; color: #ffffff; }
        .message.from-me .message-sender { color: #e0e0e0; }
        .message-text { margin: 0; word-wrap: break-word; line-height: 1.5; color: #e5e7eb; } /* IMPROVED: Brighter text color */
        .message-timestamp { font-size: 0.75rem; color: #aaa; margin-top: 0.4rem; text-align: right; opacity: 0.7; }
        .message.from-other .message-timestamp { color: #888; }
        
        .message-input-area { padding: 1rem 2rem; border-top: 1px solid #333; background-color: #1a1a1a; }
        .message-input-wrapper { display: flex; background-color: #2a2a2a; border-radius: 12px; padding: 0.5rem; align-items: center; }
        .message-input { flex-grow: 1; border: none; background: transparent; color: #f0f0f0; padding: 0.75rem; font-size: 1rem; }
        .message-input:focus { outline: none; }
        
        .send-btn { background-color: #007acc; color: white; border: none; width: 40px; height: 40px; border-radius: 10px; cursor: pointer; transition: background-color 0.2s; display: flex; align-items: center; justify-content: center; }
        .send-btn:hover { background-color: #005f99; }
      `}</style>
      
      {/* Main App Navigation (Floating Dock) */}
      <nav className="main-navigation">
        <Link to="/" className="nav-item" title="Home"><svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9,22 9,12 15,12 15,22"/></svg></Link>
        <Link to="/dashboard" className="nav-item" title="Dashboard"><svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect x="3" y="13" width="7" height="8"/><rect x="14" y="3" width="7" height="18"/></svg></Link>
        <Link to="/profile" className="nav-item" title="Profile"><svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 8-4 8-4s8 0 8 4"/></svg></Link>
        <Link to="/rooms" className="nav-item active" title="Rooms"><svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg></Link>
        <Link to="/create-room" className="nav-item" title="Create Room"><svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg></Link>
        <Link to="/challenges" className="nav-item" title="Challenges"><svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 3v4"/><path d="M8 3v4"/></svg></Link>
        <Link to="/achievements" className="nav-item" title="Achievements"><svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7.5 21 12 18.5 16.5 21 15.79 13.88"/></svg></Link>
      </nav>

      {/* Main Content Area */}
      <div className="chat-layout-wrapper">
        <div className="chat-layout">
          <aside className="rooms-sidebar">
            <div className="sidebar-header">
              <h2>Chat Rooms</h2>
              <Link to="/rooms">← Back to Search</Link>
            </div>
            <div className="room-list">
              {allRooms.map(room => (
                <Link key={room._id} to={`/chatroom/${room._id}`} className={`room-list-item ${room._id === roomId ? 'active' : ''}`}>
                  {room.roomName}
                </Link>
              ))}
            </div>
          </aside>
          <main className="chat-area">
            <header className="chat-header">
              {currentRoom ? ( <><h3>{currentRoom.roomName}</h3><p>{currentRoom.roomDescription || 'Welcome to the chat!'}</p></> ) : ( <h3>Loading Room...</h3> )}
            </header>
            <div className="messages-container">
              {isDataLoading ? (
                <div style={{ textAlign: 'center', padding: '2rem' }}>Loading Messages...</div>
              ) : (
                messages.map(msg => (
                  <div key={msg._id} className={`message ${currentUser && msg.sender._id === currentUser.id ? 'from-me' : 'from-other'}`}>
                    <div className="avatar">{msg.sender.username.charAt(0).toUpperCase()}</div>
                    <div className="message-content">
                      <div className="message-sender">{msg.sender.username}</div>
                      <p className="message-text">{msg.content}</p>
                      <div className="message-timestamp">{formatTimestamp(msg.timestamp)}</div>
                    </div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>
            <div className="message-input-area">
              <div className="message-input-wrapper">
                <input type="text" className="message-input" value={newMessage} onChange={e => setNewMessage(e.target.value)} onKeyPress={handleKeyPress} placeholder="Type your message..."/>
                <button onClick={handleSendMessage} className="send-btn">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
                </button>
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
};

export default ChatRoom;
