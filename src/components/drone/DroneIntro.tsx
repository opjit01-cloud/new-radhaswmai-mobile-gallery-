import React, { useState } from 'react';

export const DroneIntro: React.FC = () => {
  const [activeVideo, setActiveVideo] = useState<string>('/intro/video1.mp4');
  const [activeLabel, setActiveLabel] = useState<string>('Cracks Detection');

  const videoTriggers = [
    {
      word: 'cracks',
      video: '/intro/video1.mp4',
      label: 'Surface & Micro-Cracks Detection',
    },
    {
      word: 'deformations',
      video: '/intro/video2.mp4',
      label: 'Sub-Millimeter Structural Deformations',
    },
    {
      word: 'structural risks',
      video: '/intro/video3.mp4',
      label: 'High-Altitude Infrastructure Risks',
    },
  ];

  return (
    <section id="intro-section" className="bg-[#FDFDFD] px-6 py-32 border-t border-b border-ink/12">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left: Interactive Interactive Scrollytelling Typography */}
        <div className="lg:col-span-7 flex flex-col gap-8">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#24363F]" />
            <span className="font-mono text-xs text-ink/64 uppercase tracking-widest">
              //01 Core Optical Diagnostics
            </span>
          </div>

          <p className="font-light text-3xl sm:text-4xl lg:text-5xl leading-tight text-[#24363F] tracking-tight">
            Detecting{' '}
            <span
              onMouseEnter={() => {
                setActiveVideo('/intro/video1.mp4');
                setActiveLabel('Surface & Micro-Cracks Detection');
              }}
              className={`video-scrub-word font-normal cursor-pointer underline decoration-2 decoration-blue-500 underline-offset-8 transition-colors ${
                activeVideo === '/intro/video1.mp4' ? 'text-black font-semibold' : 'text-ink/70'
              }`}
            >
              cracks
            </span>
            ,{' '}
            <span
              onMouseEnter={() => {
                setActiveVideo('/intro/video2.mp4');
                setActiveLabel('Sub-Millimeter Structural Deformations');
              }}
              className={`video-scrub-word font-normal cursor-pointer underline decoration-2 decoration-blue-500 underline-offset-8 transition-colors ${
                activeVideo === '/intro/video2.mp4' ? 'text-black font-semibold' : 'text-ink/70'
              }`}
            >
              deformations
            </span>{' '}
            and{' '}
            <span
              onMouseEnter={() => {
                setActiveVideo('/intro/video3.mp4');
                setActiveLabel('High-Altitude Infrastructure Risks');
              }}
              className={`video-scrub-word font-normal cursor-pointer underline decoration-2 decoration-blue-500 underline-offset-8 transition-colors ${
                activeVideo === '/intro/video3.mp4' ? 'text-black font-semibold' : 'text-ink/70'
              }`}
            >
              structural risks
            </span>{' '}
            before they become catastrophic failures.
          </p>

          <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-ink/64 pt-4 border-t border-ink/12">
            <span>HOVER WORDS TO STREAM FLIGHT TELEMETRY FEED</span>
            <span>•</span>
            <span className="text-blue-600 font-semibold">{activeLabel}</span>
          </div>
        </div>

        {/* Right: Live Scrubbed Video Display */}
        <div className="lg:col-span-5">
          <div className="relative aspect-video w-full overflow-hidden rounded-lg border border-ink/24 shadow-lg bg-black">
            <video
              key={activeVideo}
              autoPlay
              muted
              loop
              playsInline
              src={activeVideo}
              className="w-full h-full object-cover transition-opacity duration-500"
            />
            {/* High-tech HUD Overlay */}
            <div className="absolute top-3 left-3 flex items-center gap-2 px-2.5 py-1 rounded bg-black/60 backdrop-blur-sm text-white font-mono text-[10px] uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
              LIVE TELEMETRY
            </div>

            <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded bg-black/60 backdrop-blur-sm text-white font-mono text-[10px]">
              240,000 PTS/SEC
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
