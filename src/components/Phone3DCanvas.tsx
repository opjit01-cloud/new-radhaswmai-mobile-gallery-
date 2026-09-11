import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RotateCw, Sparkles, Smartphone, Check } from 'lucide-react';
import { MagneticButton } from './common/MagneticButton';

interface Phone3DCanvasProps {
  initialColor?: string;
  onColorChange?: (colorName: string) => void;
}

export const PHONE_COLORS = [
  { name: 'Natural Titanium', hex: '#9E9B94', metalHex: '#C5C5C2', label: 'Natural Titanium' },
  { name: 'Desert Titanium', hex: '#C2A387', metalHex: '#D4BFA9', label: 'Desert Titanium' },
  { name: 'White Titanium', hex: '#E3E4E5', metalHex: '#FFFFFF', label: 'White Titanium' },
  { name: 'Black Titanium', hex: '#2A2A2C', metalHex: '#4A4A4D', label: 'Black Titanium' }
];

export const Phone3DCanvas: React.FC<Phone3DCanvasProps> = ({
  initialColor = 'Natural Titanium',
  onColorChange
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentColor, setCurrentColor] = useState(initialColor);
  const [autoRotate, setAutoRotate] = useState(true);
  const autoRotateRef = useRef(autoRotate);
  autoRotateRef.current = autoRotate;

  const backMatRef = useRef<THREE.MeshStandardMaterial | null>(null);
  const frameMatRef = useRef<THREE.MeshStandardMaterial | null>(null);
  const cameraPlateMatRef = useRef<THREE.MeshStandardMaterial | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let animId: number;
    let width = container.clientWidth || 550;
    let height = container.clientHeight || 550;

    // 1. Scene & Camera Setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(34, width / height, 0.1, 100);
    camera.position.set(0, 0.15, 4.35);

    // 2. High-Fidelity WebGL Renderer with mobile performance caps
    const isMobile = typeof window !== 'undefined' && (window.innerWidth < 768 || ('ontouchstart' in window));
    const renderer = new THREE.WebGLRenderer({
      antialias: !isMobile,
      alpha: true,
      powerPreference: isMobile ? 'default' : 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(isMobile ? 1.0 : Math.min(window.devicePixelRatio, 1.5));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.appendChild(renderer.domElement);

    // 3. Cinema Studio Lighting (Platinum rim, crisp key, soft fill)
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.3);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 3.5);
    keyLight.position.set(4, 7, 5);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0xe2e8f0, 2.8);
    rimLight.position.set(-5, -2, -3);
    scene.add(rimLight);

    const softFill = new THREE.DirectionalLight(0xffffff, 0.9);
    softFill.position.set(0, -4, 3);
    scene.add(softFill);

    // 4. Exhibition Pedestal / Plinth
    const plinthGroup = new THREE.Group();
    const plinthGeo = new THREE.CylinderGeometry(1.65, 1.75, 0.08, 64);
    const plinthMat = new THREE.MeshStandardMaterial({
      color: 0x0c0d12,
      roughness: 0.45,
      metalness: 0.65
    });
    const plinth = new THREE.Mesh(plinthGeo, plinthMat);
    plinth.position.y = -1.98;
    plinthGroup.add(plinth);

    // Plinth Platinum Inlay Ring
    const ringGeo = new THREE.TorusGeometry(1.66, 0.018, 16, 64);
    ringGeo.rotateX(Math.PI / 2);
    const ringMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      metalness: 0.95,
      roughness: 0.15,
      emissive: new THREE.Color(0xffffff),
      emissiveIntensity: 0.2
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.position.y = -1.94;
    plinthGroup.add(ring);
    scene.add(plinthGroup);

    // 5. Detailed 3D Smartphone Construction
    const phoneRoot = new THREE.Group();
    scene.add(phoneRoot);

    const phoneWidth = 1.64;
    const phoneHeight = 3.38;
    const phoneDepth = 0.16;
    const cornerRadius = 0.22;

    const shape = new THREE.Shape();
    const w2 = phoneWidth / 2 - cornerRadius;
    const h2 = phoneHeight / 2 - cornerRadius;

    shape.moveTo(-w2, -h2 - cornerRadius);
    shape.lineTo(w2, -h2 - cornerRadius);
    shape.absarc(w2, -h2, cornerRadius, -Math.PI / 2, 0, false);
    shape.lineTo(w2 + cornerRadius, h2);
    shape.absarc(w2, h2, cornerRadius, 0, Math.PI / 2, false);
    shape.lineTo(-w2, h2 + cornerRadius);
    shape.absarc(-w2, h2, cornerRadius, Math.PI / 2, Math.PI, false);
    shape.lineTo(-w2 - cornerRadius, -h2);
    shape.absarc(-w2, -h2, cornerRadius, Math.PI, Math.PI * 1.5, false);

    const extrudeSettings = {
      depth: phoneDepth,
      bevelEnabled: true,
      bevelSegments: 6,
      steps: 1,
      bevelSize: 0.025,
      bevelThickness: 0.025
    };

    const activeCol = PHONE_COLORS.find(c => c.name === initialColor) || PHONE_COLORS[0];

    // Chassis Frame (Grade 5 Brushed Titanium)
    const frameGeo = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    frameGeo.center();
    const frameMat = new THREE.MeshStandardMaterial({
      color: activeCol.metalHex,
      metalness: 0.92,
      roughness: 0.28
    });
    frameMatRef.current = frameMat;
    const frameMesh = new THREE.Mesh(frameGeo, frameMat);
    phoneRoot.add(frameMesh);

    // Front OLED Display with Ceramic Shield Glass
    const frontScreenGeo = new THREE.PlaneGeometry(phoneWidth * 0.94, phoneHeight * 0.96);
    const frontScreenMat = new THREE.MeshStandardMaterial({
      color: 0x050508,
      roughness: 0.08,
      metalness: 0.9,
      emissive: new THREE.Color(0x0a0b12),
      emissiveIntensity: 0.2
    });
    const frontScreen = new THREE.Mesh(frontScreenGeo, frontScreenMat);
    frontScreen.position.z = phoneDepth / 2 + 0.026;
    phoneRoot.add(frontScreen);

    // Dynamic Island Pill
    const pillShape = new THREE.Shape();
    const pw = 0.22;
    const ph = 0.06;
    pillShape.moveTo(-pw, -ph);
    pillShape.lineTo(pw, -ph);
    pillShape.absarc(pw, 0, ph, -Math.PI / 2, Math.PI / 2, false);
    pillShape.lineTo(-pw, ph);
    pillShape.absarc(-pw, 0, ph, Math.PI / 2, Math.PI * 1.5, false);
    const pillGeo = new THREE.ShapeGeometry(pillShape);
    const pillMat = new THREE.MeshBasicMaterial({ color: 0x000000 });
    const pillMesh = new THREE.Mesh(pillGeo, pillMat);
    pillMesh.position.set(0, 1.45, phoneDepth / 2 + 0.028);
    phoneRoot.add(pillMesh);

    // Rear Frosted Glass Backplate
    const backGeo = new THREE.PlaneGeometry(phoneWidth * 0.94, phoneHeight * 0.96);
    const backMat = new THREE.MeshStandardMaterial({
      color: activeCol.hex,
      roughness: 0.38,
      metalness: 0.65
    });
    backMatRef.current = backMat;
    const backMesh = new THREE.Mesh(backGeo, backMat);
    backMesh.position.z = -phoneDepth / 2 - 0.026;
    backMesh.rotation.y = Math.PI;
    phoneRoot.add(backMesh);

    // Camera Island Bump
    const camIslandShape = new THREE.Shape();
    const cw = 0.42;
    const ch = 0.44;
    const cr = 0.12;
    camIslandShape.moveTo(-cw + cr, -ch);
    camIslandShape.lineTo(cw - cr, -ch);
    camIslandShape.absarc(cw - cr, -ch + cr, cr, -Math.PI / 2, 0, false);
    camIslandShape.lineTo(cw, ch - cr);
    camIslandShape.absarc(cw - cr, ch - cr, cr, 0, Math.PI / 2, false);
    camIslandShape.lineTo(-cw + cr, ch);
    camIslandShape.absarc(-cw + cr, ch - cr, cr, Math.PI / 2, Math.PI, false);
    camIslandShape.lineTo(-cw, -ch + cr);
    camIslandShape.absarc(-cw + cr, -ch + cr, cr, Math.PI, Math.PI * 1.5, false);

    const camIslandExtrude = {
      depth: 0.045,
      bevelEnabled: true,
      bevelSize: 0.015,
      bevelThickness: 0.015,
      bevelSegments: 4
    };
    const camIslandGeo = new THREE.ExtrudeGeometry(camIslandShape, camIslandExtrude);
    const camIslandMat = new THREE.MeshStandardMaterial({
      color: activeCol.hex,
      roughness: 0.25,
      metalness: 0.8
    });
    cameraPlateMatRef.current = camIslandMat;
    const camIslandMesh = new THREE.Mesh(camIslandGeo, camIslandMat);
    camIslandMesh.position.set(-0.35, 1.05, -phoneDepth / 2 - 0.027);
    camIslandMesh.rotation.y = Math.PI;
    phoneRoot.add(camIslandMesh);

    // Triple Sapphire Lenses
    const lensRingGeo = new THREE.CylinderGeometry(0.14, 0.14, 0.04, 32);
    lensRingGeo.rotateX(Math.PI / 2);
    const lensRingMat = new THREE.MeshStandardMaterial({
      color: activeCol.metalHex,
      metalness: 0.95,
      roughness: 0.12
    });

    const lensGlassGeo = new THREE.CylinderGeometry(0.11, 0.11, 0.042, 32);
    lensGlassGeo.rotateX(Math.PI / 2);
    const lensGlassMat = new THREE.MeshStandardMaterial({
      color: 0x050510,
      metalness: 0.95,
      roughness: 0.05
    });

    const lensPositions = [
      [-0.48, 1.22],
      [-0.48, 0.88],
      [-0.22, 1.05]
    ];

    lensPositions.forEach(([lx, ly]) => {
      const ring = new THREE.Mesh(lensRingGeo, lensRingMat);
      ring.position.set(lx, ly, -phoneDepth / 2 - 0.075);
      phoneRoot.add(ring);

      const glass = new THREE.Mesh(lensGlassGeo, lensGlassMat);
      glass.position.set(lx, ly, -phoneDepth / 2 - 0.077);
      phoneRoot.add(glass);
    });

    // 6. Interactive Drag & Rotation
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;
    let targetRotY = 0.45;
    let targetRotX = 0.08;

    const handleMouseDown = (e: MouseEvent) => {
      isDragging = true;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const dx = e.clientX - prevMouseX;
      const dy = e.clientY - prevMouseY;
      targetRotY += dx * 0.008;
      targetRotX = Math.max(-0.6, Math.min(0.6, targetRotX + dy * 0.008));
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const handleMouseUp = () => {
      isDragging = false;
    };

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        isDragging = true;
        prevMouseX = e.touches[0].clientX;
        prevMouseY = e.touches[0].clientY;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDragging || e.touches.length === 0) return;
      const dx = e.touches[0].clientX - prevMouseX;
      const dy = e.touches[0].clientY - prevMouseY;
      targetRotY += dx * 0.008;
      targetRotX = Math.max(-0.6, Math.min(0.6, targetRotX + dy * 0.008));
      prevMouseX = e.touches[0].clientX;
      prevMouseY = e.touches[0].clientY;
    };

    const handleTouchEnd = () => {
      isDragging = false;
    };

    container.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    container.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', handleTouchEnd);

    // 7. FPS-OPTIMIZED Render Loop with IntersectionObserver
    // Automatically pauses rendering when out of view, saving 100% GPU/CPU!
    let isVisible = true;
    let clock = new THREE.Clock();

    const animate = () => {
      if (!isVisible) return;
      animId = requestAnimationFrame(animate);

      const delta = clock.getDelta();

      if (autoRotateRef.current && !isDragging) {
        targetRotY += 0.35 * delta;
      }

      phoneRoot.rotation.y += (targetRotY - phoneRoot.rotation.y) * 0.08;
      phoneRoot.rotation.x += (targetRotX - phoneRoot.rotation.x) * 0.08;
      phoneRoot.position.y = Math.sin(clock.getElapsedTime() * 1.5) * 0.05;

      renderer.render(scene, camera);
    };

    const observer = new IntersectionObserver(([entry]) => {
      const wasVisible = isVisible;
      isVisible = entry.isIntersecting;
      if (isVisible && !wasVisible) {
        cancelAnimationFrame(animId);
        clock.getDelta(); // reset delta
        animate();
      } else if (!isVisible) {
        cancelAnimationFrame(animId);
      }
    }, { threshold: 0.05 });
    observer.observe(container);

    animate();

    const onResize = () => {
      if (!container) return;
      width = container.clientWidth;
      height = container.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener('resize', onResize);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(animId);
      container.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      container.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('resize', onResize);
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  const handleSelectColor = (col: typeof PHONE_COLORS[0]) => {
    setCurrentColor(col.name);
    if (backMatRef.current) backMatRef.current.color.set(col.hex);
    if (frameMatRef.current) frameMatRef.current.color.set(col.metalHex);
    if (cameraPlateMatRef.current) cameraPlateMatRef.current.color.set(col.hex);
    if (onColorChange) onColorChange(col.name);
  };

  return (
    <div className="relative w-full h-[520px] flex items-center justify-center">
      {/* 3D WebGL Canvas */}
      <div
        ref={containerRef}
        className="w-full h-full cursor-grab active:cursor-grabbing select-none"
      />

      {/* Floating Finish Selector & Auto-Rotate Controls */}
      <div className="absolute bottom-4 inset-x-0 flex flex-col items-center gap-3 pointer-events-auto z-10">
        {/* Luxury Finish Chips */}
        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#0A0B0E]/90 backdrop-blur-2xl border border-white/15 shadow-2xl">
          <span className="text-[11px] font-bold text-neutral-300 tracking-wider mr-1.5 flex items-center gap-1">
            <Sparkles size={12} className="text-white" />
            Titanium Finish:
          </span>
          {PHONE_COLORS.map((col) => (
            <MagneticButton
              key={col.name}
              onClick={() => handleSelectColor(col)}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs transition-all cursor-pointer ${
                currentColor === col.name
                  ? 'bg-white text-black font-extrabold shadow-lg shadow-white/20 scale-105'
                  : 'text-neutral-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <span
                className="w-3.5 h-3.5 rounded-full border border-black/40 inline-block shadow-sm"
                style={{ backgroundColor: col.metalHex }}
              />
              <span className="text-[11px] font-medium hidden sm:inline">{col.label}</span>
            </MagneticButton>
          ))}

          {/* Toggle Auto Rotation */}
          <button
            onClick={() => setAutoRotate(!autoRotate)}
            className={`p-1.5 rounded-full transition-all ml-1 ${
              autoRotate ? 'text-white bg-white/10' : 'text-neutral-500 hover:text-white'
            }`}
            title="Toggle Continuous Turntable Rotation"
          >
            <RotateCw size={13} className={autoRotate ? 'animate-spin' : ''} style={{ animationDuration: '6s' }} />
          </button>
        </div>

        {/* Micro Interaction Hint */}
        <div className="text-[10px] uppercase tracking-[0.2em] text-neutral-400 font-mono bg-black/60 px-3 py-1 rounded-full border border-white/10 backdrop-blur-md">
          Drag horizontally to rotate 360°
        </div>
      </div>
    </div>
  );
};
