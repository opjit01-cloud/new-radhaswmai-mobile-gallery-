import React, { useEffect, useRef, useState } from 'react';
import { ArrowRight, ShieldCheck, Sparkles, MessageCircle, CreditCard, Award, Flame, Crosshair, RefreshCw, Compass, Sliders, ChevronRight } from 'lucide-react';
import videoSrc from '../assets/gimble-video.mp4';
import { Product } from '../data/products';

interface GimbleHeroStageProps {
  onExplore: () => void;
  onOpenEmi: () => void;
  onOpenCompare: () => void;
  onAddToCart: (product: Product, selectedColor: string) => void;
}

export const GimbleHeroStage: React.FC<GimbleHeroStageProps> = ({
  onExplore,
  onOpenEmi,
  onOpenCompare,
  onAddToCart,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const targetTimeRef = useRef<number>(5.0);
  const currentTimeRef = useRef<number>(5.0);
  const [isInverted, setIsInverted] = useState<boolean>(false);
  const [telemetry, setTelemetry] = useState({ panAngle: 0, progressPercent: 50, isReady: false });

  const LERP_FACTOR = 0.18;

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadedMetadata = () => {
      if (video.duration) {
        const midTime = video.duration * 0.5;
        targetTimeRef.current = midTime;
        currentTimeRef.current = midTime;
        video.currentTime = midTime;
        setTelemetry(prev => ({ ...prev, isReady: true }));
      }
    };

    if (video.readyState >= 1) {
      handleLoadedMetadata();
    } else {
      video.addEventListener('loadedmetadata', handleLoadedMetadata);
    }

    // Direct 1:1 Mouse Cursor Screen Tracking
    const handleMouseMove = (e: MouseEvent) => {
      if (!video.duration) return;
      const rawRatio = Math.max(0, Math.min(1, e.clientX / window.innerWidth));
      const ratio = isInverted ? (1 - rawRatio) : rawRatio;
      targetTimeRef.current = ratio * video.duration;
    };

    // Touch Move Support for Mobile Devices
    const handleTouchMove = (e: TouchEvent) => {
      if (!video.duration || e.touches.length === 0) return;
      const rawRatio = Math.max(0, Math.min(1, e.touches[0].clientX / window.innerWidth));
      const ratio = isInverted ? (1 - rawRatio) : rawRatio;
      targetTimeRef.current = ratio * video.duration;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });

    // Smooth 60fps LERP Animation Loop with Decoder Protection
    let rafId: number;
    const updateLoop = () => {
      if (video && video.duration) {
        // LERP toward target time
        currentTimeRef.current += (targetTimeRef.current - currentTimeRef.current) * LERP_FACTOR;
        const safeTime = Math.max(0, Math.min(video.duration, currentTimeRef.current));

        // Update video currentTime if not seeking
        if (!video.seeking && Math.abs(video.currentTime - safeTime) > 0.006) {
          if ('fastSeek' in video && typeof (video as any).fastSeek === 'function') {
            (video as any).fastSeek(safeTime);
          } else {
            video.currentTime = safeTime;
          }
        }

        // Calculate real-time telemetry HUD
        const currentProgress = safeTime / video.duration;
        const panAngle = Math.round((currentProgress - 0.5) * 90); // -45 deg to +45 deg
        const progressPercent = Math.round(currentProgress * 100);

        setTelemetry(prev => ({
          ...prev,
          panAngle,
          progressPercent,
          isReady: true,
        }));
      }

      rafId = requestAnimationFrame(updateLoop);
    };

    rafId = requestAnimationFrame(updateLoop);

    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      cancelAnimationFrame(rafId);
    };
  }, [isInverted, LERP_FACTOR]);

  const handleResetCenter = () => {
    if (videoRef.current?.duration) {
      targetTimeRef.current = videoRef.current.duration * 0.5;
    }
  };

  return (
    <section className="relative overflow-hidden pt-8 pb-16 px-4 md:px-8 border-b border-white/10 bg-[#06080C]">
      
      {/* Background Interactive Gimble Video Stage with Calibrated Vignettes */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none opacity-45 mix-blend-screen">
        <video
          ref={videoRef}
          src={videoSrc}
          muted
          playsInline
          preload="auto"
          className="w-full h-full object-cover object-center scale-105 filter contrast-125 brightness-95"
        />
        {/* Multilayer linear & radial gradients for 100% UI readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#06080C] via-[#06080C]/70 to-[#06080C]/85" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#06080C] via-transparent to-[#06080C]/80" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">

        {/* Top Gimbal Telemetry Status Bar */}
        <div className="mb-8 p-3.5 sm:p-4 rounded-2xl bg-[#0C1017]/90 backdrop-blur-md border border-white/10 flex flex-wrap items-center justify-between gap-4 shadow-2xl">
          
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Crosshair className="w-4 h-4 animate-spin-slow" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-white tracking-wide uppercase font-mono">
                  3-AXIS GIMBAL SERVO RADAR
                </span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-mono font-bold">
                  ACTIVE TRACKING
                </span>
              </div>
              <p className="text-[11px] text-gray-400 font-sans hidden sm:block">
                Move mouse horizontally across the screen to dynamically rotate the gimbal optical sensor.
              </p>
            </div>
          </div>

          {/* Telemetry Readouts & Quick Controls */}
          <div className="flex items-center gap-3 text-xs font-mono">
            <div className="flex items-center gap-2 bg-[#080B10] px-3 py-1.5 rounded-xl border border-white/10 text-gray-300">
              <Compass className="w-3.5 h-3.5 text-cyan-400" />
              <span>PAN:</span>
              <span className={`font-bold ${telemetry.panAngle === 0 ? 'text-emerald-400' : 'text-white'}`}>
                {telemetry.panAngle > 0 ? `+${telemetry.panAngle}°` : `${telemetry.panAngle}°`}
              </span>
              <span className="text-gray-500">|</span>
              <span className="text-gray-400">{telemetry.progressPercent}%</span>
            </div>

            <button
              onClick={() => setIsInverted(!isInverted)}
              className={`px-3 py-1.5 rounded-xl border transition-all cursor-pointer ${
                isInverted
                  ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50'
                  : 'bg-white/5 text-gray-400 hover:text-white border-white/10'
              }`}
              title="Invert mouse horizontal tracking axis"
            >
              <span>{isInverted ? 'Axis: Inverted' : 'Axis: Normal'}</span>
            </button>

            <button
              onClick={handleResetCenter}
              className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-400 hover:text-white transition-colors cursor-pointer"
              title="Recenter Gimbal Forward"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>

        {/* Main Hero Showcase Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Left Hero Content (7 Cols) - 100% Contrast & Legibility */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/20 w-fit mb-5 shadow-sm">
              <Flame className="w-3.5 h-3.5 text-white animate-pulse" />
              <span className="text-[11px] font-mono uppercase tracking-widest text-white font-semibold">
                NEW RADHASWAMI MOBILE GALLERY // 2026 EDITION
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-extrabold text-white tracking-tight leading-[1.08]">
              Kinetic Precision. <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-white via-[#E2E8F0] to-[#94A3B8] bg-clip-text text-transparent">
                Flagship Mastery.
              </span>
            </h1>

            <p className="mt-5 text-base sm:text-lg text-gray-200 font-light leading-relaxed max-w-2xl drop-shadow-md">
              India's premier destination for cinematic camera stabilizers, titanium smartphones, studio noise-canceling acoustics, and curated gear. Hand-inspected, 100% sealed Indian units with official brand tax invoicing and 0% No-Cost EMI.
            </p>

            {/* Quick Metrics Bar */}
            <div className="mt-6 grid grid-cols-3 gap-3 max-w-lg">
              <div className="p-3 rounded-2xl bg-[#0E131E]/90 border border-white/10 backdrop-blur-sm">
                <div className="text-[10px] font-mono text-cyan-400 uppercase">OPTICAL SENSING</div>
                <div className="text-sm font-bold text-white mt-0.5">3-Axis Gimbal</div>
                <div className="text-[10px] text-gray-400">Zero Blur Stabilizer</div>
              </div>

              <div className="p-3 rounded-2xl bg-[#0E131E]/90 border border-white/10 backdrop-blur-sm">
                <div className="text-[10px] font-mono text-white uppercase">FLAGSHIP CHIP</div>
                <div className="text-sm font-bold text-white mt-0.5">3nm Titanium</div>
                <div className="text-[10px] text-gray-400">A18 Pro &amp; 8 Elite</div>
              </div>

              <div className="p-3 rounded-2xl bg-[#0E131E]/90 border border-white/10 backdrop-blur-sm">
                <div className="text-[10px] font-mono text-emerald-400 uppercase">PAPERLESS EMI</div>
                <div className="text-sm font-bold text-white mt-0.5">0% Interest</div>
                <div className="text-[10px] text-gray-400">Bajaj &amp; HDFC Direct</div>
              </div>
            </div>

            {/* Primary Action Buttons */}
            <div className="mt-8 flex flex-wrap items-center gap-3.5">
              <button
                onClick={onExplore}
                className="flex items-center gap-2.5 bg-white hover:bg-neutral-200 text-black font-extrabold text-xs sm:text-sm py-3.5 px-7 rounded-xl shadow-lg transition-all active:scale-95 cursor-pointer"
              >
                <span>Explore Flagship Inventory</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <a
                href="https://wa.me/919691011335?text=Hello%20New%20Radhaswami%20Mobile%20Gallery!%20I%20want%20to%20order%20a%20flagship%20device%20or%20gimbal%20stabilizer."
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 bg-[#1B2921] hover:bg-[#22352B] border border-emerald-500/40 text-emerald-400 font-semibold text-xs sm:text-sm py-3.5 px-6 rounded-xl transition-all cursor-pointer active:scale-95"
              >
                <MessageCircle className="w-4 h-4 text-emerald-400" />
                <span>WhatsApp VIP Order</span>
              </a>

              <button
                onClick={onOpenEmi}
                className="flex items-center gap-2 bg-[#121722]/90 hover:bg-[#1A2230] border border-white/15 text-gray-300 hover:text-white text-xs sm:text-sm py-3.5 px-5 rounded-xl transition-all cursor-pointer"
              >
                <CreditCard className="w-4 h-4 text-white" />
                <span>0% EMI Studio</span>
              </button>
            </div>

          </div>

          {/* Right Hero Interactive Viewport (5 Cols) */}
          <div className="lg:col-span-5 flex flex-col items-center">
            
            {/* Live Interactive Gimbal Stage Card */}
            <div className="relative w-full max-w-md aspect-square rounded-3xl overflow-hidden border border-white/20 bg-gradient-to-b from-[#101622]/95 to-[#080B10]/95 p-6 flex flex-col justify-between shadow-2xl backdrop-blur-md group">
              
              {/* Header Badges */}
              <div className="flex items-center justify-between z-10">
                <span className="px-3 py-1 rounded-full bg-black/70 border border-white/10 text-[10px] font-mono text-cyan-400 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                  GIMBAL RADAR
                </span>
                <span className="px-3 py-1 rounded-full bg-white/10 border border-white/20 text-[10px] font-mono text-white font-semibold">
                  LIVE GYRO VIEW
                </span>
              </div>

              {/* Center Spotlight Video Preview */}
              <div className="relative w-full h-[220px] my-auto rounded-2xl overflow-hidden border border-white/10 bg-black/60 flex items-center justify-center shadow-inner">
                <video
                  src={videoSrc}
                  muted
                  playsInline
                  autoPlay
                  loop
                  className="w-full h-full object-cover object-center filter contrast-125"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-3">
                  <div className="text-xs text-white font-mono flex items-center justify-between w-full">
                    <span>360° CINEMATIC GYRO</span>
                    <span className="text-white">SMOOTH STABILIZER</span>
                  </div>
                </div>
              </div>

              {/* Bottom Quick Feature Chips */}
              <div className="grid grid-cols-2 gap-2 pt-3 border-t border-white/10 text-center text-xs">
                <button
                  onClick={onOpenCompare}
                  className="py-2 px-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white font-semibold transition-all cursor-pointer flex items-center justify-center gap-1"
                >
                  <span>Compare Flagships</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={onExplore}
                  className="py-2 px-3 rounded-xl bg-white hover:bg-neutral-200 text-black font-bold transition-all cursor-pointer"
                >
                  <span>Browse Gear</span>
                </button>
              </div>

            </div>

            {/* Instruction Tip */}
            <div className="mt-3 text-center text-xs font-mono text-gray-400">
              💡 Track mouse across viewport to steer the 3-axis stabilizer
            </div>

          </div>

        </div>

        {/* Store Trust Assurance Bar */}
        <div className="mt-14 pt-8 border-t border-white/10 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-[#0C1017]/90 border border-white/5 flex items-start gap-3 backdrop-blur-sm">
            <ShieldCheck className="w-5 h-5 text-white shrink-0 mt-0.5" />
            <div>
              <div className="text-xs font-bold text-white">100% Sealed Indian Units</div>
              <div className="text-[11px] text-gray-400 mt-0.5">Original brand invoice &amp; 1-year authorized warranty.</div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#0C1017]/90 border border-white/5 flex items-start gap-3 backdrop-blur-sm">
            <CreditCard className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
            <div>
              <div className="text-xs font-bold text-white">0% No-Cost EMI Online &amp; In-Store</div>
              <div className="text-[11px] text-gray-400 mt-0.5">Instant paperless approval via Bajaj, HDFC &amp; ICICI.</div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#0C1017]/90 border border-white/5 flex items-start gap-3 backdrop-blur-sm">
            <Award className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <div className="text-xs font-bold text-white">2-Hour Express Dispatch</div>
              <div className="text-[11px] text-gray-400 mt-0.5">BlueDart Priority Express Transit across MP &amp; India.</div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#0C1017]/90 border border-white/5 flex items-start gap-3 backdrop-blur-sm">
            <Sparkles className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
            <div>
              <div className="text-xs font-bold text-white">Instant Trade-in Bonus</div>
              <div className="text-[11px] text-gray-400 mt-0.5">Up to ₹12,000 extra credit on your old smartphone.</div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
