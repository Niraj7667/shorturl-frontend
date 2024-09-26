import React from 'react';
import ReactDOM from 'react-dom/client'; // Make sure this import is correct
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom'; // Added Navigate for redirection
import Signup from "./components/signup/signup.jsx"; // Ensure the correct path is used
import Login from './components/login/login.jsx';
import ShortenUrl from './components/shorten/shorten.jsx';
import Dashboard from './dashboard/dashboard.jsx';
import UpdateUrl from './updateUrl/updateUrl.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Router>
      <Routes>
      <Route path="/" element={<Navigate to="/auth/login" />} />
        <Route path="/auth/signup" element={<Signup />} />
        <Route path='/auth/login' element = {<Login />} />
        <Route path='/api/shorten' element= {<ShortenUrl />} />
        <Route path='/dashboard' element = {<Dashboard /> } />
        <Route path='/update/:shortUrl' element= {<UpdateUrl />} />
      </Routes>
    </Router>
  </React.StrictMode>
);
