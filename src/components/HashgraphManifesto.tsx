import React, { useState } from 'react';
import { ShieldCheck, Award, Zap, Sparkles, ArrowRight, CheckCircle2 } from 'lucide-react';
import { HashgraphButton } from './HashgraphButton';

interface HashgraphManifestoProps {
  onExplorePortfolio: () => void;
}

export const HashgraphManifesto: React.FC<HashgraphManifestoProps> = ({ onExplorePortfolio }) => {
  const [showFullManifesto, setShowFullManifesto] = useState(false);

  return (
    <section id="manifesto" className="relative min-h-[90vh] py-24 sm:py-32 px-6 sm:px-12 lg:px-16 border-t border-white/5 bg-[#000209]">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Title Index */}
        <div className="section-title mb-8 sm:mb-12">
          <span className="section-title__id">//01</span>
          <span>MANIFESTO &bull; PRINCIPLES</span>
        </div>

        {/* Asymmetric Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 sm:gap-16 items-start">
          
          {/* Left Title */}
          <div className="lg:col-span-6">
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-display font-extrabold text-white tracking-tight leading-[1.08]">
              Hardware with<br />
              <span className="text-[#9BB8E1] pl-6 sm:pl-10 inline-block">conviction.</span>
            </h2>

            <div className="mt-8 space-y-4 max-w-lg">
              <p className="text-sm sm:text-base text-gray-300 font-light leading-relaxed">
                New Radhaswami Mobile Gallery operates at the nexus of institutional trust and flagship engineering. We believe authentic, factory-sealed hardware, transparent GST pricing, and unmatched after-sales concierge define true prestige.
              </p>
              
              {showFullManifesto && (
                <p className="text-sm sm:text-base text-gray-400 font-light leading-relaxed animate-fade-in pt-2">
                  We reject gray-market compromises. Every iPhone, Galaxy Ultra, Hasselblad camera phone, and audiophile headset in our vaults is certified Indian stock, verified with matching serials on official brand diagnostic portals before reaching your hands.
                </p>
              )}

              <div className="pt-4 flex items-center gap-4">
                <HashgraphButton
                  onClick={() => setShowFullManifesto(!showFullManifesto)}
                  hoverText={showFullManifesto ? 'Show Less' : 'Read Full Story'}
                  small
                >
                  {showFullManifesto ? 'Show Less' : 'Read Manifesto'}
                </HashgraphButton>

                <button
                  onClick={onExplorePortfolio}
                  className="text-xs font-mono uppercase tracking-widest text-[#9BB8E1] hover:text-white flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <span>Explore Vault</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Right Metrics & Assurances Grid */}
          <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
            
            <div className="p-6 rounded-2xl hashgraph-card">
              <div className="text-[10px] font-mono text-[#9BB8E1] uppercase mb-2">// 01 AUTHENTICITY</div>
              <div className="text-lg font-bold text-white mb-1">100% Brand Sealed</div>
              <p className="text-xs text-gray-400 leading-relaxed">
                Official Indian retail packaging with intact security pull-tabs and serials.
              </p>
            </div>

            <div className="p-6 rounded-2xl hashgraph-card">
              <div className="text-[10px] font-mono text-[#9BB8E1] uppercase mb-2">// 02 NATIONAL COVERAGE</div>
              <div className="text-lg font-bold text-white mb-1">1-Year Warranty</div>
              <p className="text-xs text-gray-400 leading-relaxed">
                Valid at every authorized Apple, Samsung, and Sony service center pan-India.
              </p>
            </div>

            <div className="p-6 rounded-2xl hashgraph-card">
              <div className="text-[10px] font-mono text-[#9BB8E1] uppercase mb-2">// 03 TRADE-IN BONUSES</div>
              <div className="text-lg font-bold text-white mb-1">+₹12,000 Exchange</div>
              <p className="text-xs text-gray-400 leading-relaxed">
                Instant doorstep evaluation and bonus trade-in value against your prior device.
              </p>
            </div>

            <div className="p-6 rounded-2xl hashgraph-card">
              <div className="text-[10px] font-mono text-[#9BB8E1] uppercase mb-2">// 04 DISPATCH SPEED</div>
              <div className="text-lg font-bold text-white mb-1">2-Hour Courier</div>
              <p className="text-xs text-gray-400 leading-relaxed">
                Priority express delivery in metropolitan corridors via BlueDart Air Express.
              </p>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
