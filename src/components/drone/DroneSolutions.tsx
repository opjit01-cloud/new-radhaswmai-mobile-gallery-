import React, { useState } from 'react';

export const DroneSolutions: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'energy' | 'infrastructure' | 'industry' | 'geospatial'>('energy');

  const tabs = [
    {
      id: 'energy',
      label: 'Energy',
      video: '/solutions/energy.mp4',
      headline: 'Power grids, wind turbines, and solar arrays span thousands of acres.',
      description:
        'LiDAR-equipped UAVs eliminate access risk while cutting inspection cycles from weeks to hours with millimeter precision.',
      metrics: ['98.4% Outage Reduction', '4K Thermal Spectrum', 'Autonomous Patrol'],
    },
    {
      id: 'infrastructure',
      label: 'Infrastructure',
      video: '/solutions/infrastructure.mp4',
      headline: 'Bridges, viaducts, and railways require sub-millimeter deformation checks.',
      description:
        'Continuous high-density point clouds expose micro-fissures and settling shifts without halting traffic or human operations.',
      metrics: ['±2mm Precision', 'Digital Twin Output', 'Continuous Drift Log'],
    },
    {
      id: 'industry',
      label: 'Industry',
      video: '/solutions/industry.mp4',
      headline: 'Refineries, chemical plants, and heavy fabrication facilities.',
      description:
        'Aevion & Radhaswami enterprise aerial units navigate GPS-denied environments with autonomous obstacle avoidance.',
      metrics: ['Class 1 Div 2 Ready', 'Non-Destructive Testing', 'Zero Plant Downtime'],
    },
    {
      id: 'geospatial',
      label: 'Geospatial',
      video: '/solutions/geospatial.mp4',
      headline: 'High-density topographical terrain capture and volumetric modeling.',
      description:
        'Generates millions of georeferenced coordinates per flight for urban planning, mining volumes, and forestry density.',
      metrics: ['240,000 pts/sec', 'WGS84 Georeferenced', 'Sub-Canopy Penetration'],
    },
  ];

  const current = tabs.find((t) => t.id === activeTab) || tabs[0];

  return (
    <section id="solutions" className="bg-[#FDFDFD] px-6 py-28 border-t border-ink/24">
      {/* Top Header */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-end justify-between border-b border-ink/24 pb-12">
        <h2 className="text-massive font-light text-[#24363F] tracking-tighter select-none">
          Solutions
        </h2>
        <div className="flex items-center gap-3 mt-4 md:mt-0">
          <span className="w-8 h-8 rounded-full border border-ink/24 flex items-center justify-center font-mono text-sm text-ink/64">
            4
          </span>
          <span className="font-mono text-xs text-ink/64 uppercase tracking-widest">
            // Operational Deployments
          </span>
        </div>
      </div>

      {/* Tabs Row */}
      <div className="max-w-7xl mx-auto pt-8 border-b border-ink/12 overflow-x-auto">
        <div className="flex items-center gap-8 md:gap-16 pb-4">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`font-light text-2xl md:text-4xl pb-2 transition-all cursor-pointer relative whitespace-nowrap ${
                activeTab === tab.id ? 'text-[#24363F] font-normal' : 'text-ink/32 hover:text-ink/60'
              }`}
            >
              {tab.label}
              {activeTab === tab.id && (
                <span className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#24363F]" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content: Video + Details */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 pt-12 items-center">
        <div className="lg:col-span-5 flex flex-col justify-between gap-8">
          <div>
            <h3 className="text-2xl md:text-3xl font-light text-[#24363F] leading-snug">
              {current.headline}
            </h3>
            <p className="text-base text-ink/64 mt-4 leading-relaxed font-light">
              {current.description}
            </p>
          </div>

          <div className="space-y-3 pt-6 border-t border-ink/12">
            {current.metrics.map((m, idx) => (
              <div key={idx} className="flex items-center gap-3 font-mono text-xs text-ink/80">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                <span>{m}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-7">
          <div className="relative aspect-video w-full rounded-lg overflow-hidden border border-ink/24 shadow-xl bg-black">
            <video
              key={current.video}
              autoPlay
              muted
              loop
              playsInline
              src={current.video}
              className="w-full h-full object-cover transition-opacity duration-300"
            />
            <div className="absolute top-4 left-4 px-3 py-1 rounded bg-black/60 backdrop-blur-sm text-white font-mono text-xs uppercase">
              SECTOR // {current.label}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
