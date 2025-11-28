import React, { useState } from 'react';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import AuthPanel from './components/AuthPanel.jsx';
import UploadForm from './components/UploadForm.jsx';
import JobTracker from './components/JobTracker.jsx';

export default function App() {
  const [authed, setAuthed] = useState(!!localStorage.getItem('token'));
  const [currentJobId, setCurrentJobId] = useState(null);
  const [userEmail, setUserEmail] = useState('');

  function handleAuthChange(isAuthed, email = '') {
    setAuthed(isAuthed);
    setUserEmail(email);
  }

  function handleLogout() {
    localStorage.removeItem('token');
    setAuthed(false);
    setUserEmail('');
    setCurrentJobId(null);
  }

  function handleJobCreated(jobId) {
    setCurrentJobId(jobId);
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header user={authed ? { email: userEmail } : null} onLogout={handleLogout} />

      <main className="container" style={{ flex: 1 }}>
        {/* Hero Section */}
        <div className="hero">
          <h1>Transform 2D Dental Images into 3D Models</h1>
          <p>
            Powered by advanced AI depth estimation and GPU-accelerated processing.
            Upload your dental images and get professional-grade 3D STL models in seconds.
          </p>
        </div>

        {/* Feature Highlights */}
        {!authed && (
          <div className="feature-grid" style={{ marginBottom: 'var(--space-2xl)' }}>
            <div className="feature-card">
              <div className="feature-icon">🤖</div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: 'var(--space-sm)' }}>AI-Powered</h3>
              <p style={{ fontSize: '0.875rem', margin: 0 }}>
                Uses Depth-Anything transformer model for accurate depth estimation
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">⚡</div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: 'var(--space-sm)' }}>Lightning Fast</h3>
              <p style={{ fontSize: '0.875rem', margin: 0 }}>
                GPU-accelerated processing delivers results in 10-30 seconds
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🎯</div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: 'var(--space-sm)' }}>Precision</h3>
              <p style={{ fontSize: '0.875rem', margin: 0 }}>
                Poisson reconstruction ensures high-quality 3D mesh output
              </p>
            </div>
          </div>
        )}

        {/* Authentication Panel */}
        {!authed && <AuthPanel onAuthChange={handleAuthChange} />}

        {/* Main Application */}
        {authed && (
          <div style={{ animation: 'fadeInUp 0.5s ease' }}>
            <UploadForm onJobCreated={handleJobCreated} />
            {currentJobId && (
              <JobTracker
                jobId={currentJobId}
                onComplete={(final) => console.log('Job finished', final)}
              />
            )}
          </div>
        )}

        {/* Call to Action for Non-Authenticated Users */}
        {!authed && (
          <div className="glass-card" style={{
            textAlign: 'center',
            marginTop: 'var(--space-2xl)',
            padding: 'var(--space-2xl)'
          }}>
            <h3 style={{ marginBottom: 'var(--space-md)' }}>Ready to Get Started?</h3>
            <p style={{ marginBottom: 'var(--space-lg)', maxWidth: '600px', margin: '0 auto var(--space-lg)' }}>
              Create a free account to start transforming your dental images into 3D models.
              No credit card required.
            </p>
            <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
              ✓ Unlimited uploads &nbsp;&nbsp; ✓ Fast processing &nbsp;&nbsp; ✓ Secure storage
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}