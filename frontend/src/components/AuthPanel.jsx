import React, { useState } from 'react';
import { signup, login, logout } from '../api.js';

export default function AuthPanel({ onAuthChange }) {
  const [mode, setMode] = useState('login');
  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const token = localStorage.getItem('token');

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    try {
      if (mode === 'signup') {
        await signup(email, pw, name);
      } else {
        await login(email, pw);
      }
      onAuthChange(true);
    } catch (e) {
      setError(e.response?.data?.error || e.message);
    }
  }

  function handleLogout() {
    logout();
    onAuthChange(false);
  }

  if (token) {
    return (
      <div className="panel">
        <h3>Authenticated</h3>
        <p>Token present in localStorage.</p>
        <button className="btn btn-secondary" onClick={handleLogout}>Logout</button>
      </div>
    );
  }

  return (
    <div className="panel">
      <h3>{mode === 'signup' ? 'Sign Up' : 'Login'}</h3>
      <form onSubmit={handleSubmit} className="grid" style={{ gap: 10 }}>
        {mode === 'signup' && (
          <input
            placeholder="Name"
            value={name}
            onChange={e => setName(e.target.value)}
          />
        )}
        <input
          placeholder="Email"
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <input
          placeholder="Password"
            type="password"
          value={pw}
          onChange={e => setPw(e.target.value)}
          required
        />
        {error && <div style={{ color: '#ff6b6b', fontSize: 13 }}>{error}</div>}
        <div className="flex">
          <button className="btn" type="submit">
            {mode === 'signup' ? 'Create Account' : 'Login'}
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => setMode(mode === 'signup' ? 'login' : 'signup')}
          >
            Switch to {mode === 'signup' ? 'Login' : 'Sign Up'}
          </button>
        </div>
      </form>
    </div>
  );
}