import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js';

export default function STLViewer({ stlUrl }) {
  const mountRef = useRef();
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!stlUrl) return;
    const container = mountRef.current;
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0d1216);

    const camera = new THREE.PerspectiveCamera(40, container.clientWidth / container.clientHeight, 0.1, 2000);
    camera.position.set(0, 0, 220);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    const hemi = new THREE.HemisphereLight(0xffffff, 0x444444, 1.1);
    hemi.position.set(0, 200, 0);
    scene.add(hemi);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.2);
    dirLight.position.set(150, 200, 100);
    scene.add(dirLight);

    const loader = new STLLoader();
    loader.load(
      stlUrl,
      (geometry) => {
        geometry.computeVertexNormals();
        const material = new THREE.MeshPhongMaterial({
          color: 0x4db6ff,
          specular: 0x111111,
          shininess: 80
        });
        const mesh = new THREE.Mesh(geometry, material);

        geometry.computeBoundingBox();
        const bb = geometry.boundingBox;
        const size = new THREE.Vector3();
        bb.getSize(size);
        const center = new THREE.Vector3();
        bb.getCenter(center);
        mesh.position.sub(center);

        scene.add(mesh);

        // Controls (simple orbit substitute)
        let isDragging = false;
        let prev = { x: 0, y: 0 };
        container.onmousedown = e => {
          isDragging = true;
          prev = { x: e.clientX, y: e.clientY };
        };
        window.onmouseup = () => { isDragging = false; };
        window.onmousemove = e => {
          if (!isDragging) return;
          const dx = e.clientX - prev.x;
            const dy = e.clientY - prev.y;
          prev = { x: e.clientX, y: e.clientY };
          mesh.rotation.y += dx * 0.01;
          mesh.rotation.x += dy * 0.01;
        };

        container.onwheel = e => {
          e.preventDefault();
          const delta = e.deltaY * 0.5;
          camera.position.z += delta;
          camera.position.z = Math.max(20, Math.min(camera.position.z, 2000));
        };
      },
      undefined,
      (err) => {
        setError('Failed to load STL');
        console.error(err);
      }
    );

    function animate() {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    }
    animate();

    function handleResize() {
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    }
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      container.innerHTML = '';
      renderer.dispose();
    };
  }, [stlUrl]);

  return (
    <div>
      <div className="stl-viewer-container" ref={mountRef}>
        {!stlUrl && <div style={{ padding: 10 }}>No STL URL</div>}
      </div>
      {error && <div style={{ color: '#ff6b6b', marginTop: 8 }}>{error}</div>}
    </div>
  );
}