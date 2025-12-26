import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppHeader from '../components/AppHeader';

function RoleLogin({ users }) {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    if (!trimmedEmail || !trimmedPassword) {
      setError('Email and password are required.');
      return;
    }

    const user = users.find(
      (u) => u.email === trimmedEmail && u.password === trimmedPassword
    );

    if (!user) {
      setError('Invalid email or password.');
      return;
    }

    localStorage.setItem('role', user.role);
    localStorage.setItem('userEmail', user.email);

    if (user.role === 'CHAIR') {
      navigate('/chair');
    } else {
      navigate('/employee');
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#020617',
        color: '#e5e7eb',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Optional: keep AppHeader if you use it elsewhere */}
      {/* <AppHeader /> */}

      {/* Custom header with logo like Home page */}
      <header
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '1rem 2rem',
          background: 'rgba(2,6,23,0.95)',
          borderBottom: '1px solid #1f2937',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem',
          }}
        >
          <img
            src="/logo.jpg"           // logo in public/logo.jpg
            alt="Task Portal Logo"
            style={{
              width: 170,
              height: 40,
              objectFit: 'contain',
              borderRadius: '0.6rem',
            }}
          />
          
        </div>
      </header>

      <main
        style={{
          flex: 1,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '1.5rem 0.8rem',
        }}
      >
        <div
          style={{
            width: '100%',
            maxWidth: 420,
            borderRadius: '1.2rem',
            border: '1px solid #1f2937',
            background:
              'radial-gradient(circle at top left, #1f2937 0%, #020617 55%)',
            padding: '1.4rem 1.6rem 1.6rem',
          }}
        >
          <h2
            style={{
              margin: 0,
              marginBottom: '0.8rem',
              fontSize: '1.3rem',
            }}
          >
            Login
          </h2>
          <p
            style={{
              margin: 0,
              marginBottom: '1rem',
              fontSize: '0.9rem',
              color: '#9ca3af',
            }}
          >
            Enter your email and password to continue.
          </p>

          <form onSubmit={handleLogin}>
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
                placeholder="Enter your password"
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

            <button
              type="submit"
              style={{
                width: '100%',
                padding: '0.7rem 1rem',
                borderRadius: '0.9rem',
                border: 'none',
                background: '#8b5cf6',
                color: '#ffffff',
                fontSize: '0.95rem',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Login
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}

export default RoleLogin;
