import React, { useState } from 'react';
import { submitImage } from '../api.js';

export default function UploadForm({ onJobCreated }) {
  const [file, setFile] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    if (!file) return;
    setBusy(true);
    setError('');
    try {
      const resp = await submitImage(file);
      onJobCreated(resp.job_id, resp.db_job_id || null);
    } catch (e) {
      setError(e.response?.data?.error || e.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="panel">
      <h3>Submit New 3D Reconstruction Job</h3>
      <form onSubmit={handleSubmit}>
        <input
          type="file"
          accept="image/*"
          onChange={e => setFile(e.target.files?.[0] || null)}
        />
        <div style={{ marginTop: 10 }}>
          <button className="btn" type="submit" disabled={!file || busy}>
            {busy ? 'Submitting...' : 'Submit'}
          </button>
        </div>
        {error && <div style={{ color: '#ff6b6b', marginTop: 8 }}>{error}</div>}
      </form>
    </div>
  );
}