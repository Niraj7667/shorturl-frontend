import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import moment from 'moment'; // For formatting the date

// Axios instance for API calls
const api = axios.create({
  baseURL: 'http://localhost:3000/api', // Adjust to your backend API
  withCredentials: true, // Sends cookies (JWT)
});

const Dashboard = () => {
  const [urls, setUrls] = useState([]); // Stores user's URLs
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Fetch the list of URLs when the component mounts
  useEffect(() => {
    const fetchUrls = async () => {
      try {
        const token = localStorage.getItem('jwtToken');
        const response = await axios.get('http://localhost:3000/api/urls', {
          headers: {
            Authorization: `Bearer ${token}`,  // JWT token for authorization
          },
          withCredentials: true, // Include cookies if needed
        });

        setUrls(response.data.urls); // Assuming the backend sends a list of URLs with clickCount and createdAt
      } catch (err) {
        console.error('Error fetching URLs:', err);
        setError('Failed to fetch URLs');
      }
    };

    fetchUrls();
  }, []);

  // Function to delete a URL
  const handleDeleteUrl = async (id) => {
    const token = localStorage.getItem('jwtToken');

    try {
      await api.delete(`http://localhost:3000/delete/urls/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,  // JWT token for authorization
        },
      });

      // Remove the deleted URL from the state
      setUrls(urls.filter(url => url.id !== id));
      alert('URL deleted successfully');
    } catch (err) {
      console.error('Error deleting URL:', err);
      setError('Failed to delete URL');
    }
  };

  // Function to copy the short URL
  const handleCopyUrl = (shortUrl) => {
    navigator.clipboard.writeText(`http://localhost:3000/${shortUrl}`)
      .then(() => {
        alert('Shortened URL copied to clipboard!');
      })
      .catch(err => {
        console.error('Failed to copy URL: ', err);
        setError('Failed to copy URL');
      });
  };

  const handleNavigateToShorten = () => {
    navigate('/shorten'); // Navigate to the URL shortener page
  };

  return (
    <div>
      <h1>Dashboard</h1>

      {/* Error message */}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {/* Button to navigate to /shorten */}
      <button onClick={handleNavigateToShorten}>Shorten a New URL</button>

      <h2>Your URLs:</h2>
      <ul>
        {urls.map((url) => (
          <li key={url.id}>
            <p>Long URL: {url.longUrl}</p>
            <p>
              Short URL: 
              <a 
                href={`http://localhost:3000/${url.shortUrl}`} 
                target="_blank" 
                rel="noopener noreferrer"
                style={{ marginLeft: '5px', textDecoration: 'underline', color: 'blue' }}
              >
                {`http://localhost:3000/${url.shortUrl}`}
              </a>
            </p>
            {/* Display the click count */}
            <p>Click Count: {url.clickCount}</p>
            
            {/* Display the creation time, formatted using moment.js */}
            <p>Created At: {moment(url.createdAt).format('MMMM Do YYYY, h:mm:ss a')}</p>

            {/* Button to copy the short URL */}
            <button onClick={() => handleCopyUrl(url.shortUrl)}>Copy Short URL</button>
            
            {/* Button to delete the URL */}
            <button onClick={() => handleDeleteUrl(url.id)}>Delete URL</button>
            
            {/* Button to update the short URL */}
            <button onClick={() => handleUpdateUrl(url.shortUrl)}>Update URL</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Dashboard;
