import React, { useState } from 'react';
import { Calculator, Zap, ShieldCheck, CheckCircle2 } from 'lucide-react';

export const EmiCalculator: React.FC = () => {
  const [devicePrice, setDevicePrice] = useState<number>(129999);
  const [downPayment, setDownPayment] = useState<number>(20000);
  const [tenureMonths, setTenureMonths] = useState<number>(12);
  const [isZeroInterest, setIsZeroInterest] = useState<boolean>(true);

  const loanAmount = Math.max(0, devicePrice - downPayment);
  const interestRateAnnual = isZeroInterest ? 0 : 12; // 0% No Cost EMI vs 12% standard
  const monthlyInterestRate = interestRateAnnual / (12 * 100);

  const monthlyEmi = Math.round(
    interestRateAnnual === 0
      ? loanAmount / tenureMonths
      : (loanAmount * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, tenureMonths)) /
        (Math.pow(1 + monthlyInterestRate, tenureMonths) - 1)
  );

  const totalPayable = downPayment + monthlyEmi * tenureMonths;
  const totalInterest = totalPayable - devicePrice;

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);
  };

  return (
    <section id="emi-calculator" className="py-20 px-4 md:px-8 max-w-7xl mx-auto">
      <div className="glass-panel-gold rounded-3xl p-6 sm:p-10 md:p-12 border border-gold/20 shadow-2xl relative overflow-hidden">
        
        {/* Background ambient glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gold/10 blur-[100px] rounded-full pointer-events-none" />

        <div className="max-w-3xl mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-gold/30 bg-gold/5 text-gold text-xs font-mono mb-3">
            <Calculator className="w-3.5 h-3.5" />
            <span>FINANCE &amp; EASY MONTHLY INSTALLMENTS</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-display font-bold text-white tracking-tight">
            0% No-Cost EMI Calculator
          </h2>
          <p className="mt-3 text-gray-400 text-sm sm:text-base">
            Upgrade to your dream flagship phone with zero down payment and flexible monthly tenures at New Radhaswami Mobile Gallery.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Controls Column */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Device Price Slider */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-gray-400">DEVICE PRICE</span>
                <span className="text-gold font-bold text-sm">{formatCurrency(devicePrice)}</span>
              </div>
              <input
                type="range"
                min="20000"
                max="200000"
                step="5000"
                value={devicePrice}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setDevicePrice(val);
                  if (downPayment > val) setDownPayment(Math.round(val * 0.2));
                }}
                className="w-full accent-gold bg-[#12171F] h-2 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] font-mono text-gray-500">
                <span>₹20,000</span>
                <span>₹1,00,000</span>
                <span>₹2,00,000</span>
              </div>
            </div>

            {/* Down Payment Slider */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-gray-400">DOWN PAYMENT</span>
                <span className="text-white font-bold text-sm">{formatCurrency(downPayment)}</span>
              </div>
              <input
                type="range"
                min="0"
                max={Math.round(devicePrice * 0.7)}
                step="5000"
                value={downPayment}
                onChange={(e) => setDownPayment(Number(e.target.value))}
                className="w-full accent-gold bg-[#12171F] h-2 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] font-mono text-gray-500">
                <span>₹0 (Zero Down Payment)</span>
                <span>{formatCurrency(Math.round(devicePrice * 0.7))}</span>
              </div>
            </div>

            {/* Tenure Selector */}
            <div className="space-y-2">
              <span className="text-xs font-mono text-gray-400 block">[ SELECT LOAN DURATION ]</span>
              <div className="grid grid-cols-5 gap-2">
                {[3, 6, 9, 12, 24].map((m) => (
                  <button
                    key={m}
                    onClick={() => setTenureMonths(m)}
                    className={`py-2.5 rounded-xl text-xs font-mono font-bold transition-all ${
                      tenureMonths === m
                        ? 'bg-gold text-black shadow-glow-gold'
                        : 'bg-white/5 border border-white/10 text-gray-300 hover:border-white/30'
                    }`}
                  >
                    {m} Mo
                  </button>
                ))}
              </div>
            </div>

            {/* 0% Interest Toggle */}
            <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10">
              <input
                type="checkbox"
                id="zeroInterest"
                checked={isZeroInterest}
                onChange={(e) => setIsZeroInterest(e.target.checked)}
                className="w-4 h-4 accent-gold cursor-pointer"
              />
              <label htmlFor="zeroInterest" className="text-xs text-gray-300 cursor-pointer flex items-center gap-2">
                <span>Apply Partner Bank 0% No-Cost EMI Offer</span>
                <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-mono font-bold">
                  RECOMMENDED
                </span>
              </label>
            </div>

          </div>

          {/* Results Summary Box */}
          <div className="lg:col-span-5 p-6 sm:p-8 rounded-2xl bg-[#090D12] border border-gold/30 shadow-2xl space-y-6">
            <div className="text-center pb-6 border-b border-white/10">
              <span className="text-xs font-mono text-gray-400 uppercase tracking-wider block mb-1">
                MONTHLY INSTALLMENT
              </span>
              <div className="text-4xl sm:text-5xl font-display font-extrabold text-gold">
                {formatCurrency(monthlyEmi)}
                <span className="text-xs text-gray-400 font-normal font-mono"> /month</span>
              </div>
              <p className="text-[11px] font-mono text-emerald-400 mt-2 flex items-center justify-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Zero Hidden Fees • Instant Approval</span>
              </p>
            </div>

            <div className="space-y-2.5 text-xs font-mono">
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-gray-400">Total Loan Amount:</span>
                <span className="text-white font-medium">{formatCurrency(loanAmount)}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-gray-400">Down Payment:</span>
                <span className="text-white font-medium">{formatCurrency(downPayment)}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-gray-400">Interest Charged:</span>
                <span className={totalInterest <= 0 ? 'text-emerald-400 font-bold' : 'text-zinc-300'}>
                  {totalInterest <= 0 ? '₹0 (0% Interest)' : formatCurrency(totalInterest)}
                </span>
              </div>
              <div className="flex justify-between py-1 text-sm font-bold pt-2">
                <span className="text-gold">Total Amount:</span>
                <span className="text-gold">{formatCurrency(totalPayable)}</span>
              </div>
            </div>

            <a
              href={`https://wa.me/919691011335?text=Hello%20New%20Radhaswami%20Mobile%20Gallery,%20I%20want%20to%20apply%20for%200%25%20EMI%20for%20Device%20Price:%20${encodeURIComponent(formatCurrency(devicePrice))},%20Down%20Payment:%20${encodeURIComponent(formatCurrency(downPayment))},%20Tenure:%20${tenureMonths}%20Months%20(Monthly%20EMI:%20${encodeURIComponent(formatCurrency(monthlyEmi))}).`}
              target="_blank"
              rel="noreferrer"
              className="w-full block text-center py-3.5 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white font-bold rounded-xl text-xs uppercase tracking-wider shadow-lg transition-all"
            >
              Apply for EMI on WhatsApp ➔
            </a>
          </div>

        </div>

      </div>
    </section>
  );
};
