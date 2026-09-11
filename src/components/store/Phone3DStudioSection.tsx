import React, { useState } from 'react';
import { Phone3DCanvas, PHONE_COLORS } from '../Phone3DCanvas';
import { Sparkles, Shield, Cpu, Camera, Battery, Rotate3d, Check, ShoppingBag, Zap } from 'lucide-react';
import { MagneticButton } from '../common/MagneticButton';
import { Aurora } from '../reactbits/Aurora';
import { AuroraBeam } from '../reactbits/AuroraBeam';
import { Particles } from '../reactbits/Particles';
import { SpotlightCard } from '../reactbits/SpotlightCard';
import { BorderBeam } from '../reactbits/BorderBeam';
import { ShinyText } from '../reactbits/ShinyText';
import { DecryptedText } from '../reactbits/DecryptedText';
import { ClickSpark } from '../reactbits/ClickSpark';

interface Phone3DStudioSectionProps {
  onAddToCart?: (phoneName: string, color: string) => void;
  onBuyNow?: (phoneName: string, color: string) => void;
}

export const Phone3DStudioSection: React.FC<Phone3DStudioSectionProps> = ({
  onAddToCart,
  onBuyNow
}) => {
  const [selectedColor, setSelectedColor] = useState(PHONE_COLORS[0].name);
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    if (onAddToCart) onAddToCart('Apple iPhone 16 Pro Max', selectedColor);
    setAdded(true);
    setTimeout(() => setAdded(false), 2200);
  };

  const handleBuy = () => {
    if (onBuyNow) {
      onBuyNow('Apple iPhone 16 Pro Max', selectedColor);
    } else if (onAddToCart) {
      onAddToCart('Apple iPhone 16 Pro Max', selectedColor);
    }
  };

  return (
    <section id="handset-3d-studio" className="relative py-24 sm:py-32 bg-[#FAFAFB] dark:bg-[#07080A] text-[#0A0B0E] dark:text-[#F8FAFC] border-t border-b border-black/[0.08] dark:border-white/10 overflow-hidden transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-neutral-100 dark:bg-white/10 border border-neutral-300 dark:border-white/15 text-xs text-neutral-800 dark:text-neutral-200 shadow-xs animate-float-badge backdrop-blur-xl">
            <span className="text-[10px] font-mono tracking-widest font-bold px-1.5 py-0.5 rounded bg-black dark:bg-white text-white dark:text-black">
              SALON 02
            </span>
            <Rotate3d size={14} className="text-black dark:text-white" />
            <DecryptedText
              text="360° INTERACTIVE TITANIUM STUDIO"
              speed={25}
              maxIterations={12}
              className="uppercase tracking-widest text-[10px] font-bold text-neutral-900 dark:text-neutral-200"
            />
          </div>

          <h2 className="font-serif-luxury text-3xl sm:text-5xl lg:text-6xl font-normal text-neutral-950 dark:text-white tracking-tight">
            Anatomy of <span className="font-semibold text-black dark:text-white"><ShinyText text="Grade 5 Titanium" speed={3} /></span>
          </h2>

          <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 font-light leading-relaxed max-w-xl mx-auto">
            Rotate the handset in real-time 3D, inspect aerospace-grade Grade 5 titanium precision bevels, and customize finishes with dynamic OLED reflections.
          </p>
        </div>

        {/* 3D Showcase Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Feature Cards with SpotlightCard */}
          <div className="lg:col-span-3 space-y-4 order-2 lg:order-1">
            <SpotlightCard
              spotlightColor="rgba(255, 255, 255, 0.08)"
              className="p-5 rounded-2xl bg-white dark:bg-[#0F1117] border border-neutral-200/90 dark:border-white/10 hover:border-black/30 dark:hover:border-white/30 shadow-sm space-y-2"
            >
              <div className="flex items-center gap-2 text-xs font-bold text-neutral-950 dark:text-white">
                <Cpu size={15} className="text-black dark:text-white" />
                <ShinyText text="A18 Pro / Snapdragon 8 Elite" speed={4} />
              </div>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                3nm architecture with hardware ray tracing and next-gen 16-core neural compute engines.
              </p>
            </SpotlightCard>

            <SpotlightCard
              spotlightColor="rgba(255, 255, 255, 0.08)"
              className="p-5 rounded-2xl bg-white dark:bg-[#0F1117] border border-neutral-200/90 dark:border-white/10 hover:border-black/30 dark:hover:border-white/30 shadow-sm space-y-2"
            >
              <div className="flex items-center gap-2 text-xs font-bold text-neutral-950 dark:text-white">
                <Camera size={15} className="text-black dark:text-white" />
                <ShinyText text="48MP Fusion Triple Sapphire" speed={4} />
              </div>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                Anti-reflective sapphire coating, 5x optical tetraprism telephoto, and 4K 120fps Dolby Vision.
              </p>
            </SpotlightCard>

            <SpotlightCard
              spotlightColor="rgba(255, 255, 255, 0.08)"
              className="p-5 rounded-2xl bg-white dark:bg-[#0F1117] border border-neutral-200/90 dark:border-white/10 hover:border-black/30 dark:hover:border-white/30 shadow-sm space-y-2"
            >
              <div className="flex items-center gap-2 text-xs font-bold text-neutral-950 dark:text-white">
                <Battery size={15} className="text-black dark:text-white" />
                <ShinyText text="Silicon-Carbon All-Day Cell" speed={4} />
              </div>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                Ultra-dense battery chemistry enabling up to 33 hours continuous HDR video streaming.
              </p>
            </SpotlightCard>
          </div>

          {/* Center 3D Interactive Canvas with BorderBeam */}
          <div className="lg:col-span-6 flex flex-col items-center justify-center order-1 lg:order-2">
            <div className="relative w-full max-w-[490px] aspect-square rounded-3xl bg-[#F8F9FA] dark:bg-[#0B0E14] border border-neutral-200/90 dark:border-white/10 shadow-2xl p-4 overflow-hidden flex items-center justify-center">
              <BorderBeam size={220} duration={8} colorFrom="#000000" colorTo="#94A3B8" borderWidth={1.5} />
              
              {/* Interactive 3D Canvas */}
              <Phone3DCanvas
                initialColor={selectedColor}
                onColorChange={(c) => setSelectedColor(c)}
              />

              {/* 3D Drag Tip Badge */}
              <div className="absolute bottom-4 inset-x-0 flex justify-center pointer-events-none">
                <div className="px-4 py-1.5 rounded-full bg-white/90 dark:bg-[#0F1117]/90 backdrop-blur-md border border-neutral-200 dark:border-white/15 text-[10px] text-neutral-800 dark:text-neutral-200 flex items-center gap-1.5 shadow-md font-medium">
                  <Sparkles size={11} className="text-black dark:text-white" />
                  <span>Click &amp; drag to rotate in 360° 3D</span>
                </div>
              </div>
            </div>

            {/* Color Switcher Controls */}
            <div className="mt-6 flex flex-col items-center gap-3">
              <span className="text-[11px] uppercase tracking-widest text-neutral-600 dark:text-neutral-400">
                Active Chassis Finish: <strong className="text-neutral-950 dark:text-white font-bold">{selectedColor}</strong>
              </span>

              <div className="flex items-center gap-2.5 p-1.5 rounded-full bg-neutral-100 dark:bg-white/10 border border-neutral-200 dark:border-white/10 shadow-xs">
                {PHONE_COLORS.map((col) => {
                  const isSelected = selectedColor === col.name;
                  return (
                    <MagneticButton
                      key={col.name}
                      onClick={() => setSelectedColor(col.name)}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-white dark:bg-neutral-800 text-black dark:text-white border border-neutral-300 dark:border-white/20 shadow-md scale-105 font-bold'
                          : 'text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white border border-transparent'
                      }`}
                      title={col.name}
                    >
                      <span
                        className="w-3.5 h-3.5 rounded-full shadow-inner border border-neutral-300 dark:border-white/20 shrink-0"
                        style={{ backgroundColor: col.metalHex }}
                      />
                      <span className="text-[11px] font-medium hidden sm:inline">{col.label}</span>
                      {isSelected && <Check size={11} className="text-black dark:text-white" />}
                    </MagneticButton>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Summary Card & Purchase CTA with SpotlightCard & BorderBeam */}
          <div className="lg:col-span-3 space-y-5 order-3">
            <SpotlightCard
              spotlightColor="rgba(255, 255, 255, 0.08)"
              className="relative p-6 rounded-3xl bg-white dark:bg-[#0F1117] border border-neutral-200/90 dark:border-white/10 shadow-xl space-y-4 overflow-hidden"
            >
              <BorderBeam size={180} duration={10} colorFrom="#000000" colorTo="#94A3B8" borderWidth={1.5} />

              <div className="flex items-center justify-between border-b border-neutral-200 dark:border-white/10 pb-3">
                <span className="text-xs uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Live Showroom Stock:</span>
                <span className="text-xs text-black dark:text-white font-bold flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-ping" />
                  Available Today
                </span>
              </div>

              <h4 className="font-serif-luxury text-2xl text-neutral-950 dark:text-white">
                iPhone 16 Pro Max
              </h4>

              <div className="text-2xl font-serif-luxury text-neutral-950 dark:text-white font-semibold">
                <ShinyText text="₹1,44,900" speed={3} />
                <span className="text-xs text-neutral-500 dark:text-neutral-400 block font-sans font-normal mt-0.5">
                  or ₹6,038/month with 0% No-Cost EMI
                </span>
              </div>

              <div className="space-y-2 text-xs text-neutral-600 dark:text-neutral-400">
                <div className="flex items-center gap-2">
                  <Shield size={13} className="text-black dark:text-white" />
                  <span className="text-neutral-900 dark:text-neutral-200 font-medium">100% Sealed Indian Retail Box</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check size={13} className="text-black dark:text-white" />
                  <span className="text-neutral-900 dark:text-neutral-200 font-medium">1 Year Official Manufacturer Warranty</span>
                </div>
              </div>

              {/* Side-by-Side Add to Bag and Buy Now with ClickSpark */}
              <ClickSpark sparkColor="#000000" sparkCount={10}>
                <div className="grid grid-cols-2 gap-2.5 pt-2">
                  <MagneticButton
                    onClick={handleAdd}
                    className={`py-3 px-2 rounded-2xl text-[11px] uppercase tracking-wider font-bold transition-all border ${
                      added
                        ? 'bg-black dark:bg-white text-white dark:text-black border-black dark:border-white shadow-md font-extrabold'
                        : 'bg-neutral-100 hover:bg-neutral-200 dark:bg-white/10 dark:hover:bg-white/15 text-neutral-900 dark:text-white border-neutral-300 dark:border-white/15'
                    }`}
                  >
                    {added ? (
                      <span className="flex items-center justify-center gap-1 text-white dark:text-black">
                        <Check size={13} />
                        <span>Added</span>
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-1">
                        <ShoppingBag size={13} className="text-neutral-700 dark:text-neutral-300" />
                        <span>Add to Bag</span>
                      </span>
                    )}
                  </MagneticButton>

                  <MagneticButton
                    onClick={handleBuy}
                    className="py-3 px-2 rounded-2xl text-[11px] uppercase tracking-wider font-extrabold bg-black hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-200 text-white dark:text-black shadow-xl shadow-black/20"
                  >
                    <span className="flex items-center justify-center gap-1 text-white dark:text-black">
                      <Zap size={13} className="text-white dark:text-black fill-current" />
                      <span>Buy Now</span>
                    </span>
                  </MagneticButton>
                </div>
              </ClickSpark>

              <a
                href="#catalog"
                className="block text-center text-[11px] text-neutral-500 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors uppercase tracking-wider pt-1 font-semibold"
              >
                Browse All Color Variants in Catalog →
              </a>
            </SpotlightCard>
          </div>

        </div>

      </div>
    </section>
  );
};


