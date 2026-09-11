import React from 'react';
import { ArrowUp, MapPin, Phone, Mail, MessageCircle } from 'lucide-react';
import { HashgraphButton } from './HashgraphButton';

interface HashgraphFooterProps {
  onOpenTrackOrder: () => void;
}

export const HashgraphFooter: React.FC<HashgraphFooterProps> = ({ onOpenTrackOrder }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative py-24 sm:py-32 px-6 sm:px-12 lg:px-16 border-t border-white/10 bg-[#000209] text-white">
      <div className="max-w-7xl mx-auto space-y-16">
        
        {/* Giant HashgraphVC Headline */}
        <div className="text-center max-w-4xl mx-auto">
          <div className="text-xs font-mono uppercase tracking-widest text-[#9BB8E1] mb-4">
            // LONG-TERM CONVICTION
          </div>
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-display font-extrabold text-white tracking-tight leading-[1.1]">
            We prioritize genuine partnerships<br />
            <span className="text-[#9BB8E1]">and lasting relationships.</span>
          </h2>
        </div>

        {/* Store Contacts & Social Links Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8 border-t border-white/5 font-mono text-xs text-gray-400">
          
          {/* Col 1: Store Location */}
          <div className="space-y-3">
            <div className="text-white uppercase tracking-wider font-bold flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#9BB8E1]" />
              <span>FLAGSHIP LOCATION</span>
            </div>
            <p className="leading-relaxed text-gray-400 font-sans">
              Shop No. 12-14, Royal Commercial Plaza, Station Road Square, City Hub.<br />
              Open Daily: 10:00 AM – 10:00 PM IST
            </p>
            <a
              href="https://maps.google.com"
              target="_blank"
              rel="noreferrer"
              className="text-[#9BB8E1] hover:underline inline-block pt-1"
            >
              Open GPS Coordinates &rarr;
            </a>
          </div>

          {/* Col 2: Direct Helplines */}
          <div className="space-y-3">
            <div className="text-white uppercase tracking-wider font-bold flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-[#9BB8E1]" />
              <span>DIRECT CHANNELS</span>
            </div>
            <div className="space-y-1">
              <div>Phone: +91 96910 11335</div>
              <div>WhatsApp VIP: +91 96910 11335</div>
              <div>Email: concierge@newradhaswami.com</div>
            </div>
            <button
              onClick={onOpenTrackOrder}
              className="text-[#9BB8E1] hover:underline inline-block pt-1 cursor-pointer"
            >
              Track Existing Sealed Order &rarr;
            </button>
          </div>

          {/* Col 3: Return to Top */}
          <div className="flex flex-col items-start md:items-end justify-between space-y-4">
            <HashgraphButton onClick={scrollToTop} hoverText="Return to Top" small>
              Back to Top &uarr;
            </HashgraphButton>

            <div className="text-[11px] text-gray-500 md:text-right">
              OFFICIAL INDIAN RETAIL LICENSED<br />
              GSTIN: 27AABCR1234F1Z5
            </div>
          </div>

        </div>

        {/* Bottom Bar: Copyright & Made By */}
        <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-[11px] text-gray-500">
          <div>
            &copy; {new Date().getFullYear()} NEW RADHASWAMI MOBILE GALLERY. All Rights Reserved.
          </div>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-white transition-colors">PRIVACY POLICY</a>
            <a href="#" className="hover:text-white transition-colors">TERMS OF SERVICE</a>
            <span className="text-[#9BB8E1]">HASHGRAPH VC ARCHITECTURE</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
