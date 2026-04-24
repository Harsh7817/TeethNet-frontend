import React from 'react';

export default function Footer() {
    return (
        <footer style={{
            marginTop: 'var(--space-3xl)',
            padding: 'var(--space-xl)',
            borderTop: '1px solid var(--glass-border)',
            textAlign: 'center'
        }}>
            <div className="container">
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                    gap: 'var(--space-xl)',
                    marginBottom: 'var(--space-xl)'
                }}>
                    {/* About */}
                    <div style={{ textAlign: 'left' }}>
                        <h4 style={{
                            fontSize: '1rem',
                            marginBottom: 'var(--space-md)',
                            color: 'var(--text-primary)'
                        }}>
                            About TeethNet
                        </h4>
                        <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                            Advanced AI-powered 3D reconstruction platform for dental imaging.
                            Transform 2D images into precise 3D models.
                        </p>
                    </div>

                    {/* Features */}
                    <div style={{ textAlign: 'left' }}>
                        <h4 style={{
                            fontSize: '1rem',
                            marginBottom: 'var(--space-md)',
                            color: 'var(--text-primary)'
                        }}>
                            Features
                        </h4>
                        <ul style={{
                            listStyle: 'none',
                            fontSize: '0.875rem',
                            color: 'var(--text-muted)'
                        }}>
                            <li style={{ marginBottom: 'var(--space-sm)' }}>✓ AI Depth Estimation</li>
                            <li style={{ marginBottom: 'var(--space-sm)' }}>✓ Real-time Processing</li>
                            <li style={{ marginBottom: 'var(--space-sm)' }}>✓ 3D Visualization</li>
                            <li style={{ marginBottom: 'var(--space-sm)' }}>✓ STL Export</li>
                        </ul>
                    </div>

                    {/* Tech Stack */}
                    <div style={{ textAlign: 'left' }}>
                        <h4 style={{
                            fontSize: '1rem',
                            marginBottom: 'var(--space-md)',
                            color: 'var(--text-primary)'
                        }}>
                            Powered By
                        </h4>
                        <div style={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            gap: 'var(--space-sm)',
                            fontSize: '0.75rem'
                        }}>
                            <span className="status-badge" style={{ background: 'rgba(97, 218, 251, 0.1)' }}>React</span>
                            <span className="status-badge" style={{ background: 'rgba(16, 185, 129, 0.1)' }}>Node.js</span>
                            <span className="status-badge" style={{ background: 'rgba(245, 158, 11, 0.1)' }}>Python</span>
                            <span className="status-badge" style={{ background: 'rgba(124, 58, 237, 0.1)' }}>PyTorch</span>
                        </div>
                    </div>
                </div>

                {/* Copyright */}
                <div style={{
                    paddingTop: 'var(--space-lg)',
                    borderTop: '1px solid var(--glass-border)',
                    fontSize: '0.875rem',
                    color: 'var(--text-muted)'
                }}>
                    <p style={{ margin: 0 }}>
                        © 2025 TeethNet. Built with ❤️ using Depth-Anything AI Model.
                    </p>
                    <p style={{ margin: 'var(--space-sm) 0 0', fontSize: '0.75rem' }}>
                        Version 1.0.0 | GPU-Accelerated Processing
                    </p>
                </div>
            </div>
        </footer>
    );
}
