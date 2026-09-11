import React, { useState, useEffect } from 'react';
import { ShoppingBag, User, Search, Menu, X, Sparkles, ShieldCheck, ArrowUpRight, ArrowLeft, Instagram, Megaphone } from 'lucide-react';
import { MagneticButton } from '../common/MagneticButton';
import { ShinyText } from '../reactbits/ShinyText';
import { ClickSpark } from '../reactbits/ClickSpark';
import { ThemeToggle } from '../common/ThemeToggle';

interface StoreHeaderProps {
  cartCount: number;
  onOpenCart: () => void;
  onOpenAuth: () => void;
  onOpenTracking: () => void;
  currentUser: { name: string; phone?: string; email?: string } | null;
  onSearchQuery?: (q: string) => void;
  currentPage: 'showroom' | 'shop';
  onNavigatePage: (page: 'showroom' | 'shop') => void;
  onNavigateSection?: (sectionId: string) => void;
  onOpenPortal?: () => void;
}

export const StoreHeader: React.FC<StoreHeaderProps> = ({
  cartCount,
  onOpenCart,
  onOpenAuth,
  onOpenTracking,
  currentUser,
  onSearchQuery,
  currentPage,
  onNavigatePage,
  onNavigateSection,
  onOpenPortal
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    if (onSearchQuery) onSearchQuery(e.target.value);
  };

  const scrollToSection = (id: string) => {
    if (currentPage !== 'showroom') {
      onNavigatePage('showroom');
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
  };

  return (
    <header className="fixed top-2 sm:top-3.5 inset-x-0 z-50 flex justify-center px-2.5 sm:px-6 pointer-events-none transition-all duration-300 font-sans">
      <div
        className={`pointer-events-auto w-full max-w-7xl mx-auto rounded-full transition-all duration-300 flex items-center justify-between px-3 sm:px-5 py-2 sm:py-2.5 ${
          scrolled
            ? 'bg-white/95 dark:bg-[#0B0E14]/95 backdrop-blur-2xl border border-neutral-200/90 dark:border-white/10 shadow-[0_12px_32px_rgba(0,0,0,0.06)] dark:shadow-[0_12px_32px_rgba(0,0,0,0.5)] text-neutral-900 dark:text-white'
            : 'bg-white/90 dark:bg-[#0B0E14]/85 backdrop-blur-xl border border-neutral-200/80 dark:border-white/10 shadow-[0_6px_20px_rgba(0,0,0,0.04)] dark:shadow-[0_6px_20px_rgba(0,0,0,0.4)] text-neutral-900 dark:text-white'
        }`}
      >
        
        {/* Brand Logo & Editorial Monogram (shrink-0: always pristine, never squished or clipped) */}
        <a
          href="#showroom"
          onClick={(e) => {
            e.preventDefault();
            onNavigatePage('showroom');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="flex items-center gap-2 sm:gap-3 group shrink-0"
        >
          {/* Official Brand Logo */}
          <div className="relative w-8 h-8 sm:w-10 sm:h-10 rounded-full p-[1px] bg-neutral-200 dark:bg-white/15 group-hover:border-neutral-400 shadow-sm transition-all shrink-0 overflow-hidden">
            <img src="/nrs-logo.png" alt="New Radhaswami Mobile Gallery" className="w-full h-full object-cover rounded-full" />
          </div>

          <div className="flex flex-col justify-center">
            <div className="font-serif-luxury text-xs sm:text-base lg:text-lg font-bold tracking-[0.06em] text-neutral-900 dark:text-white flex items-center gap-1.5 leading-none whitespace-nowrap">
              <span>NEW RADHASWAMI</span>
            </div>
            <div className="hidden sm:block text-[8px] lg:text-[8.5px] tracking-[0.2em] text-neutral-500 dark:text-neutral-400 uppercase font-bold mt-0.5 whitespace-nowrap">
              FLAGSHIP GALLERY • PITHAMPUR (MP)
            </div>
          </div>
        </a>

        {/* PRIMARY VIEW TABS (DESKTOP: SHOWROOM VS SEPARATE SHOP PAGE) */}
        <nav className="hidden md:flex items-center gap-1 bg-neutral-100/90 dark:bg-white/10 p-1 rounded-full border border-neutral-200/80 dark:border-white/10 shrink-0">
          {/* 1. Showroom Experience */}
          <button
            onClick={() => {
              onNavigatePage('showroom');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`px-3.5 py-1.5 rounded-full text-[11px] uppercase tracking-[0.14em] font-bold transition-all duration-200 cursor-pointer ${
              currentPage === 'showroom'
                ? 'bg-black dark:bg-white text-white dark:text-black shadow-sm'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white hover:bg-neutral-200/60 dark:hover:bg-white/10'
            }`}
          >
            Showroom
          </button>

          {/* 2. DEDICATED SEPARATE SHOP PAGE TAB */}
          <button
            onClick={() => onNavigatePage('shop')}
            className={`px-3.5 py-1.5 rounded-full text-[11px] uppercase tracking-[0.14em] font-bold transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
              currentPage === 'shop'
                ? 'bg-black dark:bg-white text-white dark:text-black shadow-sm'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white hover:bg-neutral-200/60 dark:hover:bg-white/10'
            }`}
          >
            <Sparkles size={11} className={currentPage === 'shop' ? 'text-white dark:text-black' : 'text-neutral-500 dark:text-neutral-400'} />
            <span>Shop Boutique</span>
            <span className={`text-[8.5px] px-1.5 py-0.2 rounded font-mono font-extrabold ${
              currentPage === 'shop' ? 'bg-white dark:bg-black text-black dark:text-white' : 'bg-neutral-200 dark:bg-white/20 text-neutral-700 dark:text-neutral-300'
            }`}>
              TAB
            </span>
          </button>

          {/* Experiential Shortcuts (Visible on 2XL screens where abundant width is present) */}
          <div className="hidden 2xl:flex items-center">
            <div className="h-3 w-px bg-neutral-300 dark:bg-white/15 mx-1" />
            <button
              onClick={() => scrollToSection('handset-3d-studio')}
              className="px-2.5 py-1.5 rounded-full text-[10.5px] uppercase tracking-[0.12em] text-neutral-500 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors cursor-pointer"
            >
              3D Studio
            </button>
            <button
              onClick={() => scrollToSection('emi-studio')}
              className="px-2.5 py-1.5 rounded-full text-[10.5px] uppercase tracking-[0.12em] text-neutral-500 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors cursor-pointer"
            >
              0% EMI
            </button>
            <button
              onClick={() => scrollToSection('compare')}
              className="px-2.5 py-1.5 rounded-full text-[10.5px] uppercase tracking-[0.12em] text-neutral-500 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors cursor-pointer"
            >
              Compare
            </button>
          </div>
        </nav>

        {/* MOBILE QUICK TAB SWITCHER (< md) */}
        <div className="md:hidden flex items-center bg-neutral-100 dark:bg-white/10 p-0.5 rounded-full border border-neutral-200 dark:border-white/10 shrink-0 mx-1">
          <button
            onClick={() => onNavigatePage('showroom')}
            className={`px-2.5 py-1 rounded-full text-[10px] uppercase font-bold tracking-wider transition-all cursor-pointer ${
              currentPage === 'showroom'
                ? 'bg-black dark:bg-white text-white dark:text-black shadow-xs'
                : 'text-neutral-500 dark:text-neutral-400 hover:text-black dark:hover:text-white'
            }`}
          >
            Tour
          </button>
          <button
            onClick={() => onNavigatePage('shop')}
            className={`px-3 py-1 rounded-full text-[10px] uppercase font-bold tracking-wider transition-all flex items-center gap-1 cursor-pointer ${
              currentPage === 'shop'
                ? 'bg-black dark:bg-white text-white dark:text-black shadow-xs'
                : 'text-neutral-500 dark:text-neutral-400 hover:text-black dark:hover:text-white'
            }`}
          >
            <span>Shop</span>
            <span className={`w-1.5 h-1.5 rounded-full ${currentPage === 'shop' ? 'bg-white dark:bg-black' : 'bg-black dark:bg-white animate-pulse'}`} />
          </button>
        </div>

        {/* Right Action Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          
          {/* Refined Minimalist Search Bar (Desktop >= lg) */}
          <div className="relative hidden lg:block">
            <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-neutral-100/90 dark:bg-white/10 border border-neutral-200/80 dark:border-white/10 focus-within:border-black dark:focus-within:border-white focus-within:bg-white dark:focus-within:bg-[#0F1117] transition-all text-xs">
              <Search size={12} className="text-neutral-400 dark:text-neutral-500" />
              <input
                type="text"
                placeholder="Search models..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="bg-transparent text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-neutral-500 outline-none w-14 xl:w-24 focus:w-36 transition-all duration-300 text-xs"
              />
              {searchTerm && (
                <button
                  onClick={() => { setSearchTerm(''); if (onSearchQuery) onSearchQuery(''); }}
                  className="text-neutral-400 hover:text-black dark:hover:text-white"
                >
                  <X size={11} />
                </button>
              )}
            </div>
          </div>

          {/* Search Trigger for Mobile / Tablet (< lg) */}
          <MagneticButton
            onClick={() => setSearchOpen(!searchOpen)}
            className="lg:hidden p-1.5 rounded-full bg-neutral-100 dark:bg-white/10 border border-neutral-200 dark:border-white/10 text-neutral-700 dark:text-neutral-300 hover:text-black dark:hover:text-white shrink-0"
            title="Search Showroom"
          >
            <Search size={14} />
          </MagneticButton>

          {/* Announcement / VIP Offers Trigger (Desktop >= xl) */}
          <MagneticButton
            onClick={() => window.dispatchEvent(new CustomEvent('open_announcement_popup'))}
            className="hidden xl:flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-amber-500/30 text-xs text-neutral-800 dark:text-neutral-200 hover:text-black dark:hover:text-white transition-all cursor-pointer bg-amber-500/10 hover:bg-amber-500/20 shrink-0"
            title="Official Showroom Announcements & Offers"
          >
            <Megaphone size={12} className="text-amber-500 animate-pulse" />
            <span className="text-[10px] tracking-wider uppercase font-bold text-amber-700 dark:text-amber-300">Offers</span>
          </MagneticButton>

          {/* Track Order Trigger (Desktop >= xl) */}
          <MagneticButton
            onClick={onOpenTracking}
            className="hidden xl:flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-neutral-200 hover:border-neutral-300 dark:border-white/15 text-xs text-neutral-700 hover:text-black dark:text-neutral-300 dark:hover:text-white transition-all cursor-pointer bg-neutral-100 hover:bg-neutral-200 dark:bg-white/5 dark:hover:bg-white/10 shrink-0"
            title="Track Order"
          >
            <ShieldCheck size={12} className="text-black dark:text-white" />
            <span className="text-[10px] tracking-wider uppercase font-semibold">Track</span>
          </MagneticButton>

          {/* VIP Concierge / Account (Tablet/Desktop >= sm) */}
          <MagneticButton
            onClick={onOpenAuth}
            className="hidden sm:flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full bg-neutral-100 dark:bg-white/10 hover:bg-neutral-200 dark:hover:bg-white/15 border border-neutral-200 dark:border-white/10 hover:border-neutral-300 text-xs text-neutral-800 dark:text-neutral-200 hover:text-black dark:hover:text-white transition-all cursor-pointer shrink-0"
            title="VIP Account"
          >
            <User size={13} className="text-black dark:text-white" />
            <span className="text-[10.5px] tracking-wider uppercase font-semibold">
              {currentUser ? currentUser.name.split(' ')[0] : 'Sign In'}
            </span>
          </MagneticButton>

          {/* Theme Toggle (Dark/Light Switcher) */}
          <ThemeToggle className="shrink-0" />

          {/* Shopping Bag Button (Solid Obsidian Black Pill, Perfectly Integrated Inside Container) */}
          <ClickSpark sparkColor="#000000" sparkCount={8}>
            <MagneticButton
              onClick={onOpenCart}
              className="relative flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-full bg-black hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-200 text-white dark:text-black font-bold text-xs uppercase tracking-wider transition-all cursor-pointer shadow-sm active:scale-95 shrink-0"
              title="Shopping Bag"
            >
              <ShoppingBag size={13} className="text-white dark:text-black" />
              <span className="hidden sm:inline text-[10.5px] font-bold text-white dark:text-black">Bag</span>
              {cartCount > 0 && (
                <span className="min-w-[15px] h-3.5 rounded-full bg-white dark:bg-black text-black dark:text-white text-[9px] font-extrabold flex items-center justify-center px-1">
                  {cartCount}
                </span>
              )}
            </MagneticButton>
          </ClickSpark>

          {/* Mobile Menu Hamburger (< md) */}
          <MagneticButton
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-1.5 sm:p-2 rounded-full bg-neutral-100 dark:bg-white/10 border border-neutral-200 dark:border-white/10 text-neutral-800 dark:text-neutral-200 hover:bg-neutral-200 dark:hover:bg-white/15 transition-colors shrink-0"
            title="Navigation Menu"
          >
            {mobileMenuOpen ? <X size={15} /> : <Menu size={15} />}
          </MagneticButton>

        </div>
      </div>

      {/* Mobile Search Dropdown */}
      {searchOpen && (
        <div className="lg:hidden fixed top-16 inset-x-4 z-50 p-3 bg-white/95 dark:bg-[#0F1117]/95 backdrop-blur-2xl rounded-2xl border border-neutral-200 dark:border-white/10 shadow-2xl animate-fade-in pointer-events-auto">
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-neutral-100 dark:bg-white/10 border border-neutral-200 dark:border-white/10 text-xs">
            <Search size={14} className="text-neutral-400 dark:text-neutral-500" />
            <input
              type="text"
              placeholder="Search iPhone, Galaxy, Pixel, OnePlus..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="bg-transparent text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-neutral-500 outline-none w-full text-xs"
            />
            {searchTerm && (
              <button
                onClick={() => { setSearchTerm(''); if (onSearchQuery) onSearchQuery(''); }}
                className="text-neutral-400 hover:text-black dark:hover:text-white"
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Mobile & Tablet Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed top-16 inset-x-4 z-50 bg-white/95 dark:bg-[#0F1117]/95 backdrop-blur-2xl rounded-3xl border border-neutral-200 dark:border-white/10 p-5 space-y-3 text-xs shadow-2xl animate-tab-in pointer-events-auto text-neutral-900 dark:text-white">
          
          <div className="text-[10px] uppercase tracking-[0.2em] text-neutral-400 dark:text-neutral-500 font-bold border-b border-neutral-200 dark:border-white/10 pb-2 mb-2 flex items-center justify-between">
            <span>Primary Navigation</span>
            <span className="text-neutral-500 dark:text-neutral-400">2 Views</span>
          </div>

          <button
            onClick={() => {
              onNavigatePage('showroom');
              setMobileMenuOpen(false);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`w-full flex items-center justify-between py-2.5 px-3 rounded-xl text-left uppercase tracking-wider text-xs transition-colors cursor-pointer ${
              currentPage === 'showroom'
                ? 'bg-black dark:bg-white text-white dark:text-black font-extrabold shadow-sm'
                : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-white/5'
            }`}
          >
            <span>Showroom Experience</span>
            <ArrowUpRight size={13} className={currentPage === 'showroom' ? 'text-white dark:text-black' : 'text-neutral-400 dark:text-neutral-500'} />
          </button>

          <button
            onClick={() => {
              onNavigatePage('shop');
              setMobileMenuOpen(false);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`w-full flex items-center justify-between py-2.5 px-3 rounded-xl text-left uppercase tracking-wider text-xs transition-colors cursor-pointer ${
              currentPage === 'shop'
                ? 'bg-black dark:bg-white text-white dark:text-black font-extrabold shadow-sm'
                : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-white/5'
            }`}
          >
            <div className="flex items-center gap-2">
              <Sparkles size={12} className={currentPage === 'shop' ? 'text-white dark:text-black' : 'text-neutral-600 dark:text-neutral-400'} />
              <span>Shop Boutique (New Page)</span>
            </div>
            <ArrowUpRight size={13} className={currentPage === 'shop' ? 'text-white dark:text-black' : 'text-neutral-400 dark:text-neutral-500'} />
          </button>

          <div className="text-[10px] uppercase tracking-[0.2em] text-neutral-400 dark:text-neutral-500 font-bold border-b border-neutral-200 dark:border-white/10 pt-2 pb-1 flex items-center justify-between">
            <span>Showroom Highlights</span>
          </div>

          <button
            onClick={() => scrollToSection('handset-3d-studio')}
            className="w-full flex items-center justify-between py-2 px-3 rounded-xl hover:bg-neutral-100 dark:hover:bg-white/5 text-neutral-700 dark:text-neutral-300 text-left uppercase tracking-wider text-xs cursor-pointer"
          >
            <span>360° Titanium Studio</span>
            <ArrowUpRight size={12} className="text-neutral-400 dark:text-neutral-500" />
          </button>

          <button
            onClick={() => scrollToSection('emi-studio')}
            className="w-full flex items-center justify-between py-2 px-3 rounded-xl hover:bg-neutral-100 dark:hover:bg-white/5 text-neutral-700 dark:text-neutral-300 text-left uppercase tracking-wider text-xs cursor-pointer"
          >
            <span>0% EMI Plans</span>
            <ArrowUpRight size={12} className="text-neutral-400 dark:text-neutral-500" />
          </button>

          <button
            onClick={() => scrollToSection('compare')}
            className="w-full flex items-center justify-between py-2 px-3 rounded-xl hover:bg-neutral-100 dark:hover:bg-white/5 text-neutral-700 dark:text-neutral-300 text-left uppercase tracking-wider text-xs cursor-pointer"
          >
            <span>Compare Phones</span>
            <ArrowUpRight size={12} className="text-neutral-400 dark:text-neutral-500" />
          </button>

          {/* Official Announcements & VIP Offers (Mobile Trigger) */}
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              window.dispatchEvent(new CustomEvent('open_announcement_popup'));
            }}
            className="w-full flex items-center justify-between p-2.5 rounded-xl bg-amber-500/10 dark:bg-amber-500/20 border border-amber-500/30 text-amber-800 dark:text-amber-200 text-left uppercase tracking-wider text-xs font-bold transition-all cursor-pointer shadow-xs"
          >
            <div className="flex items-center gap-2">
              <Megaphone size={13} className="text-amber-500 animate-pulse" />
              <span>Announcements & VIP Offers</span>
            </div>
            <Sparkles size={13} className="text-amber-500" />
          </button>

          {/* Theme Mode Toggle (Mobile) */}
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-neutral-100 dark:bg-white/5 border border-neutral-200 dark:border-white/10">
            <span className="text-xs uppercase tracking-wider font-semibold text-neutral-800 dark:text-neutral-200">Appearance Mode</span>
            <ThemeToggle showLabel={true} />
          </div>

          <div className="pt-2 border-t border-neutral-200 dark:border-white/10 grid grid-cols-2 gap-2">
            <button
              onClick={() => { setMobileMenuOpen(false); onOpenTracking(); }}
              className="py-2.5 px-3 rounded-xl bg-neutral-100 dark:bg-white/10 border border-neutral-200 dark:border-white/10 text-neutral-800 dark:text-neutral-200 hover:text-black dark:hover:text-white uppercase text-[11px] font-semibold text-center cursor-pointer"
            >
              Track Order
            </button>
            <button
              onClick={() => { setMobileMenuOpen(false); onOpenAuth(); }}
              className="py-2.5 px-3 rounded-xl bg-neutral-100 dark:bg-white/10 border border-neutral-200 dark:border-white/10 text-neutral-800 dark:text-neutral-200 hover:text-black dark:hover:text-white uppercase text-[11px] font-semibold text-center cursor-pointer"
            >
              {currentUser ? currentUser.name.split(' ')[0] : 'Sign In'}
            </button>
          </div>

          <a
            href="https://www.instagram.com/newradhaswamimobilegallery/?hl=en"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#F77737] text-white text-xs font-bold uppercase tracking-wider shadow-sm cursor-pointer"
          >
            <Instagram size={14} className="text-white" />
            <span>Follow @newradhaswamimobilegallery</span>
          </a>
        </div>
      )}

    </header>
  );
};
