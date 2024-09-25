import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './ShortenUrl.css'; // Import the CSS file

const ShortenUrl = () => {
  const [originalUrl, setOriginalUrl] = useState('');
  const [shortUrl, setShortUrl] = useState('');
  const [error, setError] = useState('');
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('jwtToken');
        const response = await axios.get('http://localhost:3000/auth/check', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
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
    setError('');

    if (!authenticated) {
      setError('Please log in to shorten URLs.');
      return;
    }

    if (!originalUrl) {
      setError('Please enter a valid URL.');
      return;
    }

    try {
      const token = localStorage.getItem('jwtToken');
      const response = await axios.post(
        'http://localhost:3000/api/shorten',
        { originalUrl },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setShortUrl(`http://localhost:3000/${response.data.url.shortUrl}`);
    } catch (err) {
      setError('Failed to shorten the URL.');
      console.error(err);
    }
  };

  const navigate = useNavigate();

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
    <div className="shorten-url-container">
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

      {error && <p className="error">{error}</p>}

      {shortUrl && (
        <div className="short-url-display">
          <p>Shortened URL:</p>
          <a href={shortUrl} target="_blank" rel="noopener noreferrer">
            {shortUrl}
          </a>
          <button className="copy-btn" onClick={copyToClipboard}>Copy URL</button>
        </div>
      )}
      <button onClick={() => navigate('/dashboard')}>Back to Dashboard</button>
    </div>
  );
};

export default ShortenUrl;
