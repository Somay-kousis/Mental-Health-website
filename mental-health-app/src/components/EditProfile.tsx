// src/pages/EditProfile.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/edit-profile.css'; // adjust path if needed

const EditProfile: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    bio: '',
    pronouns: '',
    profilePicture: '',
  });

  // Fetch existing user info (optional enhancement)
  useEffect(() => {
      const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/profile', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      setFormData({
        username: data.user.username || '',
        email: data.user.email || '',
        bio: data.user.bio || '',
        pronouns: data.user.pronouns || '',
        profilePicture: data.user.profilePicture || '',
      });
    } catch (err) {
      console.error('Failed to fetch profile:', err);
    }
  };

  fetchProfile();
    // TODO: Fetch current profile data with token and prefill form
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
 e.preventDefault();

  try {
    const token = localStorage.getItem('token'); // or however you store it

    const res = await fetch('http://localhost:5000/api/update-profile', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(formData),
      
    });

    if (!res.ok) {
          console.log("Status:", res.status);
console.log("Response:", await res.text()); // convert to text to see even error HTML
      throw new Error('Failed to update profile');

    }

    const data = await res.json();
    console.log('Updated:', data);
    navigate('/profile');
  } catch (err) {
    console.error(err);
    alert('Error updating profile');


  }
  };

  return (
    <div className="edit-profile-container glass">
      <h1 className="premium-section-title">Edit Profile</h1>
      <form className="edit-profile-form" onSubmit={handleSubmit}>
  <div className="form-group">
    <label>Username:</label>
    <input type="text" name="username" value={formData.username} onChange={handleChange} />
  </div>

  <div className="form-group">
    <label>Email:</label>
    <input type="email" name="email" value={formData.email} onChange={handleChange} />
  </div>

  <div className="form-group">
    <label>Pronouns:</label>
    <input type="text" name="pronouns" value={formData.pronouns} onChange={handleChange} />
  </div>

  <div className="form-group">
    <label>Bio:</label>
    <textarea name="bio" value={formData.bio} onChange={handleChange} />
  </div>

  <div className="form-group">
    <label>Profile Picture URL:</label>
    <input type="text" name="profilePicture" value={formData.profilePicture} onChange={handleChange} />
  </div>

  <button type="submit" className="btn btn-primary">Save Changes</button>
</form>

    </div>
  );
};

export default EditProfile;
