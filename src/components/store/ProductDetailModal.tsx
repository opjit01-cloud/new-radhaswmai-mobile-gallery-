import React, { useState, useEffect } from 'react';
import { Product } from '../../data/products';
import { 
  X, 
  ShoppingBag, 
  Check, 
  Sparkles, 
  Award, 
  ChevronLeft, 
  ChevronRight, 
  ShieldCheck, 
  Truck, 
  CreditCard,
  MessageCircle,
  Share2,
  Bell
} from 'lucide-react';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, color: string, storage?: string, price?: number) => void;
  onBuyNow?: (product: Product, color: string, storage?: string, price?: number) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onAddToCart,
  onBuyNow
}) => {
  if (!product) return null;

  // Multi-image gallery state
  const galleryImages = (product.images && product.images.length > 0)
    ? product.images
    : [product.image];

  const [activeImageIdx, setActiveImageIdx] = useState<number>(0);
  const [selectedColor, setSelectedColor] = useState<string>(product.colors[0]?.name || 'Standard');
  const [selectedStorage, setSelectedStorage] = useState<string>(product.storageVariants?.[0]?.size || '');
  const [added, setAdded] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);

  // Reset image index when product changes
  useEffect(() => {
    setActiveImageIdx(0);
    setSelectedColor(product.colors[0]?.name || 'Standard');
    setSelectedStorage(product.storageVariants?.[0]?.size || '');
  }, [product]);

  // Dynamic price calculation
  let currentPrice = product.price;
  if (product.storageVariants && selectedStorage) {
    const v = product.storageVariants.find(s => s.size === selectedStorage);
    if (v) currentPrice = v.price;
  }
  const emiMonthly = Math.round(currentPrice / 24);

  // Navigation handlers
  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveImageIdx(prev => (prev === 0 ? galleryImages.length - 1 : prev - 1));
  };

  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveImageIdx(prev => (prev === galleryImages.length - 1 ? 0 : prev + 1));
  };

  // Touch swipe support for mobile phone screen
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart === null) return;
    const touchEnd = e.changedTouches[0].clientX;
    const diff = touchStart - touchEnd;

    if (diff > 45) {
      // Swiped left -> Next
      setActiveImageIdx(prev => (prev === galleryImages.length - 1 ? 0 : prev + 1));
    } else if (diff < -45) {
      // Swiped right -> Prev
      setActiveImageIdx(prev => (prev === 0 ? galleryImages.length - 1 : prev - 1));
    }
    setTouchStart(null);
  };

  const handleAdd = () => {
    onAddToCart(product, selectedColor, selectedStorage, currentPrice);
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
    }, 1800);
  };

  const handleWhatsAppOrder = () => {
    const phone = '919691011335';
    const message = `*NEW RADHASWAMI MOBILE GALLERY — EXCLUSIVE ORDER*\n\n` +
      `*Product:* ${product.name}\n` +
      `*Finish:* ${selectedColor}\n` +
      (selectedStorage ? `*Storage:* ${selectedStorage}\n` : '') +
      `*Price:* ₹${currentPrice.toLocaleString('en-IN')}\n\n` +
      `Hello New Radhaswami Concierge, I would like to place an immediate order and pay via *WhatsApp Pay*. Please share the payment request and delivery confirmation for Pithampur.`;

    const encoded = encodeURIComponent(message);
    window.open(`https://api.whatsapp.com/send?phone=${phone}&text=${encoded}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/65 backdrop-blur-md animate-fade-in font-sans">
      <div className="relative w-full max-w-3xl bg-white rounded-3xl p-5 sm:p-8 shadow-2xl text-[#0A0B0E] border border-black/10 max-h-[92vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 sm:top-6 sm:right-6 p-2 rounded-full bg-[#F3F4F6] hover:bg-[#EAEBED] text-[#6B7280] hover:text-[#0A0B0E] transition-colors cursor-pointer border border-black/5 z-20"
        >
          <X size={18} />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 items-start">
          
          {/* =====================================================================
              1. INTERACTIVE MULTI-IMAGE SLIDER & THUMBNAIL GALLERY
          ===================================================================== */}
          <div className="flex flex-col gap-3">
            
            {/* Main Slide Viewport */}
            <div 
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
              className="relative aspect-square w-full rounded-2xl bg-gradient-to-b from-[#F7F7F9] to-[#EFEFF3] border border-black/[0.06] overflow-hidden flex items-center justify-center p-4 select-none group"
            >
              <img
                src={galleryImages[activeImageIdx]}
                alt={`${product.name} angle ${activeImageIdx + 1}`}
                className={`w-full h-full object-contain drop-shadow-[0_12px_24px_rgba(0,0,0,0.1)] transition-all duration-300 ${
                  product.inStock === false ? 'grayscale-[35%] opacity-60' : ''
                }`}
              />

              {/* Prev / Next Chevrons (shown on hover & mobile) */}
              {galleryImages.length > 1 && (
                <>
                  <button
                    onClick={handlePrevImage}
                    className="absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 hover:bg-white shadow-md border border-black/10 flex items-center justify-center text-[#0A0B0E] transition-all cursor-pointer z-10"
                    title="Previous angle"
                  >
                    <ChevronLeft size={18} />
                  </button>

                  <button
                    onClick={handleNextImage}
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 hover:bg-white shadow-md border border-black/10 flex items-center justify-center text-[#0A0B0E] transition-all cursor-pointer z-10"
                    title="Next angle"
                  >
                    <ChevronRight size={18} />
                  </button>
                </>
              )}

              {/* Dot Slide Indicators & Counter */}
              {galleryImages.length > 1 && (
                <div className="absolute bottom-3 inset-x-0 flex items-center justify-center gap-1.5 z-10">
                  {galleryImages.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIdx(idx)}
                      className={`h-1.5 rounded-full transition-all cursor-pointer ${
                        activeImageIdx === idx 
                          ? 'w-6 bg-[#0A0B0E]' 
                          : 'w-1.5 bg-black/20 hover:bg-black/40'
                      }`}
                    />
                  ))}
                  <span className="ml-2 px-2 py-0.5 rounded-full bg-black/70 text-white text-[9px] font-bold">
                    {activeImageIdx + 1} / {galleryImages.length}
                  </span>
                </div>
              )}

              {/* Stock Status Badges */}
              <div className="absolute top-3 left-3 flex flex-wrap items-center gap-1.5">
                <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/95 backdrop-blur-md border border-black/10 text-[#059669] text-[10px] font-bold shadow-2xs">
                  <ShieldCheck size={12} />
                  <span>100% Sealed Stock</span>
                </div>
                {product.inStock === false && (
                  <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-neutral-950/95 backdrop-blur-md border border-neutral-700 text-rose-300 text-[10px] font-extrabold shadow-2xs">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                    <span>Sold Out</span>
                  </div>
                )}
              </div>
            </div>

            {/* Thumbnail Tray */}
            {galleryImages.length > 1 && (
              <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                {galleryImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIdx(idx)}
                    className={`relative w-14 h-14 rounded-xl bg-[#F7F7F9] border overflow-hidden p-1 transition-all shrink-0 cursor-pointer ${
                      activeImageIdx === idx 
                        ? 'border-[#0A0B0E] ring-2 ring-[#0A0B0E]/20 shadow-xs scale-105' 
                        : 'border-black/10 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-contain" />
                  </button>
                ))}
              </div>
            )}

          </div>

          {/* =====================================================================
              2. PRODUCT SPECS & DIRECT ACTIONS
          ===================================================================== */}
          <div className="flex flex-col space-y-4">
            
            <div>
              <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-neutral-800 font-bold mb-1">
                <Award size={13} className="text-black" />
                <span>{product.brand} Official Authorized Partner</span>
              </div>

              <h2 className="text-xl sm:text-2xl font-black text-[#0A0B0E] tracking-tight leading-tight">
                {product.name}
              </h2>
            </div>

            {/* Price & Savings */}
            <div className="flex items-baseline gap-3">
              <span className="text-2xl sm:text-3xl font-black text-[#0A0B0E]">
                ₹{currentPrice.toLocaleString('en-IN')}
              </span>
              {product.originalPrice > currentPrice && (
                <span className="text-sm text-[#9CA3AF] line-through">
                  ₹{product.originalPrice.toLocaleString('en-IN')}
                </span>
              )}
              {product.originalPrice > currentPrice && (
                <span className="text-xs font-bold text-[#059669] bg-[#ECFDF5] px-2.5 py-0.5 rounded-full border border-[#A7F3D0]">
                  Save ₹{(product.originalPrice - currentPrice).toLocaleString('en-IN')}
                </span>
              )}
            </div>

            {/* 0% EMI Banner */}
            <div className="p-3 rounded-2xl bg-neutral-100 border border-neutral-200 text-xs text-neutral-800 flex items-center gap-2.5">
              <CreditCard size={16} className="text-black shrink-0" />
              <span>0% EMI: from <strong>₹{emiMonthly.toLocaleString('en-IN')}/mo</strong> with instant bank approval</span>
            </div>

            {/* Color Finish Selection */}
            {product.colors && product.colors.length > 0 && (
              <div>
                <div className="text-xs text-[#525866] font-semibold mb-2">
                  Selected Finish: <strong className="text-[#0A0B0E]">{selectedColor}</strong>
                </div>
                <div className="flex items-center gap-2.5">
                  {product.colors.map(c => (
                    <button
                      key={c.name}
                      onClick={() => setSelectedColor(c.name)}
                      className={`w-7 h-7 rounded-full border-2 transition-all cursor-pointer relative shadow-xs ${
                        selectedColor === c.name 
                          ? 'border-[#0A0B0E] scale-110 ring-2 ring-black/20' 
                          : 'border-transparent opacity-70 hover:opacity-100'
                      }`}
                      style={{ backgroundColor: c.hex }}
                      title={c.name}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Storage Variants */}
            {product.storageVariants && product.storageVariants.length > 0 && (
              <div>
                <div className="text-xs text-[#525866] font-semibold mb-2">
                  Storage Capacity:
                </div>
                <div className="flex items-center gap-2">
                  {product.storageVariants.map(s => (
                    <button
                      key={s.size}
                      onClick={() => setSelectedStorage(s.size)}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        selectedStorage === s.size
                          ? 'bg-[#0A0B0E] text-white shadow-xs'
                          : 'bg-[#F3F4F6] text-[#4B5563] hover:text-[#0A0B0E] border border-black/[0.06]'
                      }`}
                    >
                      {s.size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Key Specifications Grid */}
            {product.specs && (
              <div className="border-t border-black/[0.06] pt-3">
                <div className="text-xs font-bold text-[#0A0B0E] mb-2">Technical Highlights:</div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {Object.entries(product.specs).slice(0, 4).map(([key, val]) => (
                    <div key={key} className="p-2 rounded-xl bg-[#F8F9FA] border border-black/[0.04]">
                      <span className="text-[10px] text-[#9CA3AF] block">{key}</span>
                      <span className="font-semibold text-[#0A0B0E] truncate block">{val}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* WhatsApp Pay & Bag Action Buttons */}
            <div className="space-y-2.5 pt-2">
              {product.inStock === false ? (
                <div className="space-y-3">
                  <div className="p-3.5 rounded-2xl bg-neutral-100 border border-neutral-200 text-center">
                    <span className="text-xs font-black text-neutral-800 uppercase tracking-wider block mb-1">
                      Currently Unavailable
                    </span>
                    <p className="text-xs text-neutral-600 leading-relaxed">
                      This unit is presently sold out across our regional showrooms. Reserve early priority for our next incoming shipment.
                    </p>
                  </div>
                  
                  <button
                    onClick={() => {
                      const phone = '919691011335';
                      const msg = encodeURIComponent(`Hi New Radhaswami Mobile, please notify me when ${product.name} (${selectedStorage || ''} ${selectedColor}) is restocked.`);
                      window.open(`https://wa.me/${phone}?text=${msg}`, '_blank');
                    }}
                    className="w-full py-3.5 rounded-2xl bg-neutral-950 hover:bg-neutral-800 text-white font-extrabold text-sm shadow-md active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Bell size={18} className="text-neutral-300" />
                    <span>Notify When Restocked via WhatsApp</span>
                  </button>

                  <button
                    disabled
                    className="w-full py-3 rounded-xl bg-neutral-100 text-neutral-400 font-bold text-xs border border-neutral-200 cursor-not-allowed flex items-center justify-center gap-1.5"
                  >
                    <ShoppingBag size={15} />
                    <span>Sold Out — In-Store & Online</span>
                  </button>
                </div>
              ) : (
                <>
                  {/* Primary: Exclusive WhatsApp Pay Direct Checkout */}
                  <button
                    onClick={handleWhatsAppOrder}
                    className="w-full py-3.5 rounded-2xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-extrabold text-sm shadow-[0_4px_16px_rgba(37,211,102,0.3)] active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <MessageCircle size={18} />
                    <span>Order via WhatsApp Pay</span>
                  </button>

                  <div className="grid grid-cols-2 gap-2">
                    {/* Secondary: Add to Shopping Bag */}
                    <button
                      onClick={handleAdd}
                      className={`py-3 rounded-xl border text-xs font-bold transition-all active:scale-[0.98] cursor-pointer flex items-center justify-center gap-1.5 ${
                        added
                          ? 'bg-[#10B981] text-white border-[#059669]'
                          : 'bg-[#0A0B0E] hover:bg-[#232731] text-white border-transparent shadow-xs'
                      }`}
                    >
                      {added ? (
                        <>
                          <Check size={16} />
                          <span>Added to Bag!</span>
                        </>
                      ) : (
                        <>
                          <ShoppingBag size={16} />
                          <span>Add to Bag</span>
                        </>
                      )}
                    </button>

                    {/* Instant White Glove Delivery Inquiry */}
                    <button
                      onClick={() => {
                        const phone = '919691011335';
                        const msg = encodeURIComponent(`Hi, can you deliver ${product.name} today in Pithampur?`);
                        window.open(`https://api.whatsapp.com/send?phone=${phone}&text=${msg}`, '_blank');
                      }}
                      className="py-3 rounded-xl bg-[#F4F5F7] hover:bg-[#EAEBED] text-[#0A0B0E] font-bold text-xs border border-black/[0.06] transition-all active:scale-[0.98] cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <Truck size={15} />
                      <span>Same-Day Inquiry</span>
                    </button>
                  </div>
                </>
              )}
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
