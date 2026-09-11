import React, { useState, useMemo } from 'react';
import { Product } from '../../data/products';
import { 
  ShoppingBag, 
  Check, 
  Sparkles, 
  Filter, 
  Zap, 
  ArrowUpRight, 
  ShieldCheck, 
  ArrowUpDown,
  Smartphone,
  Headphones,
  Watch,
  BatteryCharging,
  LayoutGrid,
  List,
  Search,
  CheckCircle2,
  X,
  Truck,
  FileText,
  Award,
  Star,
  Tag,
  CreditCard
} from 'lucide-react';
import { MagneticButton } from '../common/MagneticButton';
import { SpotlightCard } from '../reactbits/SpotlightCard';
import { BorderBeam } from '../reactbits/BorderBeam';
import { ShinyText } from '../reactbits/ShinyText';
import { DecryptedText } from '../reactbits/DecryptedText';
import { ClickSpark } from '../reactbits/ClickSpark';
import { BlurText } from '../reactbits/BlurText';
import { Squares } from '../reactbits/Squares';

interface DedicatedShopSectionProps {
  products: Product[];
  onAddToCart: (product: Product, color: string, storage?: string, price?: number) => void;
  onBuyNow: (product: Product, color: string, storage?: string, price?: number) => void;
  onSelectEmiProduct: (product: Product) => void;
  onOpenSpecsModal: (product: Product) => void;
  initialCategory?: string;
  onViewAllProducts?: () => void;
}

export const DedicatedShopSection: React.FC<DedicatedShopSectionProps> = ({
  products,
  onAddToCart,
  onBuyNow,
  onSelectEmiProduct,
  onOpenSpecsModal,
  initialCategory = 'all',
  onViewAllProducts
}) => {
  // Navigation & Filter States
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [selectedBrand, setSelectedBrand] = useState<string>('all');
  const [selectedPriceRange, setSelectedPriceRange] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating' | 'savings'>('featured');
  const [shopSearch, setShopSearch] = useState<string>('');
  
  // Flipkart-style View Switcher
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');

  // Per-product variant selection
  const [selectedStorageMap, setSelectedStorageMap] = useState<{ [id: string]: string }>({});
  const [selectedColorMap, setSelectedColorMap] = useState<{ [id: string]: string }>({});
  const [addedItemId, setAddedItemId] = useState<string | null>(null);

  // Category counts
  const categoryCounts = useMemo(() => {
    return {
      all: products.length,
      smartphones: products.filter(p => p.category === 'smartphones').length,
      audio: products.filter(p => p.category === 'audio').length,
      watches: products.filter(p => p.category === 'watches').length,
      chargers: products.filter(p => p.category === 'chargers' || p.category === 'accessories').length
    };
  }, [products]);

  // Categories list
  const categories = [
    { id: 'all', label: 'All Catalog', icon: <LayoutGrid size={14} />, count: categoryCounts.all },
    { id: 'smartphones', label: 'Mobiles', icon: <Smartphone size={14} />, count: categoryCounts.smartphones },
    { id: 'audio', label: 'Pro Audio', icon: <Headphones size={14} />, count: categoryCounts.audio },
    { id: 'watches', label: 'Smartwatches', icon: <Watch size={14} />, count: categoryCounts.watches },
    { id: 'chargers', label: 'Fast Chargers', icon: <BatteryCharging size={14} />, count: categoryCounts.chargers }
  ];

  // Available brands in the store
  const availableBrands = useMemo(() => {
    const brandSet = new Set<string>();
    products.forEach(p => brandSet.add(p.brand));
    return ['all', ...Array.from(brandSet)];
  }, [products]);

  // Filtered & Sorted Products
  const filteredProducts = useMemo(() => {
    let result = products.filter(product => {
      // Category filter
      if (selectedCategory !== 'all') {
        if (selectedCategory === 'chargers') {
          if (product.category !== 'chargers' && product.category !== 'accessories') return false;
        } else if (product.category !== selectedCategory) {
          return false;
        }
      }

      // Brand filter
      if (selectedBrand !== 'all') {
        if (product.brand.toLowerCase() !== selectedBrand.toLowerCase()) return false;
      }

      // Price filter
      if (selectedPriceRange === 'under-30k' && product.price >= 30000) return false;
      if (selectedPriceRange === '30k-100k' && (product.price < 30000 || product.price > 100000)) return false;
      if (selectedPriceRange === 'above-100k' && product.price <= 100000) return false;

      // Shop keyword search
      if (shopSearch.trim()) {
        const query = shopSearch.toLowerCase();
        const matchName = product.name.toLowerCase().includes(query);
        const matchBrand = product.brand.toLowerCase().includes(query);
        const matchDesc = product.description.toLowerCase().includes(query);
        if (!matchName && !matchBrand && !matchDesc) return false;
      }

      return true;
    });

    // Sorting
    if (sortBy === 'price-asc') {
      result = [...result].sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      result = [...result].sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      result = [...result].sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'savings') {
      result = [...result].sort((a, b) => (b.originalPrice - b.price) - (a.originalPrice - a.price));
    }

    return result;
  }, [products, selectedCategory, selectedBrand, selectedPriceRange, sortBy, shopSearch]);

  const getProductSelection = (product: Product) => {
    const color = selectedColorMap[product.id] || (product.colors[0]?.name || 'Standard');
    const storage = selectedStorageMap[product.id] || (product.storageVariants?.[0]?.size || 'Standard');
    
    let price = product.price;
    if (product.storageVariants && product.storageVariants.length > 0) {
      const variant = product.storageVariants.find(v => v.size === storage);
      if (variant) price = variant.price;
    }
    return { color, storage, price };
  };

  const handleAdd = (product: Product) => {
    const { color, storage, price } = getProductSelection(product);
    onAddToCart(product, color, storage, price);
    setAddedItemId(product.id);
    setTimeout(() => setAddedItemId(null), 2000);
  };

  const handleBuyNowClick = (product: Product) => {
    const { color, storage, price } = getProductSelection(product);
    onBuyNow(product, color, storage, price);
  };

  return (
    <section id="shop-section" className="py-16 sm:py-28 px-3 sm:px-6 bg-[#FAFAFA] text-[#0A0B0E] border-t border-b border-black/5 relative overflow-hidden">
      
      {/* Light Theme Animated Background */}
      <div className="absolute inset-0 z-0 opacity-[0.15]">
        <Squares 
          direction="diagonal"
          speed={0.5}
          squareSize={40}
          borderColor="#000000"
          hoverFillColor="#E5E7EB"
        />
      </div>

      <div className="max-w-7xl mx-auto relative z-10 space-y-6 sm:space-y-8">
        
        {/* =========================================================================
            1. DEDICATED BOUTIQUE ARCHITECTURAL HEADER
        ========================================================================= */}
        <div className="p-5 sm:p-9 rounded-2xl sm:rounded-3xl bg-white/80 backdrop-blur-2xl border border-black/5 shadow-xl space-y-4">
          
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-[9px] sm:text-[10px] font-mono tracking-widest font-extrabold px-2 py-0.5 rounded bg-black text-white">
                  OFFICIAL STORE
                </span>
                <span className="text-[10px] uppercase tracking-wider text-neutral-500 font-bold hidden sm:inline">
                  PITHAMPUR FLAGSHIP • 100% FACTORY SEALED INDIAN STOCK
                </span>
              </div>

              <div className="text-3xl sm:text-4xl lg:text-5xl font-serif-luxury font-normal text-black tracking-tight leading-tight">
                <BlurText 
                  text="The Haute Mobile Shopping Salon"
                  delay={50}
                  animateBy="words"
                  direction="bottom"
                  className="inline-block"
                />
              </div>
            </div>

            {/* Quick Vault Statistics Badges */}
            <div className="flex flex-wrap lg:flex-col items-start lg:items-end gap-2 text-xs">
              <span className="px-3 py-1 rounded-full bg-black/5 border border-black/10 text-black font-mono text-xs shadow-sm font-semibold">
                {filteredProducts.length} Flagships in Stock
              </span>
              {onViewAllProducts && (
                <button
                  onClick={onViewAllProducts}
                  className="text-xs uppercase tracking-wider text-neutral-600 hover:text-black underline font-semibold cursor-pointer"
                >
                  Open Full Shop Tab →
                </button>
              )}
            </div>
          </div>

          {/* Flipkart Trust Strip */}
          <div className="pt-3 border-t border-black/10 grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] text-neutral-600">
            <div className="flex items-center gap-1.5">
              <ShieldCheck size={13} className="text-black shrink-0" />
              <span className="truncate font-medium">100% Brand Sealed</span>
            </div>
            <div className="flex items-center gap-1.5">
              <FileText size={13} className="text-black shrink-0" />
              <span className="truncate font-medium">Instant GST Tax Invoice</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Truck size={13} className="text-black shrink-0" />
              <span className="truncate font-medium">Free Express Air Courier</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Award size={13} className="text-black shrink-0" />
              <span className="truncate font-medium">1-Year Official Warranty</span>
            </div>
          </div>
        </div>

        {/* =========================================================================
            2. FLIPKART-STYLE CONTROLS, CATEGORY RAILS & VIEW TOGGLE
        ========================================================================= */}
        <div className="p-3.5 sm:p-5 rounded-2xl bg-white/95 backdrop-blur-xl border border-black/10 space-y-3.5 shadow-md sticky top-16 sm:top-20 z-30">
          
          {/* Horizontal Category Rail */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 [scrollbar-width:none] -mx-1 px-1">
            {categories.map(cat => {
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 sm:px-4 py-2 rounded-xl text-xs uppercase tracking-wider font-semibold transition-all duration-300 flex items-center gap-1.5 shrink-0 cursor-pointer ${
                    isActive
                      ? 'bg-black text-white font-extrabold shadow-md scale-[1.02]'
                      : 'bg-black/[0.02] text-neutral-600 hover:text-black hover:bg-black/[0.05] border border-black/5'
                  }`}
                >
                  <span>{cat.icon}</span>
                  <span>{cat.label}</span>
                  <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded ${
                    isActive ? 'bg-white/20 text-white font-bold' : 'bg-black/5 text-neutral-500'
                  }`}>
                    {cat.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Secondary Filters */}
          <div className="flex flex-wrap items-center justify-between gap-2.5 pt-2 border-t border-black/5">
            
            {/* Brand Filter Pills */}
            <div className="flex items-center gap-1 overflow-x-auto [scrollbar-width:none] py-0.5">
              {availableBrands.map(b => (
                <button
                  key={b}
                  onClick={() => setSelectedBrand(b)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer capitalize whitespace-nowrap ${
                    selectedBrand === b
                      ? 'bg-black text-white font-extrabold shadow-sm'
                      : 'bg-black/[0.03] text-neutral-600 hover:text-black hover:bg-black/[0.06] border border-black/5'
                  }`}
                >
                  {b === 'all' ? 'All Brands' : b}
                </button>
              ))}
            </div>

            {/* Controls: Search, View Mode Toggle, Sort */}
            <div className="flex items-center gap-2 text-xs w-full sm:w-auto justify-between sm:justify-end">
              
              {/* Search Input */}
              <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-white border border-black/10 focus-within:border-black/30 transition-all text-xs flex-1 sm:flex-initial shadow-sm">
                <Search size={13} className="text-neutral-500" />
                <input
                  type="text"
                  placeholder="Search models..."
                  value={shopSearch}
                  onChange={(e) => setShopSearch(e.target.value)}
                  className="bg-transparent text-black placeholder-neutral-400 outline-none w-full sm:w-32 text-xs"
                />
                {shopSearch && (
                  <button onClick={() => setShopSearch('')} className="text-neutral-400 hover:text-black">
                    <X size={12} />
                  </button>
                )}
              </div>

              {/* Sort Options */}
              <div className="flex items-center gap-1 bg-white border border-black/10 rounded-xl px-2 py-1.5 shrink-0 shadow-sm">
                <ArrowUpDown size={12} className="text-neutral-500" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-transparent text-black text-xs outline-none cursor-pointer"
                >
                  <option value="featured" className="bg-white text-black">Popularity</option>
                  <option value="price-asc" className="bg-white text-black">Price: Low to High</option>
                  <option value="price-desc" className="bg-white text-black">Price: High to Low</option>
                  <option value="rating" className="bg-white text-black">Top Rated (★)</option>
                  <option value="savings" className="bg-white text-black">Biggest Discount</option>
                </select>
              </div>

              {/* Flipkart View Switcher (List vs 2-Col Grid) */}
              <div className="flex items-center bg-white/[0.06] p-0.5 rounded-xl border border-white/10 shrink-0">
                <button
                  onClick={() => setViewMode('list')}
                  title="Detailed Flipkart Listing View"
                  className={`p-1.5 rounded-lg transition-all ${
                    viewMode === 'list'
                      ? 'bg-white text-black font-bold shadow-sm'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  <List size={14} />
                </button>
                <button
                  onClick={() => setViewMode('grid')}
                  title="Compact 2-Column Grid View"
                  className={`p-1.5 rounded-lg transition-all ${
                    viewMode === 'grid'
                      ? 'bg-white text-black font-bold shadow-sm'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  <LayoutGrid size={14} />
                </button>
              </div>

            </div>

          </div>

        </div>

        {/* =========================================================================
            3. PRODUCT SHOWCASE LISTING (FLIPKART STYLE)
        ========================================================================= */}
        {filteredProducts.length === 0 ? (
          <div className="py-20 text-center p-8 rounded-3xl bg-white/80 border border-black/10 space-y-4 shadow-sm">
            <p className="text-neutral-500 text-sm">No products found matching your current filter criteria.</p>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSelectedBrand('all');
                setSelectedPriceRange('all');
                setShopSearch('');
              }}
              className="px-6 py-2.5 rounded-full bg-black text-white font-bold text-xs uppercase tracking-wider cursor-pointer shadow-md"
            >
              Reset All Filters
            </button>
          </div>
        ) : viewMode === 'list' ? (

          /* FLIPKART DETAILED LIST VIEW */
          <div className="space-y-4">
            {filteredProducts.map(product => {
              const { color: currentColor, storage: currentStorage, price: currentPrice } = getProductSelection(product);
              const savings = product.originalPrice ? product.originalPrice - currentPrice : 0;
              const discountPct = product.originalPrice ? Math.round((savings / product.originalPrice) * 100) : 0;
              const emiMonthly = Math.round(currentPrice / 12);

              return (
                <div
                  key={product.id}
                  className="relative rounded-2xl sm:rounded-3xl bg-white/90 backdrop-blur-xl border border-black/10 hover:border-black/20 transition-all p-3.5 sm:p-6 shadow-sm hover:shadow-lg"
                >
                  <div className="flex flex-col md:flex-row gap-4 sm:gap-6">
                    
                    {/* Left Column: Image with Discount Badge & Flipkart NR-Assured Tag */}
                    <div className="w-full md:w-56 lg:w-64 shrink-0 flex flex-col items-center">
                      <div 
                        onClick={() => onOpenSpecsModal(product)}
                        className="relative w-full aspect-square max-h-56 sm:max-h-64 rounded-xl sm:rounded-2xl overflow-hidden bg-neutral-50 border border-black/5 flex items-center justify-center cursor-pointer group"
                      >
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          loading="lazy"
                        />

                        {discountPct > 0 && (
                          <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md bg-black text-white font-black text-[10px] tracking-wide shadow-sm">
                            {discountPct}% OFF
                          </div>
                        )}

                        {product.badge && (
                          <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-md bg-black/10 backdrop-blur-md text-black border border-black/15 font-bold text-[9px] uppercase tracking-wider">
                            {product.badge}
                          </div>
                        )}

                        <div className="absolute bottom-2.5 right-2.5 px-2.5 py-0.5 rounded-full bg-white/90 backdrop-blur-md text-[9px] font-bold text-black border border-black/10 flex items-center gap-1 opacity-80 group-hover:opacity-100 shadow-sm">
                          <span>Inspect</span>
                          <ArrowUpRight size={10} />
                        </div>
                      </div>

                      <div className="mt-2 flex items-center gap-1.5 text-[10.5px] text-neutral-500 font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                        <span>In Stock • Ready for Dispatch</span>
                      </div>
                    </div>

                    {/* Middle Column: Details, Ratings, Specifications Checklist */}
                    <div className="flex-1 space-y-2.5 min-w-0">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] uppercase font-bold tracking-widest text-neutral-500">
                            {product.brand}
                          </span>
                          <span className="text-neutral-400">•</span>
                          <div className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded bg-black/5 border border-black/10 text-[9.5px] font-extrabold text-black">
                            <Zap size={9} className="text-black fill-black" />
                            <span>NR-Assured</span>
                          </div>
                        </div>

                        <h3
                          onClick={() => onOpenSpecsModal(product)}
                          className="text-lg sm:text-xl font-medium text-black tracking-tight cursor-pointer hover:text-neutral-600 transition-colors mt-0.5 line-clamp-2"
                        >
                          {product.name}
                        </h3>
                      </div>

                      {/* Rating Pill */}
                      <div className="flex items-center gap-2 text-xs">
                        <span className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-green-600 text-white font-extrabold text-[11px] shadow-sm">
                          <span>{product.rating}</span>
                          <Star size={11} className="fill-white" />
                        </span>
                        <span className="text-neutral-500 text-xs">
                          ({product.reviewsCount} Ratings & Reviews)
                        </span>
                      </div>

                      {/* Specifications Bullets (Flipkart Style) */}
                      {product.specs && (
                        <ul className="space-y-1 text-xs text-neutral-600 pt-1">
                          {Object.entries(product.specs).slice(0, 4).map(([key, val]) => (
                            <li key={key} className="flex items-start gap-1.5">
                              <span className="text-neutral-400">•</span>
                              <span className="text-neutral-500 font-normal">{key}:</span>
                              <span className="text-black font-medium truncate">{val}</span>
                            </li>
                          ))}
                        </ul>
                      )}

                      {/* Variants */}
                      <div className="pt-2 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-black/5 text-xs">
                        {product.storageVariants && product.storageVariants.length > 0 && (
                          <div className="flex items-center gap-1.5">
                            <span className="text-neutral-500 text-[11px]">Storage:</span>
                            <div className="flex gap-1">
                              {product.storageVariants.map(v => (
                                <button
                                  key={v.size}
                                  onClick={() => setSelectedStorageMap(prev => ({ ...prev, [product.id]: v.size }))}
                                  className={`px-2 py-0.5 rounded-md text-[11px] font-semibold transition-all cursor-pointer ${
                                    currentStorage === v.size
                                      ? 'bg-black text-white font-bold shadow-sm'
                                      : 'bg-black/[0.04] text-neutral-600 hover:text-black border border-black/10'
                                  }`}
                                >
                                  {v.size}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}

                        {product.colors && product.colors.length > 0 && (
                          <div className="flex items-center gap-1.5">
                            <span className="text-neutral-500 text-[11px]">Finish:</span>
                            <div className="flex items-center gap-1.5">
                              {product.colors.map(c => (
                                <button
                                  key={c.name}
                                  onClick={() => setSelectedColorMap(prev => ({ ...prev, [product.id]: c.name }))}
                                  title={c.name}
                                  className={`w-4 h-4 rounded-full border transition-all cursor-pointer ${
                                    currentColor === c.name
                                      ? 'border-black scale-125 shadow-sm'
                                      : 'border-transparent opacity-60 hover:opacity-100 shadow-sm'
                                  }`}
                                  style={{ backgroundColor: c.hex }}
                                />
                              ))}
                              <span className="text-[10px] text-neutral-600 ml-0.5">{currentColor}</span>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Delivery & Warranty Tag */}
                      <div className="pt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-neutral-500">
                        <span className="flex items-center gap-1 text-black font-medium">
                          <Truck size={12} className="text-neutral-500" />
                          <span>Free Express Delivery by Tomorrow</span>
                        </span>
                        <span>•</span>
                        <span>7-Day Replacement</span>
                      </div>
                    </div>

                    {/* Right Column: Pricing & Side-by-Side Action Buttons */}
                    <div className="w-full md:w-64 shrink-0 flex flex-col justify-between border-t md:border-t-0 md:border-l border-black/10 pt-3 md:pt-0 md:pl-5 space-y-3">
                      <div>
                        <div className="flex items-baseline gap-2 flex-wrap">
                          <span className="text-2xl sm:text-3xl font-bold font-mono text-black tracking-tight">
                            ₹{currentPrice.toLocaleString('en-IN')}
                          </span>
                          {product.originalPrice && (
                            <span className="text-xs text-neutral-500 line-through font-mono">
                              ₹{product.originalPrice.toLocaleString('en-IN')}
                            </span>
                          )}
                          {discountPct > 0 && (
                            <span className="text-[11px] font-bold text-green-700 bg-green-50 px-1.5 py-0.5 rounded border border-green-200">
                              {discountPct}% off
                            </span>
                          )}
                        </div>

                        {savings > 0 && (
                          <div className="text-[11px] text-green-700 mt-0.5 font-medium">
                            You Save: <strong className="font-mono">₹{savings.toLocaleString('en-IN')}</strong>
                          </div>
                        )}

                        {/* Bank Offer Pill */}
                        <div className="mt-2.5 p-2 rounded-xl bg-green-50 border border-green-100 text-[11px] space-y-1">
                          <div className="flex items-center gap-1 text-green-800 font-semibold">
                            <Tag size={12} className="shrink-0" />
                            <span>Bank Offer</span>
                          </div>
                          <p className="text-green-700/80 text-[10.5px] leading-tight">
                            Flat ₹5,000 instant discount with HDFC & ICICI Credit Cards.
                          </p>
                        </div>

                        {/* EMI Option */}
                        <button
                          type="button"
                          onClick={() => onSelectEmiProduct(product)}
                          className="mt-2 w-full flex items-center justify-between text-[11px] text-neutral-300 hover:text-white p-1.5 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
                        >
                          <span className="flex items-center gap-1">
                            <CreditCard size={12} className="text-neutral-400" />
                            <span>0% EMI from <strong>₹{emiMonthly.toLocaleString('en-IN')}</strong>/mo</span>
                          </span>
                          <span className="text-[10px] text-white font-bold underline">Check Plans →</span>
                        </button>
                      </div>

                      {/* Large Side-by-Side Touch Buttons */}
                      <div className="grid grid-cols-2 gap-2 pt-2">
                        <button
                          onClick={() => handleAdd(product)}
                          type="button"
                          className={`min-h-[44px] py-2.5 px-2 rounded-xl text-xs uppercase tracking-wider font-bold transition-all border cursor-pointer flex items-center justify-center gap-1.5 ${
                            addedItemId === product.id
                              ? 'bg-neutral-800 text-white border-black shadow-md'
                              : 'bg-black/[0.04] hover:bg-black/[0.08] text-black border-black/10 active:scale-95'
                          }`}
                        >
                          {addedItemId === product.id ? (
                            <>
                              <Check size={14} className="text-white" />
                              <span className="text-white">In Bag</span>
                            </>
                          ) : (
                            <>
                              <ShoppingBag size={14} className="text-neutral-600" />
                              <span>Add Bag</span>
                            </>
                          )}
                        </button>

                        <button
                          onClick={() => handleBuyNowClick(product)}
                          type="button"
                          className="min-h-[44px] py-2.5 px-2 rounded-xl bg-black hover:bg-neutral-800 text-white font-extrabold text-xs uppercase tracking-wider transition-all cursor-pointer shadow-[0_4px_16px_rgba(0,0,0,0.25)] flex items-center justify-center gap-1.5 active:scale-95"
                        >
                          <Zap size={14} className="text-black fill-black" />
                          <span>Buy Now</span>
                        </button>
                      </div>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        ) : (

          /* FLIPKART 2-COLUMN GRID VIEW */
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
            {filteredProducts.map(product => {
              const { color: currentColor, storage: currentStorage, price: currentPrice } = getProductSelection(product);
              const savings = product.originalPrice ? product.originalPrice - currentPrice : 0;
              const discountPct = product.originalPrice ? Math.round((savings / product.originalPrice) * 100) : 0;

              return (
                <div
                  key={product.id}
                  className="relative rounded-xl sm:rounded-2xl bg-white/95 backdrop-blur-xl border border-black/10 hover:border-black/20 transition-all p-2.5 sm:p-4 flex flex-col justify-between shadow-sm hover:shadow-lg"
                >
                  <div>
                    {/* Image & Badges */}
                    <div
                      onClick={() => onOpenSpecsModal(product)}
                      className="relative aspect-square w-full rounded-lg sm:rounded-xl overflow-hidden bg-neutral-50 border border-black/5 flex items-center justify-center cursor-pointer group"
                    >
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />

                      {discountPct > 0 && (
                        <div className="absolute top-1.5 left-1.5 px-1.5 py-0.2 rounded bg-black text-white font-black text-[9px] shadow-sm">
                          {discountPct}% OFF
                        </div>
                      )}

                      <div className="absolute bottom-1.5 right-1.5 px-1.5 py-0.2 rounded-full bg-white/90 text-[8.5px] font-bold text-neutral-600 border border-black/10 flex items-center gap-0.5 shadow-sm">
                        <span>Inspect</span>
                        <ArrowUpRight size={9} />
                      </div>
                    </div>

                    {/* Title & Brand */}
                    <div className="mt-2.5">
                      <div className="text-[9px] uppercase font-bold text-neutral-500 tracking-wider">
                        {product.brand}
                      </div>
                      <h3
                        onClick={() => onOpenSpecsModal(product)}
                        className="text-xs sm:text-sm font-medium text-black tracking-tight line-clamp-2 cursor-pointer hover:text-neutral-600 transition-colors mt-0.5"
                      >
                        {product.name}
                      </h3>
                    </div>

                    {/* Rating Pill */}
                    <div className="flex items-center gap-1.5 mt-1.5 text-xs">
                      <span className="flex items-center gap-0.5 px-1.5 py-0.2 rounded bg-green-600 text-white font-extrabold text-[10px]">
                        <span>{product.rating}</span>
                        <Star size={9} className="fill-white" />
                      </span>
                      <span className="text-[10px] text-neutral-500">
                        ({product.reviewsCount})
                      </span>
                    </div>

                    {/* Pricing */}
                    <div className="mt-2">
                      <div className="flex items-baseline gap-1.5 flex-wrap">
                        <span className="text-sm sm:text-lg font-bold font-mono text-black">
                          ₹{currentPrice.toLocaleString('en-IN')}
                        </span>
                        {product.originalPrice && (
                          <span className="text-[10px] text-neutral-500 line-through font-mono">
                            ₹{product.originalPrice.toLocaleString('en-IN')}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Storage Chips */}
                    {product.storageVariants && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {product.storageVariants.map(v => (
                          <button
                            key={v.size}
                            onClick={() => setSelectedStorageMap(prev => ({ ...prev, [product.id]: v.size }))}
                            className={`px-1.5 py-0.5 rounded text-[9.5px] font-semibold transition-all ${
                              currentStorage === v.size
                                ? 'bg-black text-white font-bold shadow-sm'
                                : 'bg-black/[0.04] text-neutral-600 border border-transparent'
                            }`}
                          >
                            {v.size}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Grid Action Buttons */}
                  <div className="grid grid-cols-2 gap-1.5 pt-3 mt-2 border-t border-black/5">
                    <button
                      onClick={() => handleAdd(product)}
                      type="button"
                      className="min-h-[38px] py-1.5 px-1 rounded-lg text-[10px] uppercase font-bold border border-black/10 text-black bg-black/[0.02] hover:bg-black/[0.05] transition-all flex items-center justify-center gap-1"
                    >
                      {addedItemId === product.id ? <Check size={12} className="text-black" /> : <ShoppingBag size={12} className="text-neutral-600" />}
                      <span>{addedItemId === product.id ? 'Added' : 'Bag'}</span>
                    </button>

                    <button
                      onClick={() => handleBuyNowClick(product)}
                      type="button"
                      className="min-h-[38px] py-1.5 px-1 rounded-lg text-[10px] uppercase font-extrabold bg-black text-white hover:bg-neutral-800 transition-all flex items-center justify-center gap-1 shadow-sm"
                    >
                      <Zap size={12} className="fill-white text-white" />
                      <span>Buy</span>
                    </button>
                  </div>

                </div>
              );
            })}
          </div>
        )}

      </div>
    </section>
  );
};
