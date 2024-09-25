import React, { useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import './UpdateUrl.css'; // Import the CSS file

const UpdateUrl = () => {
  const { shortUrl } = useParams(); // Get the short URL from the route params
  const [newShortUrl, setNewShortUrl] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [success, setSuccess] = useState('');

  const handleUpdateUrl = async () => {
    if (!newShortUrl) {
      setError('Please enter a valid short URL');
      return;
    }
  
    // Retrieve the JWT token from localStorage
    const token = localStorage.getItem('jwtToken');
  
    try {
      const response = await axios.put(
        `http://localhost:3000/api/update/urls/${shortUrl}`, 
        { newShortUrl },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Send token in the Authorization header
          },
        }
      );
  
      // Set success message from the response
      setError('');
      setSuccess(response.data.message); // Display the success message from backend
    } catch (err) {
      console.error('Failed to update URL:', err);
      setError('Failed to update URL');
      setSuccess(''); // Clear success message if there's an error
    }
  };

  return (
    <div className="update-url-container">
      <h1>Update Short URL</h1>
      {error && <p className="error">{error}</p>}
      {success && <p className="success">{success}</p>} {/* Success message */}
      <label htmlFor="newShortUrl">New Short URL:</label>
      <input
        type="text"
        id="newShortUrl"
        value={newShortUrl}
        onChange={(e) => setNewShortUrl(e.target.value)}
      />
      <button onClick={handleUpdateUrl}>Update</button>
      <button onClick={() => navigate('/dashboard')}>Back to Dashboard</button>
    </div>
  );
};

export default UpdateUrl;
