import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import './login.css';

const Login = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const navigate = useNavigate(); // Initialize navigate hook

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Send login request to the backend
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/auth/login`, formData, {
        withCredentials: true, // Include credentials (cookies) with the request
      });
      
      // Store the JWT in localStorage
      const { token } = response.data;
      localStorage.setItem("jwtToken", token);

      // Set Axios default authorization header
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      // Success message
      setMessage(response.data.message);
      navigate('/dashboard'); // Navigate to the dashboard after successful login
    } catch (error) {
      // Handle errors
      if (error.response && error.response.data.message) {
        setMessage(error.response.data.message);
      } else {
        setMessage("Something went wrong. Please try again.");
      }
    }
  };

  const handleNavigateToSignup = () => {
    navigate('/auth/signup'); // Navigate to the signup page
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Login</h2>

        <div className="input-group">
          <label>Username:</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>

        <div className="input-group">
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="input-group">
          <label>Password:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        <button className="login-button" type="submit">Login</button>

        {message && <p className="message">{message}</p>}

        <p>Don't have an account?</p>
        <button className="signup-btn" onClick={handleNavigateToSignup}>
          Go to Signup
        </button>
      </form>

      {/* Optional image container for logo or illustration */}
      {/* <div className="image-container">
        <img src="your-logo.png" alt="Your Logo" />
      </div> */}
    </div>
  );
};

export default Login;
