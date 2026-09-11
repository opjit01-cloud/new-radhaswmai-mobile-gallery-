import React from 'react';

export const DroneGearSpecs: React.FC = () => {
  return (
    <section id="gear" className="relative bg-[#FDFDFD] px-6 pt-24 pb-32 overflow-hidden">
      {/* Top Header: Massive Typography & Number Pill */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-end justify-between border-b border-ink/24 pb-12">
        <h2 className="text-massive font-light text-[#24363F] tracking-tighter select-none">
          Gear
        </h2>
        <div className="flex items-center gap-3 mt-4 md:mt-0">
          <span className="w-8 h-8 rounded-full border border-ink/24 flex items-center justify-center font-mono text-sm text-ink/64">
            3
          </span>
          <span className="font-mono text-xs text-ink/64 uppercase tracking-widest">
            // Architecture & Payload
          </span>
        </div>
      </div>

      {/* Description & Payload Details */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 py-16">
        <div className="md:col-span-4 flex items-start gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-ink/48 mt-2" />
          <span className="font-mono text-xs uppercase tracking-widest text-ink/64">
            [ PAYLOAD & SENSOR SUITE ]
          </span>
        </div>

        <div className="md:col-span-8">
          <p className="font-light text-2xl md:text-3xl text-[#24363F] leading-relaxed">
            Engineered around the <strong className="font-semibold text-black">DJI Zenmuse L2 LiDAR payload</strong> and aerospace-grade carbon fiber composite frame.
          </p>
          <p className="font-light text-lg md:text-xl text-ink/64 mt-4 leading-relaxed">
            Delivers frame-based point cloud acquisition with up to 240,000 pts/s and five simultaneous returns per pulse, paired seamlessly with Radhaswami ground stations and flagship mobile controllers.
          </p>
        </div>
      </div>

      {/* Semicircular Dome Arc Gauge HUD */}
      <div className="max-w-5xl mx-auto relative pt-12">
        <div className="flex justify-center">
          <svg
            id="gear-dome-arc"
            width="800"
            height="320"
            viewBox="0 0 800 320"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full max-w-[750px] overflow-visible"
          >
            {/* Outer Arc */}
            <path
              d="M 50 300 A 350 350 0 0 1 750 300"
              stroke="#24363F"
              strokeOpacity="0.25"
              strokeWidth="1.5"
              strokeDasharray="4 4"
            />
            {/* Inner Concentric Guide */}
            <path
              d="M 120 300 A 280 280 0 0 1 680 300"
              stroke="#24363F"
              strokeOpacity="0.12"
              strokeWidth="1"
            />
            {/* Calibrated Ticks */}
            <line x1="400" y1="20" x2="400" y2="40" stroke="#24363F" strokeWidth="2" strokeOpacity="0.6" />
            <line x1="190" y1="100" x2="205" y2="112" stroke="#24363F" strokeWidth="1.5" strokeOpacity="0.4" />
            <line x1="610" y1="100" x2="595" y2="112" stroke="#24363F" strokeWidth="1.5" strokeOpacity="0.4" />
            <line x1="80" y1="230" x2="98" y2="236" stroke="#24363F" strokeWidth="1.5" strokeOpacity="0.4" />
            <line x1="720" y1="230" x2="702" y2="236" stroke="#24363F" strokeWidth="1.5" strokeOpacity="0.4" />

            {/* Center HUD Icon */}
            <circle cx="400" cy="300" r="45" fill="#FDFDFD" stroke="#24363F" strokeWidth="1.5" />
            <circle cx="400" cy="300" r="38" fill="none" stroke="#24363F" strokeOpacity="0.2" strokeDasharray="3 3" />
            <text x="400" y="304" textAnchor="middle" fill="#24363F" fontSize="11" fontFamily="Proto Mono" letterSpacing="1">
              TECH
            </text>
          </svg>
        </div>

        {/* 3 Telemetry Data Columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 border-t border-b border-ink/24 divide-y md:divide-y-0 md:divide-x divide-ink/24 mt-6">
          {/* Col 1 */}
          <div className="flex flex-col items-center justify-center p-8 text-center">
            <span className="text-4xl md:text-5xl font-light text-[#24363F] tracking-tight">
              5 returns
            </span>
            <span className="font-mono text-xs text-ink/64 uppercase tracking-widest mt-2">
              [ MAX RETURNS PER PULSE ]
            </span>
          </div>

          {/* Col 2 */}
          <div className="flex flex-col items-center justify-center p-8 text-center">
            <span className="text-4xl md:text-5xl font-light text-[#24363F] tracking-tight">
              ±2 cm
            </span>
            <span className="font-mono text-xs text-ink/64 uppercase tracking-widest mt-2">
              [ DETECTION ACCURACY ]
            </span>
          </div>

          {/* Col 3 */}
          <div className="flex flex-col items-center justify-center p-8 text-center">
            <span className="text-4xl md:text-5xl font-light text-[#24363F] tracking-tight">
              450 m
            </span>
            <span className="font-mono text-xs text-ink/64 uppercase tracking-widest mt-2">
              [ OPERATIONAL RANGE ]
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
