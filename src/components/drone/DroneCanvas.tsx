import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

interface DroneCanvasProps {
  scrollProgress: number;
}

export const DroneCanvas: React.FC<DroneCanvasProps> = ({ scrollProgress }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef(scrollProgress);
  scrollRef.current = scrollProgress;

  const [isLoaded, setIsLoaded] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let animId: number;
    let width = container.clientWidth || window.innerWidth;
    let height = container.clientHeight || window.innerHeight;

    // 1. Scene & Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(35, width / height, 0.1, 1000);
    // Camera positioned at standard distance
    camera.position.set(0, 0.2, 5.2);

    // 2. WebGL Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.appendChild(renderer.domElement);

    // 3. Studio High-Tech Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 2.2);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 3.0);
    keyLight.position.set(5, 10, 7);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xb0d0ea, 2.0);
    fillLight.position.set(-6, -2, -4);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0x00e5ff, 1.8);
    rimLight.position.set(0, -5, 4);
    scene.add(rimLight);

    // Environment map for reflections
    const textureLoader = new THREE.TextureLoader();
    textureLoader.load('/drone/drone-env.jpg', (envTex) => {
      envTex.mapping = THREE.EquirectangularReflectionMapping;
      envTex.colorSpace = THREE.SRGBColorSpace;
      scene.environment = envTex;
    });

    // 4. Drone Model State
    const droneGroup = new THREE.Group();
    scene.add(droneGroup);

    let mixer: THREE.AnimationMixer | null = null;
    let action: THREE.AnimationAction | null = null;
    let gimbalYaw: THREE.Object3D | null = null;
    let gimbalPitch: THREE.Object3D | null = null;
    const spinningMotors: { node: THREE.Object3D; dir: number }[] = [];

    // Mouse tracking & drag orbit
    const mouse = { x: 0, y: 0, targetX: 0, targetY: 0, isDragging: false, dragStartX: 0, dragStartY: 0, rotX: 0, rotY: 0 };

    const onMouseMove = (e: MouseEvent) => {
      mouse.targetX = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.targetY = -(e.clientY / window.innerHeight) * 2 + 1;

      if (mouse.isDragging) {
        const dx = e.clientX - mouse.dragStartX;
        const dy = e.clientY - mouse.dragStartY;
        mouse.rotY += dx * 0.008;
        mouse.rotX += dy * 0.008;
        mouse.dragStartX = e.clientX;
        mouse.dragStartY = e.clientY;
      }
    };

    const onMouseDown = (e: MouseEvent) => {
      // Allow drag rotation on canvas if clicking anywhere not on interactive buttons
      if ((e.target as HTMLElement).tagName === 'BUTTON' || (e.target as HTMLElement).tagName === 'A') return;
      mouse.isDragging = true;
      mouse.dragStartX = e.clientX;
      mouse.dragStartY = e.clientY;
    };

    const onMouseUp = () => {
      mouse.isDragging = false;
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);

    // 5. Load GLTF Drone
    const loader = new GLTFLoader();
    loader.load(
      '/drone/drone.glb',
      (gltf) => {
        const root = gltf.scene;

        // Compute Bounding Box to accurately center and normalize scale
        const box = new THREE.Box3().setFromObject(root);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());

        // The drone is ~37 units in the GLB. We scale it so its max dimension is ~3.3 units
        const maxDim = Math.max(size.x, size.y, size.z);
        const scaleFactor = 3.3 / (maxDim || 1);

        // Center pivot
        root.position.x = -center.x * scaleFactor;
        root.position.y = -center.y * scaleFactor;
        root.position.z = -center.z * scaleFactor;
        root.scale.setScalar(scaleFactor);

        // Enhance metallic PBR materials
        root.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh;
            mesh.castShadow = true;
            mesh.receiveShadow = true;
            if (mesh.material) {
              const mat = mesh.material as THREE.MeshStandardMaterial;
              mat.roughness = Math.max(mat.roughness, 0.22);
              mat.metalness = Math.min(Math.max(mat.metalness, 0.7), 0.98);
              mat.envMapIntensity = 2.2;
              mat.needsUpdate = true;
            }
          }

          if (child.name === 'Camera_leftRight') gimbalYaw = child;
          if (child.name === 'Camera__UPDOWN') gimbalPitch = child;

          if (child.name.includes('FL_Motor') || child.name.includes('RR_Motor')) {
            spinningMotors.push({ node: child, dir: -1 });
          } else if (child.name.includes('FR_Motor') || child.name.includes('RL_Motor')) {
            spinningMotors.push({ node: child, dir: 1 });
          }
        });

        // Set up the AnimationMixer for folding/unfolding/landing
        if (gltf.animations && gltf.animations.length > 0) {
          mixer = new THREE.AnimationMixer(root);
          const clip = gltf.animations[0];
          action = mixer.clipAction(clip);
          action.play();
          action.paused = true;
        }

        droneGroup.add(root);
        setIsLoaded(true);
      },
      undefined,
      (err) => {
        console.error('Failed to load drone.glb:', err);
        setLoadError(String(err));
      }
    );

    // 6. LiDAR Laser Cone Mesh
    const beamGeo = new THREE.ConeGeometry(1.2, 3.8, 32, 1, true);
    beamGeo.translate(0, -1.9, 0);
    const beamMat = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      side: THREE.DoubleSide,
      uniforms: {
        time: { value: 0 },
        opacity: { value: 0 },
        color: { value: new THREE.Color(0x00E5FF) },
      },
      vertexShader: `
        varying vec2 vUv;
        varying vec3 vNormal;
        void main() {
          vUv = uv;
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float time;
        uniform float opacity;
        uniform vec3 color;
        varying vec2 vUv;
        varying vec3 vNormal;
        void main() {
          float scanLines = sin(vUv.y * 50.0 - time * 12.0) * 0.5 + 0.5;
          float edge = 1.0 - abs(dot(vNormal, vec3(0.0, 0.0, 1.0)));
          float a = (1.0 - vUv.y) * 0.6 * (0.5 + 0.5 * scanLines + 0.8 * edge) * opacity;
          gl_FragColor = vec4(color, a);
        }
      `,
    });
    const beamMesh = new THREE.Mesh(beamGeo, beamMat);
    beamMesh.position.set(0, -0.3, 0.4);
    beamMesh.visible = false;
    scene.add(beamMesh);

    // 7. Animation Loop
    let lastTime = performance.now();
    let currentFrame = 184;
    const TOTAL_FRAMES = 1038;
    const FPS = 30;
    const clipDuration = TOTAL_FRAMES / FPS;

    const animate = (now: number) => {
      animId = requestAnimationFrame(animate);
      const dt = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;

      // Mouse smoothing
      mouse.x += (mouse.targetX - mouse.x) * 0.08;
      mouse.y += (mouse.targetY - mouse.y) * 0.08;

      const p = Math.max(0, Math.min(1, scrollRef.current));

      // Keyframe mapping across sections
      let targetFrame = 184;
      if (p <= 0.18) {
        // Hero hover (frames 184 -> 220)
        targetFrame = 184 + (p / 0.18) * 36;
      } else if (p <= 0.42) {
        // Gear payload inspection (frames 220 -> 424)
        targetFrame = 220 + ((p - 0.18) / 0.24) * 204;
      } else if (p <= 0.62) {
        // LiDAR scanning sweep (frames 424 -> 564)
        targetFrame = 424 + ((p - 0.42) / 0.2) * 140;
      } else if (p <= 0.82) {
        // Arms folding into 42cm profile (frames 730 -> 769)
        targetFrame = 730 + ((p - 0.62) / 0.2) * 39;
      } else {
        // Landing & Docking (frames 769 -> 1038)
        targetFrame = 769 + ((p - 0.82) / 0.18) * 269;
      }

      currentFrame += (targetFrame - currentFrame) * 0.12;

      if (action && mixer) {
        const t = (currentFrame / TOTAL_FRAMES) * clipDuration;
        action.time = Math.max(0, Math.min(clipDuration, t));
        mixer.update(0);
      }

      // Continuous propeller spinning
      const propSpeed = 60.0 * dt;
      for (const m of spinningMotors) {
        m.node.rotation.y += propSpeed * m.dir;
      }

      // Drone flight hovering float and position choreography
      const floatY = Math.sin(now * 0.0022) * 0.04;
      const floatRoll = Math.cos(now * 0.0016) * 0.02;

      let targetPosY = floatY;
      let targetPosZ = 0;
      let targetRotX = -mouse.y * 0.15 + floatRoll + mouse.rotX;
      let targetRotY = mouse.x * 0.25 + mouse.rotY;
      let targetRotZ = -mouse.x * 0.12;

      if (p < 0.18) {
        // Hero: Front center
        targetPosY = 0.1 + floatY;
        targetPosZ = 0.3;
      } else if (p >= 0.18 && p < 0.42) {
        // Gear specs: tilted for top-down angle inspection
        targetPosY = 0.3;
        targetPosZ = -0.2;
        targetRotX += 0.35;
        targetRotY += 0.4;
      } else if (p >= 0.42 && p < 0.62) {
        // LiDAR scan: pitched forward
        targetPosY = 0.15;
        targetPosZ = 0.1;
        targetRotX += 0.25;
      } else {
        // Arm Fold & Store: rotated for profile
        targetPosY = -0.15;
        targetPosZ = 0.2;
        targetRotY += 0.65;
      }

      droneGroup.position.y += (targetPosY - droneGroup.position.y) * 0.08;
      droneGroup.position.z += (targetPosZ - droneGroup.position.z) * 0.08;
      droneGroup.position.x += (mouse.x * 0.2 - droneGroup.position.x) * 0.08;

      droneGroup.rotation.x += (targetRotX - droneGroup.rotation.x) * 0.08;
      droneGroup.rotation.y += (targetRotY - droneGroup.rotation.y) * 0.08;
      droneGroup.rotation.z += (targetRotZ - droneGroup.rotation.z) * 0.08;

      // Gimbal cursor tracking
      if (gimbalYaw) {
        gimbalYaw.rotation.y = THREE.MathUtils.lerp(gimbalYaw.rotation.y, mouse.x * 0.5, 0.1);
      }
      if (gimbalPitch) {
        gimbalPitch.rotation.x = THREE.MathUtils.lerp(gimbalPitch.rotation.x, mouse.y * 0.4, 0.1);
      }

      // LiDAR beam active during scan phase
      const isScanning = p > 0.38 && p < 0.64;
      beamMesh.visible = isScanning;
      if (isScanning) {
        beamMat.uniforms.time.value = now * 0.001;
        beamMat.uniforms.opacity.value = THREE.MathUtils.lerp(beamMat.uniforms.opacity.value, 1.0, 0.1);
        beamMesh.position.copy(droneGroup.position);
        beamMesh.position.y -= 0.4;
      } else {
        beamMat.uniforms.opacity.value = 0;
      }

      renderer.render(scene, camera);
    };

    animId = requestAnimationFrame(animate);

    const onResize = () => {
      if (!container) return;
      width = container.clientWidth || window.innerWidth;
      height = container.clientHeight || window.innerHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('resize', onResize);
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <>
      {/* 3D WebGL Canvas fixed at z-20 so it is NEVER obscured by section backgrounds */}
      <div
        ref={containerRef}
        className="fixed inset-0 pointer-events-none z-20 overflow-hidden"
        style={{ width: '100vw', height: '100vh' }}
      />

      {/* Loading indicator */}
      {!isLoaded && !loadError && (
        <div className="fixed bottom-6 left-6 z-50 flex items-center gap-3 px-4 py-2 rounded-full bg-white/90 backdrop-blur-md border border-ink/24 shadow-lg text-xs font-mono text-ink">
          <span className="w-2 h-2 rounded-full bg-blue-600 animate-ping" />
          <span>Calibrating 3D Drone & LiDAR Sensors...</span>
        </div>
      )}

      {loadError && (
        <div className="fixed bottom-6 left-6 z-50 px-4 py-2 rounded bg-red-50 text-red-700 text-xs font-mono border border-red-200">
          Sensor error: {loadError}
        </div>
      )}
    </>
  );
};
