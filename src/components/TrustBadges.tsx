import React from 'react';
import { ShieldCheck, Truck, RotateCcw, Award, Headphones, MapPin } from 'lucide-react';

export const TrustBadges: React.FC = () => {
  const features = [
    {
      icon: ShieldCheck,
      title: '100% Genuine Sealed Stock',
      desc: 'Sourced directly from official authorized brand channels with verifiable serial numbers.',
      color: 'text-gold'
    },
    {
      icon: Award,
      title: '1-Year Brand Warranty',
      desc: 'Full manufacturer warranty coverage supported at any authorized brand service center.',
      color: 'text-emerald-400'
    },
    {
      icon: Truck,
      title: 'Express Same-Day Delivery',
      desc: 'Free insured local dispatch within hours with secure tamper-proof unboxing verification.',
      color: 'text-cyan-400'
    },
    {
      icon: RotateCcw,
      title: 'Best Old Phone Trade-In',
      desc: 'Instant doorstep evaluation and guaranteed highest exchange value for your old smartphone.',
      color: 'text-white'
    },
    {
      icon: Headphones,
      title: 'Lifetime Technical Support',
      desc: 'Complimentary data transfer, screen protector application, and software setup.',
      color: 'text-purple-400'
    },
    {
      icon: MapPin,
      title: 'VIP In-Store Experience',
      desc: 'Visit New Radhaswami Mobile Gallery to get hands-on demo across all flagship flagships.',
      color: 'text-rose-400'
    }
  ];

  return (
    <section className="py-20 px-4 md:px-8 max-w-7xl mx-auto border-t border-white/5">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <span className="text-xs font-mono uppercase tracking-widest text-gold block mb-2">
          [ THE NEW RADHASWAMI ADVANTAGE ]
        </span>
        <h2 className="text-3xl sm:text-4xl font-display font-bold text-white tracking-tight">
          Why Discerning Customers Choose Us
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((f, i) => {
          const Icon = f.icon;
          return (
            <div key={i} className="p-6 rounded-2xl glass-panel hover:glass-panel-gold transition-all duration-300 space-y-3">
              <div className={`w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center ${f.color}`}>
                <Icon className="w-5 h-5" />
              </div>
              <h3 className="text-base font-display font-bold text-white">{f.title}</h3>
              <p className="text-xs text-gray-400 font-light leading-relaxed">{f.desc}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
};
