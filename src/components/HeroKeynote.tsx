import React, { useState, useEffect } from 'react';
import { ArrowRight, ShieldCheck, Sparkles, MessageCircle, CreditCard, Award, Flame, Cpu, Camera, BatteryCharging, Check, Clock, ChevronRight } from 'lucide-react';
import { Product } from '../data/products';

interface HeroKeynoteProps {
  onExplore: () => void;
  onOpenEmi: () => void;
  onOpenCompare: () => void;
  onAddToCart: (product: Product, selectedColor: string, storage?: string) => void;
}

export const HeroKeynote: React.FC<HeroKeynoteProps> = ({
  onExplore,
  onOpenEmi,
  onOpenCompare,
  onAddToCart
}) => {
  const colors = [
    { name: 'Desert Titanium', hex: '#C2A387', image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=1200&q=85', tag: 'Signature 2026 Finish' },
    { name: 'Natural Titanium', hex: '#9E9B94', image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=1200&q=85', tag: 'Raw Industrial Grade' },
    { name: 'White Titanium', hex: '#E3E4E5', image: 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&w=1200&q=85', tag: 'Surgical Ceramic Tone' },
    { name: 'Black Titanium', hex: '#2A2A2D', image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02560?auto=format&fit=crop&w=1200&q=85', tag: 'Deep Space Obsidian' }
  ];

  const storages = [
    { size: '256GB', price: 144900, emi: 6038 },
    { size: '512GB', price: 164900, emi: 6870 },
    { size: '1TB', price: 184900, emi: 7704 }
  ];

  const [selectedColorIndex, setSelectedColorIndex] = useState(0);
  const [selectedStorageIndex, setSelectedStorageIndex] = useState(0);

  // Flash deal countdown timer
  const [timeLeft, setTimeLeft] = useState({ hours: 7, minutes: 34, seconds: 22 });
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 8, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const activeColor = colors[selectedColorIndex];
  const activeStorage = storages[selectedStorageIndex];

  const handleHeroAdd = () => {
    const dummyProduct: Product = {
      id: 'iphone-16-pro-max',
      name: `iPhone 16 Pro Max (${activeStorage.size})`,
      brand: 'Apple',
      category: 'smartphones',
      price: activeStorage.price,
      originalPrice: activeStorage.price + 15000,
      rating: 4.9,
      reviewsCount: 342,
      image: activeColor.image,
      colors: colors.map(c => ({ name: c.name, hex: c.hex })),
      emiStartsAt: activeStorage.emi,
      specs: {
        'Processor': 'Apple A18 Pro (3nm)',
        'Storage': activeStorage.size,
        'Display': '6.9" Super Retina XDR 120Hz',
        'Camera': '48MP Fusion Triple'
      },
      description: 'Forged in titanium with A18 Pro silicon.',
      inStock: true
    };
    onAddToCart(dummyProduct, activeColor.name, activeStorage.size);
  };

  return (
    <section className="relative overflow-hidden pt-8 pb-16 px-4 md:px-8 border-b border-white/5">
      {/* Subtle ambient lighting */}
      <div 
        className="absolute top-10 left-1/2 -translate-x-1/2 w-[800px] h-[400px] blur-[150px] rounded-full pointer-events-none opacity-20 transition-all duration-700"
        style={{ backgroundColor: activeColor.hex }}
      />

      <div className="max-w-7xl mx-auto relative z-10">

        {/* Live Deal Banner Bar */}
        <div className="mb-8 p-3 sm:p-4 rounded-2xl bg-[#0D121B] border border-white/10 flex flex-wrap items-center justify-between gap-4 shadow-xl">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-white/10 border border-white/20 text-white">
              <Flame className="w-5 h-5 animate-pulse text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-white uppercase tracking-wider">
                  Festival of Innovation Sale
                </span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-mono font-bold">
                  SAVE ₹15,000 INSTANT
                </span>
              </div>
              <p className="text-xs text-neutral-400 hidden sm:block">
                Complimentary MagSafe 25W Charger + 1 Year AppleCare Support with every Pro device.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 text-xs font-mono bg-black/40 px-3 py-1.5 rounded-xl border border-white/10">
              <Clock className="w-3.5 h-3.5 text-white" />
              <span className="text-white font-bold">{String(timeLeft.hours).padStart(2, '0')}h</span>
              <span className="text-gray-500">:</span>
              <span className="text-white font-bold">{String(timeLeft.minutes).padStart(2, '0')}m</span>
              <span className="text-gray-500">:</span>
              <span className="text-white font-bold">{String(timeLeft.seconds).padStart(2, '0')}s</span>
            </div>
            <button
              onClick={onExplore}
              className="text-xs font-semibold text-white hover:text-neutral-300 flex items-center gap-1 transition-colors cursor-pointer underline underline-offset-2"
            >
              <span>View Offers</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Keynote Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          {/* Left Column: Editorial Device Typography & Live Configurator */}
          <div className="lg:col-span-6 flex flex-col justify-center">
            
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 w-fit mb-5">
              <span className="w-2 h-2 rounded-full bg-white animate-ping" />
              <span className="text-[11px] font-mono uppercase tracking-widest text-neutral-300 font-semibold">
                APPLE AUTHORISED SHOWCASE // IN STOCK
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-extrabold text-white tracking-tight leading-[1.06]">
              iPhone 16 <span className="bg-gradient-to-r from-white via-[#E2E8F0] to-[#94A3B8] bg-clip-text text-transparent">Pro Max</span>
            </h1>
            
            <p className="mt-4 text-base sm:text-lg text-neutral-300 font-light leading-relaxed">
              Forged in <strong className="text-white font-semibold">Grade 5 Aerospace Titanium</strong>. Armed with the revolutionary <strong className="text-white font-semibold">A18 Pro (3nm)</strong> neural architecture, studio 48MP Fusion optics, and industry-benchmark 33-hour battery endurance.
            </p>

            {/* Spec Highlights Micro Grid */}
            <div className="mt-6 grid grid-cols-3 gap-3">
              <div className="p-3 rounded-xl bg-[#0F141F] border border-white/10">
                <Cpu className="w-4 h-4 text-white mb-1" />
                <div className="text-xs font-bold text-white">A18 Pro</div>
                <div className="text-[10px] text-neutral-400 font-mono">3nm 6-Core GPU</div>
              </div>
              <div className="p-3 rounded-xl bg-[#0F141F] border border-white/10">
                <Camera className="w-4 h-4 text-cyan-400 mb-1" />
                <div className="text-xs font-bold text-white">48MP Triple</div>
                <div className="text-[10px] text-neutral-400 font-mono">5x Tetraprism</div>
              </div>
              <div className="p-3 rounded-xl bg-[#0F141F] border border-white/10">
                <BatteryCharging className="w-4 h-4 text-emerald-400 mb-1" />
                <div className="text-xs font-bold text-white">33h MagSafe</div>
                <div className="text-[10px] text-neutral-400 font-mono">All-Day Power</div>
              </div>
            </div>

            {/* Interactive Color Switcher */}
            <div className="mt-7">
              <div className="flex items-center justify-between text-xs mb-2.5">
                <span className="text-neutral-400">Finish: <strong className="text-white font-semibold">{activeColor.name}</strong></span>
                <span className="text-[11px] font-mono text-neutral-300">{activeColor.tag}</span>
              </div>
              <div className="flex items-center gap-3">
                {colors.map((color, idx) => (
                  <button
                    key={color.name}
                    onClick={() => setSelectedColorIndex(idx)}
                    className={`relative p-1 rounded-full transition-all cursor-pointer ${
                      selectedColorIndex === idx
                        ? 'ring-2 ring-white ring-offset-2 ring-offset-[#07090E] scale-110'
                        : 'opacity-70 hover:opacity-100 hover:scale-105'
                    }`}
                    title={color.name}
                  >
                    <span 
                      className="block w-7 h-7 rounded-full shadow-inner border border-white/20"
                      style={{ backgroundColor: color.hex }}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Interactive Storage Switcher */}
            <div className="mt-6">
              <div className="text-xs text-neutral-400 mb-2">Storage Capacity:</div>
              <div className="grid grid-cols-3 gap-2.5">
                {storages.map((storage, idx) => (
                  <button
                    key={storage.size}
                    onClick={() => setSelectedStorageIndex(idx)}
                    className={`py-2 px-3 rounded-xl border text-center transition-all cursor-pointer ${
                      selectedStorageIndex === idx
                        ? 'border-white bg-white/10 text-white font-bold shadow-md shadow-white/5'
                        : 'border-white/10 bg-[#0F141F] text-neutral-400 hover:text-white hover:border-white/20'
                    }`}
                  >
                    <div className="text-xs font-bold">{storage.size}</div>
                    <div className="text-[10px] font-mono text-neutral-400">₹{storage.price.toLocaleString('en-IN')}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Price & EMI Live Display */}
            <div className="mt-7 p-4 rounded-2xl bg-[#0D121B] border border-white/10 flex items-center justify-between">
              <div>
                <div className="text-[11px] text-neutral-400 uppercase tracking-wider font-mono">Special Direct Store Price</div>
                <div className="flex items-baseline gap-2 mt-0.5">
                  <span className="text-2xl sm:text-3xl font-display font-extrabold text-white">
                    ₹{activeStorage.price.toLocaleString('en-IN')}
                  </span>
                  <span className="text-xs text-neutral-500 line-through">
                    ₹{(activeStorage.price + 15000).toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-[11px] font-mono text-emerald-400 font-semibold">0% No-Cost EMI</div>
                <div className="text-sm font-bold text-white">
                  from ₹{activeStorage.emi.toLocaleString('en-IN')}<span className="text-xs text-neutral-400">/mo</span>
                </div>
              </div>
            </div>

            {/* Primary Action Buttons */}
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <button
                onClick={handleHeroAdd}
                className="flex-1 min-w-[200px] flex items-center justify-center gap-2 bg-white hover:bg-neutral-200 text-black font-extrabold text-xs sm:text-sm py-3.5 px-6 rounded-xl shadow-lg transition-all active:scale-95 cursor-pointer"
              >
                <span>Add to Bag ({activeStorage.size})</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <a
                href={`https://wa.me/919691011335?text=${encodeURIComponent(`Hello New Radhaswami Mobile Gallery! I want to purchase iPhone 16 Pro Max ${activeStorage.size} in ${activeColor.name} for ₹${activeStorage.price.toLocaleString('en-IN')}. Please confirm sealed unit availability.`)}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2 bg-[#1B2921] hover:bg-[#22352B] border border-emerald-500/40 text-emerald-400 font-semibold text-xs sm:text-sm py-3.5 px-5 rounded-xl transition-all cursor-pointer active:scale-95"
              >
                <MessageCircle className="w-4 h-4 text-emerald-400" />
                <span>WhatsApp Buy</span>
              </a>

              <button
                onClick={onOpenCompare}
                className="flex items-center justify-center gap-1.5 bg-[#141A25] hover:bg-[#1C2534] border border-white/10 text-neutral-300 hover:text-white text-xs sm:text-sm py-3.5 px-4 rounded-xl transition-all cursor-pointer"
              >
                <span>Compare Specs</span>
              </button>
            </div>

          </div>

          {/* Right Column: High-Res Studio Showcase with Real Depth Lighting */}
          <div className="lg:col-span-6 flex flex-col items-center justify-center relative">
            
            {/* Studio Device Stage */}
            <div className="relative w-full max-w-lg aspect-[4/5] rounded-3xl overflow-hidden border border-white/15 bg-gradient-to-b from-[#131924] to-[#0A0D13] p-6 flex flex-col items-center justify-between shadow-2xl group">
              
              {/* Top Card Badges */}
              <div className="w-full flex items-center justify-between z-10">
                <span className="px-3 py-1 rounded-full bg-black/60 border border-white/10 text-[10px] font-mono text-neutral-300">
                  INDIAN SEALED STOCK
                </span>
                <span className="px-3 py-1 rounded-full bg-white/10 border border-white/20 text-[10px] font-mono text-white font-semibold">
                  100% APPLE WARRANTY
                </span>
              </div>

              {/* High Resolution Device Photography with Natural Reflections */}
              <div className="relative w-full h-[320px] sm:h-[380px] my-auto flex items-center justify-center overflow-hidden rounded-2xl">
                <img
                  src={activeColor.image}
                  alt={`iPhone 16 Pro Max ${activeColor.name}`}
                  className="w-full h-full object-cover object-center transform transition-transform duration-700 ease-out group-hover:scale-105"
                  loading="eager"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A0D13] via-transparent to-transparent opacity-60" />
              </div>

              {/* Bottom Card Specs Ribbon */}
              <div className="w-full grid grid-cols-3 gap-2 pt-3 border-t border-white/10 z-10 text-center">
                <div>
                  <div className="text-[10px] text-neutral-400 font-mono">FINISH</div>
                  <div className="text-xs font-semibold text-white">{activeColor.name}</div>
                </div>
                <div>
                  <div className="text-[10px] text-neutral-400 font-mono">STORAGE</div>
                  <div className="text-xs font-semibold text-white">{activeStorage.size} NVMe</div>
                </div>
                <div>
                  <div className="text-[10px] text-neutral-400 font-mono">DELIVERY</div>
                  <div className="text-xs font-semibold text-emerald-400">2h Express</div>
                </div>
              </div>

            </div>

            {/* Quick-Jump to Galaxy S25 Ultra */}
            <div className="mt-4 flex items-center gap-2 text-xs text-neutral-400">
              <span>Looking for Android Flagship?</span>
              <button
                onClick={onOpenCompare}
                className="text-white hover:underline font-semibold flex items-center gap-1 cursor-pointer"
              >
                <span>Check Samsung Galaxy S25 Ultra</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>

        </div>

        {/* Store Trust Assurance Bar */}
        <div className="mt-14 pt-8 border-t border-white/10 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-[#0C1017] border border-white/5 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-white shrink-0 mt-0.5" />
            <div>
              <div className="text-xs font-bold text-white">100% Sealed Indian Stock</div>
              <div className="text-[11px] text-neutral-400 mt-0.5">With Official Brand GST Invoice &amp; 1-Year National Warranty.</div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#0C1017] border border-white/5 flex items-start gap-3">
            <CreditCard className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
            <div>
              <div className="text-xs font-bold text-white">0% No-Cost EMI Approval</div>
              <div className="text-[11px] text-gray-400 mt-0.5">Paperless instant approval via Bajaj Finserv, HDFC &amp; ICICI.</div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#0C1017] border border-white/5 flex items-start gap-3">
            <Award className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <div className="text-xs font-bold text-white">Instant Data Migration</div>
              <div className="text-[11px] text-gray-400 mt-0.5">Free WhatsApp &amp; Contacts transfer in-store or over video concierge.</div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#0C1017] border border-white/5 flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
            <div>
              <div className="text-xs font-bold text-white">Guaranteed Exchange Bonus</div>
              <div className="text-[11px] text-gray-400 mt-0.5">Up to ₹12,000 additional trade-in value on your old smartphone.</div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
