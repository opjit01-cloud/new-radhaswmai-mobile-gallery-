import React, { useState } from 'react';
import { Product } from '../../data/products';
import { Headphones, Watch, BatteryCharging, ShoppingBag, Check, Zap, Sparkles, LayoutGrid } from 'lucide-react';
import { MagneticButton } from '../common/MagneticButton';
import { SpotlightCard } from '../reactbits/SpotlightCard';
import { TiltedCard } from '../reactbits/TiltedCard';
import { ShinyText } from '../reactbits/ShinyText';
import { DecryptedText } from '../reactbits/DecryptedText';
import { ClickSpark } from '../reactbits/ClickSpark';
import { Aurora } from '../reactbits/Aurora';
import { Particles } from '../reactbits/Particles';

interface AccessoriesSectionProps {
  products: Product[];
  onAddToCart: (product: Product, color: string, storage?: string, price?: number) => void;
  onBuyNow?: (product: Product, color: string, storage?: string, price?: number) => void;
}

export const AccessoriesSection: React.FC<AccessoriesSectionProps> = ({
  products,
  onAddToCart,
  onBuyNow
}) => {
  const [activeCategory, setActiveCategory] = useState<'all' | 'audio' | 'watches' | 'chargers'>('all');
  const [addedItem, setAddedItem] = useState<string | null>(null);

  const accessories = products.filter(p => p.category !== 'smartphones');

  const filtered = accessories.filter(p => {
    if (activeCategory === 'all') return true;
    return p.category === activeCategory;
  });

  const handleAdd = (item: Product) => {
    const color = item.colors[0]?.name || 'Standard';
    onAddToCart(item, color, undefined, item.price);
    setAddedItem(item.id);
    setTimeout(() => setAddedItem(null), 2000);
  };

  const handleBuy = (item: Product) => {
    const color = item.colors[0]?.name || 'Standard';
    if (onBuyNow) {
      onBuyNow(item, color, undefined, item.price);
    } else {
      onAddToCart(item, color, undefined, item.price);
    }
  };

  return (
    <section id="accessories" className="py-24 sm:py-32 px-4 sm:px-6 bg-[#FAFAFB] dark:bg-[#07080A] text-[#0A0B0E] dark:text-[#F1F5F9] border-t border-black/[0.08] dark:border-white/10 relative overflow-hidden transition-colors duration-300">
      {/* Pro React Bits: Aurora Flowing Wave */}
      <Aurora colorStops={['#000000', '#64748B', '#CBD5E1', '#0B0F19']} blend={0.12} speed={15} />

      {/* Pro React Bits: Particles Constellation */}
      <Particles particleCount={20} speed={0.15} connectLines={false} className="opacity-15 dark:opacity-20" />

      <div className="max-w-7xl mx-auto relative z-10 space-y-8">
        
        {/* Salon 04 Gateway Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-black/[0.08] dark:border-white/10 pb-8 gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono tracking-widest font-bold px-2 py-0.5 rounded bg-black dark:bg-white text-white dark:text-black border border-neutral-200 dark:border-white/15">
                SALON 04
              </span>
              <DecryptedText
                text="ORIGINAL ACCESSORIES • PRO ACOUSTICS & HYPER-POWER"
                speed={26}
                maxIterations={10}
                className="text-[10.5px] uppercase tracking-[0.2em] text-neutral-500 dark:text-neutral-400 font-bold"
              />
            </div>
            <h2 className="text-3xl sm:text-5xl font-serif-luxury font-normal text-neutral-950 dark:text-white tracking-tight">
              Acoustics, Wearables &amp; <span className="font-semibold text-black dark:text-white"><ShinyText text="GaN Power" speed={3.5} /></span>
            </h2>

            <p className="text-neutral-600 dark:text-neutral-400 font-light max-w-2xl text-sm sm:text-base leading-relaxed">
              Complete your mobile ecosystem with genuine Apple AirPods, Samsung Galaxy smartwatches, and ultra-high-speed GaN fast-charging adapters.
            </p>
          </div>

          {/* Sub-Department Category Switcher */}
          <div className="flex items-center gap-1.5 bg-neutral-100 dark:bg-[#0F1015]/90 p-1.5 rounded-full border border-neutral-200 dark:border-white/15 backdrop-blur-xl">
            <MagneticButton
              onClick={() => setActiveCategory('all')}
              className={`px-3.5 py-1.5 rounded-full text-xs transition-all cursor-pointer font-medium flex items-center gap-1.5 ${
                activeCategory === 'all'
                  ? 'bg-black dark:bg-white text-white dark:text-black font-extrabold shadow-md'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white'
              }`}
            >
              <LayoutGrid size={12} />
              <span>All Gear</span>
            </MagneticButton>
            <MagneticButton
              onClick={() => setActiveCategory('audio')}
              className={`px-3.5 py-1.5 rounded-full text-xs transition-all cursor-pointer flex items-center gap-1.5 font-medium ${
                activeCategory === 'audio'
                  ? 'bg-black dark:bg-white text-white dark:text-black font-extrabold shadow-md'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white'
              }`}
            >
              <Headphones size={13} />
              <span>Pro Audio</span>
            </MagneticButton>
            <MagneticButton
              onClick={() => setActiveCategory('watches')}
              className={`px-3.5 py-1.5 rounded-full text-xs transition-all cursor-pointer flex items-center gap-1.5 font-medium ${
                activeCategory === 'watches'
                  ? 'bg-black dark:bg-white text-white dark:text-black font-extrabold shadow-md'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white'
              }`}
            >
              <Watch size={13} />
              <span>Wearables</span>
            </MagneticButton>
            <MagneticButton
              onClick={() => setActiveCategory('chargers')}
              className={`px-3.5 py-1.5 rounded-full text-xs transition-all cursor-pointer flex items-center gap-1.5 font-medium ${
                activeCategory === 'chargers'
                  ? 'bg-black dark:bg-white text-white dark:text-black font-extrabold shadow-md'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white'
              }`}
            >
              <BatteryCharging size={13} />
              <span>GaN Power</span>
            </MagneticButton>
          </div>
        </div>

        {/* Accessories Grid with React Bits TiltedCard & SpotlightCards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-2">
          {filtered.map(item => (
            <TiltedCard
              key={item.id}
              maxTilt={8}
              scale={1.02}
              glareEnable={true}
              className="h-full"
            >
              <SpotlightCard
                spotlightColor="rgba(255, 255, 255, 0.08)"
                borderColor="rgba(255, 255, 255, 0.15)"
                className="p-6 shadow-md hover:shadow-xl group h-full flex flex-col justify-between bg-white dark:bg-[#0F1015]/90 rounded-3xl backdrop-blur-xl border border-neutral-200 dark:border-white/10"
              >
                <div>
                  <div className="aspect-square w-full rounded-2xl overflow-hidden bg-neutral-100 dark:bg-black/50 border border-neutral-200 dark:border-white/10 mb-4 flex items-center justify-center p-4 group-hover:border-black/30 dark:group-hover:border-white/25 transition-colors">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-contain group-hover:scale-108 transition-transform duration-500"
                    />
                  </div>

                  <div className="text-[10px] uppercase tracking-[0.18em] text-neutral-500 dark:text-neutral-400 font-bold mb-1">
                    {item.brand}
                  </div>
                  <h4 className="text-base font-serif-luxury font-medium text-neutral-950 dark:text-white leading-snug line-clamp-1">
                    {item.name}
                  </h4>

                  <div className="mt-2.5 flex items-baseline gap-2">
                    <span className="text-lg font-bold text-neutral-950 dark:text-white font-mono">
                      ₹{item.price.toLocaleString('en-IN')}
                    </span>
                    {item.originalPrice && (
                      <span className="text-xs text-neutral-400 dark:text-neutral-500 line-through font-mono">
                        ₹{item.originalPrice.toLocaleString('en-IN')}
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-neutral-600 dark:text-neutral-400 font-light mt-2 line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                {/* Side-by-Side Action Buttons with ClickSpark */}
                <div className="grid grid-cols-2 gap-2 mt-5">
                  <ClickSpark sparkColor="#000000" sparkCount={6}>
                    <MagneticButton
                      onClick={() => handleAdd(item)}
                      className={`w-full py-2.5 px-2 rounded-xl text-[11px] uppercase tracking-wider font-bold transition-all border cursor-pointer ${
                        addedItem === item.id
                          ? 'bg-black dark:bg-white text-white dark:text-black border-black dark:border-white font-extrabold shadow-md'
                          : 'bg-neutral-100 dark:bg-white/5 hover:bg-neutral-200 dark:hover:bg-white/10 text-neutral-900 dark:text-white border-neutral-300 dark:border-white/20 hover:border-black/40 dark:hover:border-white/40'
                      }`}
                    >
                      {addedItem === item.id ? (
                        <span className="flex items-center justify-center gap-1 text-white dark:text-black font-extrabold">
                          <Check size={13} />
                          <span>Added</span>
                        </span>
                      ) : (
                        <span className="flex items-center justify-center gap-1 text-neutral-800 dark:text-white">
                          <ShoppingBag size={13} />
                          <span>Add</span>
                        </span>
                      )}
                    </MagneticButton>
                  </ClickSpark>

                  <ClickSpark sparkColor="#CBD5E1" sparkCount={8}>
                    <MagneticButton
                      onClick={() => handleBuy(item)}
                      className="w-full py-2.5 px-2 rounded-xl text-[11px] uppercase tracking-wider font-extrabold bg-black hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-200 text-white dark:text-black shadow-lg shadow-black/10 dark:shadow-white/15 transition-all cursor-pointer"
                    >
                      <span className="flex items-center justify-center gap-1 text-white dark:text-black font-extrabold">
                        <Zap size={13} className="text-white dark:text-black fill-current" />
                        <span>Buy</span>
                      </span>
                    </MagneticButton>
                  </ClickSpark>
                </div>
              </SpotlightCard>
            </TiltedCard>
          ))}
        </div>

      </div>
    </section>
  );
};
