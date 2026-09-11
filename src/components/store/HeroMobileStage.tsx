import React from 'react';
import { GimbalHeroVideo } from '../GimbalHeroVideo';
import { ShieldCheck, Truck, Sparkles, Award, ArrowUpRight } from 'lucide-react';
import { MagneticButton } from '../common/MagneticButton';
import { ShinyText } from '../reactbits/ShinyText';
import { DecryptedText } from '../reactbits/DecryptedText';
import { BlurText } from '../reactbits/BlurText';
import { CountUp } from '../reactbits/CountUp';
import { StarBorder } from '../reactbits/StarBorder';
import { ClickSpark } from '../reactbits/ClickSpark';
import { PerspectiveGrid } from '../reactbits/PerspectiveGrid';
import { SplitText } from '../reactbits/SplitText';
import { GlareCard } from '../reactbits/GlareCard';

interface HeroMobileStageProps {
  onExploreClick: () => void;
  onSelectHandset: (brand: string) => void;
}

export const HeroMobileStage: React.FC<HeroMobileStageProps> = ({
  onExploreClick,
  onSelectHandset
}) => {
  return (
    <section id="hero" className="relative min-h-screen w-full overflow-hidden bg-[#FAFAFB] dark:bg-[#07080A] text-[#0A0B0E] dark:text-[#F8FAFC] transition-colors duration-300">
      {/* React Bits Pro: 3D Perspective Ground Grid */}
      <PerspectiveGrid gridColor="rgba(0, 0, 0, 0.06)" speed={0.4} gridSize={48} className="opacity-70 dark:opacity-30" />

      {/* 1. IMMERSIVE 60 FPS GIMBAL VIDEO IN THE BACKGROUND */}
      <GimbalHeroVideo className="min-h-screen pt-20 sm:pt-28 pb-12 sm:pb-16 px-4 sm:px-8 flex flex-col justify-between relative z-10">
        
        {/* Top Banner Verification Strip */}
        <div className="max-w-7xl mx-auto w-full pt-2">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-black/[0.08] dark:border-white/10 pb-3 sm:pb-4 backdrop-blur-sm transition-colors">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-black dark:bg-emerald-400 shadow-[0_0_8px_rgba(0,0,0,0.4)] dark:shadow-[0_0_8px_rgba(52,211,153,0.6)]" />
              <DecryptedText
                text="NEW RADHASWAMI • AUTHORIZED MOBILE GALLERY • PITHAMPUR (MP)"
                speed={25}
                maxIterations={12}
                className="text-[10px] sm:text-[11px] uppercase tracking-[0.16em] sm:tracking-[0.22em] text-neutral-800 dark:text-neutral-200 font-bold"
              />
            </div>

            <div className="hidden md:flex items-center gap-6 text-[11px] text-neutral-600 dark:text-neutral-400">
              <span className="flex items-center gap-1.5 text-neutral-800 dark:text-neutral-200 font-medium">
                <ShieldCheck size={14} className="text-black dark:text-white" />
                100% Sealed Indian Units
              </span>
              <span className="text-black/20 dark:text-white/20">•</span>
              <span className="flex items-center gap-1.5 text-neutral-800 dark:text-neutral-200 font-medium">
                <Truck size={14} className="text-black dark:text-white" />
                BlueDart Insured Air Dispatch
              </span>
              <span className="text-black/20 dark:text-white/20">•</span>
              <span className="flex items-center gap-1.5 text-neutral-800 dark:text-neutral-200 font-medium">
                <Sparkles size={14} className="text-black dark:text-white" />
                0% Interest No-Cost EMI
              </span>
            </div>
          </div>
        </div>

        {/* Hero Foreground Content Over Full-Screen Gimbal Background */}
        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 items-center my-auto py-8 sm:py-16">
          
          {/* Main Left Copy with Luxury Editorial Typography */}
          <div className="lg:col-span-8 space-y-5 sm:space-y-7 text-center lg:text-left">
            
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/90 dark:bg-white/5 backdrop-blur-xl border border-black/10 dark:border-white/15 text-xs text-neutral-800 dark:text-neutral-200 mx-auto lg:mx-0 shadow-sm transition-colors">
              <Sparkles size={12} className="text-black dark:text-white" />
              <span className="tracking-wide text-[10px] sm:text-[11px] uppercase font-bold text-neutral-900 dark:text-white">
                iPhone 16 Pro Max • Galaxy S25 Ultra • Pixel 9 Pro Fold
              </span>
            </div>

            <div className="font-serif-luxury text-4xl sm:text-6xl xl:text-7xl font-light tracking-tight leading-[1.05] text-neutral-950 dark:text-white">
              <SplitText
                text="Flagship Smartphones &"
                delay={0.06}
                animateBy="words"
                direction="bottom"
                className="font-serif-luxury text-4xl sm:text-6xl xl:text-7xl text-neutral-950 dark:text-white font-light block"
              />
              <span className="font-normal text-black dark:text-white block tracking-tight mt-1">
                <ShinyText text="Pro Mobile Atelier." speed={3.2} />
              </span>
            </div>

            <p className="text-sm sm:text-lg text-neutral-600 dark:text-neutral-300 font-light leading-relaxed max-w-2xl mx-auto lg:mx-0">
              India's premier gallery for 100% genuine sealed flagship handsets. Backed by official brand warranties, instant GST invoices, and same-day BlueDart air dispatch.
            </p>

            {/* Quick Brand Switcher Chips with Magnetic Attraction */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 pt-1">
              <span className="text-xs text-neutral-500 dark:text-neutral-400 mr-1 uppercase tracking-wider text-[10px] font-bold">Top Brands:</span>
              {['Apple', 'Samsung', 'Google', 'OnePlus'].map((brand) => (
                <MagneticButton
                  key={brand}
                  onClick={() => onSelectHandset(brand)}
                  className="px-4 py-1.5 rounded-full bg-white dark:bg-white/5 hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black backdrop-blur-lg border border-neutral-300 dark:border-white/15 text-xs text-neutral-800 dark:text-neutral-200 font-medium transition-all cursor-pointer shadow-xs"
                >
                  {brand}
                </MagneticButton>
              ))}
            </div>

            {/* Action CTAs with StarBorder and ClickSpark */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 sm:gap-4 pt-3">
              <ClickSpark sparkColor="#000000" sparkCount={10}>
                <StarBorder color="#000000" speed="4s">
                  <MagneticButton
                    onClick={onExploreClick}
                    className="px-8 py-4 rounded-xl bg-black dark:bg-white hover:bg-neutral-800 dark:hover:bg-neutral-200 text-white dark:text-black text-xs uppercase tracking-wider font-extrabold shadow-2xl shadow-black/20 flex items-center gap-2 cursor-pointer transition-all"
                  >
                    <span>View All Phones to Shop</span>
                    <ArrowUpRight size={15} />
                  </MagneticButton>
                </StarBorder>
              </ClickSpark>

              <ClickSpark sparkColor="#000000" sparkCount={8}>
                <MagneticButton
                  as="a"
                  href="#emi-studio"
                  className="px-7 py-4 rounded-xl bg-white dark:bg-white/5 hover:bg-neutral-100 dark:hover:bg-white/10 text-neutral-900 dark:text-white border border-neutral-300 dark:border-white/15 text-xs uppercase tracking-wider font-semibold transition-all shadow-xs flex items-center gap-2"
                >
                  <span>0% EMI Studio</span>
                </MagneticButton>
              </ClickSpark>
            </div>
          </div>

          {/* Right Column Highlights Badge (React Bits Pro GlareCard) */}
          <div className="lg:col-span-4 hidden lg:flex flex-col items-end justify-center">
            <div className="w-full max-w-sm">
              <GlareCard className="p-6 rounded-3xl bg-white/95 dark:bg-[#0F1117]/95 backdrop-blur-2xl border border-neutral-200/90 dark:border-white/10 shadow-2xl space-y-3.5 text-neutral-900 dark:text-white transition-colors">
                <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-black dark:text-white font-bold">
                  <Award size={16} className="text-black dark:text-white" />
                  <span>Authorized Indian Stock</span>
                </div>
                <p className="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed font-normal">
                  Every handset is 100% factory-sealed Indian retail stock with official Apple, Samsung, Google, and OnePlus brand warranties and instant GST invoice.
                </p>
                <div className="pt-2 border-t border-neutral-200 dark:border-white/10 flex items-center justify-between text-[11px]">
                  <span className="text-neutral-500 dark:text-neutral-400 font-medium">Quality Guarantee:</span>
                  <span className="text-black dark:text-white font-bold flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    100% Sealed &amp; Verified
                  </span>
                </div>
              </GlareCard>
            </div>
          </div>

        </div>

        {/* Bottom Feature Metrics Strip with React Bits CountUp */}
        <div className="max-w-7xl mx-auto w-full border-t border-black/[0.08] dark:border-white/10 pt-5 sm:pt-6 backdrop-blur-sm transition-colors">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 text-center sm:text-left">
            <div>
              <div className="font-serif-luxury text-xl sm:text-3xl font-medium text-neutral-950 dark:text-white">
                <CountUp to={100} suffix="%" duration={1.5} /> Sealed
              </div>
              <div className="text-[11px] sm:text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">Original Brand Boxes with Bill</div>
            </div>
            <div>
              <div className="font-serif-luxury text-xl sm:text-3xl font-medium text-neutral-950 dark:text-white">
                <CountUp to={0} prefix="" suffix="%" duration={1} /> Interest
              </div>
              <div className="text-[11px] sm:text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">No-Cost EMI up to 24 Months</div>
            </div>
            <div>
              <div className="font-serif-luxury text-xl sm:text-3xl font-medium text-neutral-950 dark:text-white">Express Air</div>
              <div className="text-[11px] sm:text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">Same-Day Pithampur Express</div>
            </div>
            <div>
              <div className="font-serif-luxury text-xl sm:text-3xl font-medium text-neutral-950 dark:text-white">
                <CountUp to={2450} separator="," suffix="+ Clients" duration={2} />
              </div>
              <div className="text-[11px] sm:text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">Rated 4.9 ★★★★★</div>
            </div>
          </div>
        </div>

      </GimbalHeroVideo>
    </section>
  );
};
