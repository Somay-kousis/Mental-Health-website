import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const Signup: React.FC = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail]     = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]     = useState('');
  const navigate = useNavigate();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await axios.post('http://localhost:5000/api/signup', {
        username,
        email,
        password
      });

      // Save token
      localStorage.setItem('token', res.data.token);

      // Redirect to dashboard
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Signup failed');
    }
  };

  return (
    <section className="SignUp" id="signup">
      <div className="signup-container">
        <div className="signup-layout">
          <div className="signup-form-section">
            <div className="signup-card">
              <div className="header">Create Account</div>

              <form className="signup-form" id="signupForm" onSubmit={handleSignup}>
                <div className="form-group">
                  <input
                    type="text"
                    name="name"
                    id="signupName"
                    placeholder="Name"
                    className="form-input"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <input
                    type="email"
                    name="email"
                    id="signupEmail"
                    placeholder="Email"
                    className="form-input"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <input
                    type="password"
                    name="password"
                    id="signupPassword"
                    placeholder="Password"
                    className="form-input"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                <button type="submit" className="btn">Sign Up</button>
              </form>

              {error && <div className="error-msg">{error}</div>}

              <div className="switch-auth">
                Already have an account? <Link to="/">Sign In</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Signup;
