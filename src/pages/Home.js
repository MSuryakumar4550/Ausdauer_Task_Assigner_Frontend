import React from 'react';
import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();

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
        {/* Left: logo + title */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem',
          }}
        >
          {/* logo.jpg must be inside /public */}
          <img
            src="logo.jpg"
            alt="Task Portal Logo"
            style={{
              width: 170,
              height: 50,
              objectFit: 'contain',
              borderRadius: '0.6rem',
            }}
          />
          <h1 style={{ margin: 0, fontSize: '1.4rem' }}>Task Portal</h1>
        </div>

        <button
          onClick={() => navigate('/login')}
          style={{
            padding: '0.6rem 1.2rem',
            borderRadius: '0.8rem',
            border: '1px solid #4b5563',
            background: '#020617',
            color: '#e5e7eb',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          Login
        </button>
      </header>

      <main
        style={{
          flex: 1,
          padding: '2rem',
          maxWidth: '800px',
          margin: '0 auto',
        }}
      >
        <div
          style={{
            background: '#020617',
            borderRadius: '1.2rem',
            border: '1px solid #1f2937',
            padding: '2rem',
            boxShadow: '0 25px 60px rgba(0,0,0,0.8)',
          }}
        >
          <h2 style={{ marginTop: 0, color: '#f9fafb', fontSize: '1.5rem' }}>
            Company Announcements
          </h2>

          <div style={{ marginTop: '1.5rem' }}>
            <div
              style={{
                background: '#0f172a',
                borderRadius: '1rem',
                padding: '1.2rem',
                marginBottom: '1rem',
                borderLeft: '4px solid #8b5cf6',
              }}
            >
              <h3 style={{ margin: '0 0 0.5rem 0', color: '#8b5cf6' }}>
                Monthly Team Meeting
              </h3>
              <p style={{ margin: '0 0 0.5rem 0', color: '#e5e7eb' }}>
                Join us this Friday at 3 PM for quarterly review. All team leads
                required.
              </p>
              <span style={{ fontSize: '0.8rem', color: '#9ca3af' }}>
                Posted 2 days ago
              </span>
            </div>

            <div
              style={{
                background: '#0f172a',
                borderRadius: '1rem',
                padding: '1.2rem',
                marginBottom: '1rem',
                borderLeft: '4px solid #22c55e',
              }}
            >
              <h3 style={{ margin: '0 0 0.5rem 0', color: '#22c55e' }}>
                New Employee Achievement!
              </h3>
              <p style={{ margin: '0 0 0.5rem 0', color: '#e5e7eb' }}>
                Congrats to Employee 1 for completing 5 tasks ahead of deadline!
              </p>
              <span style={{ fontSize: '0.8rem', color: '#9ca3af' }}>
                Posted yesterday
              </span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Home;
