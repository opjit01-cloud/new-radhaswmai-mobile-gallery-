import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Product } from '../data/products';
import { 
  ShoppingBag, 
  Trash2, 
  MessageCircle, 
  ArrowRight, 
  ShieldCheck, 
  X, 
  CheckCircle2, 
  Truck, 
  Plus, 
  Minus,
  Sparkles,
  Lock
} from 'lucide-react';

export interface CartItem {
  product: Product;
  selectedColor: string;
  selectedStorage?: string;
  quantity: number;
}

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (productId: string, color: string, qty: number) => void;
  onRemoveItem: (productId: string, color: string) => void;
  onClearCart: () => void;
  onOrderPlaced?: (orderId: string) => void;
  currentUser?: { name: string; phone?: string; email?: string; address?: string } | null;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onOrderPlaced,
  currentUser
}) => {
  const [couponCode, setCouponCode] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponFeedback, setCouponFeedback] = useState<string | null>(null);
  const [dbCoupons, setDbCoupons] = useState<any[]>(() => {
    try {
      const saved = localStorage.getItem('nr_coupons_db');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {}
    return [
      { code: 'RADHA10', discountType: 'percentage', value: 10, minCart: 10000, description: '10% Off on flagship mobile orders', active: true },
      { code: 'ROYAL10', discountType: 'percentage', value: 10, minCart: 15000, description: 'VIP Showroom Exclusive Concession', active: true },
      { code: 'PREMIUM500', discountType: 'flat', value: 500, minCart: 5000, description: 'Flat ₹500 instant discount', active: true },
      { code: 'WELCOME1000', discountType: 'flat', value: 1000, minCart: 25000, description: '₹1,000 Off on orders above ₹25K', active: true }
    ];
  });

  // Fetch live coupons from database whenever cart drawer opens & listen for real-time changes
  React.useEffect(() => {
    const refreshCoupons = () => {
      try {
        const saved = localStorage.getItem('nr_coupons_db');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) setDbCoupons(parsed);
        }
      } catch {}

      fetch('/api/coupons')
        .then(res => res.json())
        .then(data => {
          if (data.success && Array.isArray(data.coupons)) {
            setDbCoupons(data.coupons);
            try {
              localStorage.setItem('nr_coupons_db', JSON.stringify(data.coupons));
            } catch {}
          }
        })
        .catch(() => {});
    };

    if (isOpen) {
      refreshCoupons();
    }

    window.addEventListener('nr_coupons_updated', refreshCoupons);
    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'nr_coupons_db' || e.key === 'nr_coupons_last_updated') {
        refreshCoupons();
      }
    };
    window.addEventListener('storage', handleStorage);

    return () => {
      window.removeEventListener('nr_coupons_updated', refreshCoupons);
      window.removeEventListener('storage', handleStorage);
    };
  }, [isOpen]);

  // Checkout modal state
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [customerName, setCustomerName] = useState(currentUser?.name || '');
  const [customerPhone, setCustomerPhone] = useState(currentUser?.phone || '');
  const [customerAddress, setCustomerAddress] = useState(currentUser?.address || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState<any>(null);

  // Sync with current user changes
  React.useEffect(() => {
    if (currentUser) {
      if (currentUser.name) setCustomerName(currentUser.name);
      if (currentUser.phone) setCustomerPhone(currentUser.phone);
      if (currentUser.address) setCustomerAddress(currentUser.address);
    }
  }, [currentUser]);

  const subtotal = items.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

  // Re-verify currently applied coupon if coupon list or cart changes (revoke if deleted or inactive)
  React.useEffect(() => {
    if (couponApplied && couponCode) {
      const code = couponCode.trim().toUpperCase();
      const found = dbCoupons.find(c => (c.code || '').toUpperCase() === code);
      if (!found) {
        setDiscountAmount(0);
        setCouponApplied(false);
        setCouponFeedback(`Voucher "${code}" was deleted or expired.`);
      } else if (!found.active) {
        setDiscountAmount(0);
        setCouponApplied(false);
        setCouponFeedback(`Voucher "${code}" has been deactivated.`);
      } else if (found.minCart && subtotal < found.minCart) {
        setDiscountAmount(0);
        setCouponApplied(false);
        setCouponFeedback(`Minimum cart total of ₹${found.minCart.toLocaleString('en-IN')} required for ${code}.`);
      } else {
        let disc = 0;
        if (found.discountType === 'percentage') {
          disc = Math.round(subtotal * (Number(found.value) / 100));
        } else {
          disc = Math.min(subtotal, Number(found.value));
        }
        setDiscountAmount(disc);
      }
    }
  }, [dbCoupons, subtotal, couponApplied, couponCode]);

  const finalTotal = Math.max(0, subtotal - discountAmount);

  // Free shipping threshold ₹20,000
  const freeShippingThreshold = 20000;
  const progressToFreeShipping = Math.min(100, (subtotal / freeShippingThreshold) * 100);
  const remainingForFree = Math.max(0, freeShippingThreshold - subtotal);

  const handleApplyCoupon = async () => {
    const code = couponCode.trim().toUpperCase();
    if (!code) return;

    let latestCoupons = dbCoupons;
    try {
      const saved = localStorage.getItem('nr_coupons_db');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) latestCoupons = parsed;
      }
    } catch {}

    try {
      const res = await fetch('/api/coupons');
      const data = await res.json();
      if (data.success && Array.isArray(data.coupons)) {
        latestCoupons = data.coupons;
        setDbCoupons(data.coupons);
        try {
          localStorage.setItem('nr_coupons_db', JSON.stringify(data.coupons));
        } catch {}
      }
    } catch {}

    const found = latestCoupons.find(c => (c.code || '').toUpperCase() === code);

    if (!found) {
      setDiscountAmount(0);
      setCouponApplied(false);
      setCouponFeedback(`Voucher "${code}" is invalid, expired, or was removed.`);
      return;
    }

    if (!found.active) {
      setDiscountAmount(0);
      setCouponApplied(false);
      setCouponFeedback(`Voucher "${code}" is currently deactivated.`);
      return;
    }

    if (found.minCart && subtotal < found.minCart) {
      setDiscountAmount(0);
      setCouponApplied(false);
      setCouponFeedback(`Minimum cart total of ₹${found.minCart.toLocaleString('en-IN')} required for ${code}.`);
      return;
    }

    let disc = 0;
    if (found.discountType === 'percentage') {
      disc = Math.round(subtotal * (Number(found.value) / 100));
    } else {
      disc = Math.min(subtotal, Number(found.value));
    }

    setDiscountAmount(disc);
    setCouponApplied(true);
    setCouponFeedback(`Voucher ${code} applied (-₹${disc.toLocaleString('en-IN')} discount)`);
  };

  const handleCreateOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;

    // Strict Out of Stock check at checkout
    const oosItem = items.find(i => i.product.inStock === false || (i.product.stockCount !== undefined && i.product.stockCount <= 0));
    if (oosItem) {
      alert(`Cannot proceed with checkout: "${oosItem.product.name}" is currently Out of Stock. Please remove it from your shopping bag.`);
      return;
    }
    if (!customerName || !customerPhone) {
      alert('Please fill in your legal name and contact number.');
      return;
    }

    setIsSubmitting(true);

    const payload = {
      customer: {
        name: customerName,
        phone: customerPhone,
        address: customerAddress || 'Doorstep Delivery'
      },
      items: items.map(i => ({
        name: `${i.product.name}${i.selectedStorage ? ' (' + i.selectedStorage + ')' : ''}`,
        color: i.selectedColor,
        qty: i.quantity,
        price: i.product.price
      })),
      paymentMethod: 'WhatsApp Pay / UPI',
      total: finalTotal
    };

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      setIsSubmitting(false);

      if (data.success && data.order) {
        setConfirmedOrder(data.order);
        if (onOrderPlaced) onOrderPlaced(data.order.orderId);
        openWhatsAppPay(data.order.orderId);
      } else {
        fallbackOrderCreation();
      }
    } catch {
      setIsSubmitting(false);
      fallbackOrderCreation();
    }
  };

  const openWhatsAppPay = (orderId: string) => {
    const itemsList = items.map(i => `• ${i.product.name} (${i.selectedColor}${i.selectedStorage ? ', ' + i.selectedStorage : ''}) x${i.quantity} = ₹${(i.product.price * i.quantity).toLocaleString('en-IN')}`).join('\n');
    const msg = `*NEW RADHASWAMI MOBILE GALLERY — ORDER #${orderId}*\n\n` +
      `*Client:* ${customerName}\n` +
      `*Phone:* ${customerPhone}\n` +
      (customerAddress ? `*Delivery Address:* ${customerAddress}\n` : '') +
      `\n*Items:*\n${itemsList}\n\n` +
      `*Total Due:* ₹${finalTotal.toLocaleString('en-IN')}\n` +
      `*Payment Method:* WhatsApp Pay\n\n` +
      `Hello New Radhaswami Concierge, please send me the WhatsApp Pay UPI payment request for Order #${orderId}.`;

    window.open(`https://api.whatsapp.com/send?phone=919691011335&text=${encodeURIComponent(msg)}`, '_blank');
  };

  const fallbackOrderCreation = () => {
    const orderId = 'NRM-' + Math.floor(100000 + Math.random() * 900000);
    const simulated = {
      orderId,
      customer: { name: customerName, phone: customerPhone, address: customerAddress || 'Doorstep Delivery' },
      items: items.map(i => ({
        name: `${i.product.name}${i.selectedStorage ? ' (' + i.selectedStorage + ')' : ''}`,
        color: i.selectedColor,
        qty: i.quantity,
        price: i.product.price
      })),
      total: finalTotal,
      status: 'Confirmed',
      createdAt: new Date().toISOString(),
      dispatchSlot: 'Today within 2 Hours via BlueDart Air Express',
      trackingNumber: 'BD-IN-' + Math.floor(1000000 + Math.random() * 9000000)
    };
    try {
      const savedOrders = localStorage.getItem('nr_orders_db');
      const ordersList = savedOrders ? JSON.parse(savedOrders) : [];
      localStorage.setItem('nr_orders_db', JSON.stringify([simulated, ...ordersList]));
      window.dispatchEvent(new CustomEvent('nr_orders_updated'));
      if (typeof BroadcastChannel !== 'undefined') {
        const bc = new BroadcastChannel('nr_sync_bus');
        bc.postMessage({ type: 'order_created', order: simulated });
        bc.close();
      }
      fetch('/api/admin/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(simulated)
      }).catch(() => {});
    } catch {}
    setConfirmedOrder(simulated);
    if (onOrderPlaced) onOrderPlaced(orderId);
    openWhatsAppPay(orderId);
  };

  const formatPrice = (val: number) => {
    return `₹${val.toLocaleString('en-IN')}`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[120] flex justify-end">
      {/* Backdrop */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm"
      />
      
      {/* Drawer Container (Modern White & Black Luxury Theme) */}
      <motion.div 
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 28, stiffness: 300 }}
        className="relative w-full max-w-md bg-white text-neutral-900 border-l border-neutral-200 h-full flex flex-col justify-between shadow-2xl overflow-hidden z-10 font-sans"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Drawer Header */}
        <div className="p-5 border-b border-neutral-100 flex items-center justify-between bg-neutral-50/80 backdrop-blur-md">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base text-neutral-900 leading-tight">Your Shopping Bag</h3>
              <p className="text-[11px] text-neutral-500 font-mono">
                {items.length} {items.length === 1 ? 'selected handset' : 'selected handsets'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-neutral-200/70 text-neutral-500 hover:text-neutral-900 transition-colors cursor-pointer"
            title="Close Bag"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Shipping Progress Indicator */}
        <div className="px-5 py-3 bg-neutral-50 border-b border-neutral-100">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="text-neutral-600 flex items-center gap-1.5 font-mono text-[11px]">
              <Truck className="w-3.5 h-3.5 text-black" />
              {remainingForFree === 0
                ? 'Unlocked Free BlueDart Air Express Delivery!'
                : `Add ${formatPrice(remainingForFree)} for Free Express Dispatch`}
            </span>
            <span className="text-[10px] font-mono text-black font-bold">
              {Math.round(progressToFreeShipping)}%
            </span>
          </div>
          <div className="w-full h-1.5 bg-neutral-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-black transition-all duration-500 rounded-full"
              style={{ width: `${progressToFreeShipping}%` }}
            />
          </div>
        </div>

        {/* Items List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-3">
          {items.length === 0 ? (
            <div className="py-24 text-center flex flex-col items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-400 mb-4 border border-neutral-200">
                <ShoppingBag className="w-7 h-7" />
              </div>
              <p className="text-base font-bold text-neutral-900">Your bag is empty</p>
              <p className="text-xs text-neutral-500 mt-1 max-w-[220px] leading-relaxed">
                Discover official brand-sealed flagship phones to add to your order.
              </p>
              <button
                onClick={onClose}
                className="mt-5 px-6 py-2.5 rounded-full bg-black text-white text-xs font-bold hover:bg-neutral-800 transition-all cursor-pointer shadow-md"
              >
                Explore Handsets
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={`${item.product.id}-${item.selectedColor}-${item.selectedStorage || ''}`}
                className="p-3.5 rounded-2xl bg-white border border-neutral-200 flex gap-3.5 items-center justify-between shadow-sm hover:border-neutral-300 transition-all"
              >
                <img
                  src={item.product.image}
                  alt={item.product.name}
                  className="w-16 h-16 object-cover rounded-xl bg-neutral-50 border border-neutral-100 shrink-0"
                />

                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold text-neutral-900 truncate leading-tight">
                    {item.product.name}
                  </h4>
                  
                  <div className="flex items-center gap-1.5 mt-1 text-[11px] text-neutral-500 font-mono">
                    <span className="truncate">{item.selectedColor}</span>
                    {item.selectedStorage && (
                      <>
                        <span>•</span>
                        <span className="text-black font-semibold">{item.selectedStorage}</span>
                      </>
                    )}
                  </div>

                  <div className="text-xs font-black text-neutral-900 mt-1">
                    {formatPrice(item.product.price)}
                  </div>
                </div>

                {/* Quantity Stepper & Remove */}
                <div className="flex flex-col items-end gap-2 shrink-0">
                  <button
                    onClick={() => onRemoveItem(item.product.id, item.selectedColor)}
                    className="text-neutral-400 hover:text-red-600 p-1 transition-colors cursor-pointer"
                    title="Remove item"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>

                  <div className="flex items-center gap-1 bg-neutral-100 border border-neutral-200 rounded-lg px-1.5 py-0.5">
                    <button
                      onClick={() => onUpdateQuantity(item.product.id, item.selectedColor, item.quantity - 1)}
                      className="text-neutral-600 hover:text-black p-0.5 cursor-pointer"
                    >
                      <Minus size={11} />
                    </button>
                    <span className="text-xs font-mono font-bold text-neutral-900 px-1.5">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => onUpdateQuantity(item.product.id, item.selectedColor, item.quantity + 1)}
                      className="text-neutral-600 hover:text-black p-0.5 cursor-pointer"
                    >
                      <Plus size={11} />
                    </button>
                  </div>
                </div>

              </div>
            ))
          )}
        </div>

        {/* Drawer Footer / Checkout Bar */}
        {items.length > 0 && (
          <div className="p-5 border-t border-neutral-100 bg-neutral-50/90 backdrop-blur-md space-y-4">
            
            {/* Promo Code Input */}
            <div className="space-y-1.5">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => {
                    setCouponCode(e.target.value);
                    if (couponFeedback) setCouponFeedback(null);
                  }}
                  placeholder="PROMO CODE"
                  disabled={couponApplied}
                  className="flex-1 bg-white border border-neutral-200 rounded-xl px-3 py-2 text-xs text-neutral-900 outline-none uppercase font-mono placeholder:text-neutral-400 focus:border-black"
                />
                <button
                  onClick={handleApplyCoupon}
                  disabled={couponApplied || !couponCode}
                  className="px-4 py-2 rounded-xl bg-black text-white text-xs font-bold hover:bg-neutral-800 disabled:opacity-40 cursor-pointer transition-all"
                >
                  {couponApplied ? 'Applied' : 'Apply'}
                </button>
              </div>
              {couponFeedback && (
                <div className={`text-[11px] font-medium ${couponApplied ? 'text-emerald-600' : 'text-red-500'}`}>
                  {couponFeedback}
                </div>
              )}
            </div>

            {/* Price Calculations */}
            <div className="space-y-1.5 text-xs font-mono">
              <div className="flex justify-between text-neutral-600">
                <span>Subtotal</span>
                <span className="text-neutral-900 font-semibold">{formatPrice(subtotal)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Special Gallery Discount</span>
                  <span>-{formatPrice(discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between text-neutral-600">
                <span>BlueDart Express Shipping</span>
                <span className="text-emerald-600 font-bold">FREE</span>
              </div>
              <div className="flex justify-between text-base font-black text-neutral-900 pt-2 border-t border-neutral-200">
                <span>Total Payable</span>
                <span>{formatPrice(finalTotal)}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div>
              <button
                onClick={() => setIsCheckoutOpen(true)}
                className="w-full py-4 px-4 rounded-2xl bg-black hover:bg-neutral-800 text-white font-extrabold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg active:scale-[0.99]"
              >
                <Lock size={14} />
                <span>Proceed to Express Checkout</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </button>
            </div>

          </div>
        )}

      </motion.div>

      {/* Express Checkout Modal (White & Black Luxury Styling) */}
      {isCheckoutOpen && (
        <div className="fixed inset-0 z-[130] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
          <div className="relative w-full max-w-lg rounded-3xl bg-white border border-neutral-200 p-6 sm:p-8 shadow-2xl text-neutral-900 overflow-hidden font-sans">
            
            <button
              onClick={() => {
                setIsCheckoutOpen(false);
                setConfirmedOrder(null);
              }}
              className="absolute top-5 right-5 p-2 rounded-full bg-neutral-100 text-neutral-500 hover:text-black hover:bg-neutral-200 cursor-pointer transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {confirmedOrder ? (
              /* Order Confirmation Digital Receipt */
              <div className="text-center py-4 space-y-4">
                <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-200">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-neutral-900 tracking-tight">
                    Order Reserved Successfully!
                  </h3>
                  <p className="text-xs text-neutral-500 mt-1">
                    Your brand-sealed handset is reserved for immediate BlueDart air dispatch.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200 text-left text-xs font-mono space-y-2">
                  <div className="flex justify-between">
                    <span className="text-neutral-500">ORDER ID:</span>
                    <span className="text-black font-bold">#{confirmedOrder.orderId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-500">AIRWAY BILL:</span>
                    <span className="text-black font-bold">{confirmedOrder.trackingNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-500">DISPATCH TIMELINE:</span>
                    <span className="text-emerald-700 font-semibold">{confirmedOrder.dispatchSlot}</span>
                  </div>
                  <div className="flex justify-between border-t border-neutral-200 pt-2">
                    <span className="text-neutral-500">TOTAL AMOUNT:</span>
                    <span className="text-black font-black text-sm">{formatPrice(confirmedOrder.total)}</span>
                  </div>
                </div>

                <div className="pt-2 space-y-2">
                  <a
                    href={`https://wa.me/919691011335?text=${encodeURIComponent(`Hello New Radhaswami Mobile Gallery! I have placed Order #${confirmedOrder.orderId} totaling ${formatPrice(confirmedOrder.total)}. Please share invoice and tracking link.`)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-3.5 rounded-2xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Confirm Order on WhatsApp Concierge</span>
                  </a>

                  <button
                    onClick={() => {
                      onClearCart();
                      setIsCheckoutOpen(false);
                      onClose();
                    }}
                    className="w-full py-2.5 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-semibold cursor-pointer transition-colors"
                  >
                    Done &amp; Return to Store
                  </button>
                </div>
              </div>
            ) : (
              /* Checkout Form */
              <form onSubmit={handleCreateOrder} className="space-y-4 text-xs">
                <div className="flex items-center gap-2 font-mono text-[10px] text-neutral-500 uppercase tracking-widest mb-1">
                  <ShieldCheck className="w-4 h-4 text-black" />
                  <span>OFFICIAL SEALED RETAIL CHECKOUT</span>
                </div>
                
                <h3 className="text-2xl font-black text-neutral-900 tracking-tight">
                  Dispatch &amp; Delivery Details
                </h3>

                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="e.g. Vikramaditya Sharma"
                    className="w-full bg-neutral-50 border border-neutral-300 rounded-xl px-3.5 py-2.5 text-xs text-neutral-900 outline-none focus:border-black focus:bg-white transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">Mobile Number (for WhatsApp GST Invoice) *</label>
                  <input
                    type="tel"
                    required
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="+91 96910 11335"
                    className="w-full bg-neutral-50 border border-neutral-300 rounded-xl px-3.5 py-2.5 text-xs text-neutral-900 outline-none focus:border-black focus:bg-white transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">Delivery Address &amp; City</label>
                  <textarea
                    rows={2}
                    value={customerAddress}
                    onChange={(e) => setCustomerAddress(e.target.value)}
                    placeholder="Flat / Building, Street, City & 6-digit Pincode"
                    className="w-full bg-neutral-50 border border-neutral-300 rounded-xl px-3.5 py-2.5 text-xs text-neutral-900 outline-none focus:border-black focus:bg-white transition-all resize-none"
                  />
                </div>

                {/* WhatsApp Pay Direct Verification */}
                <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200 text-neutral-800 space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-[#25D366] text-white flex items-center justify-center shrink-0 shadow-sm">
                      <MessageCircle className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-bold text-xs text-neutral-900">Instant WhatsApp Pay UPI</div>
                      <div className="text-[10px] text-neutral-500">Official New Radhaswami Showroom Concierge Dispatch</div>
                    </div>
                  </div>
                  <p className="text-[11px] text-neutral-600 leading-relaxed">
                    Upon placing your reservation, you will receive an official tax invoice with serial number verification and UPI payment link via WhatsApp.
                  </p>
                </div>

                <div className="pt-2 border-t border-neutral-200 flex justify-between items-center text-xs font-mono">
                  <span className="text-neutral-500">Total Due:</span>
                  <span className="text-xl font-black text-neutral-900">{formatPrice(finalTotal)}</span>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 rounded-2xl bg-black hover:bg-neutral-800 text-white font-extrabold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg disabled:opacity-50"
                >
                  <MessageCircle className="w-4 h-4 text-[#25D366]" />
                  <span>{isSubmitting ? 'Securing Stock Allocation...' : `Confirm & Pay via WhatsApp (${formatPrice(finalTotal)})`}</span>
                </button>
              </form>
            )}

          </div>
        </div>
      )}

    </div>
  );
};
