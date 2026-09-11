import React, { useState, useMemo, useEffect } from 'react';
import { Product, PRODUCTS, StorageVariant } from '../data/products';
import { ShoppingBag, Star, MessageCircle, SlidersHorizontal, Eye, ArrowRight, ArrowUpDown } from 'lucide-react';
import { HashgraphButton } from './HashgraphButton';
import { QuickViewModal } from './QuickViewModal';

interface HashgraphPortfolioProps {
  onAddToCart: (product: Product, selectedColor: string, storage?: string) => void;
  onOpenCompare: () => void;
}

export const HashgraphPortfolio: React.FC<HashgraphPortfolioProps> = ({
  onAddToCart,
  onOpenCompare,
}) => {
  const [catalogProducts, setCatalogProducts] = useState<Product[]>(PRODUCTS);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [selectedBrand, setSelectedBrand] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'featured' | 'price-low' | 'price-high' | 'rating'>('featured');

  const [cardColors, setCardColors] = useState<{ [productId: string]: string }>({});
  const [cardStorages, setCardStorages] = useState<{ [productId: string]: StorageVariant }>({});
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        if (data.products && data.products.length > 0) {
          setCatalogProducts(data.products);
        }
      })
      .catch(() => {});
  }, []);

  const categories = [
    { id: 'all', label: 'All Hardware' },
    { id: 'smartphones', label: 'Flagship Phones' },
    { id: 'audio', label: 'Audiophile Sound' },
    { id: 'watches', label: 'Titanium Watches' },
    { id: 'accessories', label: 'Armor & MagSafe' },
  ];

  const brands = useMemo(() => {
    const b = new Set(catalogProducts.map(p => p.brand));
    return ['all', ...Array.from(b)];
  }, [catalogProducts]);

  const filteredProducts = useMemo(() => {
    return catalogProducts
      .filter(p => {
        const matchCat = activeCategory === 'all' || p.category === activeCategory;
        const matchBrand = selectedBrand === 'all' || p.brand === selectedBrand;
        return matchCat && matchBrand;
      })
      .sort((a, b) => {
        if (sortBy === 'price-low') return a.price - b.price;
        if (sortBy === 'price-high') return b.price - a.price;
        if (sortBy === 'rating') return b.rating - a.rating;
        return 0;
      });
  }, [catalogProducts, activeCategory, selectedBrand, sortBy]);

  const handleCardAdd = (product: Product) => {
    const chosenColor = cardColors[product.id] || product.colors[0]?.name || 'Standard';
    const chosenStorage = cardStorages[product.id];
    const productToAdd: Product = {
      ...product,
      price: chosenStorage ? chosenStorage.price : product.price,
    };
    onAddToCart(productToAdd, chosenColor, chosenStorage?.size);
  };

  const formatPrice = (val: number) => `₹${val.toLocaleString('en-IN')}`;

  return (
    <section id="portfolio" className="relative min-h-screen py-24 sm:py-32 px-6 sm:px-12 lg:px-16 border-t border-white/5 bg-[#000209]">
      
      {/* Quick View Modal */}
      <QuickViewModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        onAddToCart={onAddToCart}
      />

      <div className="max-w-7xl mx-auto">
        
        {/* Section Title Index */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 sm:mb-12">
          <div className="section-title">
            <span className="section-title__id">//02</span>
            <span>HARDWARE PORTFOLIO &bull; VAULT</span>
          </div>

          <button
            onClick={onOpenCompare}
            className="text-xs font-mono uppercase tracking-widest text-[#9BB8E1] hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <span>Compare Top Flagships</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Asymmetric Offset Title Matching HashgraphVC */}
        <div className="mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-5xl lg:text-7xl font-display font-extrabold text-white tracking-tight leading-[1.05]">
            <span className="block">Early access.</span>
            <span className="block pl-8 sm:pl-20 text-[#9BB8E1]">permanent</span>
            <span className="block pl-4 sm:pl-10">advantage.</span>
          </h2>
          <p className="mt-6 text-sm sm:text-base text-gray-400 font-light max-w-xl">
            Selected from premier global production lines. Factory-sealed inventory, precision camera systems, titanium enclosures, and audiophile transducers.
          </p>
        </div>

        {/* Filter Controls Bar */}
        <div className="mb-10 p-4 rounded-2xl bg-[#080C14] border border-[#9BB8E1]/15 flex flex-wrap items-center justify-between gap-4">
          
          {/* Categories */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-2xl scrollbar-none">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-mono uppercase tracking-wider transition-all cursor-pointer ${
                  activeCategory === cat.id
                    ? 'bg-[#9BB8E1] text-black font-bold shadow-md shadow-[#9BB8E1]/20'
                    : 'bg-white/5 text-gray-300 hover:text-white border border-white/5'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Brands & Sort */}
          <div className="flex items-center gap-4 ml-auto text-xs font-mono">
            <select
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
              className="bg-[#000209] text-gray-300 border border-white/15 rounded-lg px-3 py-1.5 outline-none cursor-pointer"
            >
              <option value="all">ALL BRANDS</option>
              {brands.filter(b => b !== 'all').map(b => (
                <option key={b} value={b}>{b.toUpperCase()}</option>
              ))}
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-[#000209] text-gray-300 border border-white/15 rounded-lg px-3 py-1.5 outline-none cursor-pointer"
            >
              <option value="featured">SORT: FEATURED</option>
              <option value="price-low">PRICE: LOW TO HIGH</option>
              <option value="price-high">PRICE: HIGH TO LOW</option>
              <option value="rating">TOP RATED 4.8★+</option>
            </select>
          </div>

        </div>

        {/* Hardware Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredProducts.map((product) => {
            const chosenColor = cardColors[product.id] || product.colors[0]?.name || 'Standard';
            const chosenStorage = cardStorages[product.id];
            const currentPrice = chosenStorage ? chosenStorage.price : product.price;
            const currentEmi = Math.round(currentPrice / 24);

            return (
              <div
                key={product.id}
                className="rounded-3xl p-6 hashgraph-card flex flex-col justify-between group transition-all duration-500 hover:-translate-y-1.5"
              >
                <div>
                  
                  {/* Card Header: Brand & Badge */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[11px] font-mono text-[#9BB8E1] uppercase tracking-widest">
                      {product.brand}
                    </span>
                    <div className="flex items-center gap-2">
                      {product.badge && (
                        <span className="px-2.5 py-0.5 rounded-full bg-[#9BB8E1]/15 border border-[#9BB8E1]/30 text-[#9BB8E1] text-[9px] font-mono font-bold uppercase">
                          {product.badge}
                        </span>
                      )}
                      <button
                        onClick={() => setQuickViewProduct(product)}
                        className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors cursor-pointer"
                        title="Quick View Specifications"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* High-Resolution Device Photography */}
                  <div
                    onClick={() => setQuickViewProduct(product)}
                    className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-[#04060A] border border-white/5 mb-5 p-3 flex items-center justify-center cursor-pointer"
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover rounded-xl transition-transform duration-700 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                      <span className="text-[10px] text-white font-mono flex items-center gap-1">
                        <Eye className="w-3 h-3 text-[#9BB8E1]" />
                        Inspect in-box &amp; full specs
                      </span>
                    </div>
                  </div>

                  {/* Title & Rating */}
                  <h3
                    onClick={() => setQuickViewProduct(product)}
                    className="text-base sm:text-lg font-display font-bold text-white hover:text-[#9BB8E1] transition-colors cursor-pointer leading-snug"
                  >
                    {product.name}
                  </h3>

                  <div className="flex items-center gap-2 my-2 text-xs">
                    <div className="flex items-center gap-1 text-white">
                      <Star className="w-3.5 h-3.5 fill-white" />
                      <span className="font-bold">{product.rating}</span>
                    </div>
                    <span className="text-gray-500 font-mono text-[11px]">({product.reviewsCount} reviews)</span>
                    <span className="text-gray-700">•</span>
                    <span className="text-[#9BB8E1] text-[11px] font-mono">100% Sealed</span>
                  </div>

                  {/* Color Swatches */}
                  <div className="my-3 flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      {product.colors.map(c => (
                        <button
                          key={c.name}
                          onClick={() => setCardColors(prev => ({ ...prev, [product.id]: c.name }))}
                          className={`p-0.5 rounded-full transition-all cursor-pointer ${
                            chosenColor === c.name
                              ? 'ring-2 ring-[#9BB8E1] ring-offset-2 ring-offset-[#080C14]'
                              : 'opacity-60 hover:opacity-100'
                          }`}
                          title={c.name}
                        >
                          <span
                            className="block w-3.5 h-3.5 rounded-full border border-white/20"
                            style={{ backgroundColor: c.hex }}
                          />
                        </button>
                      ))}
                    </div>
                    <span className="text-[10px] font-mono text-gray-400 truncate max-w-[120px]">
                      {chosenColor}
                    </span>
                  </div>

                  {/* Storage Variants (Interactive) */}
                  {product.storageVariants && product.storageVariants.length > 0 && (
                    <div className="my-3 grid grid-cols-3 gap-1.5">
                      {product.storageVariants.map(sv => {
                        const isSelected = (chosenStorage?.size || product.storageVariants![0].size) === sv.size;
                        return (
                          <button
                            key={sv.size}
                            onClick={() => setCardStorages(prev => ({ ...prev, [product.id]: sv }))}
                            className={`py-1 text-center rounded-lg border text-[10px] font-mono transition-all cursor-pointer ${
                              isSelected
                                ? 'border-[#9BB8E1] bg-[#9BB8E1]/20 text-white font-bold'
                                : 'border-white/10 bg-black/40 text-gray-400 hover:text-white'
                            }`}
                          >
                            {sv.size}
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {/* Specs Snippet */}
                  <div className="mt-3 pt-3 border-t border-white/5 space-y-1 text-[11px] text-gray-300">
                    {Object.entries(product.specs).slice(0, 2).map(([key, val]) => (
                      <div key={key} className="flex items-center justify-between text-gray-400">
                        <span className="font-mono text-[10px]">{key}:</span>
                        <span className="text-gray-200 font-medium truncate max-w-[170px]">{val}</span>
                      </div>
                    ))}
                  </div>

                </div>

                {/* Card Footer: Price & Shimmer Action */}
                <div className="mt-6 pt-4 border-t border-white/10">
                  <div className="flex items-baseline justify-between mb-3">
                    <div>
                      <div className="text-xl font-display font-extrabold text-white">
                        {formatPrice(currentPrice)}
                      </div>
                      {product.originalPrice > currentPrice && (
                        <div className="text-[11px] text-gray-500 line-through">
                          {formatPrice(product.originalPrice)}
                        </div>
                      )}
                    </div>
                    <div className="text-right font-mono">
                      <div className="text-[10px] text-[#9BB8E1]">0% NO-COST EMI</div>
                      <div className="text-xs font-bold text-gray-300">
                        {formatPrice(currentEmi)}/mo
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => handleCardAdd(product)}
                      className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-[#9BB8E1] to-[#2C4E73] hover:brightness-110 text-white font-extrabold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer active:scale-95 shadow-md shadow-[#9BB8E1]/15 uppercase font-mono tracking-wider"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>Add to Bag</span>
                    </button>

                    <a
                      href={`https://wa.me/919691011335?text=${encodeURIComponent(`Hello New Radhaswami Mobile Gallery! I want to order ${product.name} (${chosenStorage ? chosenStorage.size + ', ' : ''}${chosenColor}) for ${formatPrice(currentPrice)}. Please confirm dispatch slot.`)}`}
                      target="_blank"
                      rel="noreferrer"
                      className="w-full py-2.5 px-2 rounded-xl bg-[#142018] hover:bg-[#1A2B20] border border-emerald-500/30 text-emerald-400 font-semibold text-xs flex items-center justify-center gap-1.5 transition-all text-center cursor-pointer font-mono uppercase"
                    >
                      <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                      <span>WhatsApp</span>
                    </a>
                  </div>
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
