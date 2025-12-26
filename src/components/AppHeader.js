import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import logo from '../logo.svg';

function AppHeader() {
  const navigate = useNavigate();
  const location = useLocation();
  const onHome = location.pathname === '/';

  return (
    <header
      style={{
        width: '100%',
        padding: '0.7rem 1.2rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: '#020617',
        borderBottom: '1px solid #111827',
        position: 'sticky',
        top: 0,
        zIndex: 40,
      }}
    >
      <div
        onClick={() => navigate('/')}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.6rem',
          cursor: 'pointer',
        }}
      >
        <img
          src={logo}
          alt="Company Logo"
          style={{
            height: 32,
            width: 32,
            borderRadius: '0.4rem',
            objectFit: 'cover',
          }}
        />
        <span
          style={{
            fontSize: '1rem',
            fontWeight: 600,
            color: '#e5e7eb',
          }}
        >
          Ausdauer Tasks
        </span>
      </div>

      {onHome && (
        <button
          onClick={() => navigate('/login')}
          style={{
            padding: '0.45rem 1rem',
            borderRadius: '999px',
            border: '1px solid #374151',
            background: '#0f172a',
            color: '#e5e7eb',
            fontSize: '0.85rem',
            fontWeight: 500,
            cursor: 'pointer',
          }}
        >
          Login
        </button>
      )}
    </header>
  );
}

export default AppHeader;
