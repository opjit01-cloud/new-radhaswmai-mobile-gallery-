import React, { useState, useEffect } from 'react';
import { Calculator, CreditCard, CheckCircle2, ShieldCheck, ArrowRight, MessageCircle, Percent, Sparkles, Building2 } from 'lucide-react';
import { Product } from '../data/products';

interface EmiFinanceStudioProps {
  products: Product[];
}

export const EmiFinanceStudio: React.FC<EmiFinanceStudioProps> = ({ products }) => {
  const [selectedProductId, setSelectedProductId] = useState<string>(products[0]?.id || 'iphone-16-pro-max');
  const [downPaymentPercent, setDownPaymentPercent] = useState<number>(0);
  const [selectedBank, setSelectedBank] = useState<string>('Bajaj Finserv');
  const [selectedTenure, setSelectedTenure] = useState<number>(12);

  const activeProduct = products.find(p => p.id === selectedProductId) || products[0];

  const banks = [
    { name: 'Bajaj Finserv', badge: 'Instant Approval', instant: true },
    { name: 'HDFC Bank', badge: '0% Paperless', instant: true },
    { name: 'ICICI Bank', badge: 'Pre-Approved', instant: true },
    { name: 'SBI Card', badge: 'Zero Processing Fee', instant: false },
    { name: 'Axis Bank', badge: 'Cashback Offer', instant: false },
  ];

  const tenures = [3, 6, 9, 12, 24];

  // Calculate calculations
  const productPrice = activeProduct?.price || 144900;
  const downPaymentAmount = Math.round((productPrice * downPaymentPercent) / 100);
  const loanAmount = productPrice - downPaymentAmount;
  const monthlyEmi = Math.round(loanAmount / selectedTenure);
  const interestSaved = Math.round(loanAmount * (0.13 * (selectedTenure / 12)));

  const handleApplyWhatsApp = () => {
    const text = encodeURIComponent(
      `Hello New Radhaswami Mobile Gallery! I want to apply for 0% No-Cost EMI for ${activeProduct.name}.\n• Bank: ${selectedBank}\n• Price: ₹${productPrice.toLocaleString('en-IN')}\n• Down Payment: ₹${downPaymentAmount.toLocaleString('en-IN')} (${downPaymentPercent}%)\n• Tenure: ${selectedTenure} Months\n• Monthly EMI: ₹${monthlyEmi.toLocaleString('en-IN')}/mo.\nPlease confirm the instant paperless document checklist.`
    );
    window.open(`https://wa.me/919691011335?text=${text}`, '_blank');
  };

  return (
    <section id="emi-studio" className="py-16 px-4 md:px-8 border-b border-white/5 bg-[#090C12]">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/20 text-white text-xs font-mono uppercase tracking-wider mb-3">
            <Calculator className="w-3.5 h-3.5 text-white" />
            FINANCIAL FLEXIBILITY HUB
          </div>
          <h2 className="text-3xl sm:text-5xl font-display font-extrabold text-white tracking-tight">
            0% Interest No-Cost EMI Studio.
          </h2>
          <p className="mt-3 text-sm sm:text-base text-neutral-400">
            Own the device you desire with zero extra charges. Partnered directly with top credit providers for instant on-the-spot verification.
          </p>
        </div>

        {/* Studio Interactive Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Controls Column (7 Cols) */}
          <div className="lg:col-span-7 rounded-3xl bg-[#0F1420] border border-white/10 p-6 sm:p-8 shadow-xl">
            
            {/* Step 1: Choose Device */}
            <div className="mb-6">
              <label className="block text-xs font-mono uppercase text-neutral-400 mb-2">
                1. Select Flagship Device
              </label>
              <select
                value={selectedProductId}
                onChange={(e) => setSelectedProductId(e.target.value)}
                className="w-full bg-[#080B10] border border-white/15 rounded-xl px-4 py-3 text-white text-sm focus:border-white outline-none transition-colors"
              >
                {products.map(p => (
                  <option key={p.id} value={p.id} className="bg-[#0D1117] text-white">
                    {p.name} — ₹{p.price.toLocaleString('en-IN')}
                  </option>
                ))}
              </select>
            </div>

            {/* Step 2: Choose Bank */}
            <div className="mb-6">
              <label className="block text-xs font-mono uppercase text-neutral-400 mb-2">
                2. Select Finance Partner
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {banks.map(bank => (
                  <button
                    key={bank.name}
                    onClick={() => setSelectedBank(bank.name)}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      selectedBank === bank.name
                        ? 'border-white bg-white/10 text-white font-bold shadow-md shadow-white/5'
                        : 'border-white/10 bg-[#080B10] text-neutral-400 hover:text-white hover:border-white/20'
                    }`}
                  >
                    <div className="text-xs font-bold text-white flex items-center justify-between">
                      <span>{bank.name}</span>
                      {selectedBank === bank.name && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                    </div>
                    <div className="text-[10px] font-mono text-neutral-300 mt-1">{bank.badge}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 3: Down Payment Slider */}
            <div className="mb-6">
              <div className="flex justify-between items-center text-xs mb-2">
                <span className="font-mono uppercase text-neutral-400">3. Down Payment Amount:</span>
                <span className="font-mono font-bold text-emerald-400 text-sm">
                  {downPaymentPercent}% (₹{downPaymentAmount.toLocaleString('en-IN')})
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="50"
                step="10"
                value={downPaymentPercent}
                onChange={(e) => setDownPaymentPercent(Number(e.target.value))}
                className="w-full accent-white h-2 bg-white/10 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] font-mono text-neutral-500 mt-1.5">
                <span>0% (Zero Down)</span>
                <span>10%</span>
                <span>20%</span>
                <span>30%</span>
                <span>40%</span>
                <span>50%</span>
              </div>
            </div>

            {/* Step 4: Tenure Selector */}
            <div>
              <label className="block text-xs font-mono uppercase text-neutral-400 mb-2">
                4. Select Repayment Tenure
              </label>
              <div className="grid grid-cols-5 gap-2">
                {tenures.map(months => {
                  const monthly = Math.round(loanAmount / months);
                  return (
                    <button
                      key={months}
                      onClick={() => setSelectedTenure(months)}
                      className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                        selectedTenure === months
                          ? 'border-white bg-white text-black font-extrabold shadow-md'
                          : 'border-white/10 bg-[#080B10] text-neutral-300 hover:text-white'
                      }`}
                    >
                      <div className="text-xs">{months} Mo</div>
                      <div className={`text-[10px] font-mono mt-0.5 ${selectedTenure === months ? 'text-black/80' : 'text-neutral-400'}`}>
                        ₹{monthly.toLocaleString('en-IN')}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

          </div>

          {/* Breakdown Summary Column (5 Cols) */}
          <div className="lg:col-span-5 rounded-3xl bg-gradient-to-b from-[#131926] to-[#0A0E16] border border-white/15 p-6 sm:p-8 shadow-2xl flex flex-col justify-between h-full">
            
            <div>
              <div className="flex items-center gap-3 mb-4">
                <img
                  src={activeProduct.image}
                  alt={activeProduct.name}
                  className="w-16 h-16 object-cover rounded-xl border border-white/10"
                />
                <div>
                  <div className="text-xs font-mono text-neutral-400">{activeProduct.brand}</div>
                  <h4 className="text-base font-bold text-white leading-snug">{activeProduct.name}</h4>
                  <div className="text-xs font-mono text-neutral-300 font-semibold mt-0.5">
                    Total: ₹{productPrice.toLocaleString('en-IN')}
                  </div>
                </div>
              </div>

              {/* Monthly EMI Big Callout */}
              <div className="my-6 p-5 rounded-2xl bg-[#080B10] border border-white/20 text-center">
                <span className="text-[11px] font-mono uppercase text-neutral-400 tracking-wider">
                  Calculated Monthly Installment
                </span>
                <div className="text-3xl sm:text-4xl font-display font-extrabold text-white mt-1">
                  ₹{monthlyEmi.toLocaleString('en-IN')}
                  <span className="text-sm font-normal text-neutral-400">/mo</span>
                </div>
                <div className="inline-flex items-center gap-1 text-[11px] font-mono text-emerald-400 mt-2 bg-emerald-500/10 px-3 py-1 rounded-full">
                  <Percent className="w-3 h-3" />
                  <span>0% Bank Interest Guaranteed</span>
                </div>
              </div>

              {/* Financial Line Items */}
              <div className="space-y-2.5 text-xs font-mono pt-2">
                <div className="flex justify-between text-neutral-400">
                  <span>Device Cost:</span>
                  <span className="text-white font-semibold">₹{productPrice.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-neutral-400">
                  <span>Down Payment ({downPaymentPercent}%):</span>
                  <span className="text-white font-semibold">₹{downPaymentAmount.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-neutral-400">
                  <span>Finance Loan Amount:</span>
                  <span className="text-white font-semibold">₹{loanAmount.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-neutral-400">
                  <span>Bank Processing Fee:</span>
                  <span className="text-emerald-400 font-bold">₹0 (Waived)</span>
                </div>
                <div className="flex justify-between text-neutral-400 border-t border-white/10 pt-2">
                  <span>Total Interest Saved:</span>
                  <span className="text-emerald-400 font-bold">+₹{interestSaved.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 space-y-3">
              <button
                onClick={handleApplyWhatsApp}
                className="w-full py-3.5 px-6 rounded-xl bg-white hover:bg-neutral-200 text-black font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg"
              >
                <MessageCircle className="w-4 h-4 text-black" />
                <span>Apply Instant Approval via WhatsApp</span>
              </button>

              <div className="flex items-center justify-center gap-2 text-[11px] text-gray-400">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Zero documentation hassle • In-store or doorstep approval</span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
