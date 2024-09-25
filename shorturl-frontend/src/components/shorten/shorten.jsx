import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Navigate } from 'react-router-dom';

// Axios instance for API calls, automatically sends cookies (containing JWT)
const api = axios.create({
  baseURL: 'http://localhost:3000/api', // Replace with your backend API URL
  withCredentials: true, // Ensures cookies are sent with each request
});

const ShortenUrl = () => {
  const [originalUrl, setOriginalUrl] = useState('');
  const [shortUrl, setShortUrl] = useState('');
  const [error, setError] = useState('');
  const [authenticated, setAuthenticated] = useState(false); // Authentication state

  // Check if the user is authenticated by making a request to a protected endpoint
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('jwtToken'); // Example of storing the token in localStorage

        // Make the request with the token in the Authorization header
        const response = await api.get('http://localhost:3000/auth/check', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        if (response.data.message === 'Authenticated') {
          setAuthenticated(true);
        } else {
          setAuthenticated(false);
        }
      } catch (err) {
        setAuthenticated(false);
      }
    };

    checkAuth();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Reset error message

    if (!authenticated) {
      setError('Please log in to shorten URLs.');
      return;
    }

    if (!originalUrl) {
      setError('Please enter a valid URL.');
      return;
    }

    try {
  const token = localStorage.getItem('jwtToken'); // Retrieve the token from localStorage

  // Make the POST request to shorten the URL with the JWT token in the Authorization header
  const response = await api.post(
    'http://localhost:3000/api/shorten',
    { originalUrl },
    {
      headers: {
        Authorization: `Bearer ${token}`, // Send the JWT token
      },
    }
  );

  setShortUrl(`http://localhost:3000/${response.data.url.shortUrl}`); // Full URL for the short URL
} catch (err) {
  setError('Failed to shorten the URL.');
  console.error(err);
}
  };
  const navigate = useNavigate(); // Call the useNavigate hook at the top of your component

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shortUrl)
      .then(() => {
        alert('Shortened URL copied to clipboard!');
      })
      .catch(err => {
        console.error('Failed to copy: ', err);
      });
  };
  
  return (
    <div>
      <h1>URL Shortener</h1>
      {authenticated ? (
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="originalUrl">Enter URL:</label>
            <input
              type="text"
              id="originalUrl"
              value={originalUrl}
              onChange={(e) => setOriginalUrl(e.target.value)}
            />
          </div>
          <button type="submit">Shorten URL</button>
        </form>
      ) : (
        <p>Please log in to shorten URLs.</p>
      )}

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {shortUrl && (
        <div>
          <p>Shortened URL:</p>
          <a href={shortUrl} target="_blank" rel="noopener noreferrer">
            {shortUrl}
          </a>
          <button onClick={copyToClipboard}>Copy URL</button>
        </div>
      )}
      <button onClick={() => navigate('/dashboard')}>Back to Dashboard</button>
    </div>
  );
};

export default ShortenUrl;
