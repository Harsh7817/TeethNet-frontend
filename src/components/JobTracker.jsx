import React, { useEffect, useState, useRef } from 'react';
import { getStatus, API_BASE } from '../api.js';
import STLViewer from './STLViewer.jsx';

export default function JobTracker({ jobId, onComplete }) {
  const [status, setStatus] = useState(null);
  const [detail, setDetail] = useState('');
  const [resultPath, setResultPath] = useState('');
  const [error, setError] = useState('');
  const [progress, setProgress] = useState(0);
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

        // Update progress based on status
        if (data.state === 'QUEUED') setProgress(25);
        else if (data.state === 'RUNNING') setProgress(60);
        else if (data.state === 'SUCCESS') setProgress(100);
        else if (data.state === 'FAILURE') setProgress(0);

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

  const stages = [
    { key: 'QUEUED', label: 'Queued', icon: '⏳' },
    { key: 'RUNNING', label: 'Processing', icon: '⚙️' },
    { key: 'SUCCESS', label: 'Complete', icon: '✅' },
  ];

  function getStageStatus(stageKey) {
    if (!status) return 'pending';
    const statusOrder = { 'QUEUED': 0, 'RUNNING': 1, 'SUCCESS': 2, 'FAILURE': 2 };
    const currentIndex = statusOrder[status] || 0;
    const stageIndex = statusOrder[stageKey] || 0;

    if (status === 'FAILURE') return stageIndex <= currentIndex ? 'error' : 'pending';
    if (stageIndex < currentIndex) return 'complete';
    if (stageIndex === currentIndex) return 'active';
    return 'pending';
  }

  return (
    <div className="glass-card">
      <h3 style={{ marginBottom: 'var(--space-md)' }}>
        🔄 Job Progress
      </h3>

      {/* Job ID */}
      <div style={{
        marginBottom: 'var(--space-xl)',
        padding: 'var(--space-md)',
        background: 'rgba(255, 255, 255, 0.02)',
        borderRadius: 'var(--radius-md)',
        fontSize: '0.875rem',
        fontFamily: 'JetBrains Mono, monospace'
      }}>
        <span style={{ color: 'var(--text-muted)' }}>Job ID: </span>
        <span style={{ color: 'var(--primary)' }}>{jobId}</span>
      </div>

      {/* Progress Bar */}
      <div style={{ marginBottom: 'var(--space-xl)' }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: 'var(--space-sm)',
          fontSize: '0.875rem'
        }}>
          <span style={{ fontWeight: 600 }}>Progress</span>
          <span style={{ color: 'var(--text-muted)' }}>{progress}%</span>
        </div>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progress}%` }}></div>
        </div>
      </div>

      {/* Timeline */}
      <div style={{ marginBottom: 'var(--space-xl)' }}>
        {stages.map((stage, index) => {
          const stageStatus = getStageStatus(stage.key);
          return (
            <div
              key={stage.key}
              style={{
                display: 'flex',
                gap: 'var(--space-md)',
                marginBottom: index < stages.length - 1 ? 'var(--space-lg)' : 0
              }}
            >
              {/* Icon */}
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.25rem',
                background: stageStatus === 'complete' ? 'var(--success)' :
                  stageStatus === 'active' ? 'linear-gradient(135deg, var(--primary), var(--secondary))' :
                    stageStatus === 'error' ? 'var(--error)' :
                      'rgba(255, 255, 255, 0.05)',
                border: `2px solid ${stageStatus === 'complete' ? 'var(--success)' :
                  stageStatus === 'active' ? 'var(--primary)' :
                    stageStatus === 'error' ? 'var(--error)' :
                      'var(--glass-border)'
                  }`,
                position: 'relative',
                flexShrink: 0,
                animation: stageStatus === 'active' ? 'pulse 2s ease-in-out infinite' : 'none'
              }}>
                {stage.icon}

                {/* Connector Line */}
                {index < stages.length - 1 && (
                  <div style={{
                    position: 'absolute',
                    top: '100%',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '2px',
                    height: 'var(--space-lg)',
                    background: stageStatus === 'complete' ? 'var(--success)' : 'var(--glass-border)'
                  }}></div>
                )}
              </div>

              {/* Content */}
              <div style={{ flex: 1, paddingTop: 'var(--space-sm)' }}>
                <div style={{
                  fontWeight: 600,
                  marginBottom: 'var(--space-xs)',
                  color: stageStatus === 'active' ? 'var(--primary)' : 'var(--text-primary)'
                }}>
                  {stage.label}
                </div>
                {stageStatus === 'active' && detail && (
                  <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                    {detail}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Status Badge */}
      <div style={{ marginBottom: 'var(--space-xl)' }}>
        <span className={`status-badge status-${status}`}>
          {status === 'RUNNING' && '⚙️ '}
          {status === 'SUCCESS' && '✅ '}
          {status === 'FAILURE' && '❌ '}
          {status === 'QUEUED' && '⏳ '}
          {status || 'Loading...'}
        </span>
      </div>

      {error && (
        <div className="error-message" style={{ marginBottom: 'var(--space-xl)' }}>
          <span>⚠️</span>
          <span>{error}</span>
        </div>
      )}

      {/* Success State - Download & Viewer */}
      {status === 'SUCCESS' && (
        <div style={{ animation: 'fadeInUp 0.5s ease' }}>
          <div style={{
            marginBottom: 'var(--space-lg)',
            padding: 'var(--space-lg)',
            background: 'rgba(16, 185, 129, 0.1)',
            border: '1px solid var(--success)',
            borderRadius: 'var(--radius-md)'
          }}>
            <div style={{
              fontSize: '1.125rem',
              fontWeight: 600,
              marginBottom: 'var(--space-sm)',
              color: 'var(--success)'
            }}>
              🎉 3D Model Ready!
            </div>
            <p style={{ fontSize: '0.875rem', margin: 0, color: 'var(--text-secondary)' }}>
              Your 3D STL model has been generated successfully. Download it below or view it in the 3D viewer.
            </p>
          </div>

          <a
            className="btn"
            href={`${API_BASE}/download/${jobId}`}
            download={`${jobId}.stl`}
            style={{
              width: '100%',
              marginBottom: 'var(--space-xl)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 'var(--space-sm)',
              textDecoration: 'none'
            }}
          >
            <span>⬇️</span>
            <span>Download STL File</span>
          </a>

          <div>
            <h4 style={{ marginBottom: 'var(--space-md)', fontSize: '1.125rem' }}>
              3D Preview
            </h4>
            <STLViewer stlUrl={`${API_BASE}/download/${jobId}`} />
          </div>
        </div>
      )}

      {/* Failure State */}
      {status === 'FAILURE' && (
        <div className="error-message">
          <span>❌</span>
          <div>
            <div style={{ fontWeight: 600 }}>Processing Failed</div>
            <div style={{ fontSize: '0.875rem', marginTop: 'var(--space-xs)' }}>
              {detail || 'An error occurred during processing. Please try again with a different image.'}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}