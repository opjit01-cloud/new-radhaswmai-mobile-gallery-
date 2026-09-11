import React from 'react';
import { Home, Smartphone, Sparkles, ShoppingBag, User, ShieldCheck } from 'lucide-react';

interface MobileBottomBarProps {
  cartCount: number;
  onOpenCart: () => void;
  onOpenAuth: () => void;
  currentUser: { name: string; phone?: string; email?: string } | null;
  currentPage: 'showroom' | 'shop';
  onNavigatePage: (page: 'showroom' | 'shop') => void;
  onOpenPortal?: () => void;
}

export const MobileBottomBar: React.FC<MobileBottomBarProps> = ({
  cartCount,
  onOpenCart,
  onOpenAuth,
  currentUser,
  currentPage,
  onNavigatePage,
  onOpenPortal
}) => {
  const scrollTo = (id: string) => {
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
  };

  const isLight = currentPage === 'shop';

  return (
    <div className="md:hidden fixed bottom-0 inset-x-0 z-50 backdrop-blur-2xl px-3 py-2 flex items-center justify-around safe-area-bottom transition-colors duration-300 bg-white/95 dark:bg-[#0B0E14]/95 border-t border-black/[0.08] dark:border-white/10 shadow-[0_-4px_24px_rgba(0,0,0,0.06)] dark:shadow-[0_-4px_24px_rgba(0,0,0,0.6)] text-neutral-900 dark:text-white">
      
      {/* 1. Showroom Tab */}
      <button
        onClick={() => onNavigatePage('showroom')}
        className={`flex flex-col items-center gap-1 transition-all py-1 px-3 rounded-xl cursor-pointer ${
          currentPage === 'showroom'
            ? 'text-black dark:text-white bg-neutral-100 dark:bg-white/10 font-bold shadow-xs'
            : 'text-neutral-500 dark:text-neutral-400 hover:text-black dark:hover:text-white'
        }`}
      >
        <Home size={18} className={currentPage === 'showroom' ? 'text-black dark:text-white' : 'text-neutral-500 dark:text-neutral-400'} />
        <span className="text-[10px] tracking-wide">Showroom</span>
      </button>

      {/* 2. Boutique Shop Tab (Dedicated New Page) */}
      <button
        onClick={() => onNavigatePage('shop')}
        className={`relative flex flex-col items-center gap-1 transition-all py-1 px-3 rounded-xl cursor-pointer ${
          currentPage === 'shop'
            ? 'text-black dark:text-white bg-neutral-100 dark:bg-white/10 font-bold shadow-xs'
            : 'text-neutral-500 dark:text-neutral-400 hover:text-black dark:hover:text-white'
        }`}
      >
        <ShoppingBag size={18} className={currentPage === 'shop' ? 'text-black dark:text-white' : 'text-neutral-500 dark:text-neutral-400'} />
        <span className="text-[10px] tracking-wide">Shop Tab</span>
        {currentPage === 'shop' && (
          <span className="absolute top-1 right-2 w-1.5 h-1.5 rounded-full bg-black dark:bg-white animate-pulse" />
        )}
      </button>

      {/* 3. 0% EMI */}
      <button
        onClick={() => scrollTo('emi-studio')}
        className="flex flex-col items-center gap-1 transition-colors py-1 px-2 cursor-pointer text-neutral-500 dark:text-neutral-400 hover:text-black dark:hover:text-white"
      >
        <div className="relative">
          <Sparkles size={18} className="text-black dark:text-white" />
          <span className="absolute -top-1 -right-1.5 w-1.5 h-1.5 rounded-full bg-black dark:bg-white shadow-xs" />
        </div>
        <span className="text-[10px] font-semibold tracking-wide">0% EMI</span>
      </button>

      {/* 4. Bag with Counter */}
      <button
        onClick={onOpenCart}
        className="relative flex flex-col items-center gap-1 transition-colors py-1 px-2 cursor-pointer text-neutral-500 dark:text-neutral-400 hover:text-black dark:hover:text-white"
      >
        <div className="relative">
          <ShoppingBag size={18} />
          {cartCount > 0 && (
            <span className="absolute -top-1.5 -right-2 min-w-[16px] h-4 rounded-full flex items-center justify-center text-[9px] font-extrabold px-1 bg-black dark:bg-white text-white dark:text-black shadow-xs animate-pulse">
              {cartCount}
            </span>
          )}
        </div>
        <span className="text-[10px] font-medium tracking-wide">Bag</span>
      </button>

      {/* 5. Profile / Account */}
      <button
        onClick={onOpenAuth}
        className="flex flex-col items-center gap-1 transition-colors py-1 px-2 cursor-pointer text-neutral-500 dark:text-neutral-400 hover:text-black dark:hover:text-white"
      >
        <User size={18} />
        <span className="text-[10px] font-medium tracking-wide">
          {currentUser ? currentUser.name.split(' ')[0] : 'Account'}
        </span>
      </button>

    </div>
  );
};
