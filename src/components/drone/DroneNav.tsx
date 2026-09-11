import React, { useState } from 'react';
import { ShoppingBag, Volume2, VolumeX, Menu, X, ShieldCheck } from 'lucide-react';

interface DroneNavProps {
  cartCount: number;
  onOpenCart: () => void;
  onOpenTracking: () => void;
}

export const DroneNav: React.FC<DroneNavProps> = ({
  cartCount,
  onOpenCart,
  onOpenTracking,
}) => {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioCtx, setAudioCtx] = useState<AudioContext | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // High-tech Web Audio Synthesizer for ambient drone frequency
  const toggleAudio = () => {
    if (!isPlayingAudio) {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(110, ctx.currentTime); // Low cinematic hum
      gain.gain.setValueAtTime(0.04, ctx.currentTime);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();

      setAudioCtx(ctx);
      setIsPlayingAudio(true);
    } else {
      if (audioCtx) {
        audioCtx.close();
        setAudioCtx(null);
      }
      setIsPlayingAudio(false);
    }
  };

  return (
    <>
      <header
        id="site-nav"
        className="fixed top-0 left-0 right-0 z-50 bg-[#FDFDFD]/90 backdrop-blur-md border-b border-ink/12 px-6 py-4 flex items-center justify-between"
      >
        {/* Left: Brand / Emblem */}
        <div className="flex items-center gap-4">
          <a href="#hero" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded bg-[#24363F] flex items-center justify-center text-white font-mono font-bold text-xs tracking-tighter transition-transform group-hover:scale-105">
              NRM
            </div>
            <div className="flex flex-col">
              <span className="font-sans font-semibold text-sm tracking-tight text-[#24363F]">
                New Radhaswami
              </span>
              <span className="text-[11px] font-mono text-ink/64 uppercase tracking-wider">
                Mobile & Aerial Gallery
              </span>
            </div>
          </a>

          <div className="hidden lg:block w-1 h-1 rounded-full bg-ink/48 mx-2" />
          <span className="hidden lg:inline-block text-xs font-mono text-ink/64 tracking-wide">
            LiDAR Drone & Flagship Systems
          </span>
        </div>

        {/* Center: Navigation Anchors */}
        <nav className="hidden md:flex items-center gap-8">
          <a
            href="#intro-section"
            className="text-xs font-mono uppercase tracking-widest text-ink/64 hover:text-ink transition-colors"
          >
            //01 Overview
          </a>
          <a
            href="#gear"
            className="text-xs font-mono uppercase tracking-widest text-ink/64 hover:text-ink transition-colors"
          >
            //02 Gear Specs
          </a>
          <a
            href="#solutions"
            className="text-xs font-mono uppercase tracking-widest text-ink/64 hover:text-ink transition-colors"
          >
            //03 Solutions
          </a>
          <a
            href="#capabilities"
            className="text-xs font-mono uppercase tracking-widest text-ink/64 hover:text-ink transition-colors"
          >
            //04 Capabilities
          </a>
          <a
            href="#gallery-store"
            className="text-xs font-mono uppercase tracking-widest text-ink font-bold hover:text-accent transition-colors"
          >
            //05 Hardware Store
          </a>
        </nav>

        {/* Right: Actions */}
        <div className="flex items-center gap-3">
          {/* Audio Synthesizer Toggle */}
          <button
            onClick={toggleAudio}
            title={isPlayingAudio ? 'Mute Atmospheric Audio' : 'Play Drone Soundscape'}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-ink/24 bg-ink/8 hover:bg-ink/12 transition-colors cursor-pointer text-xs font-mono text-ink"
          >
            {isPlayingAudio ? <Volume2 size={13} /> : <VolumeX size={13} />}
            <span className="hidden sm:inline">
              {isPlayingAudio ? 'Audio ON' : 'Audio OFF'}
            </span>
            <div className="flex items-end gap-0.5 h-3">
              <span className={`sound-bar ${isPlayingAudio ? 'playing' : ''}`} />
              <span className={`sound-bar ${isPlayingAudio ? 'playing' : ''}`} />
              <span className={`sound-bar ${isPlayingAudio ? 'playing' : ''}`} />
              <span className={`sound-bar ${isPlayingAudio ? 'playing' : ''}`} />
            </div>
          </button>

          {/* Order Tracking */}
          <button
            onClick={onOpenTracking}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded border border-ink/24 text-xs font-mono text-ink hover:bg-ink/8 transition-colors cursor-pointer"
          >
            <ShieldCheck size={14} />
            <span>Track Order</span>
          </button>

          {/* Cart Trigger */}
          <button
            onClick={onOpenCart}
            className="relative flex items-center gap-2 px-3.5 py-1.5 rounded bg-[#24363F] text-white hover:bg-[#162228] transition-colors text-xs font-mono uppercase cursor-pointer"
          >
            <ShoppingBag size={14} />
            <span>Cart</span>
            {cartCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-blue-500 text-white flex items-center justify-center text-[10px] font-bold">
                {cartCount}
              </span>
            )}
          </button>

          {/* Mobile Menu Trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-1.5 rounded border border-ink/24 text-ink cursor-pointer"
          >
            {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </header>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-x-0 top-[65px] bg-white border-b border-ink/24 z-40 p-6 flex flex-col gap-4 shadow-xl md:hidden">
          <a
            href="#intro-section"
            onClick={() => setMobileMenuOpen(false)}
            className="text-sm font-mono text-ink py-1 border-b border-ink/12"
          >
            //01 Overview
          </a>
          <a
            href="#gear"
            onClick={() => setMobileMenuOpen(false)}
            className="text-sm font-mono text-ink py-1 border-b border-ink/12"
          >
            //02 Gear Specs
          </a>
          <a
            href="#solutions"
            onClick={() => setMobileMenuOpen(false)}
            className="text-sm font-mono text-ink py-1 border-b border-ink/12"
          >
            //03 Solutions
          </a>
          <a
            href="#capabilities"
            onClick={() => setMobileMenuOpen(false)}
            className="text-sm font-mono text-ink py-1 border-b border-ink/12"
          >
            //04 Capabilities
          </a>
          <a
            href="#gallery-store"
            onClick={() => setMobileMenuOpen(false)}
            className="text-sm font-mono font-bold text-ink py-1 border-b border-ink/12"
          >
            //05 Hardware Store
          </a>
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenTracking();
            }}
            className="text-left text-sm font-mono text-blue-600 py-1"
          >
            Track Verified Order
          </button>
        </div>
      )}
    </>
  );
};
