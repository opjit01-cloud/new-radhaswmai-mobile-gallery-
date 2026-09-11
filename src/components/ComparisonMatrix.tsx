import React, { useState } from 'react';
import { Sparkles, ArrowUpRight } from 'lucide-react';
import { Product, PRODUCTS } from '../data/products';
import { MagneticButton } from './common/MagneticButton';
import { Aurora } from './reactbits/Aurora';
import { Particles } from './reactbits/Particles';
import { DecryptedText } from './reactbits/DecryptedText';
import { ShinyText } from './reactbits/ShinyText';

interface ComparisonMatrixProps {
  onAddToCart?: (product: Product, selectedColor: string) => void;
  products?: Product[];
}

export const ComparisonMatrix: React.FC<ComparisonMatrixProps> = ({
  onAddToCart,
  products = PRODUCTS
}) => {
  const [highlightDiffs, setHighlightDiffs] = useState(false);

  // Focus on top 3 flagships
  const flagshipIds = ['iphone-16-pro-max', 'galaxy-s25-ultra', 'oneplus-13'];
  const compareItems = flagshipIds
    .map(id => products.find(p => p.id === id))
    .filter(Boolean) as Product[];

  const specRows = [
    {
      label: 'Processor Architecture',
      key: 'processor',
      iphone: 'Apple A18 Pro (3nm TSMC) • 6-Core GPU',
      samsung: 'Snapdragon 8 Elite for Galaxy (3nm)',
      oneplus: 'Snapdragon 8 Elite (3nm)',
      winner: 'Apple A18 Pro (Single-Core Benchmark)'
    },
    {
      label: 'Primary Camera Sensor',
      key: 'camera',
      iphone: '48MP Fusion (Quad-Pixel Sensor)',
      samsung: '200MP ISOCELL HP2 (f/1.7 OIS)',
      oneplus: '50MP Sony LYT-808 Hasselblad',
      winner: 'Samsung (200MP Resolution & Nightography)'
    },
    {
      label: 'Optical Telephoto Zoom',
      key: 'zoom',
      iphone: '5x Tetraprism Optical (120mm)',
      samsung: '5x Periscope Optical + 100x Space Zoom',
      oneplus: '3x Periscope Optical (73mm)',
      winner: 'Samsung (100x Space Zoom Range)'
    },
    {
      label: 'Display & Peak Luminance',
      key: 'display',
      iphone: '6.9" Super Retina XDR OLED (2000 nits)',
      samsung: '6.8" Dynamic AMOLED 2X (2600 nits)',
      oneplus: '6.82" 2K Oriental OLED (4500 nits)',
      winner: 'OnePlus (4500 nits Peak Luminance)'
    },
    {
      label: 'Battery & Rapid Energy',
      key: 'battery',
      iphone: 'Up to 33h Video • 25W MagSafe Wireless',
      samsung: '5000mAh • 45W Wired + 15W Wireless',
      oneplus: '6000mAh Glacier • 100W SuperVOOC (36 min full)',
      winner: 'OnePlus (100W SuperVOOC)'
    },
    {
      label: 'Chassis & Aerospace Construction',
      key: 'build',
      iphone: 'Grade 5 Titanium + Ceramic Shield',
      samsung: 'Titanium Frame + Gorilla Armor Glass',
      oneplus: 'Middle Aluminum Frame + Ceramic Glass',
      winner: 'Apple & Samsung (Full Titanium Enclosure)'
    },
    {
      label: 'Spatial 3D & LiDAR Integration',
      key: 'lidar',
      iphone: 'Integrated LiDAR Sensor for Spatial Video',
      samsung: 'DepthVision Sensor Suite',
      oneplus: 'Hasselblad Multi-Spectrum Color Sensor',
      winner: 'Apple (Native Spatial Photogrammetry)'
    }
  ];

  return (
    <section id="compare" className="py-24 sm:py-32 px-4 sm:px-6 bg-[#FAFAFB] dark:bg-[#07080A] text-[#0A0B0E] dark:text-[#F8FAFC] border-t border-black/[0.08] dark:border-white/10 relative overflow-hidden transition-colors duration-300">
      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6 border-b border-black/[0.08] dark:border-white/10 pb-8">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono tracking-widest font-bold px-2 py-0.5 rounded bg-black dark:bg-white text-white dark:text-black">
                SALON 05
              </span>
              <DecryptedText
                text="FLAGSHIP SPECIFICATION MATRIX • HEAD-TO-HEAD SHOWDOWN"
                speed={26}
                maxIterations={10}
                className="text-[10.5px] uppercase tracking-[0.2em] text-neutral-500 dark:text-neutral-400 font-bold"
              />
            </div>
            <h2 className="text-3xl sm:text-5xl font-serif-luxury font-normal text-neutral-950 dark:text-white tracking-tight">
              Compare <span className="font-semibold text-black dark:text-white"><ShinyText text="Flagship Phones" speed={3.5} /></span>
            </h2>
            <p className="text-neutral-600 dark:text-neutral-400 font-light mt-2 max-w-2xl text-sm sm:text-base leading-relaxed">
              Side-by-side technical matrix of processor architecture, camera optics, zoom ranges, peak luminance, and fast-charging technologies.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <MagneticButton
              onClick={() => setHighlightDiffs(!highlightDiffs)}
              className={`px-4 py-2 rounded-full text-xs flex items-center gap-2 border transition-all cursor-pointer ${
                highlightDiffs
                  ? 'bg-black dark:bg-white text-white dark:text-black border-black dark:border-white shadow-md'
                  : 'bg-neutral-100 dark:bg-white/10 text-neutral-700 dark:text-neutral-300 border-neutral-300 dark:border-white/15 hover:text-black dark:hover:text-white'
              }`}
            >
              <Sparkles className={`w-3.5 h-3.5 ${highlightDiffs ? 'text-white dark:text-black' : 'text-black dark:text-white'}`} />
              <span>{highlightDiffs ? 'Highlight Edge Specs: ON' : 'Highlight Edge Specs: OFF'}</span>
            </MagneticButton>
          </div>
        </div>

        {/* Comparison Table Container */}
        <div className="overflow-x-auto rounded-3xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-[#0F1117] shadow-xl">
          <table className="w-full text-left border-collapse min-w-[720px]">
            <thead>
              <tr className="border-b border-neutral-200 dark:border-white/10 bg-neutral-50 dark:bg-white/[0.04]">
                <th className="p-6 text-xs text-neutral-500 dark:text-neutral-400 uppercase tracking-wider w-1/4 font-bold">Specification</th>
                
                {compareItems.map(item => (
                  <th key={item.id} className="p-6 w-1/4">
                    <div className="flex items-center gap-3.5">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-12 h-12 object-cover rounded-2xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-[#0B0E14] shadow-xs"
                      />
                      <div>
                        <div className="text-[10px] uppercase tracking-widest text-neutral-500 dark:text-neutral-400 font-bold">{item.brand}</div>
                        <div className="text-sm font-serif-luxury font-bold text-neutral-950 dark:text-white leading-snug">{item.name}</div>
                        <div className="text-xs font-bold text-black dark:text-white mt-0.5 font-mono">
                          ₹{item.price.toLocaleString('en-IN')}
                        </div>
                      </div>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-neutral-200 dark:divide-white/10 text-xs sm:text-sm">

              {specRows.map((row, idx) => (
                <tr 
                  key={row.key} 
                  className={`transition-colors ${
                    highlightDiffs && idx % 2 === 0 ? 'bg-neutral-50 dark:bg-white/[0.03]' : 'hover:bg-neutral-50/50 dark:hover:bg-white/[0.02]'
                  }`}
                >
                  <td className="p-5 font-semibold text-neutral-950 dark:text-white bg-neutral-50/70 dark:bg-white/[0.02] border-r border-neutral-200 dark:border-white/10">
                    <div>{row.label}</div>
                    {highlightDiffs && (
                      <div className="text-[10px] text-neutral-900 dark:text-neutral-200 mt-1 font-bold flex items-center gap-1">
                        <Sparkles size={10} className="text-black dark:text-white" />
                        <span>Edge: {row.winner}</span>
                      </div>
                    )}
                  </td>
                  
                  <td className="p-5 text-neutral-700 dark:text-neutral-300">
                    <div className="font-normal">{row.iphone}</div>
                  </td>

                  <td className="p-5 text-neutral-700 dark:text-neutral-300">
                    <div className="font-normal">{row.samsung}</div>
                  </td>

                  <td className="p-5 text-neutral-700 dark:text-neutral-300">
                    <div className="font-normal">{row.oneplus}</div>
                  </td>
                </tr>
              ))}

              {/* Action Row */}
              {onAddToCart && (
                <tr className="bg-neutral-50 dark:bg-white/[0.03] border-t border-neutral-200 dark:border-white/10">
                  <td className="p-6 font-semibold text-neutral-500 dark:text-neutral-400 text-xs uppercase tracking-wider">Fast Acquisition</td>
                  {compareItems.map(item => (
                    <td key={item.id} className="p-6">
                      <MagneticButton
                        onClick={() => onAddToCart(item, item.colors[0]?.name || 'Standard')}
                        className="w-full py-3 px-4 rounded-xl bg-black hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-200 text-white dark:text-black text-xs font-extrabold uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-lg shadow-black/15 transition-all cursor-pointer"
                      >
                        <span>Select {item.brand}</span>
                        <ArrowUpRight className="w-3.5 h-3.5 text-white dark:text-black" />
                      </MagneticButton>
                    </td>
                  ))}
                </tr>
              )}
            </tbody>
          </table>
        </div>

      </div>
    </section>
  );
};
