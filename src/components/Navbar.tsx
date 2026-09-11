import React, { useState } from 'react';
import { ShoppingBag, Search, Phone, Sparkles, Menu, X, ArrowRight, GitCompare, Calculator, Truck, CheckCircle2 } from 'lucide-react';

interface NavbarProps {
  cartCount: number;
  onOpenCart: () => void;
  searchTerm: string;
  onSearchChange: (val: string) => void;
  activeCategory: string;
  onSelectCategory: (cat: string) => void;
  onOpenTrackOrder: () => void;
  onOpenCompare: () => void;
  onOpenEmi: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  cartCount,
  onOpenCart,
  searchTerm,
  onSearchChange,
  activeCategory,
  onSelectCategory,
  onOpenTrackOrder,
  onOpenCompare,
  onOpenEmi
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);

  const categories = [
    { id: 'all', label: 'All Catalog' },
    { id: 'smartphones', label: 'Flagship Phones' },
    { id: 'audio', label: 'Pro Audio' },
    { id: 'watches', label: 'Wearables' },
    { id: 'chargers', label: 'Power & MagSafe' },
    { id: 'accessories', label: 'Armor & Gear' },
  ];

  return (
    <>
      {/* Top VIP Marquee Announcement Bar */}
      <div className="bg-[#0A0D14] border-b border-white/5 py-1.5 px-4 text-xs font-mono text-gray-300">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-2">
          <div className="flex items-center gap-2 text-[11px]">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/10 border border-white/15 text-white font-semibold tracking-wider uppercase text-[10px]">
              <Sparkles className="w-3 h-3 text-white" />
              OFFICIAL AUTHORISED PARTNER
            </span>
            <span className="text-neutral-500 hidden sm:inline">•</span>
            <span className="text-neutral-400 hidden sm:inline">100% Brand Sealed Indian Units with GST Invoicing</span>
          </div>

          <div className="flex items-center gap-4 text-[11px] text-gray-300">
            <button
              onClick={onOpenTrackOrder}
              className="flex items-center gap-1 text-neutral-300 hover:text-white transition-colors cursor-pointer"
            >
              <Truck className="w-3.5 h-3.5 text-neutral-300" />
              <span>Track Order</span>
            </button>
            <a 
              href="https://wa.me/919691011335?text=Hello%20New%20Radhaswami%20Mobile%20Gallery,%20I%20want%20to%20inquire%20about%20a%20flagship%20phone"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1 text-emerald-400 hover:text-emerald-300 transition-colors"
            >
              <Phone className="w-3 h-3" />
              <span>+91 96910 11335</span>
            </a>
            <span className="hidden md:flex items-center gap-1.5 text-emerald-400 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
              Open Today till 9:30 PM
            </span>
          </div>
        </div>
      </div>

      {/* Main Glass Header */}
      <header className="sticky top-0 z-50 glass-panel border-b border-white/10 px-4 md:px-8 py-3.5 transition-all">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          
          {/* Brand Logo */}
          <a href="#" className="flex items-center gap-3 group shrink-0">
            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-lg shadow-white/5 transition-transform group-hover:scale-105">
              <span className="font-display font-extrabold text-black text-lg tracking-wider">NR</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-display text-base sm:text-lg font-bold tracking-tight text-white group-hover:text-neutral-200 transition-colors">
                  NEW RADHASWAMI
                </span>
                <span className="px-1.5 py-0.5 rounded bg-white/10 border border-white/20 text-[9px] font-mono text-white font-semibold uppercase">
                  GALLERY
                </span>
              </div>
              <p className="text-[10px] text-neutral-400 tracking-wide font-sans hidden sm:block">
                Flagship Tech • 0% EMI • Official Warranty
              </p>
            </div>
          </a>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-md relative mx-2">
            <div className={`w-full flex items-center gap-2 bg-[#0F141E] border ${searchFocused ? 'border-white shadow-[0_0_15px_rgba(255,255,255,0.15)]' : 'border-white/10'} rounded-full px-4 py-2 transition-all`}>
              <Search className="w-4 h-4 text-neutral-400 shrink-0" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                placeholder="Search iPhone 16 Pro, S25 Ultra, Sony XM5..."
                className="bg-transparent border-none outline-none text-xs text-white placeholder-neutral-500 w-full font-sans"
              />
              {searchTerm && (
                <button
                  onClick={() => onSearchChange('')}
                  className="text-neutral-400 hover:text-white text-xs px-1"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Quick Nav Links */}
          <nav className="hidden lg:flex items-center gap-5 text-xs font-medium text-neutral-300">
            <button
              onClick={onOpenCompare}
              className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer py-1"
            >
              <GitCompare className="w-3.5 h-3.5 text-neutral-300" />
              <span>Compare Specs</span>
            </button>
            <button
              onClick={onOpenEmi}
              className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer py-1"
            >
              <Calculator className="w-3.5 h-3.5 text-neutral-300" />
              <span>0% EMI Studio</span>
            </button>
            <button
              onClick={onOpenTrackOrder}
              className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer py-1 text-neutral-400"
            >
              <Truck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Live Tracking</span>
            </button>
          </nav>

          {/* Cart & Mobile Toggle */}
          <div className="flex items-center gap-3">
            {/* Bag Button */}
            <button
              onClick={onOpenCart}
              className="relative flex items-center gap-2.5 bg-[#141A25] hover:bg-[#1C2534] border border-white/15 hover:border-white/30 text-white px-4 py-2 rounded-full transition-all cursor-pointer shadow-sm active:scale-95"
            >
              <ShoppingBag className="w-4 h-4 text-white" />
              <span className="text-xs font-semibold hidden sm:inline font-display">Bag</span>
              {cartCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-white text-black text-[10px] font-extrabold flex items-center justify-center animate-pulse">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-white/5 border border-white/10 text-neutral-300 hover:text-white lg:hidden cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>

        {/* Category Jump Tabs (Sub-nav) */}
        <div className="max-w-7xl mx-auto mt-3 pt-3 border-t border-white/5 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                activeCategory === cat.id
                  ? 'bg-white text-black font-bold shadow-md'
                  : 'bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white border border-white/5'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Mobile Flyout Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden mt-4 pt-4 border-t border-white/10 flex flex-col gap-3">
            <div className="flex items-center gap-2 bg-[#0F141E] border border-white/15 rounded-xl px-3 py-2">
              <Search className="w-4 h-4 text-neutral-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search phone or audio..."
                className="bg-transparent border-none outline-none text-xs text-white placeholder-neutral-500 w-full"
              />
            </div>
            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                onClick={() => { onOpenCompare(); setMobileMenuOpen(false); }}
                className="flex items-center justify-center gap-2 p-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-neutral-200"
              >
                <GitCompare className="w-4 h-4 text-neutral-300" />
                <span>Compare Flagships</span>
              </button>
              <button
                onClick={() => { onOpenEmi(); setMobileMenuOpen(false); }}
                className="flex items-center justify-center gap-2 p-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-neutral-200"
              >
                <Calculator className="w-4 h-4 text-white" />
                <span>0% EMI Suite</span>
              </button>
            </div>
            <button
              onClick={() => { onOpenTrackOrder(); setMobileMenuOpen(false); }}
              className="flex items-center justify-center gap-2 p-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-neutral-200"
            >
              <Truck className="w-4 h-4 text-emerald-400" />
              <span>Track Existing Order</span>
            </button>
          </div>
        )}
      </header>
    </>
  );
};
