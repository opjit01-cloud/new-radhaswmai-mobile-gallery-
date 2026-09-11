import React, { useState, useMemo } from 'react';
import { Product } from '../../data/products';
import { ShoppingBag, Check, Sparkles, Filter, Zap, ArrowUpRight, ShieldCheck, ArrowUpDown, Bell } from 'lucide-react';
import { MagneticButton } from '../common/MagneticButton';
import { SpotlightCard } from '../reactbits/SpotlightCard';
import { TiltedCard } from '../reactbits/TiltedCard';
import { BorderBeam } from '../reactbits/BorderBeam';
import { ShinyText } from '../reactbits/ShinyText';
import { DecryptedText } from '../reactbits/DecryptedText';
import { ClickSpark } from '../reactbits/ClickSpark';
import { Aurora } from '../reactbits/Aurora';
import { Particles } from '../reactbits/Particles';

interface MobileCatalogSectionProps {
  products: Product[];
  onAddToCart: (product: Product, color: string, storage?: string, price?: number) => void;
  onBuyNow: (product: Product, color: string, storage?: string, price?: number) => void;
  onSelectEmiProduct: (product: Product) => void;
  onOpenSpecsModal: (product: Product) => void;
  selectedBrandFilter?: string;
}

export const MobileCatalogSection: React.FC<MobileCatalogSectionProps> = ({
  products,
  onAddToCart,
  onBuyNow,
  onSelectEmiProduct,
  onOpenSpecsModal,
  selectedBrandFilter
}) => {
  const [activeBrand, setActiveBrand] = useState<string>(selectedBrandFilter || 'all');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'name'>('featured');
  const [selectedStorageMap, setSelectedStorageMap] = useState<{ [id: string]: string }>({});
  const [selectedColorMap, setSelectedColorMap] = useState<{ [id: string]: string }>({});
  const [addedItem, setAddedItem] = useState<string | null>(null);

  const brands = [
    { id: 'all', label: 'All Flagships' },
    { id: 'Apple', label: 'Apple iPhone' },
    { id: 'Samsung', label: 'Samsung Galaxy' },
    { id: 'Google', label: 'Google Pixel' },
    { id: 'OnePlus', label: 'OnePlus' }
  ];

  const processedProducts = useMemo(() => {
    let result = products.filter(p => {
      if (activeBrand === 'all') return true;
      return p.brand.toLowerCase() === activeBrand.toLowerCase() || p.name.toLowerCase().includes(activeBrand.toLowerCase());
    });

    if (sortBy === 'price-asc') {
      result = [...result].sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      result = [...result].sort((a, b) => b.price - a.price);
    } else if (sortBy === 'name') {
      result = [...result].sort((a, b) => a.name.localeCompare(b.name));
    }
    return result;
  }, [products, activeBrand, sortBy]);

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
    setAddedItem(product.id);
    setTimeout(() => setAddedItem(null), 2200);
  };

  const handleBuyNowClick = (product: Product) => {
    const { color, storage, price } = getProductSelection(product);
    onBuyNow(product, color, storage, price);
  };

  return (
    <section id="catalog" className="py-24 sm:py-32 px-4 sm:px-6 bg-[#FAFAFB] dark:bg-[#07080A] text-[#0A0B0E] dark:text-[#F8FAFC] border-t border-b border-black/[0.08] dark:border-white/10 transition-colors duration-300 relative overflow-hidden">
      
      {/* Pro React Bits: Aurora Flowing Wave Background */}
      <Aurora colorStops={['#FFFFFF', '#94A3B8', '#334155', '#0B0F19']} blend={0.15} speed={15} />

      {/* Pro React Bits: Interactive Canvas Particles Constellation */}
      <Particles particleCount={30} speed={0.18} connectLines={false} className="opacity-20" />

      <div className="max-w-7xl mx-auto relative z-10 space-y-8">
        
        {/* Architectural Salon Gateway Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-black/[0.08] dark:border-white/10 pb-8 gap-6 transition-colors">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono tracking-widest font-bold px-2 py-0.5 rounded bg-neutral-100 dark:bg-white/10 text-neutral-800 dark:text-neutral-300 border border-neutral-200 dark:border-white/15">
                SALON 01
              </span>
              <DecryptedText
                text="BESPOKE SMARTPHONE COLLECTION • OFFICIAL INDIAN UNITS"
                speed={26}
                maxIterations={10}
                className="text-[10.5px] uppercase tracking-[0.2em] text-neutral-500 dark:text-neutral-400 font-bold"
              />
            </div>
            <h2 className="text-3xl sm:text-5xl font-serif-luxury font-normal text-neutral-950 dark:text-white tracking-tight">
              The Flagship Smartphone <span className="font-semibold text-black dark:text-white"><ShinyText text="Salon" speed={3.5} /></span>
            </h2>
            <p className="text-neutral-600 dark:text-neutral-400 font-light max-w-2xl text-sm sm:text-base leading-relaxed">
              Every unit is factory-sealed, authorized by Apple, Samsung, Google, and OnePlus. Accompanied by official GST invoice and white-glove express courier dispatch.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <span className="px-4 py-2 rounded-full bg-white dark:bg-white/[0.04] border border-neutral-200 dark:border-white/15 text-xs text-neutral-800 dark:text-neutral-200 tracking-wide font-mono backdrop-blur-xl shadow-xs">
              <ShinyText text={`${processedProducts.length} Models in Salon`} speed={3} />
            </span>
          </div>
        </div>

        {/* Filter & Sort Toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-2">
          {/* Brand Filter Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto [scrollbar-width:none]">
            <Filter size={14} className="text-neutral-500 shrink-0 mr-1" />
            {brands.map(b => (
              <MagneticButton
                key={b.id}
                onClick={() => setActiveBrand(b.id)}
                className={`px-4 py-2 rounded-full text-xs tracking-wider transition-all cursor-pointer whitespace-nowrap ${
                  activeBrand === b.id
                    ? 'bg-black dark:bg-white text-white dark:text-black font-extrabold shadow-md scale-105'
                    : 'bg-white dark:bg-white/[0.04] border border-neutral-200 dark:border-white/10 text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white hover:border-neutral-400 dark:hover:border-white/25 backdrop-blur-md'
                }`}
              >
                {b.label}
              </MagneticButton>
            ))}
          </div>

          {/* Sort Selection Control */}
          <div className="flex items-center gap-2 self-end sm:self-auto shrink-0 text-xs">
            <ArrowUpDown size={13} className="text-neutral-500 dark:text-neutral-400" />
            <span className="text-neutral-500 dark:text-neutral-400 text-[11px] uppercase tracking-wider">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-white dark:bg-[#0F1015] text-neutral-900 dark:text-neutral-200 border border-neutral-200 dark:border-white/15 rounded-full px-3 py-1.5 text-xs outline-none cursor-pointer focus:border-black dark:focus:border-white/30"
            >
              <option value="featured">Featured Collection</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="name">Model Name</option>
            </select>
          </div>
        </div>

        {/* Products Grid with TiltedCard, SpotlightCard & BorderBeam */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pt-4">
          {processedProducts.map(product => {
            const currentStorage = selectedStorageMap[product.id] || (product.storageVariants?.[0]?.size || '');
            let currentPrice = product.price;
            if (product.storageVariants && currentStorage) {
              const v = product.storageVariants.find(s => s.size === currentStorage);
              if (v) currentPrice = v.price;
            }
            const currentColor = selectedColorMap[product.id] || product.colors[0]?.name || 'Standard';
            const emiMonthly = Math.round(currentPrice / 12);

            return (
              <TiltedCard
                key={product.id}
                maxTilt={6}
                scale={1.015}
                glareEnable={true}
                className="h-full"
              >
                <SpotlightCard
                  spotlightColor="rgba(255, 255, 255, 0.08)"
                  borderColor="rgba(255, 255, 255, 0.22)"
                  className="p-6 sm:p-7 shadow-xl h-full flex flex-col justify-between bg-white dark:bg-[#0F1015]/85 border border-neutral-200/90 dark:border-white/10 rounded-3xl transition-colors"
                >
                  {/* Pro React Bits BorderBeam for Featured Models */}
                  {product.badge && (
                    <BorderBeam size={200} duration={7} colorFrom="#FFFFFF" colorTo="#94A3B8" />
                  )}

                  <div>
                    {/* Top Badge & Brand */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="text-[11px] uppercase tracking-[0.18em] font-bold text-neutral-500 dark:text-neutral-400">
                        {product.brand}
                      </span>
                      <div className="flex items-center gap-2">
                        {product.badge && (
                          <span className="px-3 py-0.5 rounded-full bg-neutral-100 dark:bg-white/10 text-neutral-900 dark:text-white border border-neutral-200 dark:border-white/20 text-[10px] uppercase tracking-wider font-semibold">
                            {product.badge}
                          </span>
                        )}
                        <button
                          onClick={() => onOpenSpecsModal(product)}
                          className="text-[11px] text-neutral-500 dark:text-neutral-400 hover:text-black dark:hover:text-white flex items-center gap-0.5 transition-colors cursor-pointer"
                          title="View Full Specifications Dossier"
                        >
                          <span>Specs</span>
                          <ArrowUpRight size={12} />
                        </button>
                      </div>
                    </div>

                    {/* Device Title & Pricing */}
                    <h3
                      onClick={() => onOpenSpecsModal(product)}
                      className="text-xl sm:text-2xl font-serif-luxury font-medium text-neutral-950 dark:text-white tracking-tight leading-snug cursor-pointer hover:text-neutral-700 dark:hover:text-neutral-200 transition-colors"
                    >
                      {product.name}
                    </h3>

                    <div className="mt-2.5 flex items-baseline gap-2.5">
                      <span className="text-2xl sm:text-3xl font-bold text-neutral-950 dark:text-white tracking-tight font-mono">
                        ₹{currentPrice.toLocaleString('en-IN')}
                      </span>
                      {product.originalPrice && (
                        <span className="text-xs text-neutral-400 dark:text-neutral-500 line-through font-mono">
                          ₹{product.originalPrice.toLocaleString('en-IN')}
                        </span>
                      )}
                    </div>

                    {/* Dynamic Clickable 0% EMI Pill */}
                    <button
                      type="button"
                      onClick={() => onSelectEmiProduct(product)}
                      className="mt-3 w-full py-2 px-3.5 rounded-xl bg-neutral-50 dark:bg-white/[0.04] hover:bg-neutral-100 dark:hover:bg-white/[0.08] border border-neutral-200 dark:border-white/10 hover:border-neutral-400 dark:hover:border-white/25 text-xs flex items-center justify-between transition-all cursor-pointer group/emi shadow-2xs backdrop-blur-md"
                      title={`Click to detect price ₹${currentPrice.toLocaleString('en-IN')} and calculate EMI`}
                    >
                      <span className="flex items-center gap-1.5 font-medium text-neutral-700 dark:text-neutral-300">
                        <Sparkles size={13} className="text-black dark:text-white/80 group-hover/emi:rotate-12 transition-transform" />
                        <span>0% EMI from <strong className="text-black dark:text-white">₹{emiMonthly.toLocaleString('en-IN')}</strong>/mo</span>
                      </span>
                      <span className="text-[11px] text-neutral-500 dark:text-neutral-400 group-hover/emi:text-black dark:group-hover/emi:text-white font-bold flex items-center gap-1 group-hover/emi:translate-x-0.5 transition-transform">
                        Detect EMI →
                      </span>
                    </button>

                    {/* Product Image Stage with Depth Hover */}
                    <div
                      onClick={() => onOpenSpecsModal(product)}
                      className="relative aspect-[4/3] w-full my-6 rounded-2xl overflow-hidden bg-neutral-100 dark:bg-[#07080A]/95 border border-neutral-200 dark:border-white/10 flex items-center justify-center cursor-pointer group-hover:border-neutral-400 dark:group-hover:border-white/25 transition-all shadow-inner"
                    >
                      <img
                        src={product.image}
                        alt={product.name}
                        className={`w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out ${
                          product.inStock === false ? 'opacity-40 grayscale-[40%]' : ''
                        }`}
                      />

                      {/* Out of Stock Overlay Banner */}
                      {product.inStock === false && (
                        <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex flex-col items-center justify-center p-3 text-center z-10">
                          <span className="px-3 py-1 rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-300 text-[11px] font-mono font-bold uppercase tracking-widest mb-1">
                            Sold Out
                          </span>
                          <span className="text-[10.5px] text-neutral-300 font-medium">Temporarily Out of Stock</span>
                        </div>
                      )}

                      {/* Quick Specs Overlay Pill */}
                      <div className="absolute bottom-3 right-3 px-3 py-1 rounded-full bg-black/85 backdrop-blur-md text-[10px] uppercase font-bold text-neutral-200 border border-white/15 flex items-center gap-1 shadow-lg opacity-90 group-hover:opacity-100 transition-opacity z-20">
                        <span>View Dossier</span>
                        <ArrowUpRight size={11} />
                      </div>
                    </div>

                    {/* Finish / Color Picker */}
                    <div className="mb-4">
                      <div className="text-[11px] text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-2">
                        Finish: <span className="text-neutral-900 dark:text-white font-semibold">{currentColor}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {product.colors.map(c => (
                          <button
                            key={c.name}
                            onClick={() => setSelectedColorMap(prev => ({ ...prev, [product.id]: c.name }))}
                            title={c.name}
                            className={`w-6 h-6 rounded-full border-2 transition-all cursor-pointer ${
                              currentColor === c.name
                                ? 'border-black dark:border-white scale-125 shadow-md shadow-black/20 dark:shadow-white/30'
                                : 'border-transparent opacity-65 hover:opacity-100'
                            }`}
                            style={{ backgroundColor: c.hex }}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Storage Variants Chips */}
                    {product.storageVariants && product.storageVariants.length > 0 && (
                      <div className="mb-6">
                        <div className="text-[11px] text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-2">
                          Storage Capacity:
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {product.storageVariants.map(v => (
                            <button
                              key={v.size}
                              onClick={() => setSelectedStorageMap(prev => ({ ...prev, [product.id]: v.size }))}
                              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                                currentStorage === v.size
                                  ? 'bg-black dark:bg-white text-white dark:text-black font-extrabold shadow-md scale-105'
                                  : 'bg-neutral-100 dark:bg-white/[0.04] text-neutral-700 dark:text-neutral-400 hover:text-black dark:hover:text-white hover:bg-neutral-200 dark:hover:bg-white/[0.08] border border-neutral-200 dark:border-white/5'
                              }`}
                            >
                              {v.size}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Key Specs Pills */}
                    {product.specs && (
                      <div className="border-t border-neutral-100 dark:border-white/10 pt-3 pb-4 space-y-1.5 text-xs text-neutral-500 dark:text-neutral-400">
                        {Object.entries(product.specs).slice(0, 2).map(([k, val]) => (
                          <div key={k} className="flex justify-between">
                            <span className="text-neutral-500">{k}:</span>
                            <span className="font-medium text-neutral-900 dark:text-white truncate max-w-[180px]">{val}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* SIDE-BY-SIDE [ADD TO BAG] + [BUY NOW] BUTTONS */}
                  {product.inStock === false ? (
                    <div className="grid grid-cols-2 gap-3 pt-2">
                      <button
                        type="button"
                        disabled
                        className="w-full py-3.5 px-3 rounded-2xl text-[11px] uppercase tracking-wider font-bold bg-neutral-100 dark:bg-white/5 border border-neutral-200 dark:border-white/10 text-neutral-400 cursor-not-allowed flex items-center justify-center gap-1.5"
                      >
                        <span>Sold Out</span>
                      </button>

                      <a
                        href={`https://wa.me/919691011335?text=${encodeURIComponent(`Hi New Radhaswami Mobile Gallery, please alert me when ${product.name} is back in stock!`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full py-3.5 px-3 rounded-2xl text-[11px] uppercase tracking-wider font-extrabold bg-black dark:bg-white hover:bg-neutral-800 dark:hover:bg-neutral-200 text-white dark:text-black shadow-xl shadow-black/15 dark:shadow-white/15 cursor-pointer flex items-center justify-center gap-1.5 active:scale-95 transition-all"
                      >
                        <Bell size={13} className="shrink-0 text-white dark:text-black" />
                        <span>Alert Me</span>
                      </a>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-3 pt-2">
                      {/* Add to Bag Button */}
                      <ClickSpark sparkColor="#000000" sparkCount={6}>
                        <MagneticButton
                          onClick={() => handleAdd(product)}
                          type="button"
                          className={`w-full py-3.5 px-3 rounded-2xl text-[11px] uppercase tracking-wider font-bold transition-all border cursor-pointer ${
                            addedItem === product.id
                              ? 'bg-neutral-900 dark:bg-neutral-100 text-white dark:text-black border-black dark:border-white shadow-lg'
                              : 'bg-neutral-100 dark:bg-white/[0.06] hover:bg-neutral-200 dark:hover:bg-white/[0.12] text-neutral-900 dark:text-white border-neutral-200 dark:border-white/15 hover:border-neutral-400 dark:hover:border-white/30'
                          }`}
                        >
                          {addedItem === product.id ? (
                            <span className="flex items-center justify-center gap-1.5 text-white dark:text-black">
                              <Check size={14} className="text-white dark:text-black" />
                              <span>In Bag</span>
                            </span>
                          ) : (
                            <span className="flex items-center justify-center gap-1.5">
                              <ShoppingBag size={14} className="text-neutral-700 dark:text-neutral-300" />
                              <span>Add to Bag</span>
                            </span>
                          )}
                        </MagneticButton>
                      </ClickSpark>

                      {/* Buy Now Button */}
                      <ClickSpark sparkColor="#000000" sparkCount={12}>
                        <MagneticButton
                          onClick={() => handleBuyNowClick(product)}
                          type="button"
                          className="w-full py-3.5 px-3 rounded-2xl text-[11px] uppercase tracking-wider font-extrabold bg-black dark:bg-white hover:bg-neutral-800 dark:hover:bg-neutral-200 text-white dark:text-black shadow-xl shadow-black/20 dark:shadow-white/20 cursor-pointer"
                        >
                          <span className="flex items-center justify-center gap-1.5 text-white dark:text-black">
                            <Zap size={14} className="text-white dark:text-black fill-current" />
                            <span>Buy Now</span>
                          </span>
                        </MagneticButton>
                      </ClickSpark>
                    </div>
                  )}

                  {/* Micro Assurance */}
                  <div className="mt-3 flex items-center justify-center gap-1.5 text-[10.5px] text-neutral-500 dark:text-neutral-400">
                    <ShieldCheck size={12} className="text-neutral-500 dark:text-neutral-400" />
                    <span>Manufacturer Sealed • Free Insured Dispatch</span>
                  </div>

                </SpotlightCard>
              </TiltedCard>
            );
          })}
        </div>

      </div>
    </section>
  );
};
