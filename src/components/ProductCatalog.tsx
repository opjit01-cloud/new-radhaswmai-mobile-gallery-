import React, { useState, useMemo, useEffect } from 'react';
import { Product, PRODUCTS, StorageVariant } from '../data/products';
import { ShoppingBag, Star, MessageCircle, SlidersHorizontal, Check, Zap, Eye, Filter, ArrowUpDown, ShieldCheck } from 'lucide-react';
import { QuickViewModal } from './QuickViewModal';

interface ProductCatalogProps {
  onAddToCart: (product: Product, selectedColor: string, storage?: string) => void;
  searchTerm: string;
  activeCategory: string;
  onSelectCategory: (cat: string) => void;
}

export const ProductCatalog: React.FC<ProductCatalogProps> = ({
  onAddToCart,
  searchTerm,
  activeCategory,
  onSelectCategory,
}) => {
  const [catalogProducts, setCatalogProducts] = useState<Product[]>(PRODUCTS);
  const [selectedBrand, setSelectedBrand] = useState<string>('all');
  const [maxPrice, setMaxPrice] = useState<number>(200000);
  const [sortBy, setSortBy] = useState<'featured' | 'price-low' | 'price-high' | 'rating'>('featured');
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);

  // Per-card state tracking
  const [cardColors, setCardColors] = useState<{ [productId: string]: string }>({});
  const [cardStorages, setCardStorages] = useState<{ [productId: string]: StorageVariant }>({});
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  // Fetch from backend API on mount
  useEffect(() => {
    fetch('/api/products')
      .then((res) => {
        if (!res.ok) throw new Error('API fetch failed');
        return res.json();
      })
      .then((data) => {
        if (data.products && data.products.length > 0) {
          setCatalogProducts(data.products);
        }
      })
      .catch(() => {
        // Fallback silently to local PRODUCTS data
      });
  }, []);

  const brands = useMemo(() => {
    const set = new Set(catalogProducts.map((p) => p.brand));
    return ['all', ...Array.from(set)];
  }, [catalogProducts]);

  const filteredProducts = useMemo(() => {
    return catalogProducts
      .filter((p) => {
        const matchCat = activeCategory === 'all' || p.category === activeCategory;
        const matchBrand = selectedBrand === 'all' || p.brand === selectedBrand;
        const matchPrice = p.price <= maxPrice;
        const matchStock = !inStockOnly || p.inStock;
        const matchSearch =
          !searchTerm ||
          p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.description.toLowerCase().includes(searchTerm.toLowerCase());
        return matchCat && matchBrand && matchPrice && matchStock && matchSearch;
      })
      .sort((a, b) => {
        if (sortBy === 'price-low') return a.price - b.price;
        if (sortBy === 'price-high') return b.price - a.price;
        if (sortBy === 'rating') return b.rating - a.rating;
        return 0;
      });
  }, [catalogProducts, activeCategory, selectedBrand, maxPrice, inStockOnly, searchTerm, sortBy]);

  const handleColorChange = (productId: string, colorName: string) => {
    setCardColors((prev) => ({ ...prev, [productId]: colorName }));
  };

  const handleStorageChange = (productId: string, variant: StorageVariant) => {
    setCardStorages((prev) => ({ ...prev, [productId]: variant }));
  };

  const handleCardAdd = (product: Product) => {
    const chosenColor = cardColors[product.id] || product.colors[0]?.name || 'Standard';
    const chosenStorage = cardStorages[product.id];
    
    // Create product instance with updated variant price if selected
    const productToAdd: Product = {
      ...product,
      price: chosenStorage ? chosenStorage.price : product.price
    };

    onAddToCart(productToAdd, chosenColor, chosenStorage?.size);
  };

  const formatPrice = (val: number) => {
    return `₹${val.toLocaleString('en-IN')}`;
  };

  return (
    <section id="catalog" className="py-16 px-4 md:px-8 border-b border-white/5 max-w-7xl mx-auto">
      
      {/* Quick View Modal */}
      <QuickViewModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        onAddToCart={onAddToCart}
      />

      {/* Catalog Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-white uppercase tracking-wider mb-2">
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>CERTIFIED DIRECT INVENTORY ({filteredProducts.length} AVAILABLE)</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-white tracking-tight">
            Flagship Hardware Collection.
          </h2>
        </div>

        {/* Sorting Dropdown */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-[#0F1420] border border-white/10 rounded-xl px-3 py-2 text-xs text-gray-300">
            <ArrowUpDown className="w-3.5 h-3.5 text-gray-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-transparent text-white outline-none cursor-pointer text-xs"
            >
              <option value="featured" className="bg-[#0F1420]">Sort: Featured</option>
              <option value="price-low" className="bg-[#0F1420]">Price: Low to High</option>
              <option value="price-high" className="bg-[#0F1420]">Price: High to Low</option>
              <option value="rating" className="bg-[#0F1420]">Rating: 4.8★ &amp; Above</option>
            </select>
          </div>
        </div>
      </div>

      {/* Filter Toolbar Bar */}
      <div className="my-6 p-4 rounded-2xl bg-[#0D121B] border border-white/10 flex flex-wrap items-center justify-between gap-4">
        
        {/* Brand Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-2xl scrollbar-none">
          <span className="text-xs font-mono text-neutral-400 uppercase mr-1">Brand:</span>
          {brands.map((b) => (
            <button
              key={b}
              onClick={() => setSelectedBrand(b)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                selectedBrand === b
                  ? 'bg-white text-black font-bold'
                  : 'bg-white/5 text-neutral-300 hover:text-white border border-white/5'
              }`}
            >
              {b === 'all' ? 'All Brands' : b}
            </button>
          ))}
        </div>

        {/* Price Slider & In-stock Toggle */}
        <div className="flex items-center gap-5 ml-auto text-xs">
          <div className="flex items-center gap-2 text-gray-300">
            <span className="font-mono text-neutral-400">Max Price:</span>
            <span className="font-mono font-bold text-white">₹{maxPrice.toLocaleString('en-IN')}</span>
            <input
              type="range"
              min="5000"
              max="200000"
              step="5000"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="accent-white w-24 sm:w-32 h-1.5 bg-white/10 rounded-lg cursor-pointer"
            />
          </div>

          <label className="flex items-center gap-2 cursor-pointer text-neutral-300 hover:text-white">
            <input
              type="checkbox"
              checked={inStockOnly}
              onChange={(e) => setInStockOnly(e.target.checked)}
              className="accent-white rounded w-3.5 h-3.5 cursor-pointer"
            />
            <span>In Stock Only</span>
          </label>
        </div>

      </div>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div className="py-20 text-center rounded-3xl bg-[#0D121B] border border-white/5 p-8">
          <p className="text-neutral-400 text-sm">No products found matching your current filter criteria.</p>
          <button
            onClick={() => {
              setSelectedBrand('all');
              setMaxPrice(200000);
              onSelectCategory('all');
            }}
            className="mt-4 px-5 py-2 rounded-xl bg-white hover:bg-neutral-200 text-black text-xs font-bold"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => {
            const chosenColor = cardColors[product.id] || product.colors[0]?.name || 'Standard';
            const chosenStorage = cardStorages[product.id];
            const currentPrice = chosenStorage ? chosenStorage.price : product.price;
            const currentEmi = Math.round(currentPrice / 24);

            return (
              <div
                key={product.id}
                className="group relative rounded-3xl bg-[#0F1420] border border-white/10 hover:border-white/30 p-5 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 shadow-xl hover:shadow-2xl"
              >
                <div>
                  
                  {/* Card Header: Brand, Badge & Quick View */}
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] font-mono text-neutral-400 uppercase">
                      {product.brand}
                    </span>
                    <div className="flex items-center gap-2">
                      {product.badge && (
                        <span className="px-2.5 py-0.5 rounded-full bg-white/10 border border-white/20 text-white text-[10px] font-mono font-bold">
                          {product.badge}
                        </span>
                      )}
                      <button
                        onClick={() => setQuickViewProduct(product)}
                        className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-neutral-400 hover:text-white transition-colors cursor-pointer"
                        title="Quick View Specifications"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* High-Resolution Device Photography */}
                  <div 
                    onClick={() => setQuickViewProduct(product)}
                    className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-[#090C12] border border-white/5 mb-4 p-3 flex items-center justify-center cursor-pointer"
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover rounded-xl transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                      <span className="text-[11px] text-white font-medium flex items-center gap-1">
                        <Eye className="w-3 h-3 text-white" />
                        Click to view full specs &amp; in-box items
                      </span>
                    </div>
                  </div>

                  {/* Title & Reviews */}
                  <h3 
                    onClick={() => setQuickViewProduct(product)}
                    className="text-base sm:text-lg font-display font-bold text-white hover:text-neutral-200 transition-colors cursor-pointer leading-snug"
                  >
                    {product.name}
                  </h3>

                  <div className="flex items-center gap-2 my-2 text-xs">
                    <div className="flex items-center gap-1 text-white">
                      <Star className="w-3.5 h-3.5 fill-white" />
                      <span className="font-bold">{product.rating}</span>
                    </div>
                    <span className="text-neutral-500 text-[11px]">({product.reviewsCount} reviews)</span>
                    <span className="text-neutral-600">•</span>
                    <span className="text-emerald-400 text-[11px] font-mono">100% Sealed</span>
                  </div>

                  {/* Color Swatches */}
                  <div className="my-3 flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      {product.colors.map((c) => (
                        <button
                          key={c.name}
                          onClick={() => handleColorChange(product.id, c.name)}
                          className={`p-0.5 rounded-full transition-all cursor-pointer ${
                            chosenColor === c.name
                              ? 'ring-2 ring-white ring-offset-2 ring-offset-[#0F1420]'
                              : 'opacity-70 hover:opacity-100'
                          }`}
                          title={c.name}
                        >
                          <span
                            className="block w-4 h-4 rounded-full border border-white/20"
                            style={{ backgroundColor: c.hex }}
                          />
                        </button>
                      ))}
                    </div>
                    <span className="text-[10px] font-mono text-neutral-400 truncate max-w-[120px]">
                      {chosenColor}
                    </span>
                  </div>

                  {/* Storage Variants (Interactive) */}
                  {product.storageVariants && product.storageVariants.length > 0 && (
                    <div className="my-3 grid grid-cols-3 gap-1.5">
                      {product.storageVariants.map((sv) => {
                        const isSelected = (chosenStorage?.size || product.storageVariants![0].size) === sv.size;
                        return (
                          <button
                            key={sv.size}
                            onClick={() => handleStorageChange(product.id, sv)}
                            className={`py-1 px-1.5 text-center rounded-lg border text-[11px] font-mono transition-all cursor-pointer ${
                              isSelected
                                ? 'border-white bg-white/10 text-white font-bold'
                                : 'border-white/10 bg-[#0A0D14] text-neutral-400 hover:text-white'
                            }`}
                          >
                            {sv.size}
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {/* Key Feature Specs Pills */}
                  <div className="mt-3 pt-3 border-t border-white/5 space-y-1 text-[11px] text-neutral-300">
                    {Object.entries(product.specs).slice(0, 2).map(([key, val]) => (
                      <div key={key} className="flex items-center justify-between text-neutral-400">
                        <span className="font-mono text-[10px]">{key}:</span>
                        <span className="text-neutral-200 font-medium truncate max-w-[170px]">{val}</span>
                      </div>
                    ))}
                  </div>

                </div>

                {/* Card Footer: Pricing & Action Buttons */}
                <div className="mt-5 pt-4 border-t border-white/10">
                  <div className="flex items-baseline justify-between mb-3">
                    <div>
                      <div className="text-xl font-display font-extrabold text-white">
                        {formatPrice(currentPrice)}
                      </div>
                      {product.originalPrice > currentPrice && (
                        <div className="text-[11px] text-neutral-500 line-through">
                          {formatPrice(product.originalPrice)}
                        </div>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="text-[10px] font-mono text-emerald-400">0% No-Cost EMI</div>
                      <div className="text-xs font-bold text-neutral-300">
                        {formatPrice(currentEmi)}/mo
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => handleCardAdd(product)}
                      className="w-full py-2.5 px-3 rounded-xl bg-white hover:bg-neutral-200 text-black font-extrabold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer active:scale-95 shadow-lg"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>Add to Bag</span>
                    </button>

                    <a
                      href={`https://wa.me/919691011335?text=${encodeURIComponent(`Hello New Radhaswami Mobile Gallery! I want to order ${product.name} (${chosenStorage ? chosenStorage.size + ', ' : ''}${chosenColor}) for ${formatPrice(currentPrice)}. Please confirm dispatch slot.`)}`}
                      target="_blank"
                      rel="noreferrer"
                      className="w-full py-2.5 px-2 rounded-xl bg-[#142018] hover:bg-[#1A2B20] border border-emerald-500/30 text-emerald-400 font-semibold text-xs flex items-center justify-center gap-1.5 transition-all text-center cursor-pointer"
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
      )}

    </section>
  );
};
