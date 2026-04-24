import React, { useState } from 'react';
import { signup, login } from '../api.js';

export default function AuthPanel({ onAuthChange }) {
  const [mode, setMode] = useState('login');
  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      let result;
      if (mode === 'signup') {
        result = await signup(email, pw, name);
      } else {
        result = await login(email, pw);
      }
      onAuthChange(true, result.user?.email || email);
    } catch (e) {
      setError(e.response?.data?.error || e.message);
    } finally {
      setLoading(false);
    }
  }

  function toggleMode() {
    setMode(mode === 'signup' ? 'login' : 'signup');
    setError('');
  }

  return (
    <div className="glass-card" style={{
      maxWidth: '500px',
      margin: '0 auto',
      animation: 'fadeInUp 0.6s ease'
    }}>
      {/* Header with Toggle */}
      <div style={{
        display: 'flex',
        gap: 'var(--space-md)',
        marginBottom: 'var(--space-xl)',
        borderBottom: '1px solid var(--glass-border)',
        paddingBottom: 'var(--space-md)'
      }}>
        <button
          type="button"
          onClick={() => setMode('login')}
          style={{
            flex: 1,
            padding: 'var(--space-md)',
            background: mode === 'login' ? 'linear-gradient(135deg, var(--primary), var(--secondary))' : 'transparent',
            color: mode === 'login' ? 'white' : 'var(--text-secondary)',
            border: 'none',
            borderRadius: 'var(--radius-md)',
            cursor: 'pointer',
            fontWeight: 600,
            transition: 'all var(--transition-base)',
            fontSize: '1rem'
          }}
        >
          Login
        </button>
        <button
          type="button"
          onClick={() => setMode('signup')}
          style={{
            flex: 1,
            padding: 'var(--space-md)',
            background: mode === 'signup' ? 'linear-gradient(135deg, var(--primary), var(--secondary))' : 'transparent',
            color: mode === 'signup' ? 'white' : 'var(--text-secondary)',
            border: 'none',
            borderRadius: 'var(--radius-md)',
            cursor: 'pointer',
            fontWeight: 600,
            transition: 'all var(--transition-base)',
            fontSize: '1rem'
          }}
        >
          Sign Up
        </button>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 'var(--space-lg)' }}>
        {mode === 'signup' && (
          <div style={{ animation: 'fadeInUp 0.3s ease' }}>
            <label style={{
              display: 'block',
              marginBottom: 'var(--space-sm)',
              fontSize: '0.875rem',
              fontWeight: 500,
              color: 'var(--text-secondary)'
            }}>
              Full Name
            </label>
            <input
              placeholder="Enter your name"
              value={name}
              onChange={e => setName(e.target.value)}
              style={{ width: '100%' }}
            />
          </div>
        )}

        <div>
          <label style={{
            display: 'block',
            marginBottom: 'var(--space-sm)',
            fontSize: '0.875rem',
            fontWeight: 500,
            color: 'var(--text-secondary)'
          }}>
            Email Address
          </label>
          <input
            placeholder="you@example.com"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            style={{ width: '100%' }}
          />
        </div>

        <div>
          <label style={{
            display: 'block',
            marginBottom: 'var(--space-sm)',
            fontSize: '0.875rem',
            fontWeight: 500,
            color: 'var(--text-secondary)'
          }}>
            Password
          </label>
          <input
            placeholder="Enter your password"
            type="password"
            value={pw}
            onChange={e => setPw(e.target.value)}
            required
            style={{ width: '100%' }}
          />
          {mode === 'signup' && (
            <div style={{
              fontSize: '0.75rem',
              color: 'var(--text-muted)',
              marginTop: 'var(--space-sm)'
            }}>
              Minimum 6 characters recommended
            </div>
          )}
        </div>

        {error && (
          <div className="error-message">
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        <button
          className="btn"
          type="submit"
          disabled={loading}
          style={{
            width: '100%',
            padding: 'var(--space-md) var(--space-xl)',
            fontSize: '1rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 'var(--space-sm)'
          }}
        >
          {loading ? (
            <>
              <div className="spinner" style={{ width: '16px', height: '16px', borderWidth: '2px' }}></div>
              <span>Processing...</span>
            </>
          ) : (
            <span>{mode === 'signup' ? '✨ Create Account' : '🚀 Login'}</span>
          )}
        </button>
      </form>

      <div style={{
        marginTop: 'var(--space-lg)',
        textAlign: 'center',
        fontSize: '0.875rem',
        color: 'var(--text-muted)'
      }}>
        {mode === 'login' ? "Don't have an account? " : "Already have an account? "}
        <button
          type="button"
          onClick={toggleMode}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--primary)',
            cursor: 'pointer',
            textDecoration: 'underline',
            padding: 0,
            font: 'inherit'
          }}
        >
          {mode === 'login' ? 'Sign up' : 'Login'}
        </button>
      </div>
    </div>
  );
}