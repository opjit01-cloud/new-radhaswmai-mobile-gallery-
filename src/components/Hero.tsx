import React from 'react';
import { ArrowRight, ShieldCheck, Sparkles, MessageCircle, CreditCard, Award, Flame } from 'lucide-react';

interface HeroProps {
  onExplore: () => void;
  onOpenEmi: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onExplore, onOpenEmi }) => {
  return (
    <section className="relative overflow-hidden pt-12 pb-20 px-4 md:px-8 border-b border-white/5">
      {/* Background glowing gradients */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-r from-gold/15 via-[#00F2FE]/10 to-transparent blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Top Floating Badge */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-gold/40 bg-gold/5 shadow-glow-gold">
            <Flame className="w-4 h-4 text-gold animate-bounce" />
            <span className="text-xs font-mono font-medium text-gold tracking-wider uppercase">
              NEW RADHASWAMI MOBILE GALLERY // 2026 EDITION
            </span>
          </div>
        </div>

        {/* Big Main Headline */}
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-display font-extrabold text-white tracking-tight leading-[1.08]">
            The Pinnacle of <span className="bg-gradient-to-r from-gold-light via-gold to-gold-dark bg-clip-text text-transparent">Mobile Luxury</span> &amp; Innovation.
          </h1>
          <p className="mt-6 text-base sm:text-xl text-gray-300 font-light max-w-2xl mx-auto leading-relaxed">
            Welcome to <strong className="text-white font-semibold">New Radhaswami Mobile Gallery</strong>. Your premier destination for flagship smartphones, audiophile sound systems, titanium smartwatches, and curated accessories.
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={onExplore}
            className="flex items-center gap-2.5 bg-gradient-to-r from-gold to-[#A47D08] hover:from-[#E5C158] hover:to-[#B3880E] text-black font-bold text-sm py-3.5 px-8 rounded-full shadow-glow-gold transition-all duration-200 active:scale-95 cursor-pointer"
          >
            <span>Explore Flagship Devices</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <a
            href="https://wa.me/919691011335?text=Hello%20New%20Radhaswami%20Mobile%20Gallery,%20I%20want%20to%20order%20a%20new%20phone"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2.5 bg-[#1F2B20] hover:bg-[#28382A] border border-emerald-500/40 text-emerald-400 font-semibold text-sm py-3.5 px-7 rounded-full transition-all active:scale-95 cursor-pointer"
          >
            <MessageCircle className="w-4 h-4 text-emerald-400" />
            <span>Order via WhatsApp</span>
          </a>

          <button
            onClick={onOpenEmi}
            className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-gray-200 font-medium text-sm py-3.5 px-6 rounded-full transition-all cursor-pointer"
          >
            <CreditCard className="w-4 h-4 text-gold" />
            <span>0% Interest EMI</span>
          </button>
        </div>

        {/* Key Trust Stats Bar */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto pt-8 border-t border-white/10">
          <div className="p-4 rounded-xl glass-panel text-center">
            <div className="flex justify-center mb-1 text-gold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div className="text-lg font-bold text-white">100% Genuine</div>
            <div className="text-[11px] font-mono text-gray-400">Official Brand Sealed Pack</div>
          </div>

          <div className="p-4 rounded-xl glass-panel text-center">
            <div className="flex justify-center mb-1 text-emerald-400">
              <Award className="w-5 h-5" />
            </div>
            <div className="text-lg font-bold text-white">1-Year Warranty</div>
            <div className="text-[11px] font-mono text-gray-400">Brand Authorized Service</div>
          </div>

          <div className="p-4 rounded-xl glass-panel text-center">
            <div className="flex justify-center mb-1 text-cyan-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div className="text-lg font-bold text-white">Best Exchange</div>
            <div className="text-[11px] font-mono text-gray-400">Instant Trade-in Bonus</div>
          </div>

          <div className="p-4 rounded-xl glass-panel text-center">
            <div className="flex justify-center mb-1 text-white">
              <CreditCard className="w-5 h-5" />
            </div>
            <div className="text-lg font-bold text-white">No-Cost EMI</div>
            <div className="text-[11px] font-mono text-gray-400">Bajaj &amp; Credit Cards</div>
          </div>
        </div>

      </div>
    </section>
  );
};
