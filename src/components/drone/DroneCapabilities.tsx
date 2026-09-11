import React, { useState } from 'react';
import { PointCloudCanvas } from './PointCloudCanvas';
import { Cpu, Maximize2, Minimize2, Radio } from 'lucide-react';

export const DroneCapabilities: React.FC = () => {
  const [phase, setPhase] = useState<number>(0);

  return (
    <section id="capabilities" className="bg-[#FDFDFD] px-6 py-28 border-t border-ink/24">
      {/* Top Header */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-end justify-between border-b border-ink/24 pb-12">
        <h2 className="text-massive font-light text-[#24363F] tracking-tighter select-none">
          Capabilities
        </h2>
        <div className="flex items-center gap-3 mt-4 md:mt-0">
          <span className="w-8 h-8 rounded-full border border-ink/24 flex items-center justify-center font-mono text-sm text-ink/64">
            5
          </span>
          <span className="font-mono text-xs text-ink/64 uppercase tracking-widest">
            // Core Engineering
          </span>
        </div>
      </div>

      {/* Grid: 3D Point Cloud Canvas + Controls */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 pt-12 items-center">
        {/* Left: Interactive Controls */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <div className="flex items-center gap-2">
            <Radio size={14} className="text-blue-600 animate-pulse" />
            <span className="font-mono text-xs uppercase tracking-widest text-ink/64">
              INTERACTIVE 3D POINT CLOUD RENDERER
            </span>
          </div>

          <h3 className="text-3xl font-light text-[#24363F] leading-snug">
            {phase === 0 && 'Full-Hemisphere LiDAR Capture & Surface Point Mesh'}
            {phase === 1 && 'Dynamic Elevation Pulse & Sub-Canopy Analysis'}
            {phase === 2 && 'Real-Time Telemetry Uplink to Mobile Ground Station'}
          </h3>

          <p className="text-base text-ink/64 font-light leading-relaxed">
            Derived from <code>terrain-morph.glb</code>, rendering over 120,000 real 3D LiDAR point coordinates in real time. Switch stages below to observe live coordinate transformation.
          </p>

          <div className="flex flex-col gap-3 pt-4">
            <button
              onClick={() => setPhase(0)}
              className={`flex items-center justify-between p-4 rounded border text-left transition-all cursor-pointer ${
                phase === 0
                  ? 'border-[#24363F] bg-[#24363F] text-white shadow'
                  : 'border-ink/24 bg-white text-[#24363F] hover:bg-ink/8'
              }`}
            >
              <div className="flex items-center gap-3">
                <Cpu size={16} />
                <div>
                  <div className="text-sm font-semibold">Stage 01: Raw Terrain LiDAR Scan</div>
                  <div className={`text-xs ${phase === 0 ? 'text-white/70' : 'text-ink/64'}`}>
                    240,000 pts/sec acquisition
                  </div>
                </div>
              </div>
              <span className="font-mono text-xs">240K</span>
            </button>

            <button
              onClick={() => setPhase(1)}
              className={`flex items-center justify-between p-4 rounded border text-left transition-all cursor-pointer ${
                phase === 1
                  ? 'border-[#24363F] bg-[#24363F] text-white shadow'
                  : 'border-ink/24 bg-white text-[#24363F] hover:bg-ink/8'
              }`}
            >
              <div className="flex items-center gap-3">
                <Maximize2 size={16} />
                <div>
                  <div className="text-sm font-semibold">Stage 02: Elevation Pulse & Morph</div>
                  <div className={`text-xs ${phase === 1 ? 'text-white/70' : 'text-ink/64'}`}>
                    Sub-surface depth contouring
                  </div>
                </div>
              </div>
              <span className="font-mono text-xs">±2cm</span>
            </button>

            <button
              onClick={() => setPhase(2)}
              className={`flex items-center justify-between p-4 rounded border text-left transition-all cursor-pointer ${
                phase === 2
                  ? 'border-[#24363F] bg-[#24363F] text-white shadow'
                  : 'border-ink/24 bg-white text-[#24363F] hover:bg-ink/8'
              }`}
            >
              <div className="flex items-center gap-3">
                <Minimize2 size={16} />
                <div>
                  <div className="text-sm font-semibold">Stage 03: Uplink & Mobile Telemetry</div>
                  <div className={`text-xs ${phase === 2 ? 'text-white/70' : 'text-ink/64'}`}>
                    Cloud sync to Radhaswami stations
                  </div>
                </div>
              </div>
              <span className="font-mono text-xs">5G MESH</span>
            </button>
          </div>
        </div>

        {/* Right: Point Cloud Three.js Viewport */}
        <div className="lg:col-span-7">
          <PointCloudCanvas activePhase={phase} />
        </div>
      </div>
    </section>
  );
};
