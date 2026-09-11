import React from 'react';
import { ArrowUp, MapPin, Phone, Mail, MessageSquare } from 'lucide-react';

interface DroneFooterProps {
  onOpenTracking: () => void;
}

export const DroneFooter: React.FC<DroneFooterProps> = ({ onOpenTracking }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#182329] text-[#E0E6E9] px-6 py-20 border-t border-white/10 font-light">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-12 border-b border-white/10 pb-16">
        {/* Col 1: Brand & Bio */}
        <div className="md:col-span-5 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-white text-[#182329] flex items-center justify-center font-mono font-bold text-xs">
              NRM
            </div>
            <div>
              <div className="text-lg font-semibold tracking-tight text-white">
                New Radhaswami Mobile Gallery
              </div>
              <div className="text-xs font-mono text-white/50 uppercase tracking-wider">
                Autonomous Tech & Flagship Destination
              </div>
            </div>
          </div>

          <p className="text-sm text-white/70 max-w-md leading-relaxed font-light">
            Bridging next-generation aerial LiDAR inspection systems and the world’s finest mobile flagships. Full official warranty, zero-cost EMI plans, and VIP concierge dispatch.
          </p>

          <div className="flex items-center gap-3 pt-2">
            <a
              href="https://wa.me/919691011335"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs transition-colors"
            >
              <MessageSquare size={13} />
              <span>WhatsApp VIP Concierge</span>
            </a>

            <button
              onClick={onOpenTracking}
              className="px-3.5 py-1.5 rounded border border-white/20 hover:border-white text-white font-mono text-xs transition-colors cursor-pointer"
            >
              Track Order
            </button>
          </div>
        </div>

        {/* Col 2: Navigation Links */}
        <div className="md:col-span-3 space-y-3 font-mono text-xs uppercase tracking-wider">
          <div className="text-white/40 pb-1">Navigation</div>
          <div>
            <a href="#hero" className="hover:text-white transition-colors block py-1">
              //01 Hero Overview
            </a>
          </div>
          <div>
            <a href="#gear" className="hover:text-white transition-colors block py-1">
              //02 Gear & Dome Arc
            </a>
          </div>
          <div>
            <a href="#solutions" className="hover:text-white transition-colors block py-1">
              //03 Solutions & Video
            </a>
          </div>
          <div>
            <a href="#capabilities" className="hover:text-white transition-colors block py-1">
              //04 3D Point Cloud
            </a>
          </div>
          <div>
            <a href="#software" className="hover:text-white transition-colors block py-1">
              //05 3D Terrain Telemetry
            </a>
          </div>
          <div>
            <a href="#gallery-store" className="hover:text-white transition-colors block py-1 text-blue-400">
              //06 Flagship Store
            </a>
          </div>
        </div>

        {/* Col 3: Gallery Locations & Support */}
        <div className="md:col-span-4 space-y-4 font-mono text-xs">
          <div className="text-white/40 uppercase tracking-wider">Flagship Experience Gallery</div>
          <div className="space-y-2 text-white/70">
            <div className="flex items-start gap-2">
              <MapPin size={14} className="shrink-0 text-blue-400 mt-0.5" />
              <span>JHQJ+7PC Vijay Nagar Colony, Pithampur Industrial Area, Madhya Pradesh</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone size={14} className="shrink-0 text-blue-400" />
              <span>+91 96910 11335 (Direct Support)</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail size={14} className="shrink-0 text-blue-400" />
              <span>concierge@newradhaswamimobile.com</span>
            </div>
          </div>

          <div className="pt-2 text-[11px] text-white/40">
            Store Hours: Mon - Sun, 10:00 AM – 10:00 PM IST
          </div>
        </div>
      </div>

      {/* Bottom Legal & Back to Top */}
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between pt-8 text-xs font-mono text-white/40 gap-4">
        <div>
          © {new Date().getFullYear()} New Radhaswami Mobile Gallery. All rights reserved. Technology clone adapted from Riotters Aevion 3D Architecture.
        </div>

        <button
          onClick={scrollToTop}
          className="flex items-center gap-2 px-3 py-1.5 rounded border border-white/20 hover:border-white text-white/80 hover:text-white transition-colors cursor-pointer"
        >
          <span>Back To Top</span>
          <ArrowUp size={13} />
        </button>
      </div>
    </footer>
  );
};
