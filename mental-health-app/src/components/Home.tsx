import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import logo from '../images/logo.png';
import somayImg from '../images/somay.jpg';
import kritiImg from '../images/kriti.jpg';
import divyanshImg from '../images/divyansh.jpg';

const Home: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/signin', {
        email,
        password
      });
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      navigate('/dashboard');
    } catch (err: any) {
      alert(err.response?.data?.error || 'Sign in failed');
    }
  };

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

      <nav className="navigation">
        <Link to="/" className="nav-item active" title="Home">
          <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9,22 9,12 15,12 15,22" />
          </svg>
        </Link>
      </nav>

      <section className="header-section" id="home">
        <div className="header-background" />
        <div className="header-content">
          <div className="TOPheader">
            <div className="logo">
              <div className="header-logo">
                <img src={logo} alt="Zuuush Logo" />
              </div>
            </div>
            <h1>ZUUUSH</h1>
            <p className="header-tagline">Empowering Mental Wellness Through Connection & Support</p>
          </div>
        </div>
      </section>

      <main>
        <section className="LogIn" id="login">
          <div className="login-container">
            <div className="login-layout">
              <div className="login-form-section">
                <div className="login-card">
                  <div className="header">Welcome Back</div>
                  <form className="login-form" id="loginForm" onSubmit={handleSignIn}>
                    <div className="form-group">
                      <input
                        type="email"
                        name="email"
                        id="loginEmail"
                        placeholder="Email"
                        className="form-input"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      <input
                        type="password"
                        name="password"
                        id="loginPassword"
                        placeholder="Password"
                        className="form-input"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </div>
                    <button type="submit" className="btn">Sign In</button>
                    <Link to="/signup" className="btn btn-secondary" style={{ marginTop: '10px' }}>Sign Up</Link>
                  </form>
                </div>
              </div>
              <div className="login-description-section">
                <div className="description-content">
                  <h2 className="description-title">A Safe Space for Your Mind</h2>
                  <p className="description-text">
                    No fancy promises here. Just a space where your thoughts don't have to make perfect sense and nobody's timing how long it takes you to figure things out.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="AboutUs section" id="about">
          <div className="container">
            <div className="about-container">
              <h1 className="header animate-on-scroll">The People Behind This</h1>
              <p className="about-description animate-on-scroll">
                We're a small team of developers, designers, and psychology enthusiasts who got tired of mental health apps that felt more like homework than help.
              </p>
              <div className="TeamPics team-grid">
                <div className="Somay team-member card-3d stagger-animation">
                  <div className="team-photo hover-scale">
                    <img src={somayImg} alt="Somay" />
                  </div>
                  <p className="team-name">Somay</p>
                  <p className="team-role">UI/UX & Frontend</p>
                </div>
                <div className="kriti team-member card-3d stagger-animation">
                  <div className="team-photo hover-scale">
                    <img src={kritiImg} alt="Kriti" />
                  </div>
                  <p className="team-name">Kriti</p>
                  <p className="team-role">Backend</p>
                </div>
                <div className="divyansh team-member card-3d stagger-animation">
                  <div className="team-photo hover-scale">
                    <img src={divyanshImg} alt="Divyansh" />
                  </div>
                  <p className="team-name">Divyansh</p>
                  <p className="team-role">Backend</p>
                </div>
              </div>
              <p className="about-closing animate-on-scroll">
                Our approach is simple: create tools that work with how people actually think and feel.
              </p>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default Home;
