import React, { useState, useMemo, useEffect } from 'react';
import { Product } from '../../data/products';
import { fetchLiveAnnouncement } from '../../services/cloudSync';
import { 
  ShoppingCart, 
  Search, 
  Sparkles, 
  Smartphone, 
  Headphones, 
  Watch, 
  BatteryCharging, 
  Shield, 
  ShieldCheck, 
  Check, 
  Zap, 
  X, 
  MapPin, 
  ChevronRight, 
  Star, 
  CreditCard, 
  Flame, 
  Plane, 
  RotateCcw, 
  User,
  Truck,
  MessageSquare,
  Bell,
  ArrowRight
} from 'lucide-react';
import { SilkWaves } from '../reactbits/SilkWaves';
import { TrueFocus } from '../reactbits/TrueFocus';
import { ThemeToggle } from '../common/ThemeToggle';
import { SplitText } from '../reactbits/SplitText';
import { SpotlightCard } from '../reactbits/SpotlightCard';

interface ShopPageProps {
  products: Product[];
  onAddToCart: (product: Product, color: string, storage?: string, price?: number) => void;
  onBuyNow: (product: Product, color: string, storage?: string, price?: number) => void;
  onSelectEmiProduct: (product: Product) => void;
  onOpenSpecsModal: (product: Product) => void;
  onBackToShowroom: () => void;
  onOpenPortal?: () => void;
  onOpenCart?: () => void;
  onOpenAuth?: () => void;
  cartCount?: number;
  currentUser?: { name: string; phone?: string; email?: string; address?: string } | null;
}

export const ShopPage: React.FC<ShopPageProps> = ({
  products,
  onAddToCart,
  onBuyNow,
  onSelectEmiProduct,
  onOpenSpecsModal,
  onBackToShowroom,
  onOpenPortal,
  onOpenCart,
  onOpenAuth,
  cartCount = 0,
  currentUser
}) => {
  // Navigation & Category States
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [selectedBrand, setSelectedBrand] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating'>('featured');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);

  // Announcement State (Dynamically synced from Admin / Staff / Backend API)
  const [announcement, setAnnouncement] = useState<{
    active: boolean;
    title: string;
    message: string;
    imageUrl?: string;
    promoCode?: string;
    discountAmount?: string;
  }>(() => {
    try {
      const saved = localStorage.getItem('nr_announcement_data');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object') return parsed;
      }
    } catch {}
    return {
      active: true,
      title: 'Royal Privilege Flagship Drop',
      message: 'Enjoy instant VIP privileges across all Apple, Samsung & Google flagships. 100% manufacturer sealed Indian stock with GST invoice and insured express BlueDart air delivery.',
      imageUrl: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=1200&q=80',
      promoCode: 'ROYAL10',
      discountAmount: '10% OFF'
    };
  });

  useEffect(() => {
    const refreshAnnouncement = () => {
      fetchLiveAnnouncement()
        .then(ann => {
          if (ann && typeof ann === 'object') setAnnouncement(ann);
        })
        .catch(() => {
          try {
            const saved = localStorage.getItem('nr_announcement_data');
            if (saved) {
              const parsed = JSON.parse(saved);
              if (parsed && typeof parsed === 'object') setAnnouncement(parsed);
            }
          } catch {}
        });
    };

    refreshAnnouncement();
    window.addEventListener('nr_announcement_updated', refreshAnnouncement);
    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'nr_announcement_data' || e.key === 'nr_announcement_last_updated') {
        refreshAnnouncement();
      }
    };
    window.addEventListener('storage', handleStorage);

    return () => {
      window.removeEventListener('nr_announcement_updated', refreshAnnouncement);
      window.removeEventListener('storage', handleStorage);
    };
  }, []);

  // Dynamic Categories from Backend
  const [categories, setCategories] = useState<any[]>([
    { id: 'all', name: 'All Departments', icon: 'Sparkles' },
    { id: 'smartphones', name: 'Smartphones', icon: 'Smartphone' },
    { id: 'audio', name: 'Audio & Acoustics', icon: 'Headphones' },
    { id: 'watches', name: 'Smartwatches', icon: 'Watch' },
    { id: 'chargers', name: 'Fast GaN Chargers', icon: 'BatteryCharging' },
    { id: 'accessories', name: 'Titanium Shields', icon: 'Shield' }
  ]);

  // Fetch Categories on mount
  useEffect(() => {
    fetch('/api/categories')
      .then(res => res.json())
      .then(data => {
        if (data.categories && data.categories.length > 0) {
          setCategories(data.categories);
        }
      })
      .catch(() => {});
  }, []);

  // Delivery Location
  const [deliveryLocation, setDeliveryLocation] = useState<string>('Pithampur 454775');
  const [isLocationModalOpen, setIsLocationModalOpen] = useState<boolean>(false);
  const [tempPincode, setTempPincode] = useState<string>('');

  // Per-product variant selection (Color and Storage)
  const [selectedColorMap, setSelectedColorMap] = useState<{ [id: string]: string }>({});
  const [selectedStorageMap, setSelectedStorageMap] = useState<{ [id: string]: string }>({});
  const [addedItemFeedback, setAddedItemFeedback] = useState<{ [id: string]: boolean }>({});

  // Helper to get active color for a product
  const getSelectedColor = (product: Product): string => {
    return selectedColorMap[product.id] || (product.colors && product.colors[0]?.name) || 'Standard';
  };

  // Helper to get active storage and dynamic price for a product
  const getProductSelection = (product: Product) => {
    const color = getSelectedColor(product);
    let storage = selectedStorageMap[product.id];
    let price = product.price;

    if (product.storageVariants && product.storageVariants.length > 0) {
      if (!storage) {
        storage = product.storageVariants[0].size;
      }
      const match = product.storageVariants.find(v => v.size === storage);
      if (match) {
        price = match.price;
      }
    }

    return { color, storage, price };
  };

  const handleColorChange = (productId: string, colorName: string) => {
    setSelectedColorMap(prev => ({ ...prev, [productId]: colorName }));
  };

  const handleStorageChange = (productId: string, storageSize: string) => {
    setSelectedStorageMap(prev => ({ ...prev, [productId]: storageSize }));
  };

  const handleAddToCartClick = (product: Product) => {
    const { color, storage, price } = getProductSelection(product);
    onAddToCart(product, color, storage, price);

    // Instant visual tactile feedback
    setAddedItemFeedback(prev => ({ ...prev, [product.id]: true }));
    setTimeout(() => {
      setAddedItemFeedback(prev => ({ ...prev, [product.id]: false }));
    }, 1800);
  };

  const handleBuyNowClick = (product: Product) => {
    const { color, storage, price } = getProductSelection(product);
    onBuyNow(product, color, storage, price);
  };

  // Available brands dynamically computed
  const availableBrands = useMemo(() => {
    const set = new Set<string>();
    products.forEach(p => {
      if (activeCategory === 'all' || p.category === activeCategory) {
        if (p.brand) set.add(p.brand);
      }
    });
    return ['all', ...Array.from(set)];
  }, [products, activeCategory]);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let list = [...products];

    // Category filter
    if (activeCategory !== 'all') {
      list = list.filter(p => p.category === activeCategory);
    }

    // Brand filter
    if (selectedBrand !== 'all') {
      list = list.filter(p => p.brand.toLowerCase() === selectedBrand.toLowerCase());
    }

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        (p.description && p.description.toLowerCase().includes(q))
      );
    }

    // Sorting
    if (sortBy === 'price-asc') {
      list.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      list.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      list.sort((a, b) => b.rating - a.rating);
    }

    return list;
  }, [products, activeCategory, selectedBrand, searchQuery, sortBy]);

  // Featured Hero Flagship
  const heroProduct = useMemo(() => {
    return products.find(p => p.id === 'iphone-16-pro-max') || products[0];
  }, [products]);

  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'Smartphone': return <Smartphone size={16} />;
      case 'Headphones': return <Headphones size={16} />;
      case 'Watch': return <Watch size={16} />;
      case 'BatteryCharging': return <BatteryCharging size={16} />;
      case 'Shield': return <Shield size={16} />;
      default: return <Sparkles size={16} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFB] dark:bg-[#07080A] text-[#0A0B0E] dark:text-[#F8FAFC] font-sans selection:bg-black selection:text-white dark:selection:bg-white dark:selection:text-black pb-36 relative overflow-hidden transition-colors duration-300">
      {/* React Bits Pro: Procedural Monochrome Silk Waves */}
      <SilkWaves className="opacity-35 fixed inset-0 pointer-events-none z-0 dark:invert" color="0, 0, 0" opacity={0.05} speed={0.005} />
      
      {/* =========================================================================
          1. MINIMALIST ATELIER NAVIGATION BAR (CLEAN, MONOCHROME, NON-DISTRACTING)
      ========================================================================= */}
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-[#0B0E14]/95 backdrop-blur-xl border-b border-black/[0.06] dark:border-white/10 px-4 sm:px-8 py-3 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between gap-3">
          
          {/* Left: New Radhaswami Luxury Brand Crest */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-full overflow-hidden shadow-sm border border-neutral-200 dark:border-white/20 shrink-0">
                <img src="/nrs-logo.png" alt="New Radhaswami Mobile Gallery" className="w-full h-full object-cover" />
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-sm sm:text-base tracking-tight text-[#0A0B0E] dark:text-white">
                  NEW RADHASWAMI
                </span>
                <span className="text-[9px] text-neutral-500 dark:text-neutral-400 font-bold tracking-[0.2em] uppercase -mt-0.5">
                  Mobile Gallery
                </span>
              </div>
            </div>

            {/* 3D Virtual Showroom Switcher */}
            <button
              onClick={onBackToShowroom}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-neutral-100 dark:bg-white/10 hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black text-neutral-800 dark:text-neutral-200 text-xs font-semibold border border-neutral-200 dark:border-white/15 transition-all cursor-pointer"
            >
              <Plane size={13} className="text-black dark:text-white" />
              <span>3D Virtual Showroom</span>
            </button>
          </div>

          {/* Right: Quick Action Controls (View All Phones, VIP Sign In, Search, Bag) */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Direct View All Phones Button */}
            <button
              onClick={() => {
                setActiveCategory('smartphones');
                setSelectedBrand('all');
                setSearchQuery('');
                const el = document.getElementById('catalog-grid');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-full bg-black hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-200 text-white dark:text-black font-bold text-xs shadow-md transition-all cursor-pointer active:scale-95 shrink-0"
              title="View all flagship smartphone models"
            >
              <Smartphone size={14} className="text-white dark:text-black" />
              <span className="whitespace-nowrap">All Phones</span>
            </button>

            {/* VIP Sign In / Member Profile */}
            {onOpenAuth && (
              <button
                onClick={onOpenAuth}
                className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-neutral-100 dark:bg-white/10 hover:bg-neutral-200 dark:hover:bg-white/15 text-neutral-900 dark:text-white text-xs font-bold border border-neutral-200 dark:border-white/15 hover:border-neutral-300 dark:hover:border-white/30 transition-all cursor-pointer shadow-xs shrink-0 active:scale-95"
                title={currentUser ? `Logged in as ${currentUser.name}` : 'Sign in to VIP client concierge'}
              >
                <div className="w-5 h-5 rounded-full bg-black dark:bg-white text-white dark:text-black flex items-center justify-center font-bold text-[10px]">
                  {currentUser ? currentUser.name.charAt(0).toUpperCase() : <User size={11} />}
                </div>
                <span className="hidden sm:inline">
                  {currentUser ? currentUser.name.split(' ')[0] : 'VIP Sign In'}
                </span>
              </button>
            )}

            {/* Search Trigger */}
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className={`p-2 sm:px-3.5 sm:py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
                isSearchOpen 
                  ? 'bg-black dark:bg-white text-white dark:text-black font-bold shadow-sm' 
                  : 'bg-neutral-100 dark:bg-white/10 text-neutral-700 dark:text-neutral-300 hover:text-black dark:hover:text-white border border-neutral-200 dark:border-white/15'
              }`}
              title="Search flagship inventory"
            >
              <Search size={15} />
              <span className="hidden sm:inline">Search</span>
            </button>

            {/* Theme Mode Toggle (Dark/Light Switcher) */}
            <ThemeToggle className="mx-0.5" />

            {/* Bag Button with Live Badge */}
            {onOpenCart && (
              <button
                onClick={onOpenCart}
                className="relative flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-full bg-black hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-200 text-white dark:text-black font-bold text-xs shadow-md transition-all cursor-pointer shrink-0"
              >
                <ShoppingCart size={15} />
                <span className="hidden sm:inline">Bag</span>
                {cartCount > 0 && (
                  <span className="min-w-[18px] h-[18px] rounded-full bg-white dark:bg-black text-black dark:text-white text-[10px] font-black flex items-center justify-center px-1 shadow-xs">
                    {cartCount}
                  </span>
                )}
              </button>
            )}

          </div>

        </div>

        {/* Collapsible Search Drawer */}
        {isSearchOpen && (
          <div className="px-4 py-3 bg-[#F8F9FA] dark:bg-[#0F1117] border-t border-black/[0.06] dark:border-white/10 animate-fade-in">
            <div className="max-w-3xl mx-auto relative flex items-center">
              <Search size={16} className="absolute left-4 text-neutral-400 dark:text-neutral-500 pointer-events-none" />
              <input
                type="text"
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search iPhone 16 Pro, Galaxy S25 Ultra, OnePlus 13, Pixel 9..."
                className="w-full bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-white/15 rounded-full pl-11 pr-11 py-2.5 text-xs sm:text-sm text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-neutral-500 outline-none focus:border-black dark:focus:border-white transition-all shadow-xs"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 text-neutral-400 dark:text-neutral-500 hover:text-black dark:hover:text-white"
                >
                  <X size={15} />
                </button>
              )}
            </div>
          </div>
        )}
      </header>

      {/* =========================================================================
          2. LOCATION & WHITE GLOVE ASSURANCE STRIP (CLEAN MINIMAL)
      ========================================================================= */}
      <div className="bg-white dark:bg-[#0B0E14] border-b border-black/[0.06] dark:border-white/10 py-2 px-4 shadow-[0_1px_4px_rgba(0,0,0,0.02)] transition-colors">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-xs text-neutral-600 dark:text-neutral-400">
          <button
            onClick={() => setIsLocationModalOpen(true)}
            className="flex items-center gap-1.5 hover:text-black dark:hover:text-white transition-colors cursor-pointer"
          >
            <MapPin size={13} className="text-black dark:text-white" />
            <span className="text-neutral-500 dark:text-neutral-400">White-Glove Delivery:</span>
            <strong className="text-black dark:text-white font-semibold">{deliveryLocation}</strong>
            <ChevronRight size={13} className="text-neutral-400 dark:text-neutral-500" />
          </button>

          <div className="flex items-center gap-2 text-[11px]">
            <span className="w-1.5 h-1.5 rounded-full bg-black dark:bg-white animate-pulse" />
            <span className="text-neutral-900 dark:text-neutral-200 font-semibold">100% Genuine Sealed Indian Stock</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-5 sm:pt-7">

        {/* =========================================================================
            3. LUXURY STORE ANNOUNCEMENT SHOWCASE (NO PHONES - PURE EDITORIAL BULLETIN)
        ========================================================================= */}
        {announcement && announcement.active && !searchQuery && activeCategory === 'all' && selectedBrand === 'all' && (
          <SpotlightCard
            spotlightColor="rgba(255, 255, 255, 0.08)"
            borderColor="rgba(255, 255, 255, 0.15)"
            className="mb-8 rounded-3xl bg-white dark:bg-[#0F1117] border border-neutral-200/90 dark:border-white/10 p-5 sm:p-8 lg:p-10 relative overflow-hidden shadow-[0_4px_30px_rgba(0,0,0,0.04)] dark:shadow-[0_4px_30px_rgba(0,0,0,0.4)]"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-10 items-center relative z-10">
              
              {/* Left Column: Announcement Image Staged in Editorial Frame */}
              <div className="lg:col-span-5 relative">
                <div className="relative group w-full aspect-[16/10] sm:aspect-[4/3] rounded-2xl overflow-hidden border border-neutral-200/90 dark:border-white/10 shadow-md">
                  <img
                    src={announcement.imageUrl || "https://images.unsplash.com/photo-1616469829941-c7200edec809?w=800&auto=format&fit=crop&q=80"}
                    alt={announcement.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/10" />
                  
                  {/* Live Status Pill */}
                  <div className="absolute top-3 left-3 z-20 flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/80 backdrop-blur-md border border-white/20 text-white text-[10px] font-bold tracking-widest uppercase shadow-md">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    <span>Official Bulletin</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Editorial Announcement Details & High-End CTAs */}
              <div className="lg:col-span-7 flex flex-col justify-center space-y-4">
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-neutral-100 dark:bg-white/10 border border-neutral-200 dark:border-white/15 text-neutral-800 dark:text-neutral-200 text-[10px] font-bold uppercase tracking-widest w-fit shadow-xs">
                  <Sparkles size={12} className="text-black dark:text-white" />
                  <span>VIP Atelier Announcement • Pithampur Showroom</span>
                </div>

                <h2 className="text-2xl sm:text-4xl lg:text-5xl font-serif-luxury font-normal text-neutral-950 dark:text-white tracking-tight leading-tight">
                  {announcement.title}
                </h2>

                <p className="text-neutral-600 dark:text-neutral-400 text-xs sm:text-base leading-relaxed font-normal">
                  {announcement.message}
                </p>

                {/* Key Guarantee Badges */}
                <div className="flex flex-wrap gap-2 pt-1">
                  <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-50 dark:bg-white/5 border border-neutral-200 dark:border-white/10 text-[11px] text-neutral-800 dark:text-neutral-200 font-semibold shadow-2xs">
                    <ShieldCheck size={13} className="text-black dark:text-white" />
                    100% Sealed Indian Units
                  </span>
                  <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-50 dark:bg-white/5 border border-neutral-200 dark:border-white/10 text-[11px] text-neutral-800 dark:text-neutral-200 font-semibold shadow-2xs">
                    <Truck size={13} className="text-black dark:text-white" />
                    Insured BlueDart Express
                  </span>
                  <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-50 dark:bg-white/5 border border-neutral-200 dark:border-white/10 text-[11px] text-neutral-800 dark:text-neutral-200 font-semibold shadow-2xs">
                    <CreditCard size={13} className="text-black dark:text-white" />
                    0% Instant No-Cost EMI
                  </span>
                </div>

                {/* Tactile Action Buttons */}
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <button
                    onClick={() => {
                      const el = document.getElementById('catalog-grid');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="py-3.5 px-6 rounded-xl bg-black hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-200 text-white dark:text-black font-extrabold text-xs uppercase tracking-wider shadow-xl shadow-black/20 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <span>Browse Official Inventory</span>
                    <ArrowRight size={15} />
                  </button>

                  <a
                    href="https://wa.me/919691011335"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-3.5 px-6 rounded-xl bg-white dark:bg-white/10 hover:bg-neutral-100 dark:hover:bg-white/15 text-neutral-900 dark:text-white border border-neutral-300 dark:border-white/15 font-bold text-xs uppercase tracking-wider shadow-xs active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <MessageSquare size={15} className="text-black dark:text-white fill-current" />
                    <span>WhatsApp Concierge</span>
                  </a>
                </div>

              </div>

            </div>
          </SpotlightCard>
        )}

        {/* Quick View All Phones Minimalist Banner */}
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-white dark:bg-[#0F1117] border border-neutral-200 dark:border-white/10 text-neutral-900 dark:text-white shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-neutral-100 dark:bg-white/10 border border-neutral-200 dark:border-white/10 flex items-center justify-center text-black dark:text-white shrink-0">
              <Smartphone size={18} />
            </div>
            <div>
              <div className="text-xs sm:text-sm font-bold text-neutral-950 dark:text-white flex flex-wrap items-center gap-2">
                <TrueFocus sentence="Certified Flagship Inventory" manualMode={false} blurAmount={2} borderColor="#000000" glowColor="rgba(0,0,0,0.14)" />
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-black dark:bg-white text-white dark:text-black font-bold uppercase tracking-wider shrink-0">In Stock</span>
              </div>
              <p className="text-[11px] text-neutral-500 dark:text-neutral-400 hidden sm:block">
                View all Apple, Samsung, OnePlus & Google phones with official brand warranty & WhatsApp checkout.
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              setActiveCategory('smartphones');
              setSelectedBrand('all');
              setSearchQuery('');
              const el = document.getElementById('catalog-grid');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
              activeCategory === 'smartphones' && selectedBrand === 'all'
                ? 'bg-neutral-100 dark:bg-white/10 text-black dark:text-white border border-neutral-300 dark:border-white/20 font-extrabold shadow-xs'
                : 'bg-black hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-200 text-white dark:text-black shadow-md'
            }`}
          >
            <Smartphone size={13} />
            <span>{activeCategory === 'smartphones' && selectedBrand === 'all' ? 'Showing All Phones' : 'View All Phones to Shop'}</span>
            <ChevronRight size={13} />
          </button>
        </div>

        {/* =========================================================================
            4. HORIZONTAL BRAND & CATEGORY FILTER RAILS (TOUCH-SMOOTH)
        ========================================================================= */}
        <div className="mb-6 space-y-3">
          
          {/* Brand Selector Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none no-scrollbar">
            <span className="text-[11px] uppercase tracking-wider text-[#9CA3AF] dark:text-neutral-400 font-bold shrink-0 ml-1">
              Brand:
            </span>
            {availableBrands.map((brand) => {
              const isActive = selectedBrand.toLowerCase() === brand.toLowerCase();
              return (
                <button
                  key={brand}
                  onClick={() => setSelectedBrand(brand)}
                  className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all shrink-0 cursor-pointer ${
                    isActive
                      ? 'bg-[#0A0B0E] dark:bg-white text-white dark:text-black font-bold shadow-sm'
                      : 'bg-white dark:bg-[#0F1117] text-[#525866] dark:text-neutral-300 hover:text-[#0A0B0E] dark:hover:text-white border border-black/[0.08] dark:border-white/10 hover:border-black/20 dark:hover:border-white/20 shadow-2xs'
                  }`}
                >
                  {brand === 'all' ? 'All Brands' : brand}
                </button>
              );
            })}
          </div>

          {/* Department / Category Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none no-scrollbar">
            {categories.map((cat) => {
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all shrink-0 cursor-pointer ${
                    isActive
                      ? 'bg-black dark:bg-white text-white dark:text-black shadow-sm font-bold'
                      : 'bg-white dark:bg-[#0F1117] text-neutral-700 dark:text-neutral-300 hover:text-black dark:hover:text-white border border-neutral-200 dark:border-white/10 hover:border-neutral-300 dark:hover:border-white/20 shadow-2xs'
                  }`}
                >
                  <span className={isActive ? 'text-white dark:text-black' : 'text-neutral-900 dark:text-white'}>
                    {getCategoryIcon(cat.icon)}
                  </span>
                  <span>{cat.name}</span>
                </button>
              );
            })}
          </div>

        </div>

        {/* =========================================================================
            5. SORT & CATALOG STATUS STRIP
        ========================================================================= */}
        <div id="catalog-grid" className="flex items-center justify-between pb-3 mb-5 border-b border-black/[0.06] dark:border-white/10 text-xs">
          <div className="text-[#525866] dark:text-neutral-400 font-medium">
            Showing <strong className="text-[#0A0B0E] dark:text-white font-bold">{filteredProducts.length}</strong> certified flagship models
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[#9CA3AF] dark:text-neutral-400 hidden sm:inline">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-white dark:bg-[#0F1117] border border-black/10 dark:border-white/10 rounded-xl px-3 py-1.5 text-xs text-[#0A0B0E] dark:text-white font-semibold outline-none focus:border-[#0A0B0E] dark:focus:border-white cursor-pointer shadow-2xs"
            >
              <option value="featured">Featured First</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>
        </div>

        {/* =========================================================================
            6. PRODUCT CARDS GRID (WHITE ATELIER AESTHETIC)
        ========================================================================= */}
        {filteredProducts.length === 0 ? (
          <div className="py-20 text-center rounded-3xl bg-white dark:bg-[#0F1117] border border-black/[0.06] dark:border-white/10 p-8 shadow-xs">
            <div className="w-12 h-12 rounded-2xl bg-[#F4F5F7] dark:bg-white/10 text-[#0A0B0E] dark:text-white flex items-center justify-center mx-auto mb-3">
              <Search size={22} />
            </div>
            <h3 className="font-bold text-base text-[#0A0B0E] dark:text-white mb-1">No products found</h3>
            <p className="text-xs text-[#6B7280] dark:text-neutral-400 mb-4">Try resetting your search query or brand selection.</p>
            <button
              onClick={() => {
                setActiveCategory('all');
                setSelectedBrand('all');
                setSearchQuery('');
              }}
              className="px-5 py-2.5 rounded-full bg-black dark:bg-white text-white dark:text-black text-xs font-bold shadow-xs cursor-pointer hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-all"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-4 md:gap-6">
            {filteredProducts.map((product) => {
              const { color, storage, price } = getProductSelection(product);
              const isAdded = !!addedItemFeedback[product.id];
              const savings = product.originalPrice > price ? product.originalPrice - price : 0;
              const photoCount = product.images && product.images.length > 0 ? product.images.length : 1;

              return (
                <SpotlightCard
                  key={product.id}
                  spotlightColor="rgba(255, 255, 255, 0.08)"
                  borderColor="rgba(255, 255, 255, 0.15)"
                  className="rounded-2xl sm:rounded-3xl bg-white dark:bg-[#0F1117] border border-neutral-200/80 dark:border-white/10 hover:border-black/30 dark:hover:border-white/30 p-3 sm:p-5 flex flex-col justify-between transition-all duration-300 shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-[0_16px_36px_rgba(0,0,0,0.08)] group relative overflow-hidden"
                >
                  {/* Top Badge Strip */}
                  <div className="flex items-center justify-between gap-1 sm:gap-2 mb-2 sm:mb-3 z-10">
                    <span className="px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full bg-neutral-100 dark:bg-white/10 text-[9px] sm:text-[10px] font-bold text-neutral-800 dark:text-neutral-200 uppercase tracking-wider border border-neutral-200/60 dark:border-white/10">
                      {product.brand}
                    </span>

                    {product.inStock === false ? (
                      <span className="px-2 py-0.5 rounded-full bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-[9px] sm:text-[10px] font-bold text-rose-700 dark:text-rose-400">
                        Out of Stock
                      </span>
                    ) : savings > 0 ? (
                      <span className="px-1.5 py-0.5 sm:px-2.5 sm:py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 text-[9px] sm:text-[10px] font-bold text-emerald-700 dark:text-emerald-400">
                        Save ₹{savings.toLocaleString('en-IN')}
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full bg-neutral-100 dark:bg-white/10 border border-neutral-200 dark:border-white/10 text-[9px] sm:text-[10px] font-bold text-neutral-600 dark:text-neutral-300">
                        In Stock
                      </span>
                    )}
                  </div>

                  {/* Product Photography on Soft Light Pedestal with Multi-Image Pill */}
                  <div 
                    onClick={() => onOpenSpecsModal(product)}
                    className="relative w-full aspect-square flex items-center justify-center p-2 sm:p-4 mb-2.5 sm:mb-4 bg-gradient-to-b from-neutral-50 to-neutral-100/70 dark:from-white/5 dark:to-white/10 rounded-xl sm:rounded-2xl cursor-pointer group-hover:scale-[1.03] transition-transform duration-300"
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      className={`max-h-[120px] sm:max-h-[170px] md:max-h-[190px] object-contain drop-shadow-[0_12px_24px_rgba(0,0,0,0.1)] transition-all ${
                        product.inStock === false ? 'opacity-60 grayscale-[35%]' : ''
                      }`}
                      loading="lazy"
                    />
                    
                    {/* Multi-Photos Badge */}
                    {photoCount > 1 ? (
                      <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded-full bg-black/80 backdrop-blur-md text-[9px] font-bold text-white shadow-sm flex items-center gap-1">
                        <span>📸 {photoCount} Angles</span>
                      </div>
                    ) : (
                      <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded-full bg-white/90 dark:bg-black/90 backdrop-blur-md text-[8px] sm:text-[9px] font-semibold text-neutral-600 dark:text-neutral-300 border border-neutral-200 dark:border-white/20 shadow-2xs">
                        Specs
                      </div>
                    )}
                  </div>

                  {/* Title & Review Strip */}
                  <div className="mb-2 sm:mb-3">
                    <div className="flex items-center gap-1 sm:gap-1.5 mb-1">
                      <div className="flex items-center text-black dark:text-white">
                        <Star size={11} className="fill-black dark:fill-white" />
                      </div>
                      <span className="text-[11px] sm:text-xs font-bold text-neutral-900 dark:text-white">{product.rating}</span>
                      <span className="text-[10px] sm:text-[11px] text-neutral-400 dark:text-neutral-500">({product.reviewsCount})</span>
                    </div>

                    <h3 
                      onClick={() => onOpenSpecsModal(product)}
                      className="font-bold text-xs sm:text-base text-neutral-950 dark:text-white tracking-tight hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors cursor-pointer line-clamp-2 leading-tight min-h-[32px] sm:min-h-0"
                    >
                      {product.name}
                    </h3>
                  </div>

                  {/* Interactive Finish Swatches */}
                  {product.colors && product.colors.length > 0 && (
                    <div className="mb-2 sm:mb-3">
                      <div className="flex items-center justify-between text-[10px] sm:text-[11px] text-neutral-500 dark:text-neutral-400 mb-1">
                        <span className="hidden sm:inline">Finish:</span>
                        <span className="text-neutral-900 dark:text-white font-semibold truncate text-[10px] sm:text-[11px]">{color}</span>
                      </div>
                      <div className="flex items-center gap-1.5 sm:gap-2">
                        {product.colors.map((c) => {
                          const isSelected = color === c.name;
                          return (
                            <button
                              key={c.name}
                              onClick={() => handleColorChange(product.id, c.name)}
                              style={{ backgroundColor: c.hex }}
                              className={`w-4 h-4 sm:w-5 sm:h-5 rounded-full transition-all cursor-pointer relative shadow-xs ${
                                isSelected 
                                  ? 'ring-2 ring-offset-1 sm:ring-offset-2 ring-black dark:ring-white ring-offset-white dark:ring-offset-black scale-110' 
                                  : 'opacity-70 hover:opacity-100'
                              }`}
                              title={c.name}
                            />
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Interactive Storage Capacity Variant Pills */}
                  {product.storageVariants && product.storageVariants.length > 0 && (
                    <div className="mb-2 sm:mb-3">
                      <div className="flex items-center gap-1 overflow-x-auto pb-0.5 scrollbar-none no-scrollbar">
                        {product.storageVariants.map((v) => {
                          const isSelected = storage === v.size;
                          return (
                            <button
                              key={v.size}
                              onClick={() => handleStorageChange(product.id, v.size)}
                              className={`px-2 py-0.5 sm:px-3 sm:py-1 rounded-md sm:rounded-lg text-[10px] sm:text-[11px] font-bold transition-all shrink-0 cursor-pointer ${
                                isSelected
                                  ? 'bg-black dark:bg-white text-white dark:text-black shadow-2xs'
                                  : 'bg-neutral-100 dark:bg-white/10 text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white border border-neutral-200 dark:border-white/10'
                              }`}
                            >
                              {v.size}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Pricing & 0% EMI Display */}
                  <div className="pt-2 border-t border-neutral-100 dark:border-white/10 mb-2.5 sm:mb-3">
                    <div className="flex flex-wrap items-baseline gap-1 sm:gap-2">
                      <span className="text-base sm:text-2xl font-black text-neutral-950 dark:text-white">
                        ₹{price.toLocaleString('en-IN')}
                      </span>
                      {product.originalPrice > price && (
                        <span className="text-[10px] sm:text-xs text-neutral-400 dark:text-neutral-500 line-through">
                          ₹{product.originalPrice.toLocaleString('en-IN')}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1 mt-0.5">
                      <CreditCard size={11} className="text-neutral-500 dark:text-neutral-400 shrink-0" />
                      <span className="text-[9px] sm:text-[10px] text-neutral-500 dark:text-neutral-400 truncate">
                        0% EMI <strong className="text-neutral-900 dark:text-white">₹{Math.round(price / 24).toLocaleString('en-IN')}/m</strong>
                      </span>
                    </div>
                  </div>

                  {/* Tactile Action Buttons (Mobile Optimized) */}
                  <div className="grid grid-cols-2 gap-2 sm:gap-2.5">
                    {product.inStock === false ? (
                      <>
                        <button
                          disabled
                          className="py-2.5 px-2.5 sm:px-3 rounded-xl bg-neutral-100 dark:bg-white/5 text-neutral-400 dark:text-neutral-500 font-extrabold text-xs cursor-not-allowed flex items-center justify-center gap-1.5 border border-neutral-200 dark:border-white/10"
                        >
                          <span>Sold Out</span>
                        </button>
                        <a
                          href={`https://wa.me/919691011335?text=${encodeURIComponent(`Hi Radhaswami Mobile, please alert me when ${product.name} is back in stock!`)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="py-2.5 px-2 sm:px-3 rounded-xl bg-neutral-950 hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-200 text-white dark:text-black text-xs font-bold transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-1.5 shadow-2xs"
                        >
                          <Bell size={12} className="shrink-0" />
                          <span>Alert Me</span>
                        </a>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => handleBuyNowClick(product)}
                          className="py-2.5 px-2.5 sm:px-3 rounded-xl bg-black hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-200 text-white dark:text-black font-extrabold text-xs shadow-sm hover:shadow-md active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-1.5"
                        >
                          <Zap size={12} className="fill-white dark:fill-black text-white dark:text-black shrink-0" />
                          <span>Buy</span>
                        </button>

                        <button
                          onClick={() => handleAddToCartClick(product)}
                          className={`py-2.5 px-2 sm:px-3 rounded-xl border text-xs font-bold transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-1.5 shadow-2xs ${
                            isAdded
                              ? 'bg-neutral-950 dark:bg-white text-white dark:text-black border-neutral-950 dark:border-white shadow-xs'
                              : 'bg-white dark:bg-white/10 hover:bg-neutral-50 dark:hover:bg-white/15 text-neutral-900 dark:text-white border-neutral-200 dark:border-white/15 hover:border-neutral-300 dark:hover:border-white/25'
                          }`}
                        >
                          {isAdded ? (
                            <>
                              <Check size={13} className="text-emerald-400 stroke-[2.5]" />
                              <span>Added</span>
                            </>
                          ) : (
                            <>
                              <ShoppingCart size={13} className="text-neutral-800 dark:text-white" />
                              <span>+ Bag</span>
                            </>
                          )}
                        </button>
                      </>
                    )}
                  </div>

                </SpotlightCard>
              );
            })}
          </div>
        )}

      </div>

      {/* =========================================================================
          7. DELIVERY PINCODE BOTTOM SHEET / MODAL (WHITE THEME)
      ========================================================================= */}
      {isLocationModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm p-0 sm:p-4 animate-fade-in">
          <div className="w-full sm:max-w-md bg-white dark:bg-[#0F1117] border-t sm:border border-black/10 dark:border-white/10 rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl text-[#0A0B0E] dark:text-white">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <MapPin size={18} className="text-black dark:text-white" />
                <h3 className="font-extrabold text-base">Select Delivery Pincode</h3>
              </div>
              <button 
                onClick={() => setIsLocationModalOpen(false)}
                className="text-[#9CA3AF] hover:text-[#0A0B0E] dark:hover:text-white p-1"
              >
                <X size={18} />
              </button>
            </div>

            <p className="text-xs text-[#525866] dark:text-neutral-400 mb-4">
              Enter your 6-digit postal code to verify same-day white glove delivery from New Radhaswami Mobile Gallery, Pithampur (MP).
            </p>

            <div className="flex gap-2 mb-5">
              <input
                type="text"
                maxLength={6}
                value={tempPincode}
                onChange={(e) => setTempPincode(e.target.value.replace(/\D/g, ''))}
                placeholder="e.g. 454775"
                className="flex-1 bg-[#F4F5F7] dark:bg-neutral-900 border border-black/10 dark:border-white/15 rounded-xl px-4 py-2.5 text-sm text-[#0A0B0E] dark:text-white placeholder-[#9CA3AF] dark:placeholder-neutral-500 outline-none focus:border-[#0A0B0E] dark:focus:border-white"
              />
              <button
                onClick={() => {
                  if (tempPincode.length === 6) {
                    setDeliveryLocation(`PIN ${tempPincode}`);
                    setIsLocationModalOpen(false);
                    setTempPincode('');
                  }
                }}
                disabled={tempPincode.length !== 6}
                className="px-5 py-2.5 rounded-xl bg-[#0A0B0E] dark:bg-white disabled:opacity-40 text-white dark:text-black font-bold text-xs cursor-pointer shadow-xs"
              >
                Apply
              </button>
            </div>

            <div className="flex flex-wrap gap-2 text-xs">
              <span className="text-[#9CA3AF] dark:text-neutral-400 text-[11px] w-full mb-1">Local &amp; Regional Hubs:</span>
              {['Pithampur 454775', 'Indore 452001', 'Bhopal 462001', 'Ujjain 456001', 'Dhar 454001'].map((city) => (
                <button
                  key={city}
                  onClick={() => {
                    setDeliveryLocation(city);
                    setIsLocationModalOpen(false);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-[#F4F5F7] dark:bg-white/5 hover:bg-[#EAEBED] dark:hover:bg-white/10 text-[#374151] dark:text-neutral-200 font-semibold text-[11px] border border-black/[0.06] dark:border-white/10"
                >
                  {city}
                </button>
              ))}
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
