import React from 'react';
import logo2 from '../assets/logo2.png';

export default function Header({ user, onLogout }) {
  return (
    <header className="glass-card" style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      marginBottom: 'var(--space-xl)',
      padding: 'var(--space-lg) var(--space-xl)'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
          <div style={{
            height: '70px',
            width: '70px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '50%',
            overflow: 'hidden',
            border: '2px solid rgba(0, 212, 255, 0.2)',
            boxShadow: '0 0 15px rgba(0, 212, 255, 0.15)',
            flexShrink: 0
          }}>
            {/* Swap {logo1} to {logo2} below to try the second logo! */}
            <img
              src={logo2}
              alt="TeethNet Logo"
              style={{
                height: '115%',
                width: '115%',
                objectFit: 'cover',
                objectPosition: '51% 50%',
                transform: 'translateY(6px)'
              }}
            />
          </div>
          <div>
            <h2 style={{
              margin: 0,
              fontSize: '1.5rem',
              background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              TeethNet
            </h2>
            <p style={{
              margin: 0,
              fontSize: '0.75rem',
              color: 'var(--text-muted)',
              textTransform: 'uppercase',
              letterSpacing: '1px'
            }}>
              3D Reconstruction
            </p>
          </div>
        </div>

        {/* User Info */}
        {user && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
            <div style={{
              textAlign: 'right',
              display: 'none'
            }}>
              <div style={{ fontSize: '0.875rem', fontWeight: 600 }}>{user.email}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Authenticated</div>
            </div>
            <button
              onClick={onLogout}
              className="btn-secondary"
              style={{ padding: 'var(--space-sm) var(--space-lg)' }}
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
