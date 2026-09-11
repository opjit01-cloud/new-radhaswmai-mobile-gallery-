import React from 'react';
import { MapPin, Phone, Mail, Clock, ShieldCheck, Sparkles, MessageCircle, Heart } from 'lucide-react';

export const StoreFooter: React.FC = () => {
  return (
    <footer id="store-location" className="bg-[#05070A] text-white border-t border-white/10 pt-20 pb-12 px-4 md:px-8">
      <div className="max-w-7xl mx-auto space-y-16">
        
        {/* Brand Banner & Store Intro */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pb-12 border-b border-white/10">
          
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gold to-[#7A5C05] flex items-center justify-center shadow-glow-gold">
                <span className="font-display font-extrabold text-black text-lg">NR</span>
              </div>
              <div>
                <h3 className="text-xl font-display font-bold text-white">NEW RADHASWAMI</h3>
                <p className="text-[10px] font-mono text-gold uppercase tracking-widest">MOBILE GALLERY</p>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-gray-400 font-light leading-relaxed max-w-md">
              Your most trusted flagship smartphone &amp; luxury electronics destination. Providing 100% original sealed products, official brand warranty, best exchange valuations, and 0% No-Cost EMI solutions.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://wa.me/919691011335?text=Hello%20New%20Radhaswami%20Mobile%20Gallery,%20I%20want%20to%20know%20more%20about%20your%20offers"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-semibold text-xs hover:bg-emerald-500/20 transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Chat on WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Store Location & Contact Grid */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-8">
            
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-gold font-mono text-xs uppercase">
                <MapPin className="w-4 h-4" />
                <span>STORE LOCATION</span>
              </div>
              <p className="text-xs text-gray-300 font-light leading-relaxed">
                <strong className="text-white font-medium">New Radhaswami Mobile &amp; Electronics Gallery</strong><br />
                JHQJ+7PC Vijay Nagar Colony,<br />
                Pithampur Industrial Area, Madhya Pradesh<br />
                Pincode: 454775
              </p>
              <div className="pt-2">
                <a
                  href="https://www.google.com/maps/search/?api=1&query=JHQJ%2B7PC+Vijay+Nagar+Colony+Pithampur+Industrial+Area+Madhya+Pradesh"
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs font-mono text-cyan-400 hover:underline inline-flex items-center gap-1"
                >
                  <span>Open in Google Maps</span> ➔
                </a>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2 text-gold font-mono text-xs uppercase">
                <Clock className="w-4 h-4" />
                <span>BUSINESS HOURS</span>
              </div>
              <div className="space-y-1.5 text-xs text-gray-300 font-light">
                <div className="flex justify-between">
                  <span>Monday – Saturday:</span>
                  <span className="text-white font-mono">10:00 AM – 10:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>Sunday:</span>
                  <span className="text-emerald-400 font-mono">11:00 AM – 9:00 PM</span>
                </div>
              </div>

              <div className="pt-3 space-y-1 text-xs">
                <a href="tel:+919691011335" className="flex items-center gap-2 text-gray-300 hover:text-gold transition-colors">
                  <Phone className="w-3.5 h-3.5 text-gold" />
                  <span>+91 96910 11335</span>
                </a>
                <div className="flex items-center gap-2 text-gray-400">
                  <Mail className="w-3.5 h-3.5 text-gold" />
                  <span>care@newradhaswamimobile.com</span>
                </div>
              </div>
            </div>

          </div>

        </div>

        {/* Authorized Brands Marquee */}
        <div className="space-y-4 text-center">
          <p className="text-[11px] font-mono text-gray-500 uppercase tracking-widest">
            AUTHORIZED BRAND PARTNERS &amp; GENUINE WARRANTY STATIONS
          </p>
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-12 opacity-60 text-sm font-display font-semibold text-gray-300">
            <span>APPLE</span>
            <span>SAMSUNG</span>
            <span>ONEPLUS</span>
            <span>NOTHING</span>
            <span>SONY</span>
            <span>XIAOMI</span>
            <span>ANKER</span>
            <span>PITAKA</span>
            <span>MARSHALL</span>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-gray-500">
          <div>
            © {new Date().getFullYear()} NEW RADHASWAMI MOBILE GALLERY. All Rights Reserved.
          </div>
          <div className="flex items-center gap-1">
            <span>Crafted for Luxury Mobile Retail</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
