import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

interface PointCloudCanvasProps {
  activePhase: number; // 0: Raw scan, 1: Point cloud, 2: Uplink
}

export const PointCloudCanvas: React.FC<PointCloudCanvasProps> = ({ activePhase }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const phaseRef = useRef(activePhase);
  phaseRef.current = activePhase;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let animId: number;
    const width = container.clientWidth || 600;
    const height = container.clientHeight || 450;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 2.5, 4.5);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.appendChild(renderer.domElement);

    let pointsMesh: THREE.Points | null = null;
    let originalPositions: Float32Array | null = null;

    const loader = new GLTFLoader();
    loader.load(
      '/capabilities/terrain-morph.glb',
      (gltf) => {
        let extractedGeometry: THREE.BufferGeometry | null = null;
        gltf.scene.traverse((child) => {
          if ((child as THREE.Mesh).isMesh && !extractedGeometry) {
            extractedGeometry = (child as THREE.Mesh).geometry.clone();
          }
        });

        if (!extractedGeometry) return;

        const posAttr = (extractedGeometry as THREE.BufferGeometry).attributes.position;
        const count = posAttr.count;
        originalPositions = new Float32Array(posAttr.array);

        // Generate colors based on Y height (LiDAR elevation gradient)
        const colors = new Float32Array(count * 3);
        let minY = Infinity, maxY = -Infinity;
        for (let i = 0; i < count; i++) {
          const y = posAttr.getY(i);
          if (y < minY) minY = y;
          if (y > maxY) maxY = y;
        }

        const cLow = new THREE.Color(0x24363F);
        const cMid = new THREE.Color(0x00A3FF);
        const cHigh = new THREE.Color(0x00FF88);

        for (let i = 0; i < count; i++) {
          const y = posAttr.getY(i);
          const t = (y - minY) / (maxY - minY || 1);
          const c = new THREE.Color();
          if (t < 0.5) {
            c.lerpColors(cLow, cMid, t * 2);
          } else {
            c.lerpColors(cMid, cHigh, (t - 0.5) * 2);
          }
          colors[i * 3] = c.r;
          colors[i * 3 + 1] = c.g;
          colors[i * 3 + 2] = c.b;
        }

        (extractedGeometry as THREE.BufferGeometry).setAttribute(
          'color',
          new THREE.BufferAttribute(colors, 3)
        );

        // Points Material
        const pointsMat = new THREE.PointsMaterial({
          size: 0.025,
          vertexColors: true,
          transparent: true,
          opacity: 0.85,
          blending: THREE.NormalBlending,
        });

        pointsMesh = new THREE.Points(extractedGeometry, pointsMat);
        pointsMesh.scale.set(0.015, 0.015, 0.015);
        pointsMesh.rotation.x = -Math.PI * 0.35;
        scene.add(pointsMesh);
      },
      undefined,
      (err) => console.error('Error loading terrain-morph.glb:', err)
    );

    let angle = 0;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      angle += 0.005;

      if (pointsMesh) {
        pointsMesh.rotation.z = angle;
        
        // Morph particles dynamically based on active phase
        const phase = phaseRef.current;
        const geom = pointsMesh.geometry as THREE.BufferGeometry;
        const pos = geom.attributes.position;
        if (originalPositions) {
          const arr = pos.array as Float32Array;
          const time = Date.now() * 0.003;
          for (let i = 0; i < pos.count; i += 3) {
            const ox = originalPositions[i * 3];
            const oy = originalPositions[i * 3 + 1];
            const oz = originalPositions[i * 3 + 2];

            if (phase === 0) {
              // Raw terrain scan
              arr[i * 3] = ox;
              arr[i * 3 + 1] = oy;
              arr[i * 3 + 2] = oz;
            } else if (phase === 1) {
              // Subtle pulse ripple
              const wave = Math.sin(time + ox * 0.01) * 2.5;
              arr[i * 3] = ox;
              arr[i * 3 + 1] = oy + wave;
              arr[i * 3 + 2] = oz;
            } else {
              // Uplink scatter stream
              const scatter = Math.sin(time * 2 + i) * 8.0;
              arr[i * 3] = ox + Math.cos(time + i) * 2.0;
              arr[i * 3 + 1] = oy + scatter;
              arr[i * 3 + 2] = oz;
            }
          }
          pos.needsUpdate = true;
        }
      }

      renderer.render(scene, camera);
    };

    animId = requestAnimationFrame(animate);

    const onResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', onResize);
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[460px] rounded-lg overflow-hidden border border-ink/24 bg-[#F8F9FA]/80 backdrop-blur-sm"
    />
  );
};
