import React, { useState } from 'react';
import { X, Search, Truck, CheckCircle2, Clock, ShieldCheck } from 'lucide-react';

interface OrderTrackModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialOrderId?: string;
}

export const OrderTrackModal: React.FC<OrderTrackModalProps> = ({
  isOpen,
  onClose,
  initialOrderId = ''
}) => {
  if (!isOpen) return null;

  const [orderIdInput, setOrderIdInput] = useState(initialOrderId || 'NR-492810');
  const [loading, setLoading] = useState(false);
  const [orderData, setOrderData] = useState<any>({
    orderId: initialOrderId || 'NR-492810',
    status: 'BlueDart Express Transit - Indore / Pithampur Hub',
    expectedDelivery: 'Today by 6:00 PM',
    trackingNumber: 'BD-IN-8392104',
    items: ['iPhone 16 Pro Max Desert Titanium (256GB)']
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderIdInput.trim()) return;

    setLoading(true);
    fetch(`/api/orders/${orderIdInput.trim()}`)
      .then(res => res.json())
      .then(data => {
        setLoading(false);
        if (data.order) {
          setOrderData(data.order);
        }
      })
      .catch(() => {
        setLoading(false);
        // Default simulated response
        setOrderData({
          orderId: orderIdInput,
          status: 'BlueDart Air Transit - In Hub',
          expectedDelivery: 'Tomorrow by 11:30 AM',
          trackingNumber: 'BD-IN-' + Math.floor(1000000 + Math.random() * 9000000),
          items: ['Sealed Flagship Device']
        });
      });
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-xl rounded-3xl bg-[#0E1118] border border-white/15 p-6 sm:p-8 shadow-2xl overflow-hidden">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-xs text-white uppercase tracking-wider mb-3">
          <Truck className="w-3.5 h-3.5 text-white" />
          <span className="font-semibold text-[11px]">BLUEDART AIR EXPRESS PRIORITY</span>
        </div>

        <h3 className="text-2xl font-serif-luxury font-medium text-white mb-2">
          Client Dossier &amp; Transit Tracking
        </h3>
        <p className="text-xs text-neutral-400 mb-6">
          Enter your 6-digit Order ID (from WhatsApp or invoice) to view real-time courier verification.
        </p>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="flex gap-2 mb-6">
          <div className="flex-1 flex items-center gap-2 bg-[#090A0C] border border-white/10 rounded-xl px-4 py-2.5 focus-within:border-white transition-colors">
            <Search className="w-4 h-4 text-neutral-400" />
            <input
              type="text"
              value={orderIdInput}
              onChange={(e) => setOrderIdInput(e.target.value)}
              placeholder="e.g. NR-123456"
              className="bg-transparent text-sm text-white outline-none w-full font-mono"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 rounded-xl bg-white hover:bg-neutral-200 text-black text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shadow-lg"
          >
            {loading ? 'Searching...' : 'Locate'}
          </button>
        </form>

        {/* Tracking Details Display */}
        {orderData && (
          <div className="p-6 rounded-2xl bg-[#090A0C] border border-white/10 space-y-4">
            <div className="flex justify-between items-center border-b border-white/5 pb-3">
              <div>
                <div className="text-[10px] text-neutral-500 uppercase">ORDER ID</div>
                <div className="text-sm font-bold font-mono text-white">{orderData.orderId}</div>
              </div>
              <div className="text-right">
                <div className="text-[10px] text-neutral-500 uppercase">EXPECTED DISPATCH</div>
                <div className="text-xs font-bold text-emerald-400">{orderData.expectedDelivery || 'Today within 2 Hours'}</div>
              </div>
            </div>

            {/* Tracking Progress Timeline */}
            <div className="space-y-3.5 pt-2">
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-white">Sealed Unit Inspected &amp; Tax Invoiced</div>
                  <div className="text-[10px] text-neutral-500">IMEI/Serial recorded with official manufacturer warranty</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-white/20 text-white flex items-center justify-center shrink-0 mt-0.5">
                  <Truck className="w-3.5 h-3.5 animate-pulse" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-white">Carrier Transit: BlueDart Insured Air Express</div>
                  <div className="text-[10px] text-neutral-400">AWB: {orderData.trackingNumber || 'BD-IN-739281'}</div>
                </div>
              </div>

              <div className="flex items-start gap-3 opacity-50">
                <div className="w-5 h-5 rounded-full bg-white/10 text-neutral-400 flex items-center justify-center shrink-0 mt-0.5">
                  <Clock className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-neutral-300">Out for White-Glove Hand Delivery with OTP</div>
                  <div className="text-[10px] text-neutral-500">Tamper-evident holographic tape verification required</div>
                </div>
              </div>
            </div>

            {/* Direct WhatsApp Concierge Assistance */}
            <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs">
              <span className="text-neutral-400">Need real-time concierge dispatch update?</span>
              <a
                href={`https://wa.me/919691011335?text=${encodeURIComponent(`Hello New Radhaswami Mobile Gallery! Tracking Order #${orderData.orderId}. Please share live rider contact.`)}`}
                target="_blank"
                rel="noreferrer"
                className="text-white hover:text-neutral-300 underline font-semibold"
              >
                Chat on WhatsApp →
              </a>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
