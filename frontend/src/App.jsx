import React, { useState } from 'react';
import AuthPanel from './components/AuthPanel.jsx';
import UploadForm from './components/UploadForm.jsx';
import JobTracker from './components/JobTracker.jsx';

export default function App() {
  const [authed, setAuthed] = useState(!!localStorage.getItem('token'));
  const [currentJobId, setCurrentJobId] = useState(null);

  function handleJobCreated(jobId) {
    setCurrentJobId(jobId);
  }

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto', padding: 24 }}>
      <h1>TeethNet 3D Reconstruction</h1>
      <p style={{ color: '#9aa4af', marginTop: -8 }}>
        Upload 2D dental images → Generate 3D STL via your GPU pipeline.
      </p>

      <AuthPanel onAuthChange={setAuthed} />

      {authed && (
        <>
          <UploadForm onJobCreated={handleJobCreated} />
          {currentJobId && (
            <JobTracker jobId={currentJobId} onComplete={(final) => console.log('Job finished', final)} />
          )}
        </>
      )}

      {!authed && (
        <div className="panel" style={{ borderStyle: 'dashed' }}>
          <p>Please login or sign up to submit reconstruction jobs.</p>
        </div>
      )}
    </div>
  );
}