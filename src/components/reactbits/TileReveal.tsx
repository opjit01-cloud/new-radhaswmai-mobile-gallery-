import React from 'react';
import { Sparkles, ArrowRight, ShieldCheck, PhoneCall, ShoppingBag } from 'lucide-react';
import { MagneticButton } from '../common/MagneticButton';
import { ClickSpark } from './ClickSpark';

export interface TileItem {
  id: string;
  title: string;
  subtitle?: string;
  image: string;
  badge?: string;
}

export interface TileRevealProps {
  headline?: string;
  subheadline?: string;
  description?: string;
  badgeText?: string;
  primaryCtaText?: string;
  secondaryCtaText?: string;
  onPrimaryCta?: () => void;
  onSecondaryCta?: () => void;
  tiles?: TileItem[];
  className?: string;
}

const DEFAULT_TILES: TileItem[] = [
  // Col 0
  {
    id: 't-1',
    title: 'iPhone 16 Pro Max',
    subtitle: 'Natural Titanium',
    badge: 'Apple Authorized',
    image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 't-2',
    title: 'Watch Ultra 2',
    subtitle: 'Grade 5 Titanium',
    badge: '100% Sealed',
    image: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=800&q=80'
  },
  // Col 1
  {
    id: 't-3',
    title: 'Galaxy S25 Ultra',
    subtitle: 'Titanium Silverblue',
    badge: 'Samsung Official',
    image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 't-4',
    title: 'AirPods Max',
    subtitle: 'Space Black Studio',
    badge: 'Acoustic Precision',
    image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=800&q=80'
  },
  // Col 2 (Center)
  {
    id: 't-5',
    title: 'iPhone 16 Pro',
    subtitle: 'Desert Titanium Gold',
    badge: 'Flagship Edition',
    image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 't-6',
    title: 'OnePlus 13',
    subtitle: 'Hasselblad Quad Lens',
    badge: '0% EMI Ready',
    image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=800&q=80'
  },
  // Col 3
  {
    id: 't-7',
    title: 'Pixel 9 Pro Fold',
    subtitle: 'Porcelain Aerofold',
    badge: 'Google AI Tensor',
    image: 'https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 't-8',
    title: 'GaN 100W Air Studio',
    subtitle: 'Fast Charging Dock',
    badge: 'Original Accessories',
    image: 'https://images.unsplash.com/photo-1622445262464-84b1456045b6?auto=format&fit=crop&w=800&q=80'
  },
  // Col 4
  {
    id: 't-9',
    title: 'Galaxy Z Fold6',
    subtitle: 'Phantom Obsidian',
    badge: 'Same-Day Dispatch',
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 't-10',
    title: 'Studio Hi-Fi Sound',
    subtitle: 'Noise-Canceling Active',
    badge: 'Verified Stock',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80'
  }
];

export const TileReveal: React.FC<TileRevealProps> = ({
  headline = 'Genuine Sealed Flagships. Zero Compromise.',
  subheadline = 'NEW RADHASWAMI FLAGSHIP ATELIER • PITHAMPUR (MP)',
  description = "India's premier certified showroom for sealed Apple, Samsung, Google & OnePlus smartphones. Backed by official brand warranties, instant GST tax invoices, and 0% No-Cost EMI options.",
  badgeText = 'CERTIFIED LUXURY SHOWROOM',
  primaryCtaText = 'Explore Handset Boutique',
  secondaryCtaText = 'Check 0% EMI Calculator',
  onPrimaryCta,
  onSecondaryCta,
  tiles = DEFAULT_TILES,
  className = ''
}) => {
  return (
    <section
      id="atelier-showcase"
      className={`relative py-16 sm:py-24 w-full bg-neutral-50/70 dark:bg-[#07080A] border-t border-neutral-200/80 dark:border-white/10 overflow-hidden transition-colors duration-300 ${className}`}
    >
      {/* Ambient Luxury Radial Glow */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden">
        <div className="w-[500px] sm:w-[800px] h-[500px] sm:h-[800px] rounded-full bg-gradient-to-tr from-amber-500/10 via-emerald-500/10 to-indigo-500/10 blur-[100px] dark:opacity-40 opacity-30 transform-gpu" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 relative z-10">
        
        {/* Top Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16 space-y-3 sm:space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-neutral-100 dark:bg-white/10 border border-neutral-300 dark:border-white/15 text-xs text-neutral-800 dark:text-neutral-200 shadow-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-neutral-900 dark:text-white">
              {badgeText}
            </span>
          </div>

          <div className="text-[9.5px] sm:text-xs uppercase tracking-[0.24em] font-semibold text-neutral-500 dark:text-neutral-400">
            {subheadline}
          </div>

          <h2 className="font-serif-luxury text-3xl sm:text-5xl lg:text-6xl font-normal text-neutral-950 dark:text-white tracking-tight leading-[1.08]">
            {headline}
          </h2>

          <p className="text-xs sm:text-sm md:text-base text-neutral-600 dark:text-neutral-300 font-light leading-relaxed max-w-xl mx-auto">
            {description}
          </p>
        </div>

        {/* Flagship Handset Showcase Grid - Zero Lag Hardware Accelerated */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-5 mb-12 sm:mb-16">
          {tiles.slice(0, 8).map((item) => (
            <div
              key={item.id}
              onClick={onPrimaryCta}
              className="group relative rounded-2xl sm:rounded-3xl overflow-hidden border border-neutral-200/90 dark:border-white/10 bg-white dark:bg-[#0D1017] shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col justify-between aspect-[3/4] sm:aspect-[4/5]"
            >
              {/* Image with subtle hover zoom */}
              <div className="relative w-full h-full overflow-hidden bg-neutral-100 dark:bg-neutral-900">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
              </div>

              {/* Badge */}
              {item.badge && (
                <div className="absolute top-2.5 left-2.5 sm:top-3.5 sm:left-3.5 z-10">
                  <span className="px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] uppercase font-bold tracking-wider bg-white/95 dark:bg-black/80 backdrop-blur-md text-neutral-900 dark:text-white border border-black/10 dark:border-white/20 shadow-xs">
                    {item.badge}
                  </span>
                </div>
              )}

              {/* Bottom Card Copy */}
              <div className="absolute bottom-2.5 inset-x-2.5 sm:bottom-4 sm:inset-x-4 text-white z-10">
                <h4 className="font-serif-luxury text-xs sm:text-sm md:text-base font-bold tracking-wide leading-tight drop-shadow-sm">
                  {item.title}
                </h4>
                {item.subtitle && (
                  <p className="text-[10px] sm:text-xs text-neutral-300 font-light mt-0.5 tracking-wide truncate">
                    {item.subtitle}
                  </p>
                )}
                <div className="mt-2 flex items-center justify-between text-[9px] sm:text-[10px] uppercase tracking-wider text-emerald-400 font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                  <span>View in Showroom</span>
                  <ArrowRight size={11} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Central Privilege & Action Invitation Card */}
        <div className="max-w-3xl mx-auto rounded-3xl sm:rounded-[32px] bg-white dark:bg-[#0E121B] border border-neutral-200 dark:border-white/15 p-6 sm:p-10 text-center shadow-lg dark:shadow-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-semibold mb-4">
            <Sparkles size={13} />
            <span>Pithampur Exclusive Showroom Experience</span>
          </div>

          <h3 className="font-serif-luxury text-xl sm:text-3xl font-medium text-neutral-950 dark:text-white mb-2">
            Ready to Experience True Flagship Luxury?
          </h3>
          <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 font-light max-w-lg mx-auto mb-6 leading-relaxed">
            Visit our authorized gallery in Pithampur or order online with verified sealed packaging and same-day express air dispatch.
          </p>

          {/* Action Suite */}
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 mb-6">
            <ClickSpark sparkColor="#10B981" sparkCount={8}>
              <MagneticButton
                onClick={onPrimaryCta}
                className="flex items-center gap-2 px-6 sm:px-8 py-3.5 rounded-full bg-neutral-900 hover:bg-black dark:bg-white dark:hover:bg-neutral-200 text-white dark:text-black font-bold text-xs uppercase tracking-wider transition-all cursor-pointer shadow-lg active:scale-95"
              >
                <ShoppingBag size={14} />
                <span>{primaryCtaText}</span>
                <ArrowRight size={14} />
              </MagneticButton>
            </ClickSpark>

            <MagneticButton
              onClick={onSecondaryCta}
              className="flex items-center gap-2 px-5 sm:px-7 py-3.5 rounded-full bg-neutral-100 hover:bg-neutral-200 dark:bg-white/10 dark:hover:bg-white/15 border border-neutral-200 dark:border-white/15 text-neutral-800 dark:text-neutral-200 hover:text-black dark:hover:text-white font-semibold text-xs uppercase tracking-wider transition-all cursor-pointer shadow-xs active:scale-95"
            >
              <Sparkles size={14} className="text-amber-500" />
              <span>{secondaryCtaText}</span>
            </MagneticButton>
          </div>

          {/* Showroom Verification Footnote */}
          <div className="pt-5 border-t border-neutral-200 dark:border-white/10 flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-[10px] sm:text-[11px] text-neutral-500 dark:text-neutral-400 uppercase tracking-widest font-semibold">
            <span className="flex items-center gap-1.5 text-neutral-700 dark:text-neutral-300">
              <ShieldCheck size={13} className="text-emerald-500" />
              100% Factory Sealed Indian Stock
            </span>
            <span className="hidden sm:inline">•</span>
            <a
              href="tel:9691011335"
              className="flex items-center gap-1.5 text-neutral-700 hover:text-black dark:text-neutral-300 dark:hover:text-white transition-colors"
            >
              <PhoneCall size={12} className="text-amber-500" />
              VIP Concierge: +91 96910 11335
            </a>
          </div>
        </div>

      </div>
    </section>
  );
};

export default TileReveal;
