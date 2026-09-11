import React, { useState, useRef } from 'react';
import { ShoppingBag, Truck, Sparkles, Volume2, VolumeX } from 'lucide-react';

interface HashgraphHeaderProps {
  cartCount: number;
  onOpenCart: () => void;
  onOpenTrackOrder: () => void;
  onScrollToSection: (id: string) => void;
}

export const HashgraphHeader: React.FC<HashgraphHeaderProps> = ({
  cartCount,
  onOpenCart,
  onOpenTrackOrder,
  onScrollToSection,
}) => {
  const [isSoundOn, setIsSoundOn] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Play subtle futuristic synth tone via Web Audio API on click
  const playChime = () => {
    try {
      if (!audioCtxRef.current) {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        audioCtxRef.current = new AudioContextClass();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(isSoundOn ? 440 : 880, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(isSoundOn ? 220 : 1320, ctx.currentTime + 0.15);

      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.2);
    } catch {
      // Ignore if blocked by browser autoplay policy
    }
  };

  const handleToggleSound = () => {
    const nextState = !isSoundOn;
    setIsSoundOn(nextState);
    playChime();
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50 px-6 sm:px-12 lg:px-16 py-6 sm:py-8 flex justify-between items-center bg-gradient-to-b from-[#000209]/90 via-[#000209]/40 to-transparent pointer-events-none select-none">
      
      {/* Left: Geometric Hashgraph-style Logo */}
      <a
        href="#"
        onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
        className="flex items-center gap-3.5 group pointer-events-auto cursor-pointer"
        aria-label="New Radhaswami Mobile Gallery Homepage"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 42 41"
          className="w-8 h-8 sm:w-9 sm:h-9 text-[#9BB8E1] transition-transform duration-700 group-hover:rotate-45"
          fill="currentColor"
        >
          <path d="M23.898 0c1.274 0 2.45.68 3.086 1.783l3.721 6.457c.182.315.277.666.285 1.018l9.318-.001c.824 0 1.338.893.924 1.605L29.826 30.488a3.56 3.56 0 0 1-3.08 1.772h-7.463c-.374 0-.734-.098-1.048-.275l-4.604 7.978a1.07 1.07 0 0 1-1.851 0L.477 20.385a3.56 3.56 0 0 1-.009-3.546l3.71-6.501c.19-.333.461-.602.781-.788l12.472 21.64c.195.338.475.61.804.795l12.47-21.61c.199-.345.294-.732.285-1.117L6.033 9.26c-.384 0-.753.103-1.074.29L.379 1.602A1.068 1.068 0 0 1 1.303 0z" />
        </svg>

        <div>
          <div className="font-mono text-sm sm:text-base font-bold tracking-widest text-white uppercase group-hover:text-[#9BB8E1] transition-colors">
            NEW RADHASWAMI
          </div>
          <div className="text-[9px] font-mono tracking-[0.25em] text-[#9BB8E1] uppercase">
            MOBILE GALLERY // VC FLAGSHIP
          </div>
        </div>
      </a>

      {/* Center Nav Anchors (Desktop) */}
      <nav className="hidden lg:flex items-center gap-8 font-mono text-xs text-[#9BB8E1]/80 pointer-events-auto">
        <button
          onClick={() => onScrollToSection('manifesto')}
          className="hover:text-white transition-colors cursor-pointer"
        >
          //01 MANIFESTO
        </button>
        <button
          onClick={() => onScrollToSection('portfolio')}
          className="hover:text-white transition-colors cursor-pointer"
        >
          //02 PORTFOLIO
        </button>
        <button
          onClick={() => onScrollToSection('capital')}
          className="hover:text-white transition-colors cursor-pointer"
        >
          //03 0% EMI
        </button>
        <button
          onClick={() => onScrollToSection('concierge')}
          className="hover:text-white transition-colors cursor-pointer"
        >
          //04 CONCIERGE
        </button>
      </nav>

      {/* Right: Sound Toggle + Cart + Order Tracking */}
      <div className="flex items-center gap-4 sm:gap-6 pointer-events-auto">
        
        {/* Sound Toggle (Signature HashgraphVC element) */}
        <button
          onClick={handleToggleSound}
          className="sound-toggle hover:opacity-80 transition-opacity"
          aria-label={isSoundOn ? 'Mute sound' : 'Enable audio feedback'}
        >
          <span className="sound-toggle__label-wrapper">
            <span className="sound-toggle__label-inner">
              <span className="text-gray-400">SOUND&nbsp;</span>
              <span className={isSoundOn ? 'text-[#9BB8E1] font-bold' : 'text-gray-500'}>
                {isSoundOn ? 'ON' : 'OFF'}
              </span>
            </span>
          </span>

          {/* Equalizer Waveform SVG */}
          <svg className="sound-toggle__svg" viewBox="0 0 24 7" fill="none">
            <path
              d="M0 3.5H2.4M3.6 1.5V5.5M6 0V7M8.4 2V5M10.8 3.5H13.2M15.6 1.5V5.5M18 0V7M20.4 2V5M22.8 3.5H24"
              stroke="currentColor"
              strokeWidth="1.2"
              className={isSoundOn ? 'animate-pulse' : 'opacity-40'}
            />
          </svg>
        </button>

        {/* Track Order Radar */}
        <button
          onClick={onOpenTrackOrder}
          className="hidden sm:flex items-center gap-1.5 text-xs font-mono text-gray-300 hover:text-white transition-colors"
        >
          <Truck className="w-3.5 h-3.5 text-[#9BB8E1]" />
          <span>TRACK</span>
        </button>

        {/* Shopping Bag */}
        <button
          onClick={onOpenCart}
          className="relative p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-[#9BB8E1]/20 text-white transition-all cursor-pointer"
          aria-label="Open Cart"
        >
          <ShoppingBag className="w-4 h-4 text-[#9BB8E1]" />
          {cartCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-[#9BB8E1] text-black text-[9px] font-mono font-bold flex items-center justify-center">
              {cartCount}
            </span>
          )}
        </button>

      </div>

    </header>
  );
};
