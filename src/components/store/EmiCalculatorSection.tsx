import React, { useState, useEffect } from 'react';
import { Product } from '../../data/products';
import { CheckCircle2, ShieldCheck, Zap, Check, CreditCard, MessageSquare } from 'lucide-react';
import { MagneticButton } from '../common/MagneticButton';
import { SpotlightCard } from '../reactbits/SpotlightCard';
import { ShinyText } from '../reactbits/ShinyText';
import { DecryptedText } from '../reactbits/DecryptedText';
import { CountUp } from '../reactbits/CountUp';
import { ClickSpark } from '../reactbits/ClickSpark';
import { Aurora } from '../reactbits/Aurora';
import { Particles } from '../reactbits/Particles';
import { BorderBeam } from '../reactbits/BorderBeam';

interface EmiCalculatorSectionProps {
  selectedProduct?: Product | null;
  products?: Product[];
  onAddToCart?: (product: Product, color: string, storage?: string, price?: number) => void;
  onBuyNow?: (product: Product, color: string, storage?: string, price?: number) => void;
}

export const EmiCalculatorSection: React.FC<EmiCalculatorSectionProps> = ({
  selectedProduct,
  products = [],
  onAddToCart,
  onBuyNow
}) => {
  const [selectedDevicePrice, setSelectedDevicePrice] = useState<number>(144900);
  const [selectedDeviceName, setSelectedDeviceName] = useState<string>('iPhone 16 Pro Max 256GB');
  const [activeProductObj, setActiveProductObj] = useState<Product | null>(null);
  const [downPaymentPercent, setDownPaymentPercent] = useState<number>(0);
  const [tenureMonths, setTenureMonths] = useState<number>(12);
  const [selectedBank, setSelectedBank] = useState<string>('HDFC Bank');
  const [detectedToast, setDetectedToast] = useState<boolean>(false);

  // Fallback preset list if products array is empty
  const defaultPresets = [
    { name: 'Apple iPhone 16 Pro Max 256GB', price: 144900 },
    { name: 'Samsung Galaxy S25 Ultra 256GB', price: 129999 },
    { name: 'Google Pixel 9 Pro Fold 256GB', price: 172999 },
    { name: 'OnePlus 13 256GB', price: 69999 },
    { name: 'Apple iPhone 16 Pro 128GB', price: 119900 },
    { name: 'Samsung Galaxy S25+ 256GB', price: 99999 }
  ];

  // Auto-detect when selectedProduct prop changes
  useEffect(() => {
    if (selectedProduct) {
      setSelectedDevicePrice(selectedProduct.price);
      setSelectedDeviceName(selectedProduct.name);
      setActiveProductObj(selectedProduct);
      setDetectedToast(true);
      const timer = setTimeout(() => setDetectedToast(false), 4000);
      return () => clearTimeout(timer);
    }
  }, [selectedProduct]);

  const bankPartners = [
    { name: 'HDFC Bank', badge: '0% Interest EMI', code: 'HDFC' },
    { name: 'ICICI Bank', badge: 'Pre-Approved Cards', code: 'ICICI' },
    { name: 'Bajaj Finserv', badge: 'Zero Down Payment', code: 'BAJAJ' },
    { name: 'State Bank of India', badge: 'Lowest Processing', code: 'SBI' }
  ];

  const downPaymentAmount = Math.round((selectedDevicePrice * downPaymentPercent) / 100);
  const loanAmount = selectedDevicePrice - downPaymentAmount;
  const monthlyEmi = Math.round(loanAmount / tenureMonths);

  const handleDeviceSelect = (name: string, price: number, prodObj?: Product) => {
    setSelectedDeviceName(name);
    setSelectedDevicePrice(price);
    if (prodObj) {
      setActiveProductObj(prodObj);
    } else {
      const match = products.find(p => p.name.toLowerCase() === name.toLowerCase() || name.toLowerCase().includes(p.name.toLowerCase()));
      setActiveProductObj(match || null);
    }
  };

  const handleBuyNowFromEmi = () => {
    if (activeProductObj && onBuyNow) {
      onBuyNow(activeProductObj, activeProductObj.colors[0]?.name || 'Standard', activeProductObj.storageVariants?.[0]?.size || '256GB', selectedDevicePrice);
    } else if (products.length > 0 && onBuyNow) {
      onBuyNow(products[0], products[0].colors[0]?.name || 'Standard', '256GB', selectedDevicePrice);
    }
  };

  const displayedDevices = products.length > 0 
    ? products.slice(0, 6).map(p => ({ name: p.name, price: p.price, obj: p }))
    : defaultPresets.map(d => ({ name: d.name, price: d.price, obj: undefined }));

  return (
    <section id="emi-studio" className="py-24 sm:py-32 px-4 sm:px-6 bg-[#FAFAFB] dark:bg-[#07080A] text-[#0A0B0E] dark:text-[#F8FAFC] border-b border-black/[0.08] dark:border-white/10 relative overflow-hidden transition-colors duration-300">
      <div className="max-w-7xl mx-auto relative z-10">

        {/* Section Header with React Bits DecryptedText */}
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-black/[0.08] dark:border-white/10 pb-8 gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono tracking-widest font-bold px-2 py-0.5 rounded bg-black dark:bg-white text-white dark:text-black">
                SALON 03
              </span>
              <DecryptedText
                text="0% NO-COST EMI FINANCING LOUNGE • INSTANT APPROVAL"
                speed={26}
                maxIterations={10}
                className="text-[10.5px] uppercase tracking-[0.2em] text-neutral-500 dark:text-neutral-400 font-bold"
              />
            </div>
            <h2 className="text-3xl sm:text-5xl font-serif-luxury font-normal text-neutral-950 dark:text-white tracking-tight">
              0% Interest <span className="font-semibold text-black dark:text-white"><ShinyText text="EMI Calculator" speed={4} /></span>
            </h2>
            <p className="text-neutral-600 dark:text-neutral-400 font-light mt-2 max-w-2xl text-sm sm:text-base leading-relaxed">
              Auto-detects the price of any phone you click. Experience pure 0% interest financing with zero hidden costs, instant bank approval, and flexible 3 to 24 month tenures.
            </p>
          </div>

          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-[#0F1117] border border-neutral-200 dark:border-white/10 text-neutral-800 dark:text-neutral-200 text-xs shadow-xs font-semibold">
            <CheckCircle2 size={14} className="text-black dark:text-white" />
            <span>Auto-Synced with Showroom Pricing</span>
          </div>
        </div>

        {/* Live Detected Product Banner */}
        {detectedToast && (
          <div className="mt-6 p-4 rounded-2xl bg-white dark:bg-[#0F1117] border border-neutral-200 dark:border-white/10 text-neutral-900 dark:text-white flex items-center justify-between shadow-md animate-tab-in">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-black dark:bg-white flex items-center justify-center text-white dark:text-black">
                <Zap size={16} />
              </div>
              <div>
                <div className="text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">Device Price Auto-Detected!</div>
                <div className="text-sm font-bold text-neutral-950 dark:text-white">
                  {selectedDeviceName} • ₹{selectedDevicePrice.toLocaleString('en-IN')}
                </div>
              </div>
            </div>
            <span className="text-xs text-neutral-500 dark:text-neutral-400 font-medium hidden sm:inline">
              Calculations Updated Below
            </span>
          </div>
        )}

        {/* Interactive Calculator Body */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-10">
          
          {/* Left: Configuration Sliders & Bank Selector */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Device Preset Switcher with Auto-Sync */}
            <div>
              <label className="block text-xs text-neutral-600 dark:text-neutral-400 uppercase tracking-wider mb-3 font-semibold flex items-center justify-between">
                <span>Select or Change Handset Model:</span>
                <span className="text-[11px] text-neutral-500 dark:text-neutral-400 font-normal">Click any phone to detect price</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {displayedDevices.map(d => {
                  const isSelected = selectedDeviceName.toLowerCase() === d.name.toLowerCase();
                  return (
                    <button
                      key={d.name}
                      onClick={() => handleDeviceSelect(d.name, d.price, d.obj)}
                      className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                        isSelected
                          ? 'border-black dark:border-white bg-black dark:bg-white text-white dark:text-black shadow-xl shadow-black/10 ring-1 ring-black dark:ring-white'
                          : 'border-neutral-200 dark:border-white/10 bg-white dark:bg-[#0F1117] text-neutral-700 dark:text-neutral-300 hover:text-black dark:hover:text-white hover:bg-neutral-50 dark:hover:bg-[#151923] hover:border-neutral-300 dark:hover:border-white/20 shadow-xs'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className={`text-xs font-bold truncate max-w-[200px] ${isSelected ? 'text-white dark:text-black' : 'text-neutral-900 dark:text-white'}`}>{d.name}</div>
                        {isSelected && <Check size={14} className="text-white dark:text-black" />}
                      </div>
                      <div className={`text-sm font-bold mt-1 font-mono ${isSelected ? 'text-neutral-200 dark:text-neutral-800' : 'text-neutral-950 dark:text-neutral-200'}`}>
                        ₹{d.price.toLocaleString('en-IN')}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Down Payment Slider */}
            <div className="p-6 rounded-3xl bg-white dark:bg-[#0F1117] border border-neutral-200 dark:border-white/10 space-y-3 shadow-xs">
              <div className="flex justify-between items-center">
                <span className="text-xs text-neutral-600 dark:text-neutral-400 uppercase tracking-wider font-semibold">Initial Down Payment:</span>
                <span className="text-sm font-bold text-neutral-950 dark:text-white font-mono">
                  {downPaymentPercent}% (₹{downPaymentAmount.toLocaleString('en-IN')})
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={50}
                step={10}
                value={downPaymentPercent}
                onChange={(e) => setDownPaymentPercent(Number(e.target.value))}
                className="w-full accent-black dark:accent-white cursor-pointer h-2 bg-neutral-200 dark:bg-neutral-800 rounded-lg"
              />
              <div className="flex justify-between text-[11px] text-neutral-500 dark:text-neutral-400 font-mono">
                <span>0% (Zero Down Payment)</span>
                <span>20%</span>
                <span>30%</span>
                <span>50% Max</span>
              </div>
            </div>

            {/* Tenure Buttons */}
            <div className="p-6 rounded-3xl bg-white dark:bg-[#0F1117] border border-neutral-200 dark:border-white/10 space-y-3 shadow-xs">
              <div className="flex justify-between items-center text-xs text-neutral-600 dark:text-neutral-400 uppercase tracking-wider font-semibold">
                <span>Repayment Tenure (Months):</span>
                <span className="text-[11px] text-neutral-500 dark:text-neutral-400 font-normal">All 0% interest</span>
              </div>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {[3, 6, 9, 12, 18, 24].map(m => (
                  <MagneticButton
                    key={m}
                    onClick={() => setTenureMonths(m)}
                    className={`py-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      tenureMonths === m
                        ? 'bg-black dark:bg-white text-white dark:text-black shadow-md shadow-black/10'
                        : 'bg-neutral-100 dark:bg-white/5 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-white/10 hover:text-black dark:hover:text-white border border-neutral-200 dark:border-white/10'
                    }`}
                  >
                    {m} Mos
                  </MagneticButton>
                ))}
              </div>
            </div>

            {/* Bank Selector */}
            <div>
              <div className="text-xs text-neutral-600 dark:text-neutral-400 uppercase tracking-wider mb-2.5 font-semibold">
                Partner Financial Institutions:
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {bankPartners.map(b => (
                  <button
                    key={b.name}
                    onClick={() => setSelectedBank(b.name)}
                    className={`p-3.5 rounded-2xl border text-center transition-all cursor-pointer ${
                      selectedBank === b.name
                        ? 'border-black dark:border-white bg-black dark:bg-white text-white dark:text-black shadow-md ring-1 ring-black dark:ring-white'
                        : 'border-neutral-200 dark:border-white/10 bg-white dark:bg-[#0F1117] text-neutral-700 dark:text-neutral-300 hover:text-black dark:hover:text-white hover:border-neutral-300 dark:hover:border-white/20 shadow-xs'
                    }`}
                  >
                    <div className={`font-extrabold text-xs font-mono ${selectedBank === b.name ? 'text-white dark:text-black' : 'text-neutral-950 dark:text-white'}`}>{b.code}</div>
                    <div className={`text-[10px] truncate mt-1 ${selectedBank === b.name ? 'text-neutral-300 dark:text-neutral-700' : 'text-neutral-500 dark:text-neutral-400'}`}>{b.name}</div>
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Right: Calculation Summary Card with React Bits SpotlightCard & BorderBeam */}
          <div className="lg:col-span-5">
            <SpotlightCard
              spotlightColor="rgba(255, 255, 255, 0.08)"
              borderColor="rgba(255, 255, 255, 0.15)"
              className="relative p-8 shadow-2xl space-y-6 overflow-hidden rounded-3xl bg-white dark:bg-[#0F1117] border border-neutral-200 dark:border-white/10"
            >
              <BorderBeam size={200} duration={8} colorFrom="#000000" colorTo="#94A3B8" borderWidth={1.5} />
              
              <div className="flex items-center justify-between border-b border-neutral-200 dark:border-white/10 pb-4">
                <span className="text-[11px] text-neutral-600 dark:text-neutral-400 uppercase tracking-[0.2em] font-bold">
                  <ShinyText text="FINANCING BREAKDOWN" speed={3} />
                </span>

                <span className="px-3 py-0.5 rounded-full bg-black dark:bg-white text-white dark:text-black text-[11px] font-bold">
                  0% INTEREST WAIVED
                </span>
              </div>

              <div>
                <span className="text-xs text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">Calculated Monthly Installment</span>
                <div className="text-4xl sm:text-5xl font-serif-luxury font-medium text-neutral-950 dark:text-white mt-1.5 flex items-baseline gap-2">
                  <span className="font-bold text-black dark:text-white">
                    <CountUp
                      to={monthlyEmi}
                      prefix="₹"
                      duration={1.2}
                      className="font-mono"
                    />
                  </span>
                  <span className="text-xs text-neutral-500 dark:text-neutral-400 font-sans font-normal"> / month</span>
                </div>
                <div className="text-[11px] text-neutral-600 dark:text-neutral-400 mt-1 font-medium">
                  for {tenureMonths} Months via {selectedBank}
                </div>
              </div>

              <div className="space-y-3 border-t border-b border-neutral-200 dark:border-white/10 py-4 text-xs">
                <div className="flex justify-between text-neutral-600 dark:text-neutral-400">
                  <span>Selected Handset:</span>
                  <span className="text-neutral-950 dark:text-white font-semibold truncate max-w-[200px]">{selectedDeviceName}</span>
                </div>
                <div className="flex justify-between text-neutral-600 dark:text-neutral-400">
                  <span>Device MRP:</span>
                  <span className="text-neutral-950 dark:text-white font-mono font-medium">₹{selectedDevicePrice.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-neutral-600 dark:text-neutral-400">
                  <span>Initial Down Payment ({downPaymentPercent}%):</span>
                  <span className="text-neutral-950 dark:text-white font-mono font-medium">₹{downPaymentAmount.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-neutral-600 dark:text-neutral-400">
                  <span>Financed Principal:</span>
                  <span className="text-neutral-950 dark:text-white font-mono font-medium">₹{loanAmount.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-neutral-600 dark:text-neutral-400">
                  <span>Processing Fee:</span>
                  <span className="text-neutral-950 dark:text-white font-bold">₹0 (Waived)</span>
                </div>
                <div className="flex justify-between text-neutral-600 dark:text-neutral-400">
                  <span>Annual Interest Rate:</span>
                  <span className="text-neutral-950 dark:text-white font-bold">0.00% (Zero Surcharge)</span>
                </div>
              </div>

              {/* Action Buttons with React Bits ClickSpark */}
              <div className="space-y-3 pt-1">
                <ClickSpark sparkColor="#000000" sparkCount={12} className="w-full">
                  <MagneticButton
                    onClick={handleBuyNowFromEmi}
                    className="w-full py-4 rounded-2xl bg-black hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-200 text-white dark:text-black text-xs uppercase tracking-wider font-extrabold shadow-xl shadow-black/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <Zap size={15} className="text-white dark:text-black fill-current" />
                    <span>Buy on 0% EMI Now</span>
                  </MagneticButton>
                </ClickSpark>

                <ClickSpark sparkColor="#000000" sparkCount={8} className="w-full">
                  <MagneticButton
                    as="a"
                    href={`https://wa.me/919691011335?text=${encodeURIComponent(`Hi New Radhaswami Mobile Gallery, I would like to inquire about 0% EMI financing for ${selectedDeviceName} with ${selectedBank} (₹${monthlyEmi.toLocaleString('en-IN')}/mo for ${tenureMonths} months).`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3 rounded-2xl bg-neutral-100 hover:bg-neutral-200 dark:bg-white/10 dark:hover:bg-white/15 text-neutral-900 dark:text-white border border-neutral-300 dark:border-white/15 text-xs uppercase tracking-wider font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <MessageSquare size={14} className="text-neutral-700 dark:text-neutral-300" />
                    <span>Inquire via WhatsApp Desk</span>
                  </MagneticButton>
                </ClickSpark>
              </div>

              <div className="pt-2 flex items-center justify-center gap-2 text-[10px] text-neutral-500 dark:text-neutral-400">
                <ShieldCheck size={12} className="text-black dark:text-white" />
                <span>Zero documentation • Instant brand warranty & official GST invoice</span>
              </div>

            </SpotlightCard>
          </div>

        </div>

      </div>

    </section>
  );
};
