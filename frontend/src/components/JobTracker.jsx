import React, { useEffect, useState, useRef } from 'react';
import { getStatus } from '../api.js';
import STLViewer from './STLViewer.jsx';

export default function JobTracker({ jobId, onComplete }) {
  const [status, setStatus] = useState(null);
  const [detail, setDetail] = useState('');
  const [resultPath, setResultPath] = useState('');
  const [error, setError] = useState('');
  const timerRef = useRef();

  useEffect(() => {
    let active = true;

    async function poll() {
      try {
        const data = await getStatus(jobId);
        if (!active) return;
        setStatus(data.state || data.status);
        setDetail(data.detail || '');
        setResultPath(data.result || '');
        if (data.state === 'SUCCESS' || data.state === 'FAILURE') {
          onComplete?.(data.state);
          return; // stop polling
        }
        timerRef.current = setTimeout(poll, 2000);
      } catch (e) {
        if (!active) return;
        setError(e.response?.data?.error || e.message);
        timerRef.current = setTimeout(poll, 5000);
      }
    }
    poll();
    return () => {
      active = false;
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [jobId, onComplete]);

  return (
    <div className="panel">
      <h3>Job Status</h3>
      <div><strong>Job ID:</strong> {jobId}</div>
      <div><strong>Status:</strong> <span className={`status-${status}`}>{status || '...'}</span></div>
      {detail && <div><strong>Detail:</strong> {detail}</div>}
      {error && <div style={{ color: '#ff6b6b' }}>{error}</div>}
      {status === 'SUCCESS' && (
        <>
          <p style={{ marginTop: 10 }}>Download STL:</p>
          <a
            className="btn btn-secondary"
            href={`http://localhost:3000/download/${jobId}`}
            download={`${jobId}.stl`}
          >
            Download
          </a>
          <div style={{ marginTop: 20 }}>
            <STLViewer stlUrl={`http://localhost:3000/download/${jobId}`} />
          </div>
        </>
      )}
    </div>
  );
}