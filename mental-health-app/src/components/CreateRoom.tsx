import React, { useState, useEffect, useRef,FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const CreateRoom: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    privacy: 'public',
    roomName: '',
    roomDescription: '',
    type: ''
  });
  const [charCount, setCharCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  
  const formRef = useRef<HTMLFormElement>(null);

  // Character counter
  const updateCharCount = (value: string) => {
    setCharCount(value.length);
  };

  // Form validation
  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    if (!formData.roomName.trim()) {
      newErrors.roomName = 'Room name is required';
    } else if (formData.roomName.trim().length < 3) {
      newErrors.roomName = 'Room name must be at least 3 characters';
    }

    if (!formData.roomDescription.trim()) {
      newErrors.roomDescription = 'Description is required';
    } else if (formData.roomDescription.trim().length < 10) {
      newErrors.roomDescription = 'Description must be at least 10 characters';
    }

    if (!formData.type) {
      newErrors.type = 'Please select a room type';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/rooms/create', {
        method: 'POST',
        headers:{ 'Content-Type':'application/json' },
        body: JSON.stringify({ ...formData, createdAt: new Date() })
      });
      const { room } = await res.json();
      navigate(`/chatroom/${room._id}`);
      console.log('Room created and received from backend:', room);
      if (!res.ok) throw new Error('Create failed');
      setIsLoading(false);
      setShowSuccessModal(true);
      // after modal, route to the new room:
      setTimeout(() => navigate(`/chatroom/${room._id}`), 1000);
    } catch (err:unknown) {
      setIsLoading(false);
       const msg = err instanceof Error ? err.message : 'An error occurred';
      showSubmissionError(msg);
    }
  };


  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (name === 'roomName') {
      updateCharCount(value);
    }
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Handle radio button changes
  const handleRadioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Show submission error
  const showSubmissionError = (message: string) => {
    const errorNotification = document.createElement('div');
    errorNotification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: rgba(239, 68, 68, 0.9);
      backdrop-filter: blur(20px);
      border: 1px solid rgba(239, 68, 68, 0.3);
      border-radius: 12px;
      padding: 16px 20px;
      color: white;
      font-family: 'Inter', sans-serif;
      font-size: 0.9rem;
      z-index: 3000;
      transform: translateX(100%);
      transition: transform 0.3s ease;
      max-width: 300px;
    `;
    errorNotification.textContent = message;
    
    document.body.appendChild(errorNotification);
    
    setTimeout(() => {
      errorNotification.style.transform = 'translateX(0)';
    }, 100);
    
    setTimeout(() => {
      errorNotification.style.transform = 'translateX(100%)';
      setTimeout(() => {
        if (document.body.contains(errorNotification)) {
          document.body.removeChild(errorNotification);
        }
      }, 300);
    }, 5000);
  };

  // Close success modal
  const closeSuccessModal = () => {
    setShowSuccessModal(false);
  };

  // Go to room
  const goToRoom = () => {
    navigate('/chatroom');
  };

  // Close modal on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && showSuccessModal) {
        closeSuccessModal();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [showSuccessModal]);

  return (
    <>
      <style>
        {`
          /* ===== CREATE ROOM PREMIUM STYLES ===== */
          .create-room-container {
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 40px 20px;
            position: relative;
            background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
            font-family: 'Poppins', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          }

          .create-room-form {
            max-width: 1200px;
            width: 100%;
            background: rgba(255,255,255,0.95);
            border-radius: 18px;
            padding: 2rem;
            box-shadow: 0 25px 50px rgba(0, 0, 0, 0.1);
            position: relative;
            overflow: hidden;
            z-index: 10;
          }

          .form-header {
            border-radius: 1rem;
            background: linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.7) 100%);
            backdrop-filter: blur(20px);
            border: 1px solid rgba(255, 255, 255, 0.3);
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
            padding: 4rem 3rem;
            position: relative;
            margin-bottom: 3rem;
            text-align: center;
            overflow: hidden;
            transition: all 0.3s ease;
            z-index: 1;
          }

          .form-header h1 {
            font-family: 'DM Sans', sans-serif;
            font-size: clamp(2.5rem, 5vw, 3.5rem);
            font-weight: 700;
            background: linear-gradient(135deg, #1e293b 0%, #475569 50%, #64748b 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            margin-bottom: 1.5rem;
            letter-spacing: -0.02em;
            line-height: 1.2;
            position: relative;
            z-index: 2;
          }

          .form-header p {
            font-family: 'Inter', sans-serif;
            font-size: clamp(1.1rem, 2.5vw, 1.25rem);
            font-weight: 400;
            color: #475569;
            max-width: 600px;
            margin: 0 auto;
            line-height: 1.6;
            position: relative;
            z-index: 2;
            letter-spacing: 0.01em;
            opacity: 0.9;
          }

          .form-left {
            display: flex;
            flex-direction: column;
            gap: 30px;
          }

          .form-right {
            display: flex;
            flex-direction: column;
            gap: 30px;
            padding-left: 20px;
            border-left: 1px solid rgba(30, 64, 175, 0.1);
          }

          .privacy {
            display: flex;
            gap: 20px;
            margin-bottom: 20px;
          }

          .privacy input[type="radio"] {
            display: none;
          }

          .privacy label {
            padding: 15px 30px;
            background: rgba(255, 255, 255, 0.8);
            border: 2px solid rgba(102, 126, 234, 0.2);
            border-radius: 15px;
            cursor: pointer;
            transition: all 0.3s ease;
            position: relative;
            overflow: hidden;
            color: #333;
            font-weight: 500;
          }

          .privacy input[type="radio"]:checked + label {
            background: linear-gradient(135deg, rgba(102, 126, 234, 0.2), rgba(118, 75, 162, 0.2));
            border-color: rgba(102, 126, 234, 0.5);
            box-shadow: 0 8px 25px rgba(102, 126, 234, 0.2);
            transform: translateY(-2px);
            color: #1e293b;
          }

          .title {
            width: 100%;
            position: relative;
            border-radius: 20px;
            padding-left: 20px;
          }

          .title h2 {
            font-size: 1.5rem;
            margin-bottom: 15px;
            color: #1a1a1a;
            font-weight: 600;
          }

          .title input {
            width: 100%;
            padding: 20px;
            background: rgba(255, 255, 255, 0.9);
            border: 2px solid rgba(102, 126, 234, 0.2);
            border-radius: 15px;
            color: #333;
            font-size: 1.1rem;
            transition: all 0.3s ease;
            backdrop-filter: blur(10px);
            font-family: inherit;
          }

          .title input::placeholder {
            color: #666;
          }

          .title input:focus {
            outline: none;
            border-color: rgba(102, 126, 234, 0.8);
            box-shadow: 0 0 20px rgba(102, 126, 234, 0.2);
            transform: translateY(-2px);
            background: rgba(255, 255, 255, 1);
          }

          .character-counter {
            text-align: right;
            font-size: 0.9rem;
            margin-top: 8px;
            color: #666;
          }

          .description {
            width: 100%;
            position: relative;
            border-radius: 20px;
            padding-left: 20px;
          }

          .description p {
            font-size: 1.5rem;
            margin-bottom: 15px;
            color: #1a1a1a;
            font-weight: 600;
          }

          .description textarea {
            width: 100%;
            padding: 20px;
            background: rgba(255, 255, 255, 0.9);
            border: 2px solid rgba(102, 126, 234, 0.2);
            border-radius: 15px;
            color: #333;
            font-size: 1.1rem;
            resize: vertical;
            min-height: 120px;
            transition: all 0.3s ease;
            backdrop-filter: blur(10px);
            font-family: 'Inter', sans-serif;
          }

          .description textarea::placeholder {
            color: #666;
          }

          .description textarea:focus {
            outline: none;
            border-color: rgba(102, 126, 234, 0.8);
            box-shadow: 0 0 20px rgba(102, 126, 234, 0.2);
            transform: translateY(-2px);
            background: rgba(255, 255, 255, 1);
          }

          .type {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 16px 12px;
            align-items: center;
            border-radius: 20px;
            padding-left: 20px;
          }

          .type h3 {
            grid-column: 1 / -1;
            margin-bottom: 12px;
            color: #1a1a1a;
            font-weight: 600;
          }

          .type label {
            padding: 20px 15px;
            background: rgba(255, 255, 255, 0.8);
            border: 2px solid rgba(102, 126, 234, 0.2);
            border-radius: 15px;
            cursor: pointer;
            transition: all 0.3s ease;
            text-align: center;
            position: relative;
            overflow: hidden;
            margin-bottom: 0;
            color: #333;
            font-weight: 500;
          }

          .type input[type="radio"] {
            display: none;
          }

          .type input[type="radio"]:checked + label {
            background: linear-gradient(135deg, rgba(102, 126, 234, 0.2), rgba(118, 75, 162, 0.2));
            border-color: rgba(102, 126, 234, 0.5);
            box-shadow: 0 8px 25px rgba(102, 126, 234, 0.2);
            transform: translateY(-3px) scale(1.05);
            color: #1e293b;
          }

          .submit {
            text-align: center;
            margin-top: 40px;
          }

          .circle-button {
            width: 80px;
            height: 80px;
            background: linear-gradient(135deg, #667eea, #764ba2);
            border: none;
            border-radius: 50%;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s ease;
            box-shadow: 0 10px 30px rgba(102, 126, 234, 0.4);
            position: relative;
            overflow: hidden;
            z-index: 1;
          }

          .circle-button:hover {
            transform: translateY(-5px) scale(1.1);
            box-shadow: 0 20px 40px rgba(102, 126, 234, 0.6);
          }

          .circle-button svg {
            color: white;
            transition: transform 0.3s ease;
          }

          .circle-button:hover svg {
            transform: rotate(90deg);
          }

          .loading-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            display: none;
            align-items: center;
            justify-content: center;
            flex-direction: column;
            z-index: 2000;
            backdrop-filter: blur(10px);
          }

          .loading-overlay.active {
            display: flex;
          }

          .loading-spinner {
            width: 60px;
            height: 60px;
            border: 4px solid rgba(255, 255, 255, 0.3);
            border-top: 4px solid white;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin-bottom: 20px;
          }

          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }

          .loading-overlay p {
            color: white;
            font-size: 1.2rem;
            font-weight: 500;
          }

          .success-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            display: none;
            align-items: center;
            justify-content: center;
            z-index: 2000;
            backdrop-filter: blur(10px);
          }

          .success-modal.active {
            display: flex;
            animation: fadeIn 0.3s ease;
          }

          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }

          .modal-content {
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(30px);
            border: 1px solid rgba(255, 255, 255, 0.3);
            border-radius: 25px;
            padding: 50px;
            text-align: center;
            max-width: 400px;
            width: 90%;
            box-shadow: 0 25px 50px rgba(0, 0, 0, 0.3);
          }

          .success-icon {
            color: #4ade80;
            margin-bottom: 20px;
            animation: bounce 0.6s ease;
          }

          @keyframes bounce {
            0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
            40% { transform: translateY(-10px); }
            60% { transform: translateY(-5px); }
          }

          .modal-content h3 {
            color: #1a1a1a;
            font-size: 1.8rem;
            margin-bottom: 15px;
            font-weight: 600;
          }

          .modal-content p {
            color: #666;
            margin-bottom: 30px;
            line-height: 1.6;
          }

          .btn-primary {
            background: linear-gradient(135deg, #667eea, #764ba2);
            color: white;
            border: none;
            padding: 15px 30px;
            border-radius: 15px;
            font-size: 1.1rem;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
          }

          .btn-primary:hover {
            transform: translateY(-2px);
            box-shadow: 0 12px 35px rgba(102, 126, 234, 0.4);
          }

          .form-error {
            border-color: #ef4444 !important;
            animation: shake 0.5s ease-in-out;
          }

          .form-success {
            border-color: #10b981 !important;
          }

          @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-5px); }
            75% { transform: translateX(5px); }
          }

          .error-message {
            color: #ef4444;
            font-size: 0.85rem;
            margin-top: 8px;
            font-family: 'Inter', sans-serif;
          }

          .category-error {
            color: #ef4444;
            font-size: 0.85rem;
            margin-top: 12px;
            text-align: center;
            font-family: 'Inter', sans-serif;
            grid-column: 1 / -1;
          }

          /* ===== NAVIGATION SIDEBAR ===== */
          .navigation {
            position: fixed;
            left: 24px;
            top: 50%;
            transform: translateY(-50%);
            z-index: 1000;
            display: flex;
            flex-direction: column;
            gap: 16px;
            padding: 16px;
            background: rgba(255, 255, 255, 0.08);
            backdrop-filter: blur(20px);
            border: 1px solid rgba(255, 255, 255, 0.15);
            border-radius: 24px;
            transition: all 0.3s ease;
          }

          .navigation:hover {
            background: rgba(255, 255, 255, 0.15);
            transform: translateY(-50%) scale(1.05);
          }

          .nav-item {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 50px;
            height: 50px;
            border-radius: 12px;
            color: #374151;
            text-decoration: none;
            font-weight: 600;
            font-size: 0.875rem;
            transition: all 0.3s ease;
            position: relative;
            overflow: hidden;
          }

          .nav-item svg {
            width: 24px;
            height: 24px;
            transition: all 0.3s ease;
            position: relative;
            z-index: 2;
          }

          .nav-item:hover {
            color: #ffffff;
            transform: scale(1.1);
          }

          .nav-item:hover svg {
            transform: scale(1.1);
          }

          .nav-item.active {
            background: linear-gradient(135deg, rgba(102, 126, 234, 0.4), rgba(102, 126, 234, 0.2));
            color: #ffffff;
            box-shadow: 0 0 25px rgba(102, 126, 234, 0.4);
          }

          /* ===== RESPONSIVE DESIGN ===== */
          @media (max-width: 768px) {
            .create-room-form {
              padding: 30px 20px;
              margin: 20px;
            }
            
            .form-header h1 {
              font-size: 2.5rem;
            }
            
            .form-header p {
              font-size: 1rem;
            }
            
            .privacy {
              flex-direction: column;
              gap: 15px;
            }
            
            .type {
              grid-template-columns: repeat(2, 1fr);
            }

            .navigation {
              left: 16px;
              padding: 12px;
              gap: 12px;
            }
            
            .nav-item {
              width: 45px;
              height: 45px;
            }
            
            .nav-item svg {
              width: 20px;
              height: 20px;
            }
          }

          @media (max-width: 480px) {
            .create-room-form {
              padding: 20px 15px;
            }
            
            .form-header h1 {
              font-size: 2rem;
            }
            
            .type {
              grid-template-columns: 1fr;
            }
            
            .title input,
            .description textarea {
              padding: 15px;
              font-size: 1rem;
            }

            .navigation {
              left: 12px;
              padding: 8px;
              gap: 8px;
            }
            
            .nav-item {
              width: 40px;
              height: 40px;
            }
            
            .nav-item svg {
              width: 18px;
              height: 18px;
            }
          }

          /* Enhanced Grid Layout for Desktop */
          @media (min-width: 1024px) {
            .create-room-form {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 50px;
              align-items: start;
            }
            
            .form-header {
              grid-column: 1 / -1;
            }
            
            .submit {
              grid-column: 1 / -1;
            }
          }
        `}
      </style>

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
        <Link to="/create-room" className="nav-item active" title="Create Room">
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

      <div className="create-room-container">
        {/* Main Content */}
        <form className="create-room-form" ref={formRef} onSubmit={handleSubmit}>
          {/* Header Section */}
          <div className="form-header">
            <h1>Create Your Room</h1>
            <p>Build a space where people can connect, grow, and support each other through shared wellness activities</p>
          </div>

          {/* Left Column */}
          <div className="form-left">
            {/* Privacy Selection */}
            <div className="privacy">
              <input 
                type="radio" 
                id="public" 
                name="privacy" 
                value="public" 
                checked={formData.privacy === 'public'}
                onChange={handleRadioChange}
              />
              <label htmlFor="public">Public</label>
              <input 
                type="radio" 
                id="private" 
                name="privacy" 
                value="private"
                checked={formData.privacy === 'private'}
                onChange={handleRadioChange}
              />
              <label htmlFor="private">Private</label>
            </div>

            {/* Room Title Section */}
            <div className="title">
              <h2>&nbsp;&nbsp;Room Title</h2>
              <input 
                type="text" 
                name="roomName" 
                maxLength={20} 
                placeholder="What's this room about?" 
                required 
                className={errors.roomName ? 'form-error' : ''}
                value={formData.roomName}
                onChange={handleInputChange}
              />
              <div className="character-counter">
                <span style={{ color: charCount >= 18 ? '#ef4444' : charCount >= 15 ? '#f59e0b' : '#666' }}>
                  {charCount}
                </span>/20
              </div>
              {errors.roomName && (
                <div className="error-message">
                  {errors.roomName}
                </div>
              )}
            </div>

            {/* Description Section */}
            <div className="description">
              <p>&nbsp;&nbsp;Description</p>
              <textarea 
                name="roomDescription" 
                rows={4} 
                cols={50} 
                placeholder="Tell people what this room is for..." 
                required 
                className={errors.roomDescription ? 'form-error' : ''}
                value={formData.roomDescription}
                onChange={handleInputChange}
              />
              {errors.roomDescription && (
                <div className="error-message">
                  {errors.roomDescription}
                </div>
              )}
            </div>
          </div>

          {/* Right Column */}
          <div className="form-right">
            {/* Category Selection */}
            <div className="type">
              <h3>Room Type</h3>
              <input 
                type="radio" 
                name="type" 
                id="music" 
                value="music" 
                required
                checked={formData.type === 'music'}
                onChange={handleRadioChange}
              />
              <label htmlFor="music">Music</label>
              <input 
                type="radio" 
                name="type" 
                id="chat" 
                value="chat"
                checked={formData.type === 'chat'}
                onChange={handleRadioChange}
              />
              <label htmlFor="chat">Chat</label>
              <input 
                type="radio" 
                name="type" 
                id="voice" 
                value="voice"
                checked={formData.type === 'voice'}
                onChange={handleRadioChange}
              />
              <label htmlFor="voice">Voice</label>
              <input 
                type="radio" 
                name="type" 
                id="gaming" 
                value="gaming"
                checked={formData.type === 'gaming'}
                onChange={handleRadioChange}
              />
              <label htmlFor="gaming">Gaming</label>
              <input 
                type="radio" 
                name="type" 
                id="drawing" 
                value="drawing"
                checked={formData.type === 'drawing'}
                onChange={handleRadioChange}
              />
              <label htmlFor="drawing">Drawing</label>
              <input 
                type="radio" 
                name="type" 
                id="other" 
                value="other"
                checked={formData.type === 'other'}
                onChange={handleRadioChange}
              />
              <label htmlFor="other">Other</label>
              {errors.type && (
                <div className="category-error">
                  {errors.type}
                </div>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className="submit">
            <button type="submit" className="circle-button">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="12" y1="5" x2="12" y2="19"/>
                <line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
            </button>
          </div>
        </form>

        {/* Loading Overlay */}
        {isLoading && (
          <div className="loading-overlay active">
            <div className="loading-spinner"></div>
            <p>Creating your room...</p>
          </div>
        )}

        {/* Success Modal */}
        {showSuccessModal && (
          <div className="success-modal active" onClick={closeSuccessModal}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="success-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                  <polyline points="22,4 12,14.01 9,11.01"/>
                </svg>
              </div>
              <h3>Room Created Successfully!</h3>
              <p>Your room is now ready for others to join.</p>
              <button className="btn-primary" onClick={goToRoom}>
                Go to Room
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default CreateRoom; 