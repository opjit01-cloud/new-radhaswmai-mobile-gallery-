import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Float, RoundedBox } from '@react-three/drei';
import * as THREE from 'three';
import { Sparkles, Eye, Layers, Zap } from 'lucide-react';

interface PhoneProps {
  colorHex: string;
  autoRotate: boolean;
}

const PhoneMesh: React.FC<PhoneProps> = ({ colorHex, autoRotate }) => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (groupRef.current && autoRotate) {
      groupRef.current.rotation.y += delta * 0.4;
    }
  });

  const bodyColor = new THREE.Color(colorHex);

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* Phone Main Body Frame (Titanium) */}
      <RoundedBox args={[1.5, 3.1, 0.16]} radius={0.12} smoothness={4} castShadow receiveShadow>
        <meshStandardMaterial
          color={bodyColor}
          metalness={0.9}
          roughness={0.25}
          envMapIntensity={2.0}
        />
      </RoundedBox>

      {/* Front Screen (Black glass with bezel) */}
      <RoundedBox args={[1.42, 3.02, 0.02]} radius={0.09} smoothness={4} position={[0, 0, 0.082]}>
        <meshPhysicalMaterial
          color="#05070A"
          roughness={0.05}
          metalness={0.1}
          clearcoat={1.0}
          clearcoatRoughness={0.1}
        />
      </RoundedBox>

      {/* Screen Inner Wallpaper Glow */}
      <mesh position={[0, 0, 0.095]}>
        <planeGeometry args={[1.36, 2.94]} />
        <meshBasicMaterial color="#132030">
          <canvasTexture attach="map" image={createPhoneScreenCanvas()} />
        </meshBasicMaterial>
      </mesh>

      {/* Dynamic Island / Punch Hole Pill */}
      <mesh position={[0, 1.3, 0.098]}>
        <planeGeometry args={[0.32, 0.08]} />
        <meshBasicMaterial color="#000000" />
      </mesh>

      {/* Back Glass Panel */}
      <RoundedBox args={[1.42, 3.02, 0.01]} radius={0.09} smoothness={4} position={[0, 0, -0.082]}>
        <meshStandardMaterial
          color={bodyColor}
          roughness={0.35}
          metalness={0.6}
        />
      </RoundedBox>

      {/* Camera Island Bump */}
      <group position={[-0.35, 0.95, -0.11]}>
        <RoundedBox args={[0.65, 0.72, 0.06]} radius={0.06} smoothness={4}>
          <meshStandardMaterial color={bodyColor} metalness={0.85} roughness={0.3} />
        </RoundedBox>

        {/* 3 Camera Lenses */}
        <group position={[-0.15, 0.16, -0.035]}>
          <cylinderGeometry args={[0.11, 0.11, 0.05, 32]} />
          <meshStandardMaterial color="#111" metalness={0.95} roughness={0.1} />
          {/* Lens Glass */}
          <mesh position={[0, 0.025, 0]}>
            <cylinderGeometry args={[0.08, 0.08, 0.01, 32]} />
            <meshPhysicalMaterial color="#003366" roughness={0} transmission={0.9} />
          </mesh>
        </group>

        <group position={[-0.15, -0.16, -0.035]}>
          <cylinderGeometry args={[0.11, 0.11, 0.05, 32]} />
          <meshStandardMaterial color="#111" metalness={0.95} roughness={0.1} />
          <mesh position={[0, 0.025, 0]}>
            <cylinderGeometry args={[0.08, 0.08, 0.01, 32]} />
            <meshPhysicalMaterial color="#003366" roughness={0} transmission={0.9} />
          </mesh>
        </group>

        <group position={[0.15, 0, -0.035]}>
          <cylinderGeometry args={[0.11, 0.11, 0.05, 32]} />
          <meshStandardMaterial color="#111" metalness={0.95} roughness={0.1} />
          <mesh position={[0, 0.025, 0]}>
            <cylinderGeometry args={[0.08, 0.08, 0.01, 32]} />
            <meshPhysicalMaterial color="#003366" roughness={0} transmission={0.9} />
          </mesh>
        </group>

        {/* Flash & LiDAR Sensor */}
        <mesh position={[0.15, 0.22, -0.035]}>
          <cylinderGeometry args={[0.04, 0.04, 0.02, 16]} />
          <meshBasicMaterial color="#fffbe6" />
        </mesh>
        <mesh position={[0.15, -0.22, -0.035]}>
          <cylinderGeometry args={[0.03, 0.03, 0.02, 16]} />
          <meshBasicMaterial color="#1a1a1a" />
        </mesh>
      </group>

      {/* Titanium Side Buttons */}
      <mesh position={[0.76, 0.5, 0]}>
        <boxGeometry args={[0.03, 0.35, 0.05]} />
        <meshStandardMaterial color={bodyColor} metalness={0.95} roughness={0.2} />
      </mesh>
      <mesh position={[-0.76, 0.7, 0]}>
        <boxGeometry args={[0.03, 0.25, 0.05]} />
        <meshStandardMaterial color={bodyColor} metalness={0.95} roughness={0.2} />
      </mesh>
      <mesh position={[-0.76, 0.35, 0]}>
        <boxGeometry args={[0.03, 0.25, 0.05]} />
        <meshStandardMaterial color={bodyColor} metalness={0.95} roughness={0.2} />
      </mesh>
    </group>
  );
};

function createPhoneScreenCanvas() {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    // Luxury dark gradient wallpaper
    const grad = ctx.createLinearGradient(0, 0, 512, 1024);
    grad.addColorStop(0, '#060B12');
    grad.addColorStop(0.5, '#13283E');
    grad.addColorStop(1, '#090E17');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 512, 1024);

    // Glowing holographic sphere
    const glow = ctx.createRadialGradient(256, 512, 10, 256, 512, 220);
    glow.addColorStop(0, 'rgba(212, 175, 55, 0.8)');
    glow.addColorStop(0.4, 'rgba(0, 242, 254, 0.4)');
    glow.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(256, 512, 220, 0, Math.PI * 2);
    ctx.fill();

    // Text & Clock
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 64px Space Grotesk, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('09:41', 256, 260);

    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.font = '24px Plus Jakarta Sans, sans-serif';
    ctx.fillText('NEW RADHASWAMI 5G', 256, 310);
  }
  return canvas;
}

export const Phone3DViewer: React.FC = () => {
  const finishes = [
    { name: 'Desert Titanium Gold', hex: '#C2A387', desc: 'Warm aerospace grade 5 titanium alloy' },
    { name: 'Natural Titanium', hex: '#9E9B94', desc: 'Raw metallic brush with satin finish' },
    { name: 'Black Titanium', hex: '#2A2C30', desc: 'Deep diamond-like carbon PVD coating' },
    { name: 'Cyber Blue', hex: '#22425E', desc: 'Anodized iridescent ocean alloy' },
  ];

  const [selectedFinish, setSelectedFinish] = useState(finishes[0]);
  const [autoRotate, setAutoRotate] = useState(true);
  const [activeHotspot, setActiveHotspot] = useState<string | null>(null);

  return (
    <section id="3d-experience" className="py-20 px-4 md:px-8 max-w-7xl mx-auto">
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-gold/30 bg-gold/5 text-gold text-xs font-mono mb-4">
          <Sparkles className="w-3.5 h-3.5" />
          <span>INTERACTIVE 3D STUDIO</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-display font-bold tracking-tight text-white">
          Experience Flagship Engineering in 360°
        </h2>
        <p className="mt-4 text-gray-400 text-sm sm:text-base">
          Drag to rotate, inspect camera optics, and customize your titanium finish. Available exclusively at New Radhaswami Mobile Gallery.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* Left Specification Hotspots */}
        <div className="lg:col-span-3 space-y-4">
          <div 
            onClick={() => setActiveHotspot('camera')}
            className={`p-4 rounded-xl glass-panel transition-all cursor-pointer border ${
              activeHotspot === 'camera' ? 'border-gold shadow-glow-gold bg-[#161D26]' : 'border-white/10 hover:border-white/30'
            }`}
          >
            <div className="flex items-center gap-2.5 text-gold font-mono text-xs font-bold mb-1">
              <Eye className="w-4 h-4" />
              <span>48MP FUSION + PERISCOPE</span>
            </div>
            <p className="text-xs text-gray-300">
              Triple lens cluster with 5x optical telephoto and anti-reflective sapphire coating.
            </p>
          </div>

          <div 
            onClick={() => setActiveHotspot('chassis')}
            className={`p-4 rounded-xl glass-panel transition-all cursor-pointer border ${
              activeHotspot === 'chassis' ? 'border-gold shadow-glow-gold bg-[#161D26]' : 'border-white/10 hover:border-white/30'
            }`}
          >
            <div className="flex items-center gap-2.5 text-gold font-mono text-xs font-bold mb-1">
              <Layers className="w-4 h-4" />
              <span>GRADE 5 TITANIUM FRAME</span>
            </div>
            <p className="text-xs text-gray-300">
              Precision machined alloy offering supreme strength-to-weight ratio and ceramic shield front.
            </p>
          </div>

          <div 
            onClick={() => setActiveHotspot('battery')}
            className={`p-4 rounded-xl glass-panel transition-all cursor-pointer border ${
              activeHotspot === 'battery' ? 'border-gold shadow-glow-gold bg-[#161D26]' : 'border-white/10 hover:border-white/30'
            }`}
          >
            <div className="flex items-center gap-2.5 text-gold font-mono text-xs font-bold mb-1">
              <Zap className="w-4 h-4" />
              <span>SILICON-CARBON CELL</span>
            </div>
            <p className="text-xs text-gray-300">
              Up to 33 hours endurance with Qi2 25W MagSafe and 45W wire-speed turbo recharge.
            </p>
          </div>
        </div>

        {/* 3D WebGL Canvas Centerpiece */}
        <div className="lg:col-span-6 relative aspect-square max-h-[520px] w-full rounded-2xl overflow-hidden glass-panel border border-white/10 flex items-center justify-center shadow-2xl">
          <Canvas camera={{ position: [0, 0, 4.2], fov: 45 }} className="cursor-grab active:cursor-grabbing">
            <ambientLight intensity={1.2} />
            <directionalLight position={[5, 10, 5]} intensity={2.5} />
            <directionalLight position={[-5, -5, -2]} intensity={1.2} color="#00F2FE" />
            <pointLight position={[0, 0, 3]} intensity={1.5} color="#D4AF37" />

            <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.2}>
              <PhoneMesh colorHex={selectedFinish.hex} autoRotate={autoRotate} />
            </Float>

            <OrbitControls enableZoom={true} maxDistance={6} minDistance={2.5} />
          </Canvas>

          {/* Canvas HUD overlays */}
          <div className="absolute top-4 left-4 font-mono text-[10px] text-gray-400 bg-black/60 px-3 py-1 rounded-full border border-white/10 backdrop-blur-md">
            <span>3D ROTATE: DRAG WITH MOUSE</span>
          </div>

          <button
            onClick={() => setAutoRotate(!autoRotate)}
            className="absolute top-4 right-4 font-mono text-[10px] text-gold bg-black/60 px-3 py-1 rounded-full border border-gold/30 backdrop-blur-md hover:bg-gold/20 transition-all cursor-pointer"
          >
            {autoRotate ? 'PAUSE ROTATION' : 'AUTO ROTATE'}
          </button>

          <div className="absolute bottom-4 inset-x-4 text-center">
            <span className="text-xs font-mono text-white/90 bg-black/70 px-4 py-1.5 rounded-full border border-white/15 backdrop-blur-md">
              Current Finish: <strong className="text-gold">{selectedFinish.name}</strong>
            </span>
          </div>
        </div>

        {/* Right Finish Customizer */}
        <div className="lg:col-span-3 space-y-4">
          <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4">
            <p className="text-xs font-mono text-gray-400 uppercase tracking-wider">[ CHOOSE FINISH ]</p>
            
            <div className="space-y-2.5">
              {finishes.map((finish) => (
                <button
                  key={finish.name}
                  onClick={() => setSelectedFinish(finish)}
                  className={`w-full flex items-center justify-between p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    selectedFinish.name === finish.name 
                      ? 'border-gold bg-gold/10 shadow-glow-gold' 
                      : 'border-white/10 hover:border-white/20 bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-5 h-5 rounded-full border border-white/30 shadow-inner" 
                      style={{ backgroundColor: finish.hex }}
                    />
                    <span className="text-xs font-medium text-white">{finish.name}</span>
                  </div>
                  {selectedFinish.name === finish.name && (
                    <span className="text-[10px] font-mono text-gold">ACTIVE</span>
                  )}
                </button>
              ))}
            </div>

            <div className="pt-4 border-t border-white/10">
              <a
                href={`https://wa.me/919691011335?text=Hi%20New%20Radhaswami%20Mobile%20Gallery,%20I%20am%20interested%20in%20buying%20the%20Flagship%20Phone%20in%20${encodeURIComponent(selectedFinish.name)}%20finish.`}
                target="_blank"
                rel="noreferrer"
                className="w-full block text-center py-2.5 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white font-semibold rounded-xl text-xs shadow-lg transition-all"
              >
                Inquire on WhatsApp ➔
              </a>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
