import React from 'react';
import { ArrowUp, MapPin, Phone, Mail, MessageSquare, Instagram } from 'lucide-react';
import { MagneticButton } from '../common/MagneticButton';
import { ShinyText } from '../reactbits/ShinyText';

interface StoreFooterProps {
  onOpenTracking: () => void;
  onOpenTerms?: () => void;
  onOpenReviews?: () => void;
}

export const StoreFooter: React.FC<StoreFooterProps> = ({
  onOpenTracking,
  onOpenTerms,
  onOpenReviews
}) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#07080A] text-[#CBD5E1] px-5 sm:px-6 pt-16 pb-28 md:pb-20 border-t border-white/10 font-light relative">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-10 border-b border-white/10 pb-12">
        
        {/* Col 1: Brand & Bio */}
        <div className="md:col-span-5 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full overflow-hidden border border-white/20 shadow-lg shrink-0">
              <img src="/nrs-logo.png" alt="New Radhaswami Mobile Gallery" className="w-full h-full object-cover" />
            </div>
            <div>
              <div className="text-lg font-serif-luxury font-medium tracking-wide text-white">
                <ShinyText text="New Radhaswami Mobile Gallery" speed={3} />
              </div>
              <div className="text-[10px] tracking-[0.2em] text-neutral-400 uppercase font-bold">
                Authorized Flagship Destination • Pithampur, Madhya Pradesh
              </div>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-neutral-400 max-w-md leading-relaxed font-light">
            Official authorized showroom partner for Apple India, Samsung India, Google Pixel, and OnePlus. 100% manufacturer-sealed retail boxes, BlueDart insured air delivery, and 0% interest EMI options.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <MagneticButton
              as="a"
              href="https://wa.me/919691011335"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white hover:bg-neutral-200 text-black text-xs font-extrabold tracking-wider transition-all shadow-md shadow-white/15"
            >
              <MessageSquare size={14} className="text-black fill-black" />
              <span>WhatsApp Concierge</span>
            </MagneticButton>

            <MagneticButton
              as="a"
              href="https://www.instagram.com/newradhaswamimobilegallery/?hl=en"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#F77737] hover:opacity-95 text-white text-xs font-bold tracking-wider transition-all shadow-md"
            >
              <Instagram size={14} className="text-white" />
              <span>Instagram @newradhaswamimobilegallery</span>
            </MagneticButton>

            <MagneticButton
              onClick={onOpenTracking}
              className="px-5 py-2.5 rounded-full border border-white/15 hover:border-white/30 text-white text-xs uppercase tracking-wider transition-all cursor-pointer bg-white/[0.04] hover:bg-white/[0.08]"
            >
              Track Order
            </MagneticButton>
          </div>
        </div>

        {/* Col 2: Quick Links */}
        <div className="md:col-span-3 space-y-3 text-xs tracking-wider">
          <div className="text-white uppercase text-[11px] font-bold tracking-[0.18em] pb-1">
            Quick Navigation
          </div>
          <div>
            <a href="#hero" className="hover:text-white transition-colors block py-1 text-neutral-400">
              3D Handset Showcase
            </a>
          </div>
          <div>
            <a href="#catalog" className="hover:text-white transition-colors block py-1 text-neutral-400">
              Flagship Smartphones
            </a>
          </div>
          <div>
            <a href="#emi-studio" className="hover:text-white transition-colors block py-1 text-neutral-400">
              0% No-Cost EMI Plans
            </a>
          </div>
          <div>
            <a href="#accessories" className="hover:text-white transition-colors block py-1 text-neutral-400">
              Accessories &amp; Audio
            </a>
          </div>
          <div>
            <a href="#compare" className="hover:text-white transition-colors block py-1 text-neutral-400">
              Compare Phones
            </a>
          </div>
          <div>
            <button
              onClick={onOpenReviews}
              className="hover:text-white transition-colors text-left block py-1 cursor-pointer text-neutral-400"
            >
              Customer Reviews &amp; Ratings
            </button>
          </div>
        </div>

        {/* Col 3: Store Address & Customer Services */}
        <div className="md:col-span-4 space-y-3.5 text-xs">
          <div className="text-white uppercase text-[11px] font-bold tracking-[0.18em]">
            Store Location &amp; Contact
          </div>
          <div className="space-y-2.5 text-neutral-400">
            <div className="flex items-start gap-2.5">
              <MapPin size={14} className="shrink-0 text-white mt-0.5" />
              <span>JHQJ+7PC Vijay Nagar Colony, Pithampur Industrial Area, Madhya Pradesh</span>
            </div>
            <div className="flex items-center gap-2.5">
              <Phone size={14} className="shrink-0 text-white" />
              <a href="tel:+919691011335" className="hover:text-white transition-colors">
                +91 96910 11335 (Direct Showroom Hotline &amp; Support)
              </a>
            </div>
            <div className="flex items-center gap-2.5">
              <Mail size={14} className="shrink-0 text-white" />
              <span>support@radhaswamigallery.in</span>
            </div>
            <a
              href="https://www.instagram.com/newradhaswamimobilegallery/?hl=en"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2.5 hover:text-white transition-colors group"
            >
              <Instagram size={14} className="shrink-0 text-[#E1306C] group-hover:scale-110 transition-transform" />
              <span className="text-white font-medium">@newradhaswamimobilegallery (Official Instagram)</span>
            </a>
          </div>

          <div className="pt-3 border-t border-white/10 flex flex-wrap gap-2 text-[11px]">
            <button
              onClick={onOpenTerms}
              className="px-3 py-1.5 rounded-lg bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 text-neutral-300 hover:text-white transition-colors cursor-pointer"
            >
              Terms &amp; Conditions
            </button>
            <button
              onClick={onOpenTerms}
              className="px-3 py-1.5 rounded-lg bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 text-neutral-300 hover:text-white transition-colors cursor-pointer"
            >
              7-Day DOA &amp; Warranty Policy
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Legal & Back to Top */}
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between pt-6 text-xs text-neutral-500 gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <span>© {new Date().getFullYear()} New Radhaswami Mobile Gallery. All rights reserved.</span>
          <span>•</span>
          <button onClick={onOpenTerms} className="hover:underline text-neutral-400 hover:text-white">
            100% Genuine Sealed Indian Retail Stock
          </button>
        </div>

        <MagneticButton
          onClick={scrollToTop}
          className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 hover:border-white text-neutral-400 hover:text-white transition-colors cursor-pointer"
        >
          <span>Return to Top</span>
          <ArrowUp size={12} />
        </MagneticButton>
      </div>
    </footer>
  );
};
