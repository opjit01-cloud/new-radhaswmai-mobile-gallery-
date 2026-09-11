import React from 'react';
import { Smartphone, Rotate3d, CreditCard, Headphones, Layers, LayoutGrid, Sparkles, ShoppingBag } from 'lucide-react';
import { ShinyText } from '../reactbits/ShinyText';
import { MagneticButton } from '../common/MagneticButton';

export interface SalonDepartment {
  id: string;
  name: string;
  index: string;
  badge: string;
  icon: React.ReactNode;
  subtitle: string;
}

interface SalonDepartmentBarProps {
  activeSalon: string;
  onSelectSalon: (salonId: string) => void;
  focusedMode: boolean;
  onToggleFocusedMode: (focused: boolean) => void;
}

export const SALON_DEPARTMENTS: SalonDepartment[] = [
  {
    id: 'all',
    name: 'Full Showroom Tour',
    index: 'ALL',
    badge: 'All Salons',
    icon: <LayoutGrid size={15} />,
    subtitle: 'Browse all flagship collections sequentially'
  },
  {
    id: 'shop-section',
    name: 'Handset Boutique',
    index: 'SHOP',
    badge: 'Flagship Store',
    icon: <ShoppingBag size={15} />,
    subtitle: 'Explore full catalog of official brand-sealed smartphones'
  },
  {
    id: 'handset-3d-studio',
    name: '360° Titanium Studio',
    index: '02',
    badge: 'Interactive 3D',
    icon: <Rotate3d size={15} />,
    subtitle: 'Real-time Grade 5 titanium inspection plinth'
  },
  {
    id: 'emi-studio',
    name: '0% EMI Financing Lounge',
    index: '03',
    badge: 'Zero Interest',
    icon: <CreditCard size={15} />,
    subtitle: 'Auto price detection, flexible tenure & instant pre-approval'
  },
  {
    id: 'compare',
    name: 'Flagship Showdown',
    index: '04',
    badge: 'Spec Matrix',
    icon: <Layers size={15} />,
    subtitle: 'Head-to-head silicon, display & camera diagnostics'
  }
];

export const SalonDepartmentBar: React.FC<SalonDepartmentBarProps> = ({
  activeSalon,
  onSelectSalon,
  focusedMode,
  onToggleFocusedMode
}) => {
  return (
    <div className="relative z-20 py-8 px-4 sm:px-6 bg-white/95 dark:bg-[#0B0E14]/95 backdrop-blur-xl border-y border-black/[0.08] dark:border-white/10 shadow-xs transition-colors duration-300">
      <div className="max-w-7xl mx-auto space-y-5">
        
        {/* Top Control Meta Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-black/[0.06] dark:border-white/10 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-black dark:bg-white shadow-[0_0_8px_rgba(0,0,0,0.4)]" />
              <span className="text-[10px] uppercase tracking-[0.22em] text-neutral-500 dark:text-neutral-400 font-bold">
                PITHAMPUR SHOWROOM ATELIER • FLAGSHIP EXPERIENCES
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-serif-luxury font-normal text-neutral-950 dark:text-white">
              Interactive <span className="font-semibold text-black dark:text-white"><ShinyText text="Showroom Experiences" speed={4} /></span>
            </h3>
          </div>

          {/* View Mode Switcher: Full Showroom Tour vs Focused Department View */}
          <div className="flex items-center gap-2 self-start sm:self-auto bg-neutral-100 dark:bg-white/5 p-1 rounded-full border border-neutral-200 dark:border-white/10 text-xs">
            <button
              onClick={() => onToggleFocusedMode(false)}
              className={`px-3.5 py-1.5 rounded-full transition-all text-[11px] uppercase tracking-wider font-semibold cursor-pointer ${
                !focusedMode
                  ? 'bg-black dark:bg-white text-white dark:text-black shadow-md'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white'
              }`}
            >
              Full Showroom Tour
            </button>
            <button
              onClick={() => onToggleFocusedMode(true)}
              className={`px-3.5 py-1.5 rounded-full transition-all text-[11px] uppercase tracking-wider font-semibold cursor-pointer flex items-center gap-1.5 ${
                focusedMode
                  ? 'bg-black dark:bg-white text-white dark:text-black shadow-md'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white'
              }`}
            >
              <Sparkles size={12} className={focusedMode ? 'text-white dark:text-black' : 'text-neutral-500 dark:text-neutral-400'} />
              <span>Focused Salon</span>
            </button>
          </div>
        </div>

        {/* Department Pills Track */}
        <div className="flex items-center gap-2.5 overflow-x-auto pb-2 [scrollbar-width:none]">
          {SALON_DEPARTMENTS.map((salon) => {
            const isSelected = activeSalon === salon.id;
            return (
              <MagneticButton
                key={salon.id}
                onClick={() => onSelectSalon(salon.id)}
                className={`group px-4 py-3 rounded-2xl border transition-all duration-300 shrink-0 text-left cursor-pointer ${
                  isSelected
                    ? 'bg-black dark:bg-white text-white dark:text-black border-black dark:border-white shadow-[0_8px_24px_rgba(0,0,0,0.18)] scale-[1.02]'
                    : 'bg-white dark:bg-white/5 hover:bg-neutral-50 dark:hover:bg-white/10 border-neutral-200 dark:border-white/10 hover:border-neutral-400 dark:hover:border-white/30 text-neutral-800 dark:text-neutral-200 shadow-xs'
                }`}
              >
                <div className="flex items-center gap-2.5 mb-1">
                  <span className={`text-[10px] font-mono font-bold tracking-widest px-1.5 py-0.5 rounded ${
                    isSelected ? 'bg-white/20 dark:bg-black/20 text-white dark:text-black' : 'bg-neutral-100 dark:bg-white/10 text-neutral-600 dark:text-neutral-300'
                  }`}>
                    {salon.index}
                  </span>
                  <span className={isSelected ? 'text-white dark:text-black' : 'text-neutral-500 dark:text-neutral-400 group-hover:text-black dark:group-hover:text-white'}>
                    {salon.icon}
                  </span>
                  <span className={`text-xs uppercase tracking-wider font-bold ${
                    isSelected ? 'text-white dark:text-black' : 'text-neutral-900 dark:text-white'
                  }`}>
                    {salon.name}
                  </span>
                </div>
                <p className={`text-[10px] font-light max-w-[200px] truncate ${
                  isSelected ? 'text-neutral-300 dark:text-neutral-700 font-normal' : 'text-neutral-500 dark:text-neutral-400'
                }`}>
                  {salon.subtitle}
                </p>
              </MagneticButton>
            );
          })}
        </div>

      </div>
    </div>
  );
};
