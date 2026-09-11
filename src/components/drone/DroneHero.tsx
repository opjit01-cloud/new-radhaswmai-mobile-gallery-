import React from 'react';
import { ChevronDown, Compass, Eye, ShieldAlert, Cpu } from 'lucide-react';

interface DroneHeroProps {
  onScrollDown: () => void;
}

export const DroneHero: React.FC<DroneHeroProps> = ({ onScrollDown }) => {
  return (
    <section
      id="hero"
      className="relative flex h-screen w-full flex-col justify-between overflow-hidden bg-transparent px-6 pt-28 pb-10"
    >
      {/* Background Architectural Watermark & Vignette */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden opacity-25">
        <img
          src="/hero/aevion.svg"
          alt="Aevion Background Graphic"
          className="w-[90vw] max-w-[1400px] object-contain filter blur-[100px] transform scale-110"
        />
      </div>

      {/* Subtle Crosshairs & Technical Corner Brackets */}
      <div className="absolute top-24 left-8 pointer-events-none font-mono text-[11px] text-ink/32 flex items-center gap-2">
        <span>+</span>
        <span>RADHASWAMI AEVION DYNAMICS // 28°38'N</span>
      </div>
      <div className="absolute top-24 right-8 pointer-events-none font-mono text-[11px] text-ink/32 flex items-center gap-2">
        <span>STATION: COMMAND 01</span>
        <span>+</span>
      </div>

      {/* Top Tagline & Telemetry pill */}
      <div className="relative z-30 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="tech-pill bg-white/70 backdrop-blur-sm shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Active Fleet: Ready for Mission
          </span>
          <span className="hidden sm:inline-block text-xs font-mono text-ink/48">
            Firmware v4.8 • LiDAR L2
          </span>
        </div>

        <div className="flex items-center gap-3 font-mono text-xs text-ink/64 bg-white/70 px-3 py-1.5 rounded-full border border-ink/12 backdrop-blur-sm">
          <Compass size={13} className="text-blue-600 animate-spin" style={{ animationDuration: '10s' }} />
          <span>240,000 pts/sec • 5 Returns</span>
        </div>
      </div>

      {/* Center 3D Stage Space: Empty viewport for the 3D Canvas with drag hint */}
      <div className="relative z-30 flex-1 flex flex-col items-center justify-end pb-4 pointer-events-none">
        <div className="pointer-events-auto flex flex-wrap items-center justify-center gap-2 mb-3">
          <button
            onClick={() => document.getElementById('hero')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-3 py-1 rounded-full bg-white/90 backdrop-blur-md border border-ink/24 text-[11px] font-mono text-ink hover:bg-[#24363F] hover:text-white transition-all cursor-pointer shadow-sm"
          >
            //01 HOVER FLIGHT
          </button>
          <button
            onClick={() => document.getElementById('gear')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-3 py-1 rounded-full bg-white/90 backdrop-blur-md border border-ink/24 text-[11px] font-mono text-ink hover:bg-[#24363F] hover:text-white transition-all cursor-pointer shadow-sm"
          >
            //02 GEAR PAYLOAD
          </button>
          <button
            onClick={() => document.getElementById('capabilities')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-3 py-1 rounded-full bg-white/90 backdrop-blur-md border border-ink/24 text-[11px] font-mono text-ink hover:bg-[#24363F] hover:text-white transition-all cursor-pointer shadow-sm"
          >
            //03 LIDAR SCAN
          </button>
          <button
            onClick={() => document.getElementById('software')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-3 py-1 rounded-full bg-white/90 backdrop-blur-md border border-ink/24 text-[11px] font-mono text-ink hover:bg-[#24363F] hover:text-white transition-all cursor-pointer shadow-sm"
          >
            //04 3D TERRAIN
          </button>
          <button
            onClick={() => document.getElementById('gallery-store')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-3 py-1 rounded-full bg-[#24363F] text-white border border-[#24363F] text-[11px] font-mono hover:bg-black transition-all cursor-pointer shadow-sm"
          >
            //05 HARDWARE STORE
          </button>
        </div>

        <div className="pointer-events-auto flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/80 backdrop-blur-md border border-ink/12 text-[11px] font-mono text-ink/70 shadow-sm">
          <Eye size={12} className="text-blue-600" />
          <span>Click & drag anywhere to rotate 3D Drone 360° • Scroll down to watch arms fold</span>
        </div>
      </div>

      {/* Bottom Display Typography & Scroll Trigger */}
      <div className="relative z-30 grid grid-cols-1 md:grid-cols-12 gap-6 items-end border-t border-ink/24 pt-6 bg-white/40 backdrop-blur-sm rounded-t-xl px-4 pb-2">
        <div className="md:col-span-8">
          <div className="flex items-center gap-2 mb-2 font-mono text-xs text-blue-600 font-semibold tracking-wider uppercase">
            <span>[ NEXT-GENERATION MOBILE & AERIAL FLEET ]</span>
          </div>

          <h1 className="text-2xl sm:text-4xl md:text-5xl font-light tracking-tight text-[#24363F] leading-tight">
            Autonomous LiDAR inspection systems.{' '}
            <span className="text-ink/48 font-light">
              Precision hardware that secures critical infrastructure and powers elite mobile tech.
            </span>
          </h1>

          <div className="mt-4 flex flex-wrap items-center gap-4 text-xs font-mono text-ink/64">
            <span className="flex items-center gap-1.5">
              <Cpu size={12} />
              DJI ZENMUSE L2
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <ShieldAlert size={12} />
              SUB-MILLIMETER RISK RADAR
            </span>
            <span>•</span>
            <span>TITANIUM COMPOSITE CELL</span>
          </div>
        </div>

        <div className="md:col-span-4 flex md:justify-end">
          <button
            onClick={onScrollDown}
            type="button"
            className="group flex items-center gap-4 px-6 py-3.5 rounded-full border border-ink/24 hover:border-[#24363F] bg-white/90 backdrop-blur-md transition-all cursor-pointer shadow-md hover:shadow-xl hover:scale-105"
          >
            <span className="font-mono text-xs uppercase tracking-wider text-[#24363F] font-semibold">
              Explore Architecture
            </span>
            <div className="w-7 h-7 rounded-full bg-[#24363F] text-white flex items-center justify-center group-hover:bg-blue-600 transition-colors">
              <ChevronDown size={14} className="animate-bounce" />
            </div>
          </button>
        </div>
      </div>
    </section>
  );
};
