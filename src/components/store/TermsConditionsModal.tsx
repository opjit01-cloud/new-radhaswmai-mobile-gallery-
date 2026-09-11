import React from 'react';
import { X, ShieldCheck, Truck, FileText, CheckCircle2, AlertCircle, Award } from 'lucide-react';

interface TermsConditionsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TermsConditionsModal: React.FC<TermsConditionsModalProps> = ({
  isOpen,
  onClose
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in overflow-y-auto font-sans">
      <div className="relative w-full max-w-2xl bg-[#0C1017] border border-white/15 rounded-3xl p-6 sm:p-8 shadow-2xl text-white my-8 max-h-[90vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors cursor-pointer"
        >
          <X size={18} />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 border-b border-white/10 pb-4 mb-6">
          <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-black font-bold shrink-0 shadow-md">
            <Award size={20} />
          </div>
          <div>
            <h3 className="font-serif-luxury text-2xl font-medium text-white">
              Terms &amp; Showroom Warranty Policies
            </h3>
            <div className="text-xs text-neutral-400">
              New Radhaswami Mobile Gallery • Pithampur Authorized Flagship Partner
            </div>
          </div>
        </div>

        {/* Policies Content */}
        <div className="space-y-6 text-xs text-neutral-300 leading-relaxed font-light">
          
          {/* Policy 1 */}
          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 space-y-2">
            <div className="flex items-center gap-2 text-white font-semibold text-sm">
              <ShieldCheck size={16} className="text-white" />
              <span>1. 100% Manufacturer Sealed Indian Retail Units</span>
            </div>
            <p>
              Every handset dispatched from our Pithampur showroom is guaranteed 100% brand sealed in original manufacturer packaging with intact factory security pull-tabs. We never sell open-box, refurbished, or international parallel import devices. Each unit is mapped to official brand databases (Apple India, Samsung India, Google India, OnePlus India) prior to dispatch.
            </p>
          </div>

          {/* Policy 2 */}
          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 space-y-2">
            <div className="flex items-center gap-2 text-white font-semibold text-sm">
              <AlertCircle size={16} className="text-white" />
              <span>2. 7-Day Dead-On-Arrival (DOA) Official Replacement</span>
            </div>
            <p>
              In the rare event of a factory hardware defect out of the box, clients are entitled to a 7-day brand replacement under official manufacturer guidelines. Our concierge team assists you in obtaining the official brand Service Center DOA Certificate for immediate box replacement with zero turnaround delays.
            </p>
          </div>

          {/* Policy 3 */}
          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 space-y-2">
            <div className="flex items-center gap-2 text-white font-semibold text-sm">
              <Truck size={16} className="text-white" />
              <span>3. BlueDart Air 100% Insured Courier Dispatch</span>
            </div>
            <p>
              All shipments are fully insured for 100% of their invoice value. Orders in Pithampur and Indore are fulfilled via same-day dedicated express riders. Pan-India shipments are handled by BlueDart Air Express with tamper-evident security bags and mandatory OTP doorstep delivery handoff.
            </p>
          </div>

          {/* Policy 4 */}
          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 space-y-2">
            <div className="flex items-center gap-2 text-white font-semibold text-sm">
              <FileText size={16} className="text-white" />
              <span>4. Official 18% GST Tax Invoicing &amp; Warranty Activation</span>
            </div>
            <p>
              A tax-compliant invoice bearing the device’s serialized IMEI and GST number is generated for every purchase, eligible for corporate input tax credit. Manufacturer warranty begins automatically upon first device boot-up and network handshake with Indian carriers.
            </p>
          </div>

          {/* Policy 5 */}
          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 space-y-2">
            <div className="flex items-center gap-2 text-white font-semibold text-sm">
              <CheckCircle2 size={16} className="text-white" />
              <span>5. 0% No-Cost EMI Financing Terms</span>
            </div>
            <p>
              Zero-percent financing is provided in direct partnership with leading Indian credit institutions (HDFC, ICICI, SBI Card, Axis Bank, Bajaj Finserv, OneCard). The interest component charged by the bank is provided as an instant upfront cashback discount by New Radhaswami Mobile Gallery, ensuring your net payable equals the exact cash retail price.
            </p>
          </div>

        </div>

        {/* Footer Action */}
        <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
          <span className="text-[11px] text-neutral-500">
            Last verified: September 2026 • Legal Atelier Department
          </span>
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-full bg-white hover:bg-neutral-200 text-black font-bold text-xs uppercase tracking-wider transition-all cursor-pointer shadow-lg"
          >
            I Understand &amp; Agree
          </button>
        </div>

      </div>
    </div>
  );
};
