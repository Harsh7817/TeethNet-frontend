import React from 'react';

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
            fontSize: '2rem',
            background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontWeight: 800
          }}>
            🦷
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
