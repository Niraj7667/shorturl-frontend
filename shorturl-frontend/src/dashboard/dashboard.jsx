import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import moment from 'moment';
import { jwtDecode } from "jwt-decode";
import { AppBar, Toolbar, Button, Typography, IconButton, Box, Paper } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

// Axios instance for API calls
const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api`, // Adjust to your backend API
  withCredentials: true, // Sends cookies (JWT)
});

const Dashboard = () => {
  const [urls, setUrls] = useState([]); // Stores user's URLs
  const [error, setError] = useState('');
  const [username, setUsername] = useState(''); // State for the username
  const navigate = useNavigate();

  // Fetch the list of URLs when the component mounts
  useEffect(() => {
    const fetchUrls = async () => {
      try {
        const token = localStorage.getItem('jwtToken');

        // Decode the JWT token to get the username
        if (token) {
          const decodedToken = jwtDecode(token);
          setUsername(decodedToken.username); // Set the username from the decoded token
        }

        // Fetch URLs
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/urls`, {
          headers: {
            Authorization: `Bearer ${token}`, // JWT token for authorization
          },
          withCredentials: true, // Include cookies if needed
        });

        setUrls(response.data.urls); // Assuming the backend sends a list of URLs
      } catch (err) {
        console.error('Error fetching URLs:', err);
        setError('Failed to fetch URLs');
      }
    };

    fetchUrls();
  }, []);

  // Logout functionality
  const handleLogout = () => {
    localStorage.removeItem('jwtToken'); // Remove token from local storage
    navigate('/auth/login'); // Redirect to login page
  };

  // Navigate to URL Shortener
  const handleNavigateToShorten = () => {
    navigate('/api/shorten'); // Navigate to the URL shortener page
  };

  // Function to delete a URL
  const handleDeleteUrl = async (id) => {
    const token = localStorage.getItem('jwtToken');
    try {
      await api.delete(`${import.meta.env.VITE_API_URL}/delete/urls/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`, // JWT token for authorization
        },
      });

      setUrls(urls.filter((url) => url.id !== id)); // Remove deleted URL from state
      alert('URL deleted successfully');
    } catch (err) {
      console.error('Error deleting URL:', err);
      setError('Failed to delete URL');
    }
  };

  // Function to copy the short URL
  const handleCopyUrl = (shortUrl) => {
    navigator.clipboard.writeText(`${import.meta.env.VITE_API_URL}/${shortUrl}`)
      .then(() => {
        alert('Shortened URL copied to clipboard!');
      })
      .catch((err) => {
        console.error('Failed to copy URL: ', err);
        setError('Failed to copy URL');
      });
  };

  // Function to update a URL
  const handleUpdateUrl = async (id) => {
    const newUrl = prompt('Enter the new long URL:');
    if (newUrl) {
      const token = localStorage.getItem('jwtToken');
      try {
        const response = await api.put(`${import.meta.env.VITE_API_URL}/update/urls/${id}`, { longUrl: newUrl }, {
          headers: {
            Authorization: `Bearer ${token}`, // JWT token for authorization
          },
        });

        setUrls(response.data.urls); // Update state with the new URL list
        alert('URL updated successfully');
      } catch (err) {
        console.error('Error updating URL:', err);
        setError('Failed to update URL');
      }
    }
  };

  return (
    <div>
      {/* Top AppBar with Logout and Username */}
      <AppBar position="static">
        <Toolbar style={{ justifyContent: 'space-between' }}>
          <Typography variant="h6">Dashboard</Typography>

          <div style={{ display: 'flex', alignItems: 'center' }}>
            <IconButton color="inherit">
              <AccountCircleIcon />
            </IconButton>
            <Typography variant="body1" style={{ marginLeft: '8px' }}>
              {username}
            </Typography>
            <Button color="inherit" onClick={handleLogout} style={{ marginLeft: '16px' }}>
              Logout
            </Button>
          </div>
        </Toolbar>
      </AppBar>

      {/* Centered Content Box */}
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minHeight="100vh"
      >
        {/* Error message */}
        {error && <p style={{ color: 'red' }}>{error}</p>}

        {/* Button to navigate to /shorten */}
        <Button variant="contained" color="primary" onClick={handleNavigateToShorten} style={{ margin: '20px 0' }}>
          Shorten a New URL
        </Button>
      
        <h2>Your URLs:</h2>
        <Box width="80%">
          {urls.map((url) => (
            <Paper 
              key={url.id} 
              elevation={3} 
              style={{ padding: '20px', marginBottom: '20px', border: '1px solid #ccc' }}
            >
              <p>Long URL: {url.longUrl}</p>
              <p>
                Short URL: 
                <a 
                  href={`${import.meta.env.VITE_API_URL}/${url.shortUrl}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  style={{ marginLeft: '5px', textDecoration: 'underline', color: 'blue' }}
                >
                  {`${import.meta.env.VITE_API_URL}/${url.shortUrl}`}
                </a>
              </p>
              <p>Click Count: {url.clickCount}</p>
              <p>Created At: {moment(url.createdAt).format('MMMM Do YYYY, h:mm:ss a')}</p>

              {/* Button to copy the short URL */}
              <Button onClick={() => handleCopyUrl(url.shortUrl)} variant="outlined" color="primary" style={{ marginRight: '10px' }}>
                Copy Short URL
              </Button>
              {/* Button to delete the URL */}
              <Button onClick={() => handleDeleteUrl(url.id)} variant="outlined" color="secondary" style={{ marginRight: '10px' }}>
                Delete URL
              </Button>
              {/* Button to update the long URL */}
              <Button onClick={() => navigate(`/update/${url.shortUrl}`)} variant="outlined" color="default">
                Update URL
              </Button>
            </Paper>
          ))}
        </Box>
      </Box>
    </div>
  );
};

export default Dashboard;
