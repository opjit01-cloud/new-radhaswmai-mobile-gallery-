import React from 'react';
import { TerrainSoftwareCanvas } from './TerrainSoftwareCanvas';
import { Activity, BatteryCharging, Gauge, Navigation } from 'lucide-react';

export const DroneSoftwareTelemetry: React.FC = () => {
  return (
    <section id="software" className="bg-[#FDFDFD] px-6 py-28 border-t border-ink/24">
      {/* Top Header */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-end justify-between border-b border-ink/24 pb-12">
        <h2 className="text-massive font-light text-[#24363F] tracking-tighter select-none">
          Software
        </h2>
        <div className="flex items-center gap-3 mt-4 md:mt-0">
          <span className="w-8 h-8 rounded-full border border-ink/24 flex items-center justify-center font-mono text-sm text-ink/64">
            6
          </span>
          <span className="font-mono text-xs text-ink/64 uppercase tracking-widest">
            // Mission Control & OS
          </span>
        </div>
      </div>

      {/* Main Grid: 3D Terrain + Real-time Telemetry Dashboard */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 pt-12 items-center">
        {/* Left: 3D Wireframe Elevation Canvas */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <div className="flex items-center justify-between font-mono text-xs text-ink/64 px-1">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              LIVE 3D DIGITAL ELEVATION MODEL [ NewTerreain_006.glb ]
            </span>
            <span>POLYGONS: 48,200</span>
          </div>

          <TerrainSoftwareCanvas />

          <div className="flex justify-between items-center text-xs font-mono text-ink/48 px-1">
            <span>COORDINATES: 28.6139° N, 77.2090° E</span>
            <span>GRID: WGS84 ZONE 43N</span>
          </div>
        </div>

        {/* Right: Telemetry Diagnostic Gauges */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <div className="p-6 rounded-lg border border-ink/24 bg-white shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-ink/12 pb-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-[#24363F]">
                <Activity size={16} className="text-blue-600" />
                <span>Mission Telemetry Hub</span>
              </div>
              <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-mono text-[11px] font-medium border border-emerald-200">
                ACTIVE UPLINK
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 rounded bg-[#F8F9FA] border border-ink/12">
                <div className="flex items-center gap-1.5 text-xs text-ink/64 font-mono">
                  <Gauge size={13} />
                  <span>POINT DENSITY</span>
                </div>
                <div className="text-xl font-light text-[#24363F] mt-1 font-mono">
                  240,000 <span className="text-xs text-ink/48">pts/s</span>
                </div>
              </div>

              <div className="p-3 rounded bg-[#F8F9FA] border border-ink/12">
                <div className="flex items-center gap-1.5 text-xs text-ink/64 font-mono">
                  <Navigation size={13} />
                  <span>ALTITUDE AGL</span>
                </div>
                <div className="text-xl font-light text-[#24363F] mt-1 font-mono">
                  120.4 <span className="text-xs text-ink/48">meters</span>
                </div>
              </div>

              <div className="p-3 rounded bg-[#F8F9FA] border border-ink/12">
                <div className="flex items-center gap-1.5 text-xs text-ink/64 font-mono">
                  <BatteryCharging size={13} />
                  <span>SOLID-STATE CELL</span>
                </div>
                <div className="text-xl font-light text-[#24363F] mt-1 font-mono">
                  94% <span className="text-xs text-ink/48">22.8V</span>
                </div>
              </div>

              <div className="p-3 rounded bg-[#F8F9FA] border border-ink/12">
                <div className="flex items-center gap-1.5 text-xs text-ink/64 font-mono">
                  <Activity size={13} />
                  <span>5G DATA LINK</span>
                </div>
                <div className="text-xl font-light text-[#24363F] mt-1 font-mono">
                  1.2 <span className="text-xs text-ink/48">Gbps</span>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <div className="text-xs font-mono text-ink/64 uppercase tracking-wider mb-2">
                Ground Control Station Sync:
              </div>
              <div className="p-3 rounded border border-ink/12 bg-white text-xs font-mono text-ink space-y-1">
                <div className="text-blue-600 font-semibold">[ Connected ] New Radhaswami Command Center</div>
                <div className="text-ink/64">Target Device: iPhone 16 Pro Max & S25 Ultra Field Station</div>
                <div className="text-emerald-600 font-mono text-[11px]">Latency: 12ms • Encryption: AES-256 GCM</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
