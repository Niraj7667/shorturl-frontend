import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const navigate = useNavigate(); // Initialize the navigate hook

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
      // Send signup request to the backend
      const response = await axios.post("http://localhost:3000/auth/signup", formData, {
        withCredentials: true,
      });
      
      // Store the JWT in localStorage
      const token = response.data.token;
      localStorage.setItem("jwtToken", token);

      // Set Axios default authorization header
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      // Success message
      setMessage(response.data.message);
      navigate('/dashboard'); // Navigate to the dashboard after signup
    } catch (error) {
      // Handle errors
      if (error.response && error.response.data.message) {
        setMessage(error.response.data.message);
      } else {
        setMessage("Something went wrong. Please try again.");
      }
    }
  };

  const handleNavigateToLogin = () => {
    navigate('/auth/login'); // Navigate to the login page
  };

  return (
    <div>
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Username:</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">Sign Up</button>
      </form>

      {message && <p>{message}</p>}

      {/* Button to navigate to the login page */}
      <p>Already have an account?</p>
      <button onClick={handleNavigateToLogin}>Go to Login</button>
    </div>
  );
};

export default Signup;
