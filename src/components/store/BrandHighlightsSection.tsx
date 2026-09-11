import React from 'react';
import { ShieldCheck, FileCheck, Plane, CreditCard, Award, ArrowUpRight } from 'lucide-react';
import { ShinyText } from '../reactbits/ShinyText';
import { DecryptedText } from '../reactbits/DecryptedText';

interface BrandHighlightsSectionProps {
  onShopClick: () => void;
  onEmiClick: () => void;
}

export const BrandHighlightsSection: React.FC<BrandHighlightsSectionProps> = ({
  onShopClick,
  onEmiClick
}) => {
  const pillars = [
    {
      icon: <ShieldCheck className="w-6 h-6 text-white" />,
      title: '100% Factory-Sealed Stock',
      subtitle: 'Official Indian Retail Units',
      description: 'Every handset arrives with intact manufacturer tear-away seals, verifiable IMEI on brand servers, and valid pan-India service center warranties.'
    },
    {
      icon: <FileCheck className="w-6 h-6 text-white" />,
      title: 'Instant GST Tax Invoicing',
      subtitle: 'Corporate & Personal Billing',
      description: 'Transparent computerized tax invoices with full ITC eligibility. Input credit claims for enterprises and seamless legal ownership proof.'
    },
    {
      icon: <Plane className="w-6 h-6 text-white" />,
      title: 'Insured BlueDart Express',
      subtitle: 'Same-Day Air Dispatch',
      description: 'Transit-insured air delivery with live tracking. Same-day specialized courier dispatch across Pithampur & Indore and 24-48hr nationwide priority transit.'
    },
    {
      icon: <CreditCard className="w-6 h-6 text-white" />,
      title: '0% No-Cost EMI Lounge',
      subtitle: 'All Major Banks Supported',
      description: 'Instant approvals with HDFC, ICICI, SBI, Axis, and Bajaj Finserv. Enjoy zero interest installments across 3 to 24 month tenures.'
    }
  ];

  return (
    <section className="relative py-20 sm:py-28 bg-[#F4F5F7] dark:bg-[#07080A] text-[#0A0B0E] dark:text-[#F8FAFC] border-b border-black/[0.08] dark:border-white/10 overflow-hidden font-sans transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12 sm:mb-16 border-b border-black/[0.08] dark:border-white/10 pb-8 transition-colors">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white dark:bg-white/5 border border-neutral-200 dark:border-white/15 text-[10px] uppercase tracking-widest text-neutral-800 dark:text-neutral-200 font-bold shadow-xs">
              <Award size={13} className="text-black dark:text-white" />
              <DecryptedText
                text="THE NEW RADHASWAMI BENCHMARK"
                speed={25}
                maxIterations={12}
                className="uppercase tracking-widest text-[10px] font-bold text-neutral-900 dark:text-white"
              />
            </div>
            <h2 className="text-3xl sm:text-5xl font-serif-luxury font-normal text-neutral-950 dark:text-white tracking-tight leading-tight">
              Uncompromising Standards for <span className="font-semibold text-black dark:text-white"><ShinyText text="Flagship Technology." speed={3} /></span>
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 font-light leading-relaxed">
              We eliminate counterfeit risks, refurbished units, and grey-market stock. Direct brand allocation with complete documentation and white-glove logistics.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onShopClick}
              className="px-6 py-3.5 rounded-xl bg-black dark:bg-white hover:bg-neutral-800 dark:hover:bg-neutral-200 text-white dark:text-black text-xs uppercase tracking-wider font-extrabold transition-all shadow-xl shadow-black/15 flex items-center gap-2 cursor-pointer"
            >
              <span>Enter Boutique Store</span>
              <ArrowUpRight size={14} />
            </button>
            <button
              onClick={onEmiClick}
              className="px-5 py-3.5 rounded-xl bg-white dark:bg-white/5 hover:bg-neutral-100 dark:hover:bg-white/10 text-neutral-900 dark:text-white border border-neutral-300 dark:border-white/15 text-xs uppercase tracking-wider font-semibold transition-all cursor-pointer shadow-xs"
            >
              <span>Calculate EMI</span>
            </button>
          </div>
        </div>

        {/* 4 Pillars Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {pillars.map((pillar, idx) => (
            <div
              key={idx}
              className="p-7 rounded-3xl bg-white dark:bg-[#0F1117] border border-neutral-200/90 dark:border-white/10 hover:border-black/30 dark:hover:border-white/30 transition-all duration-300 flex flex-col justify-between group shadow-md hover:shadow-xl hover:-translate-y-1"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-black dark:bg-white/10 flex items-center justify-center mb-6 shadow-md group-hover:scale-105 transition-transform">
                  {pillar.icon}
                </div>
                <span className="text-[10px] font-mono text-neutral-500 dark:text-neutral-400 uppercase tracking-widest block mb-1">
                  Pillar 0{idx + 1}
                </span>
                <h3 className="text-lg font-bold text-neutral-950 dark:text-white mb-1.5 leading-snug">
                  {pillar.title}
                </h3>
                <div className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-3">
                  {pillar.subtitle}
                </div>
                <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed font-normal">
                  {pillar.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-neutral-100 dark:border-white/10 flex items-center justify-between text-[11px] text-neutral-500 dark:text-neutral-400 font-mono">
                <span>Verified Standard</span>
                <span className="text-neutral-950 dark:text-white font-bold">100% Guaranteed</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
