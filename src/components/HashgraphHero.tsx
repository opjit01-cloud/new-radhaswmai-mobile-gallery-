import React, { useEffect, useRef } from 'react';
import { ArrowDown, MessageCircle, Sparkles } from 'lucide-react';
import videoSrc from '../assets/gimble-video.mp4';
import { HashgraphButton } from './HashgraphButton';

interface HashgraphHeroProps {
  onExplore: () => void;
  onOpenEmi: () => void;
}

export const HashgraphHero: React.FC<HashgraphHeroProps> = ({ onExplore, onOpenEmi }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const targetTimeRef = useRef<number>(5.0);
  const currentTimeRef = useRef<number>(5.0);
  const LERP_FACTOR = 0.18;

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadedMetadata = () => {
      if (video.duration) {
        const mid = video.duration * 0.5;
        targetTimeRef.current = mid;
        currentTimeRef.current = mid;
        video.currentTime = mid;
      }
    };

    if (video.readyState >= 1) {
      handleLoadedMetadata();
    } else {
      video.addEventListener('loadedmetadata', handleLoadedMetadata);
    }

    // Direct 1:1 Screen Coordinate Mapping
    const handleMouseMove = (e: MouseEvent) => {
      if (!video.duration) return;
      const ratio = Math.max(0, Math.min(1, e.clientX / window.innerWidth));
      targetTimeRef.current = ratio * video.duration;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!video.duration || e.touches.length === 0) return;
      const ratio = Math.max(0, Math.min(1, e.touches[0].clientX / window.innerWidth));
      targetTimeRef.current = ratio * video.duration;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });

    let rafId: number;
    const animate = () => {
      if (video && video.duration) {
        currentTimeRef.current += (targetTimeRef.current - currentTimeRef.current) * LERP_FACTOR;
        const safe = Math.max(0, Math.min(video.duration, currentTimeRef.current));
        if (!video.seeking && Math.abs(video.currentTime - safe) > 0.006) {
          if ('fastSeek' in video && typeof (video as any).fastSeek === 'function') {
            (video as any).fastSeek(safe);
          } else {
            video.currentTime = safe;
          }
        }
      }
      rafId = requestAnimationFrame(animate);
    };

    rafId = requestAnimationFrame(animate);

    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <section className="relative w-full h-[100svh] overflow-hidden flex flex-col justify-end px-6 sm:px-12 lg:px-16 pb-12 sm:pb-16 bg-[#000209]">
      
      {/* Background Interactive Gimble Video Layer */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-40">
        <video
          ref={videoRef}
          src={videoSrc}
          muted
          playsInline
          preload="auto"
          className="w-full h-full object-cover object-center filter contrast-125 brightness-90"
        />
        {/* Multilayer Dark Vignette for 100% UI Contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#000209] via-[#000209]/60 to-[#000209]/90" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#000209] via-transparent to-[#000209]" />
      </div>

      {/* Hero Content Container (HashgraphVC .home-hero layout) */}
      <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col lg:flex-row lg:items-end justify-between gap-10">
        
        {/* Main Title (Offset & Massive) */}
        <div>
          <div className="inline-flex items-center gap-2 mb-4 text-xs font-mono tracking-widest text-[#9BB8E1] uppercase">
            <span className="w-2 h-2 rounded-full bg-[#9BB8E1] animate-ping" />
            <span>NEW RADHASWAMI // 2026 EDITION</span>
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-display font-extrabold text-white tracking-tight leading-[1.04]">
            The next wave<br />
            <span className="text-[#9BB8E1]">of mobile luxury.</span>
          </h1>

          <p className="mt-6 text-sm sm:text-base text-gray-300 font-light max-w-xl leading-relaxed">
            Where sealed-pack Apple &amp; Samsung flagships, precision 3-axis gyro stabilizers, and audiophile sound meet zero-compromise institutional trust.
          </p>

          {/* Action CTAs */}
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <HashgraphButton onClick={onExplore} hoverText="Explore Devices">
              Explore Portfolio
            </HashgraphButton>

            <HashgraphButton onClick={onOpenEmi} hoverText="Calculate EMI" small>
              0% No-Cost EMI
            </HashgraphButton>

            <a
              href="https://wa.me/919691011335?text=Hello%20New%20Radhaswami%20Mobile%20Gallery,%20I%20want%20to%20inquire%20about%20flagship%20inventory"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-emerald-400 hover:text-emerald-300 transition-colors py-2 px-3"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp Concierge</span>
            </a>
          </div>
        </div>

        {/* Right Scroll Indicator with Animated Dual Dash Line */}
        <div 
          onClick={onExplore}
          className="hidden md:flex items-center gap-3 cursor-pointer group select-none self-end pb-2"
        >
          <span className="text-[11px] font-mono tracking-widest text-gray-400 uppercase text-right group-hover:text-white transition-colors max-w-[120px]">
            Scroll down to discover more
          </span>
          <span className="home-hero__btn-line" />
        </div>

      </div>

    </section>
  );
};
