import React, { useState } from 'react';
import { Sparkles, ArrowRight, ShieldCheck, RefreshCw, Headphones, Smartphone, Watch, Check, Zap } from 'lucide-react';
import { SpotlightCard } from './reactbits/SpotlightCard';
import { CountUp } from './reactbits/CountUp';
import { ShinyText } from './reactbits/ShinyText';

interface BentoShowcaseProps {
  onSelectCategory: (cat: string) => void;
  onOpenEmi: () => void;
}

export const BentoShowcase: React.FC<BentoShowcaseProps> = ({
  onSelectCategory,
  onOpenEmi
}) => {
  // Trade-in interactive simulator
  const [oldBrand, setOldBrand] = useState('Apple');
  const [oldModel, setOldModel] = useState('iPhone 14 Pro');
  const [condition, setCondition] = useState('Flawless');

  const getEstimatedValue = () => {
    let base = 42000;
    if (oldBrand === 'Samsung') base = 35000;
    if (oldBrand === 'OnePlus') base = 26000;
    if (condition === 'Good') base -= 5000;
    if (condition === 'Fair') base -= 11000;
    return base;
  };

  return (
    <section className="py-16 px-4 md:px-8 border-b border-white/5">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <div className="text-xs font-mono text-white uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-white" />
              <ShinyText text="CURATED FLAGSHIP ECOSYSTEMS" speed={4} className="font-mono text-xs" />
            </div>
            <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-white tracking-tight">
              Engineered for the Discerning.
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-neutral-400 max-w-md">
            Every product at New Radhaswami Mobile Gallery is hand-inspected, backed by official brand warranty, and eligible for 0% paperless financing.
          </p>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-5">
          
          {/* Card 1: Apple Ecosystem (Spans 2 cols on desktop) */}
          <SpotlightCard className="md:col-span-2 lg:col-span-2 rounded-3xl bg-gradient-to-br from-[#121722] via-[#0E131C] to-[#0A0D14] border border-white/10 p-6 sm:p-8 flex flex-col justify-between group overflow-hidden relative shadow-xl">
            <div className="absolute top-0 right-0 w-80 h-80 bg-neutral-600/10 blur-[100px] rounded-full pointer-events-none" />
            
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="px-3 py-1 rounded-full bg-white/10 text-[10px] font-mono text-white uppercase tracking-wider">
                  APPLE PRO ECOSYSTEM
                </span>
                <span className="text-xs font-mono text-emerald-400 font-semibold">Official Warranty</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-display font-bold text-white leading-tight">
                Seamless Harmony across iPhone, Watch Ultra &amp; AirPods.
              </h3>
              <p className="mt-3 text-xs sm:text-sm text-neutral-400 leading-relaxed max-w-md">
                Experience instant AirDrop, Precision Finding, and lossless spatial audio with genuine Apple products bundled at exclusive gallery pricing.
              </p>
            </div>

            <div className="my-6 relative h-48 sm:h-56 rounded-2xl overflow-hidden border border-white/10">
              <img
                src="https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&w=1000&q=80"
                alt="Apple Ecosystem"
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-xs">
                <span className="text-white font-semibold">iPhone 16 Pro Max • Watch Ultra 2</span>
                <span className="text-white font-mono font-semibold">Bundle Save ₹18,000</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                onClick={() => onSelectCategory('smartphones')}
                className="flex items-center gap-2 text-xs font-bold text-white hover:text-neutral-300 transition-colors cursor-pointer"
              >
                <span>Browse Apple Showcase</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <span className="text-[11px] font-mono text-neutral-500">In-Store Demo Available</span>
            </div>
          </SpotlightCard>

          {/* Card 2: Interactive Trade-in Evaluator */}
          <SpotlightCard className="md:col-span-1 lg:col-span-2 rounded-3xl bg-[#0F141F] border border-white/10 p-6 sm:p-8 flex flex-col justify-between shadow-xl">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-white mb-2 uppercase">
                <RefreshCw className="w-3.5 h-3.5" />
                INSTANT EXCHANGE EVALUATOR
              </div>
              <h3 className="text-xl sm:text-2xl font-display font-bold text-white">
                Trade in Your Old Device. Upgrade Instantly.
              </h3>
              <p className="mt-2 text-xs text-neutral-400">
                Get fair market valuation in 60 seconds with on-the-spot bonus credit applied directly to your new purchase.
              </p>
            </div>

            {/* Interactive Selector */}
            <div className="my-5 p-4 rounded-2xl bg-[#080B10] border border-white/10 flex flex-col gap-3">
              <div className="grid grid-cols-3 gap-2">
                {['Apple', 'Samsung', 'OnePlus'].map(brand => (
                  <button
                    key={brand}
                    onClick={() => setOldBrand(brand)}
                    className={`py-1.5 text-xs rounded-lg font-medium transition-all cursor-pointer ${
                      oldBrand === brand
                        ? 'bg-white text-black font-bold'
                        : 'bg-white/5 text-neutral-400 hover:text-white'
                    }`}
                  >
                    {brand}
                  </button>
                ))}
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <span className="text-neutral-400">Physical Condition:</span>
                <div className="flex gap-1.5">
                  {['Flawless', 'Good', 'Fair'].map(cond => (
                    <button
                      key={cond}
                      onClick={() => setCondition(cond)}
                      className={`px-2.5 py-1 text-[11px] rounded-md transition-all cursor-pointer ${
                        condition === cond
                          ? 'bg-white/20 text-white font-bold border border-white/30'
                          : 'text-neutral-500 hover:text-neutral-300'
                      }`}
                    >
                      {cond}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2 border-t border-white/10 flex items-center justify-between">
                <div>
                  <div className="text-[10px] text-neutral-400 font-mono">ESTIMATED BUYBACK VALUE</div>
                  <div className="text-xl font-display font-extrabold text-emerald-400">
                    ₹<CountUp to={getEstimatedValue()} duration={0.6} separator="," />
                  </div>
                </div>
                <span className="text-[10px] font-mono text-white bg-white/10 px-2 py-1 rounded-md border border-white/20">
                  + ₹5,000 Exchange Bonus
                </span>
              </div>
            </div>

            <a
              href={`https://wa.me/919691011335?text=${encodeURIComponent(`Hello New Radhaswami Mobile Gallery! I want to trade in my ${oldBrand} (${condition} condition) estimated at ₹${getEstimatedValue().toLocaleString('en-IN')}. Please verify pickup details.`)}`}
              target="_blank"
              rel="noreferrer"
              className="w-full py-3 rounded-xl bg-[#141A25] hover:bg-[#1C2534] border border-white/15 text-white text-xs font-semibold text-center flex items-center justify-center gap-2 transition-all"
            >
              <span>Lock In Trade-in via WhatsApp</span>
              <ArrowRight className="w-3.5 h-3.5 text-white" />
            </a>
          </SpotlightCard>

          {/* Card 3: Audiophile Soundstage */}
          <SpotlightCard className="md:col-span-1 lg:col-span-2 rounded-3xl bg-[#0F141F] border border-white/10 p-6 sm:p-7 flex flex-col justify-between group overflow-hidden shadow-xl">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-neutral-300 mb-2 uppercase">
                <Headphones className="w-3.5 h-3.5" />
                STUDIO SOUND &amp; NOISE CANCELLATION
              </div>
              <h3 className="text-xl sm:text-2xl font-display font-bold text-white">
                Sony WH-1000XM5 &amp; AirPods Pro 2.
              </h3>
              <p className="mt-2 text-xs text-neutral-400">
                Acoustic isolation engineered for world travelers, creators, and audio purists with lossless LDAC and dynamic spatial tracking.
              </p>
            </div>

            <div className="my-4 h-36 rounded-xl overflow-hidden relative border border-white/10">
              <img
                src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80"
                alt="Sony Headphones"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <span className="absolute bottom-2.5 left-3 text-xs font-bold text-white">
                Sony WH-1000XM5 ANC • ₹29,990
              </span>
            </div>

            <button
              onClick={() => onSelectCategory('audio')}
              className="text-xs font-semibold text-neutral-300 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>Explore Audiophile Collection</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </SpotlightCard>

          {/* Card 4: Paperless 0% EMI Financing */}
          <SpotlightCard className="md:col-span-2 lg:col-span-2 rounded-3xl bg-gradient-to-br from-[#151922] via-[#10141B] to-[#0A0D14] border border-white/15 p-6 sm:p-7 flex flex-col justify-between shadow-xl">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="flex items-center gap-1.5 text-xs font-mono text-white uppercase">
                  <Zap className="w-3.5 h-3.5" />
                  3-MINUTE INSTANT APPROVAL
                </span>
                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-mono font-bold">
                  ZERO DOWN PAYMENT
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-display font-bold text-white">
                0% Interest No-Cost EMI across 5 Top Banks.
              </h3>
              <p className="mt-2 text-xs text-neutral-400">
                Partnered directly with Bajaj Finserv, HDFC Bank, ICICI Bank, SBI, and Axis Bank. No hidden charges, zero processing fees, flexible 3 to 24 month tenures.
              </p>
            </div>

            <div className="my-4 grid grid-cols-4 gap-2 text-center text-xs font-mono">
              <div className="p-2 rounded-lg bg-black/40 border border-white/10 text-neutral-300">BAJAJ</div>
              <div className="p-2 rounded-lg bg-black/40 border border-white/10 text-neutral-300">HDFC</div>
              <div className="p-2 rounded-lg bg-black/40 border border-white/10 text-neutral-300">ICICI</div>
              <div className="p-2 rounded-lg bg-black/40 border border-white/10 text-neutral-300">SBI CARD</div>
            </div>

            <button
              onClick={onOpenEmi}
              className="w-full py-3 rounded-xl bg-white hover:bg-neutral-200 text-black text-xs font-extrabold text-center flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg"
            >
              <span>Launch EMI Calculator Studio</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </SpotlightCard>

        </div>

      </div>
    </section>
  );
};
