import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export const TerrainSoftwareCanvas: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let animId: number;
    const width = container.clientWidth || 600;
    const height = container.clientHeight || 450;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 3, 5);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const ambient = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambient);
    const dir = new THREE.DirectionalLight(0x00A3FF, 2.5);
    dir.position.set(5, 8, 4);
    scene.add(dir);

    let terrainModel: THREE.Object3D | null = null;
    const loader = new GLTFLoader();
    loader.load(
      '/software/NewTerreain_006.glb',
      (gltf) => {
        terrainModel = gltf.scene;
        terrainModel.scale.set(0.008, 0.008, 0.008);
        terrainModel.position.set(0, -0.4, 0);

        terrainModel.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh;
            mesh.material = new THREE.MeshStandardMaterial({
              color: 0x24363F,
              wireframe: true,
              roughness: 0.4,
              metalness: 0.8,
            });
          }
        });

        scene.add(terrainModel);
      },
      undefined,
      (err) => console.error('Error loading NewTerreain_006.glb:', err)
    );

    let angle = 0;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      angle += 0.004;
      if (terrainModel) {
        terrainModel.rotation.y = angle;
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
      className="relative w-full h-[400px] rounded-lg overflow-hidden border border-ink/24 bg-[#0F1922] shadow-inner"
    />
  );
};
