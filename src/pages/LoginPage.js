import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import logo from "./Ausdauer_logo.jpg";
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      // This dynamically picks the Render URL if it exists, otherwise falls back to localhost for your testing
      const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8080";

      const res = await axios.post(`${API_URL}/api/auth/login`, { email, password });
      
      // Store user data securely
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.user.role);
      localStorage.setItem("userName", res.data.user.name);

      // Role-Based Redirect
      if (res.data.user.role === "CHAIR") {
        navigate("/chair");
      } else {
        navigate("/employee");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={containerStyle}>
      <div style={glassCardStyle}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <img src={logo} alt="Logo" style={{ width: '100px', height: '100px' }} />
          <h1 style={{ margin: 0, color: '#8b5cf6', fontSize: '2.5rem' }}>Ausdauer</h1>
          <p style={{ color: '#9ca3af' }}>Task Management</p>
        </div>

        {error && <div style={errorStyle}>{error}</div>}

        <form onSubmit={handleLogin}>
          <div style={inputGroup}>
            <label style={labelStyle}>Corporate Email</label>
            <input 
              type="email" 
              placeholder="name@company.com" 
              required 
              style={inputStyle} 
              onChange={(e) => setEmail(e.target.value)} 
            />
          </div>

          <div style={inputGroup}>
            <label style={labelStyle}>Secure Password</label>
            <input 
              type="password" 
              placeholder="••••••••" 
              required 
              style={inputStyle} 
              onChange={(e) => setPassword(e.target.value)} 
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            style={{ ...btnStyle, opacity: loading ? 0.7 : 1 }}
          >
            {loading ? "Authenticating..." : "Login to Dashboard"}
          </button>
        </form>
      </div>
    </div>
  );
};

// PROFESSIONAL STYLES
const containerStyle = { minHeight: '100vh', background: '#020617', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Inter, sans-serif' };
const glassCardStyle = { background: '#0f172a', padding: '3rem', borderRadius: '1.5rem', border: '1px solid #1f2937', width: '100%', maxWidth: '450px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' };
const inputGroup = { marginBottom: '1.5rem' };
const labelStyle = { display: 'block', color: '#9ca3af', fontSize: '0.875rem', marginBottom: '0.5rem' };
const inputStyle = { width: '100%', padding: '0.8rem', background: '#020617', border: '1px solid #374151', color: 'white', borderRadius: '8px', outline: 'none', transition: 'border-color 0.2s' };
const btnStyle = { width: '100%', background: '#8b5cf6', color: 'white', padding: '1rem', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '1rem' };
const errorStyle = { background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', textAlign: 'center', fontSize: '0.875rem' };

export default Login;