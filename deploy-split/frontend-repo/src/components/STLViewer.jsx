import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader';
import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls';

export default function STLViewer({ stlUrl }) {
  const mountRef = useRef(null);
  const canvasContainerRef = useRef(null); // Dedicated ref for Three.js canvas
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [wireframe, setWireframe] = useState(false);
  const meshRef = useRef(null);
  const rendererRef = useRef(null);
  const resetViewRef = useRef(null);

  useEffect(() => {
    if (!stlUrl) return;

    const container = canvasContainerRef.current;
    if (!container) return;

    // Setup Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0e27);

    // Setup Camera
    const camera = new THREE.PerspectiveCamera(
      40,
      container.clientWidth / container.clientHeight,
      0.1,
      2000
    );
    camera.position.set(0, 0, 220);

    // Setup Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    rendererRef.current = renderer;
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(container.clientWidth, container.clientHeight);

    // Force canvas to stay in container
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    renderer.domElement.style.display = 'block';
    renderer.domElement.style.outline = 'none';

    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // Lighting
    const hemi = new THREE.HemisphereLight(0xffffff, 0x444444, 1.1);
    hemi.position.set(0, 200, 0);
    scene.add(hemi);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.2);
    dirLight.position.set(150, 200, 100);
    scene.add(dirLight);

    const dirLight2 = new THREE.DirectionalLight(0x00d4ff, 0.5);
    dirLight2.position.set(-150, -100, -100);
    scene.add(dirLight2);

    // Grid
    const gridHelper = new THREE.GridHelper(200, 20, 0x00d4ff, 0x1a1f3a);
    gridHelper.position.y = -50;
    scene.add(gridHelper);

    // Controls
    let controls = new TrackballControls(camera, renderer.domElement);
    controls.rotateSpeed = 5.0;
    controls.zoomSpeed = 1.2;
    controls.panSpeed = 0.8;
    controls.noZoom = false;
    controls.noPan = false;
    controls.staticMoving = false; // Enable damping
    controls.dynamicDampingFactor = 0.1;
    controls.minDistance = 20;
    controls.maxDistance = 1500;

    // Reset View Function
    const resetView = () => {
      controls.reset();
      camera.position.set(0, 0, 220);
      controls.target.set(0, 0, 0);
      controls.update();
    };
    resetViewRef.current = resetView;

    // Load STL
    const loader = new STLLoader();
    loader.load(
      stlUrl,
      (geometry) => {
        setLoading(false);
        geometry.computeVertexNormals();

        const material = new THREE.MeshPhongMaterial({
          color: 0x89CFF0, // Lighter shade of blue (Baby Blue)
          specular: 0x111111,
          shininess: 80,
          wireframe: false
        });

        const mesh = new THREE.Mesh(geometry, material);
        meshRef.current = mesh;

        geometry.computeBoundingBox();
        const bb = geometry.boundingBox;
        const size = new THREE.Vector3();
        bb.getSize(size);
        const center = new THREE.Vector3();
        bb.getCenter(center);
        mesh.position.sub(center);

        scene.add(mesh);
      },
      undefined,
      (err) => {
        setLoading(false);
        setError('Failed to load STL');
        console.error(err);
      }
    );

    // Animation Loop
    let animationId;
    function animate() {
      animationId = requestAnimationFrame(animate);
      if (controls) controls.update();
      renderer.render(scene, camera);
    }
    animate();

    // Resize Handler
    function handleResize() {
      if (!container) return;
      const width = container.clientWidth;
      const height = container.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
      // TrackballControls handles resize via its own update if needed, but usually just camera aspect is enough
      controls.handleResize();
    }
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationId);
      if (controls) controls.dispose();
      if (container) container.innerHTML = '';
      renderer.dispose();
    };
  }, [stlUrl]);

  // Wireframe Toggle
  useEffect(() => {
    if (meshRef.current) {
      meshRef.current.material.wireframe = wireframe;
    }
  }, [wireframe]);

  return (
    <div>
      <div
        className="stl-viewer-container"
        ref={mountRef}
        style={{ position: 'relative', height: '500px', width: '100%' }}
      >
        {/* Dedicated container for Three.js canvas - NO React children allowed here */}
        <div
          ref={canvasContainerRef}
          style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }}
        />

        {/* React-managed UI overlays */}
        {loading && (
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 'var(--space-md)',
            pointerEvents: 'none',
            zIndex: 10
          }}>
            <div className="spinner"></div>
            <div style={{ color: 'var(--text-secondary)' }}>Loading 3D model...</div>
          </div>
        )}

        {!loading && !error && (
          <div className="viewer-controls" style={{ zIndex: 20 }}>
            <button
              onClick={() => setWireframe(!wireframe)}
              title={wireframe ? 'Solid View' : 'Wireframe View'}
            >
              {wireframe ? '🔲' : '⬛'}
            </button>
            <button
              onClick={() => resetViewRef.current?.()}
              title="Reset View"
              style={{ marginLeft: 'var(--space-sm)' }}
            >
              🔄
            </button>
          </div>
        )}

        {!loading && !error && (
          <div style={{
            position: 'absolute',
            bottom: 'var(--space-md)',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'var(--glass-bg)',
            backdropFilter: 'blur(10px)',
            border: '1px solid var(--glass-border)',
            borderRadius: 'var(--radius-md)',
            padding: 'var(--space-sm) var(--space-md)',
            fontSize: '0.75rem',
            color: 'var(--text-muted)',
            pointerEvents: 'none',
            zIndex: 10
          }}>
            🖱️ Drag to rotate • 🔄 Scroll to zoom
          </div>
        )}
      </div>

      {error && (
        <div className="error-message" style={{ marginTop: 'var(--space-md)' }}>
          <span>⚠️</span>
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}