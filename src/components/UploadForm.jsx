import React, { useState, useRef } from 'react';
import { submitImage } from '../api.js';

// Premium SVG Icons
const UploadIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'block', color: 'var(--primary)' }}>
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="17 8 12 3 7 8" />
    <line x1="12" y1="3" x2="12" y2="15" />
  </svg>
);

const FolderIcon = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="url(#folderGradient)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ margin: '0 auto' }}>
    <defs>
      <linearGradient id="folderGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="var(--primary)" />
        <stop offset="100%" stopColor="var(--secondary)" />
      </linearGradient>
    </defs>
    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
  </svg>
);

const TrashIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"></polyline>
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
  </svg>
);

const CheckIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
    <polyline points="20 6 9 17 4 12"></polyline>
  </svg>
);

const RocketIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"></path>
    <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"></path>
    <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"></path>
    <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"></path>
  </svg>
);

const InfoIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
    <circle cx="12" cy="12" r="10"></circle>
    <line x1="12" y1="16" x2="12" y2="12"></line>
    <line x1="12" y1="8" x2="12.01" y2="8"></line>
  </svg>
);

export default function UploadForm({ onJobCreated }) {
  const [file, setFile] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const [preview, setPreview] = useState(null);
  const fileInputRef = useRef(null);

  function handleFileSelect(selectedFile) {
    if (!selectedFile) return;

    // Validate file type
    if (!selectedFile.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    setFile(selectedFile);
    setError('');

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target.result);
    reader.readAsDataURL(selectedFile);
  }

  function handleDrop(e) {
    e.preventDefault();
    setDragOver(false);
    const droppedFile = e.dataTransfer.files[0];
    handleFileSelect(droppedFile);
  }

  function handleDragOver(e) {
    e.preventDefault();
    setDragOver(true);
  }

  function handleDragLeave() {
    setDragOver(false);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!file) return;

    setBusy(true);
    setError('');

    try {
      const resp = await submitImage(file);
      onJobCreated(resp.job_id, resp.db_job_id || null);
      // Reset form
      setFile(null);
      setPreview(null);
    } catch (e) {
      setError(e.response?.data?.error || e.message);
    } finally {
      setBusy(false);
    }
  }

  function formatFileSize(bytes) {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  }

  return (
    <div className="glass-card">
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)', marginBottom: 'var(--space-md)' }}>
        <div style={{ 
          background: 'rgba(0, 212, 255, 0.1)', 
          padding: 'var(--space-sm)', 
          borderRadius: 'var(--radius-md)',
          boxShadow: 'inset 0 0 10px rgba(0, 212, 255, 0.1)'
        }}>
          <UploadIcon />
        </div>
        <h3 style={{ margin: 0, paddingBottom: '2px' }}>
          Upload Dental Image
        </h3>
      </div>
      <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-xl)', fontSize: '0.95rem' }}>
        Upload a high-quality 2D dental image to generate a 3D STL model using our AI depth estimation.
      </p>

      <form onSubmit={handleSubmit}>
        {/* Drag and Drop Zone */}
        <div
          className={`upload-zone ${dragOver ? 'drag-over' : ''} ${file ? 'has-file' : ''}`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current?.click()}
          style={{
            padding: file ? 'var(--space-lg)' : 'var(--space-3xl)',
            minHeight: '200px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            background: dragOver ? 'rgba(0, 212, 255, 0.08)' : 'rgba(255, 255, 255, 0.02)',
            borderStyle: file ? 'solid' : 'dashed',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
          }}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={e => handleFileSelect(e.target.files?.[0])}
            style={{ display: 'none' }}
          />

          {!file ? (
            <div style={{ pointerEvents: 'none' }}>
              <div style={{ marginBottom: 'var(--space-lg)' }}>
                <FolderIcon />
              </div>
              <div style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: 'var(--space-xs)', color: 'var(--text-primary)' }}>
                Drop your image here or click to browse
              </div>
              <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                Supports JPG, PNG, WEBP • Max 10MB
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-lg)', width: '100%' }}>
              {preview && (
                <div style={{
                  position: 'relative',
                  width: '100%',
                  maxWidth: '320px',
                  borderRadius: 'var(--radius-md)',
                  overflow: 'hidden',
                  border: '1px solid var(--glass-border)',
                  boxShadow: 'var(--shadow-md)',
                  background: '#000'
                }}>
                  <img
                    src={preview}
                    alt="Preview"
                    style={{ width: '100%', height: 'auto', display: 'block', opacity: 0.9 }}
                  />
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    boxShadow: 'inset 0 0 20px rgba(0,0,0,0.5)',
                    pointerEvents: 'none'
                  }} />
                </div>
              )}

              <div style={{ width: '100%', maxWidth: '320px', background: 'rgba(0,0,0,0.2)', padding: 'var(--space-md)', borderRadius: 'var(--radius-sm)' }}>
                <div style={{
                  fontSize: '0.95rem',
                  fontWeight: 600,
                  marginBottom: 'var(--space-xs)',
                  color: 'var(--success)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-sm)',
                  justifyContent: 'center'
                }}>
                  <CheckIcon /> <span style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>{file.name}</span>
                </div>
                <div style={{
                  fontSize: '0.8rem',
                  color: 'var(--text-muted)',
                  display: 'flex',
                  gap: 'var(--space-md)',
                  justifyContent: 'center'
                }}>
                  <span style={{ fontWeight: 500 }}>{formatFileSize(file.size)}</span>
                  <span>•</span>
                  <span style={{ textTransform: 'uppercase' }}>{file.type.split('/')[1] || 'IMAGE'}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setFile(null);
                  setPreview(null);
                }}
                className="btn-secondary"
                style={{ padding: 'var(--space-sm) var(--space-xl)', fontSize: '0.875rem' }}
              >
                <TrashIcon /> Replace Image
              </button>
            </div>
          )}
        </div>

        {error && (
          <div className="error-message">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            <span style={{ fontSize: '0.9rem' }}>{error}</span>
          </div>
        )}

        <div style={{ marginTop: 'var(--space-xl)' }}>
          <button
            className="btn"
            type="submit"
            disabled={!file || busy}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 'var(--space-sm)',
              padding: 'var(--space-md)'
            }}
          >
            {busy ? (
              <>
                <div className="spinner" style={{ width: '18px', height: '18px', borderWidth: '2px' }}></div>
                <span>Processing Image...</span>
              </>
            ) : (
              <>
                <RocketIcon />
                <span>Generate 3D Model</span>
              </>
            )}
          </button>
        </div>

        {/* Info Box */}
        <div style={{
          marginTop: 'var(--space-xl)',
          padding: 'var(--space-lg)',
          background: 'rgba(0, 212, 255, 0.03)',
          border: '1px solid rgba(0, 212, 255, 0.1)',
          borderRadius: 'var(--radius-md)',
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--space-sm)'
        }}>
          <div style={{ fontWeight: 600, color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: 'var(--space-sm)', fontSize: '0.95rem' }}>
            <InfoIcon /> Processing Info
          </div>
          <ul style={{ 
            margin: 0, 
            paddingLeft: 'var(--space-xl)', 
            color: 'var(--text-secondary)',
            fontSize: '0.85rem',
            display: 'grid',
            gap: 'var(--space-xs)'
          }}>
            <li>AI depth estimation takes roughly 10-30 seconds.</li>
            <li>Higher resolution, well-lit images produce the most accurate results.</li>
            <li>Once complete, you can download the 3D model as an STL file.</li>
          </ul>
        </div>
      </form>
    </div>
  );
}