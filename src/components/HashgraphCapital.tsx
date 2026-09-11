import React, { useState } from 'react';
import { Calculator, CheckCircle2, ShieldCheck, Percent, MessageCircle, ArrowRight } from 'lucide-react';
import { Product, PRODUCTS } from '../data/products';
import { HashgraphButton } from './HashgraphButton';

interface HashgraphCapitalProps {
  products: Product[];
}

export const HashgraphCapital: React.FC<HashgraphCapitalProps> = ({ products }) => {
  const [selectedProductId, setSelectedProductId] = useState<string>(products[0]?.id || 'iphone-16-pro-max');
  const [downPaymentPercent, setDownPaymentPercent] = useState<number>(0);
  const [selectedBank, setSelectedBank] = useState<string>('Bajaj Finserv');
  const [selectedTenure, setSelectedTenure] = useState<number>(12);

  const activeProduct = products.find(p => p.id === selectedProductId) || products[0] || PRODUCTS[0];

  const banks = [
    { name: 'Bajaj Finserv', badge: 'Instant Approval', rate: '0% Interest' },
    { name: 'HDFC Bank', badge: 'Paperless Approval', rate: '0% Interest' },
    { name: 'ICICI Bank', badge: 'Pre-Approved Cards', rate: '0% Interest' },
    { name: 'SBI Card', badge: 'Zero Processing Fee', rate: '0% Interest' },
    { name: 'Axis Bank', badge: 'Direct Cashback', rate: '0% Interest' },
  ];

  const tenures = [3, 6, 9, 12, 24];

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
    <section id="capital" className="relative min-h-[90vh] py-24 sm:py-32 px-6 sm:px-12 lg:px-16 border-t border-white/5 bg-[#000209]">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Title Index */}
        <div className="section-title mb-8 sm:mb-12">
          <span className="section-title__id">//03</span>
          <span>CAPITAL &bull; 0% NO-COST EMI</span>
        </div>

        {/* Asymmetric Offset Title */}
        <div className="mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-5xl lg:text-7xl font-display font-extrabold text-white tracking-tight leading-[1.05]">
            <span className="block">Financial flexibility</span>
            <span className="block pl-6 sm:pl-16 text-[#9BB8E1]">you can build on.</span>
          </h2>
          <p className="mt-6 text-sm sm:text-base text-gray-400 font-light max-w-xl">
            Own the device you desire with zero extra charges, zero hidden interest, and instant on-the-spot institutional verification.
          </p>
        </div>

        {/* Studio Interactive Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Controls Column (7 Cols) */}
          <div className="lg:col-span-7 rounded-3xl p-6 sm:p-8 hashgraph-card">
            
            {/* Step 1: Select Flagship Device */}
            <div className="mb-6">
              <label className="block text-xs font-mono uppercase text-[#9BB8E1] tracking-wider mb-2">
                // 01 SELECT FLAGSHIP DEVICE
              </label>
              <select
                value={selectedProductId}
                onChange={(e) => setSelectedProductId(e.target.value)}
                className="w-full bg-[#04060A] border border-white/15 rounded-xl px-4 py-3 text-white text-sm focus:border-[#9BB8E1] outline-none font-mono transition-colors"
              >
                {products.map(p => (
                  <option key={p.id} value={p.id} className="bg-[#000209] text-white">
                    {p.name} — ₹{p.price.toLocaleString('en-IN')}
                  </option>
                ))}
              </select>
            </div>

            {/* Step 2: Select Financial Partner */}
            <div className="mb-6">
              <label className="block text-xs font-mono uppercase text-[#9BB8E1] tracking-wider mb-2">
                // 02 CHOOSE FINANCE PARTNER
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {banks.map(bank => (
                  <button
                    key={bank.name}
                    onClick={() => setSelectedBank(bank.name)}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      selectedBank === bank.name
                        ? 'border-[#9BB8E1] bg-[#9BB8E1]/20 text-white font-bold'
                        : 'border-white/10 bg-[#04060A] text-gray-400 hover:text-white hover:border-white/20'
                    }`}
                  >
                    <div className="text-xs font-bold text-white flex items-center justify-between">
                      <span>{bank.name}</span>
                      {selectedBank === bank.name && <CheckCircle2 className="w-3.5 h-3.5 text-[#9BB8E1]" />}
                    </div>
                    <div className="text-[10px] font-mono text-[#9BB8E1] mt-1">{bank.badge}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 3: Down Payment Slider */}
            <div className="mb-6">
              <div className="flex justify-between items-center text-xs mb-2">
                <span className="font-mono uppercase text-[#9BB8E1] tracking-wider">
                  // 03 DOWN PAYMENT:
                </span>
                <span className="font-mono font-bold text-white text-sm">
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
                className="w-full accent-[#9BB8E1] h-1.5 bg-white/10 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] font-mono text-gray-500 mt-2">
                <span>0% (ZERO DOWN)</span>
                <span>10%</span>
                <span>20%</span>
                <span>30%</span>
                <span>40%</span>
                <span>50%</span>
              </div>
            </div>

            {/* Step 4: Tenure Selector */}
            <div>
              <label className="block text-xs font-mono uppercase text-[#9BB8E1] tracking-wider mb-2">
                // 04 SELECT REPAYMENT HORIZON
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
                          ? 'border-[#9BB8E1] bg-[#9BB8E1] text-black font-extrabold shadow-md'
                          : 'border-white/10 bg-[#04060A] text-gray-300 hover:text-white'
                      }`}
                    >
                      <div className="text-xs font-mono">{months} MO</div>
                      <div className={`text-[10px] font-mono mt-0.5 ${selectedTenure === months ? 'text-black/80' : 'text-gray-400'}`}>
                        ₹{monthly.toLocaleString('en-IN')}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

          </div>

          {/* Breakdown Summary Column (5 Cols) */}
          <div className="lg:col-span-5 rounded-3xl p-6 sm:p-8 hashgraph-card flex flex-col justify-between h-full">
            <div>
              
              <div className="flex items-center gap-3.5 mb-6">
                <img
                  src={activeProduct.image}
                  alt={activeProduct.name}
                  className="w-16 h-16 object-cover rounded-xl border border-white/10"
                />
                <div>
                  <div className="text-xs font-mono text-[#9BB8E1]">{activeProduct.brand}</div>
                  <h4 className="text-base font-bold text-white leading-snug">{activeProduct.name}</h4>
                  <div className="text-xs font-mono text-gray-300 mt-0.5">
                    Price: ₹{productPrice.toLocaleString('en-IN')}
                  </div>
                </div>
              </div>

              {/* Monthly Installment Callout */}
              <div className="my-6 p-6 rounded-2xl bg-[#04060A] border border-[#9BB8E1]/30 text-center">
                <span className="text-[11px] font-mono uppercase text-gray-400 tracking-wider">
                  MONTHLY COMMITMENT
                </span>
                <div className="text-3xl sm:text-5xl font-display font-extrabold text-[#9BB8E1] mt-1">
                  ₹{monthlyEmi.toLocaleString('en-IN')}
                  <span className="text-sm font-normal text-gray-400 font-mono">/mo</span>
                </div>
                <div className="inline-flex items-center gap-1.5 text-[11px] font-mono text-emerald-400 mt-2 bg-emerald-500/10 px-3 py-1 rounded-full">
                  <Percent className="w-3 h-3" />
                  <span>0% BANK INTEREST GUARANTEED</span>
                </div>
              </div>

              {/* Financial Line Items */}
              <div className="space-y-2.5 text-xs font-mono pt-2">
                <div className="flex justify-between text-gray-400">
                  <span>Gross Cost:</span>
                  <span className="text-white font-semibold">₹{productPrice.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Down Payment ({downPaymentPercent}%):</span>
                  <span className="text-white font-semibold">₹{downPaymentAmount.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Net Loan Principal:</span>
                  <span className="text-white font-semibold">₹{loanAmount.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Processing Surcharge:</span>
                  <span className="text-emerald-400 font-bold">₹0 (WAIVED)</span>
                </div>
                <div className="flex justify-between text-gray-400 border-t border-white/10 pt-2">
                  <span>Total Interest Savings:</span>
                  <span className="text-emerald-400 font-bold">+₹{interestSaved.toLocaleString('en-IN')}</span>
                </div>
              </div>

            </div>

            {/* Action Buttons */}
            <div className="mt-8 space-y-3">
              <button
                onClick={handleApplyWhatsApp}
                className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-[#9BB8E1] to-[#2C4E73] hover:brightness-110 text-white font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-[#9BB8E1]/20 font-mono uppercase tracking-wider"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Apply Paperless Approval via WhatsApp</span>
              </button>

              <div className="flex items-center justify-center gap-2 text-[11px] font-mono text-gray-500">
                <ShieldCheck className="w-3.5 h-3.5 text-[#9BB8E1]" />
                <span>Instant on-the-spot verification &bull; Doorstep delivery</span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
