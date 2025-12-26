import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function AddUser({ onAddUser }) {
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('EMPLOYEE');
  const [team, setTeam] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !password.trim()) {
      setError('Name, email and password are required.');
      return;
    }

    const newUser = {
      id: Date.now(),
      name: name.trim(),
      email: email.trim(),
      role,
      team: team.trim() || 'General',
      password: password.trim(), // frontend-only demo
    };

    onAddUser(newUser);
    navigate('/chair');
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#020617',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
        padding: '1.5rem 1rem',
        color: '#e5e7eb',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '480px',
          background: '#020617',
          borderRadius: '1.2rem',
          border: '1px solid #1f2937',
          boxShadow: '0 25px 60px rgba(0,0,0,0.8)',
          padding: '1.6rem 1.5rem 1.8rem',
        }}
      >
        <h2
          style={{
            marginTop: 0,
            marginBottom: '0.4rem',
            fontSize: '1.3rem',
          }}
        >
          Add New User
        </h2>
        <p
          style={{
            fontSize: '0.85rem',
            color: '#9ca3af',
            marginTop: 0,
          }}
        >
          Only chairs can add new employees or chairs to the system.
        </p>

        <form onSubmit={handleSubmit} style={{ marginTop: '1rem' }}>
          <div style={{ marginBottom: '0.8rem' }}>
            <label style={{ fontSize: '0.8rem', color: '#9ca3af' }}>
              Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter full name"
              style={{
                width: '100%',
                marginTop: '0.25rem',
                padding: '0.55rem 0.7rem',
                borderRadius: '0.7rem',
                border: '1px solid #4b5563',
                background: '#020617',
                color: '#e5e7eb',
                fontSize: '0.9rem',
              }}
            />
          </div>

          <div style={{ marginBottom: '0.8rem' }}>
            <label style={{ fontSize: '0.8rem', color: '#9ca3af' }}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@ausdauer.com"
              style={{
                width: '100%',
                marginTop: '0.25rem',
                padding: '0.55rem 0.7rem',
                borderRadius: '0.7rem',
                border: '1px solid #4b5563',
                background: '#020617',
                color: '#e5e7eb',
                fontSize: '0.9rem',
              }}
            />
          </div>

          <div style={{ marginBottom: '0.8rem' }}>
            <label style={{ fontSize: '0.8rem', color: '#9ca3af' }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Set a password"
              style={{
                width: '100%',
                marginTop: '0.25rem',
                padding: '0.55rem 0.7rem',
                borderRadius: '0.7rem',
                border: '1px solid #4b5563',
                background: '#020617',
                color: '#e5e7eb',
                fontSize: '0.9rem',
              }}
            />
          </div>

          <div style={{ marginBottom: '0.8rem' }}>
            <label style={{ fontSize: '0.8rem', color: '#9ca3af' }}>
              Role
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              style={{
                width: '100%',
                marginTop: '0.25rem',
                padding: '0.55rem 0.7rem',
                borderRadius: '0.7rem',
                border: '1px solid #4b5563',
                background: '#020617',
                color: '#e5e7eb',
                fontSize: '0.9rem',
              }}
            >
              <option value="EMPLOYEE">Employee</option>
              <option value="CHAIR">Chair</option>
            </select>
          </div>

          <div style={{ marginBottom: '0.8rem' }}>
            <label style={{ fontSize: '0.8rem', color: '#9ca3af' }}>
              Team (optional)
            </label>
            <input
              type="text"
              value={team}
              onChange={(e) => setTeam(e.target.value)}
              placeholder="Finance / HR / Tech ..."
              style={{
                width: '100%',
                marginTop: '0.25rem',
                padding: '0.55rem 0.7rem',
                borderRadius: '0.7rem',
                border: '1px solid #4b5563',
                background: '#020617',
                color: '#e5e7eb',
                fontSize: '0.9rem',
              }}
            />
          </div>

          {error && (
            <div
              style={{
                fontSize: '0.78rem',
                color: '#f97316',
                marginBottom: '0.6rem',
              }}
            >
              {error}
            </div>
          )}

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              gap: '0.6rem',
              marginTop: '0.4rem',
            }}
          >
            <button
              type="button"
              onClick={() => navigate('/chair')}
              style={{
                flex: 1,
                padding: '0.55rem 0.7rem',
                borderRadius: '0.7rem',
                border: '1px solid #4b5563',
                background: '#020617',
                color: '#e5e7eb',
                fontSize: '0.9rem',
                cursor: 'pointer',
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              style={{
                flex: 1,
                padding: '0.55rem 0.7rem',
                borderRadius: '0.7rem',
                border: 'none',
                background: '#8b5cf6',
                color: '#ffffff',
                fontSize: '0.9rem',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Save User
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddUser;
