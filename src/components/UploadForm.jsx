import React, { useState, useRef } from 'react';
import { submitImage } from '../api.js';

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
      <h3 style={{ marginBottom: 'var(--space-md)' }}>
        📤 Upload Dental Image
      </h3>
      <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-xl)' }}>
        Upload a 2D dental image to generate a 3D STL model using AI-powered depth estimation
      </p>

      <form onSubmit={handleSubmit}>
        {/* Drag and Drop Zone */}
        <div
          className={`upload-zone ${dragOver ? 'drag-over' : ''} ${file ? 'has-file' : ''}`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={e => handleFileSelect(e.target.files?.[0])}
            style={{ display: 'none' }}
          />

          {!file ? (
            <div>
              <div style={{ fontSize: '3rem', marginBottom: 'var(--space-md)' }}>
                📁
              </div>
              <div style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: 'var(--space-sm)' }}>
                Drop your image here or click to browse
              </div>
              <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                Supports JPG, PNG, WEBP • Max 10MB
              </div>
            </div>
          ) : (
            <div style={{ display: 'grid', gap: 'var(--space-lg)' }}>
              {preview && (
                <div style={{
                  maxWidth: '300px',
                  margin: '0 auto',
                  borderRadius: 'var(--radius-md)',
                  overflow: 'hidden',
                  border: '2px solid var(--primary)',
                  boxShadow: 'var(--shadow-glow)'
                }}>
                  <img
                    src={preview}
                    alt="Preview"
                    style={{ width: '100%', display: 'block' }}
                  />
                </div>
              )}

              <div>
                <div style={{
                  fontSize: '1rem',
                  fontWeight: 600,
                  marginBottom: 'var(--space-sm)',
                  color: 'var(--success)'
                }}>
                  ✓ {file.name}
                </div>
                <div style={{
                  fontSize: '0.875rem',
                  color: 'var(--text-muted)',
                  display: 'flex',
                  gap: 'var(--space-md)',
                  justifyContent: 'center',
                  flexWrap: 'wrap'
                }}>
                  <span>📏 {formatFileSize(file.size)}</span>
                  <span>📷 {file.type}</span>
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
                style={{ padding: 'var(--space-sm) var(--space-lg)' }}
              >
                🗑️ Remove
              </button>
            </div>
          )}
        </div>

        {error && (
          <div className="error-message" style={{ marginTop: 'var(--space-lg)' }}>
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        <div style={{ marginTop: 'var(--space-xl)', display: 'flex', gap: 'var(--space-md)' }}>
          <button
            className="btn"
            type="submit"
            disabled={!file || busy}
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 'var(--space-sm)'
            }}
          >
            {busy ? (
              <>
                <div className="spinner" style={{ width: '16px', height: '16px', borderWidth: '2px' }}></div>
                <span>Processing...</span>
              </>
            ) : (
              <>
                <span>🚀</span>
                <span>Generate 3D Model</span>
              </>
            )}
          </button>
        </div>

        {/* Info Box */}
        <div style={{
          marginTop: 'var(--space-xl)',
          padding: 'var(--space-lg)',
          background: 'rgba(0, 212, 255, 0.05)',
          border: '1px solid rgba(0, 212, 255, 0.2)',
          borderRadius: 'var(--radius-md)',
          fontSize: '0.875rem'
        }}>
          <div style={{ fontWeight: 600, marginBottom: 'var(--space-sm)', color: 'var(--primary)' }}>
            💡 Processing Info
          </div>
          <ul style={{ margin: 0, paddingLeft: 'var(--space-lg)', color: 'var(--text-secondary)' }}>
            <li>AI depth estimation takes 10-30 seconds</li>
            <li>Higher resolution images produce better results</li>
            <li>Clear, well-lit images work best</li>
            <li>You'll receive a downloadable STL file</li>
          </ul>
        </div>
      </form>
    </div>
  );
}