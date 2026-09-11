import React, { useState } from 'react';
import { X, Star, ShieldCheck, Check, Truck, MessageCircle, ShoppingBag, ArrowRight } from 'lucide-react';
import { Product } from '../data/products';

interface QuickViewModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, selectedColor: string, storage?: string) => void;
}

export const QuickViewModal: React.FC<QuickViewModalProps> = ({
  product,
  onClose,
  onAddToCart
}) => {
  if (!product) return null;

  const [selectedColor, setSelectedColor] = useState(product.colors[0]?.name || 'Standard');
  const [selectedStorage, setSelectedStorage] = useState(
    product.storageVariants && product.storageVariants.length > 0
      ? product.storageVariants[0]
      : null
  );

  const currentPrice = selectedStorage ? selectedStorage.price : product.price;

  const handleAdd = () => {
    onAddToCart(product, selectedColor, selectedStorage?.size);
    onClose();
  };

  const handleWhatsAppBuy = () => {
    const text = encodeURIComponent(
      `Hello New Radhaswami Mobile Gallery! I want to order ${product.name} (${selectedStorage ? selectedStorage.size + ', ' : ''}${selectedColor}) priced at ₹${currentPrice.toLocaleString('en-IN')}. Please share payment & delivery confirmation.`
    );
    window.open(`https://wa.me/919691011335?text=${text}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div 
        className="relative w-full max-w-3xl rounded-3xl bg-[#0D121B] border border-white/15 p-6 sm:p-8 shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          
          {/* Left: Device Image & Color Preview */}
          <div>
            <div className="relative aspect-square rounded-2xl overflow-hidden border border-white/10 bg-[#090C12] p-4 flex items-center justify-center">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover rounded-xl"
              />
              {product.badge && (
                <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-white text-black font-extrabold text-[10px] uppercase font-mono tracking-wider shadow-md">
                  {product.badge}
                </span>
              )}
            </div>

            {/* In-the-box summary */}
            <div className="mt-4 p-3.5 rounded-xl bg-[#090C12] border border-white/5 text-xs text-neutral-400">
              <div className="font-semibold text-white mb-1">In The Box (100% Sealed):</div>
              <p className="text-[11px] leading-relaxed">
                Handset, Braided USB-C Fast Charging Cable, Official Documentation, GST Tax Invoice, SIM Eject Tool.
              </p>
            </div>
          </div>

          {/* Right: Specs & Purchasing Options */}
          <div>
            <div className="text-xs font-mono text-white uppercase tracking-wider mb-1">
              {product.brand} // {product.category.toUpperCase()}
            </div>
            
            <h3 className="text-2xl font-display font-extrabold text-white">
              {product.name}
            </h3>

            {/* Ratings & Warranty */}
            <div className="flex items-center gap-3 my-2 text-xs">
              <div className="flex items-center gap-1 text-white">
                <Star className="w-3.5 h-3.5 fill-white" />
                <span className="font-bold">{product.rating}</span>
                <span className="text-neutral-400">({product.reviewsCount} verified)</span>
              </div>
              <span className="text-neutral-600">•</span>
              <span className="text-emerald-400 font-mono text-[11px]">Official 1-Year Warranty</span>
            </div>

            <p className="text-xs text-neutral-300 my-3 leading-relaxed">
              {product.description}
            </p>

            {/* Color Swatches */}
            <div className="my-4">
              <div className="text-xs text-neutral-400 mb-2">
                Color Finish: <strong className="text-white font-semibold">{selectedColor}</strong>
              </div>
              <div className="flex items-center gap-2.5">
                {product.colors.map((c) => (
                  <button
                    key={c.name}
                    onClick={() => setSelectedColor(c.name)}
                    className={`relative p-0.5 rounded-full transition-all cursor-pointer ${
                      selectedColor === c.name
                        ? 'ring-2 ring-white ring-offset-2 ring-offset-[#0D121B]'
                        : 'opacity-70 hover:opacity-100'
                    }`}
                  >
                    <span
                      className="block w-6 h-6 rounded-full border border-white/20 shadow-inner"
                      style={{ backgroundColor: c.hex }}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Storage Variants (if available) */}
            {product.storageVariants && product.storageVariants.length > 0 && (
              <div className="my-4">
                <div className="text-xs text-neutral-400 mb-2">Storage Capacity:</div>
                <div className="grid grid-cols-3 gap-2">
                  {product.storageVariants.map((sv) => (
                    <button
                      key={sv.size}
                      onClick={() => setSelectedStorage(sv)}
                      className={`p-2 rounded-xl border text-center transition-all cursor-pointer ${
                        selectedStorage?.size === sv.size
                          ? 'border-white bg-white/10 text-white font-bold'
                          : 'border-white/10 bg-[#090C12] text-neutral-400 hover:text-white'
                      }`}
                    >
                      <div className="text-xs font-bold">{sv.size}</div>
                      <div className="text-[10px] font-mono text-neutral-400">₹{sv.price.toLocaleString('en-IN')}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Specs Breakdown */}
            <div className="my-4 pt-3 border-t border-white/10 space-y-1.5 text-xs">
              {Object.entries(product.specs).map(([label, val]) => (
                <div key={label} className="flex justify-between text-neutral-300">
                  <span className="text-neutral-400 font-mono text-[11px]">{label}:</span>
                  <span className="font-medium text-white text-right max-w-[200px] truncate">{val}</span>
                </div>
              ))}
            </div>

            {/* Price & Action */}
            <div className="pt-4 border-t border-white/10 flex items-baseline justify-between mb-4">
              <div>
                <span className="text-2xl font-display font-extrabold text-white">
                  ₹{currentPrice.toLocaleString('en-IN')}
                </span>
                {product.originalPrice > currentPrice && (
                  <span className="text-xs text-neutral-500 line-through ml-2">
                    ₹{product.originalPrice.toLocaleString('en-IN')}
                  </span>
                )}
              </div>
              <span className="text-xs font-mono text-emerald-400 font-semibold">
                0% EMI from ₹{Math.round(currentPrice / 24).toLocaleString('en-IN')}/mo
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={handleAdd}
                className="py-3 px-4 rounded-xl bg-white hover:bg-neutral-200 text-black font-extrabold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Add to Bag</span>
              </button>

              <button
                onClick={handleWhatsAppBuy}
                className="py-3 px-4 rounded-xl bg-[#1A261F] hover:bg-[#22332A] border border-emerald-500/40 text-emerald-400 font-semibold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <MessageCircle className="w-4 h-4 text-emerald-400" />
                <span>WhatsApp Buy</span>
              </button>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};
