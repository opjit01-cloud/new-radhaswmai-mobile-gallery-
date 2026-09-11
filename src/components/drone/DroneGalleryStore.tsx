import React, { useState } from 'react';
import { ShoppingBag, Check, ShieldCheck, Sparkles } from 'lucide-react';

export interface HardwareProduct {
  id: string;
  name: string;
  badge: string;
  category: string;
  description: string;
  basePrice: number;
  image: string;
  specs: { [key: string]: string };
  colors: { name: string; hex: string }[];
  storageOptions: { label: string; priceMultiplier: number }[];
}

const PRODUCTS: HardwareProduct[] = [
  {
    id: 'prod-iphone-16-pro-max',
    name: 'iPhone 16 Pro Max',
    badge: 'Flagship Grade 5 Titanium',
    category: 'Mobile Flagship',
    description: 'A18 Pro chip, 48MP Fusion camera system, and integrated LiDAR Scanner for spatial 3D capture.',
    basePrice: 144900,
    image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?q=80&w=800&auto=format&fit=crop',
    specs: {
      Processor: 'Apple A18 Pro (3nm)',
      Display: '6.9" Super Retina XDR OLED 120Hz',
      Optics: '48MP Main + 5x Tetraprism Telephoto + LiDAR',
      Battery: 'Up to 33 hrs Video Playback',
    },
    colors: [
      { name: 'Desert Titanium', hex: '#C2B19F' },
      { name: 'Natural Titanium', hex: '#9E9992' },
      { name: 'White Titanium', hex: '#E3E4E5' },
      { name: 'Black Titanium', hex: '#3C3B3A' },
    ],
    storageOptions: [
      { label: '256GB', priceMultiplier: 1.0 },
      { label: '512GB', priceMultiplier: 1.14 },
      { label: '1TB', priceMultiplier: 1.28 },
    ],
  },
  {
    id: 'prod-galaxy-s25-ultra',
    name: 'Samsung Galaxy S25 Ultra',
    badge: 'Snapdragon 8 Elite • S-Pen',
    category: 'Mobile Flagship',
    description: 'Galaxy AI suite, Armor Aluminum frame, 200MP Quad Telephoto sensor, and integrated satellite connectivity.',
    basePrice: 129999,
    image: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?q=80&w=800&auto=format&fit=crop',
    specs: {
      Processor: 'Snapdragon 8 Elite for Galaxy',
      Display: '6.8" Dynamic AMOLED 2X 120Hz 2600 nits',
      Optics: '200MP OIS + 50MP 5x Periscope + 10MP 3x',
      Battery: '5000 mAh with 45W Fast Charging',
    },
    colors: [
      { name: 'Titanium Gray', hex: '#525458' },
      { name: 'Titanium Black', hex: '#2B2B2B' },
      { name: 'Titanium Violet', hex: '#4A4656' },
    ],
    storageOptions: [
      { label: '256GB', priceMultiplier: 1.0 },
      { label: '512GB', priceMultiplier: 1.12 },
      { label: '1TB', priceMultiplier: 1.25 },
    ],
  },
  {
    id: 'prod-pixel-9-pro-fold',
    name: 'Google Pixel 9 Pro Fold',
    badge: 'Dual OLED • Tensor G4',
    category: 'Foldable Flagship',
    description: 'Fluid aerospace hinge, Google Tensor G4, Gemini Live AI on-device, and triple telephoto camera suite.',
    basePrice: 172999,
    image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?q=80&w=800&auto=format&fit=crop',
    specs: {
      Processor: 'Google Tensor G4 + Titan M2',
      Display: '8.0" Super Actua Flex OLED (Internal) + 6.3" External',
      Optics: '48MP Wide + 10.8MP 5x Telephoto + 10.5MP Ultrawide',
      Battery: '4650 mAh with 24+ hr Battery Life',
    },
    colors: [
      { name: 'Obsidian', hex: '#1F2022' },
      { name: 'Porcelain', hex: '#E8E5DF' },
    ],
    storageOptions: [
      { label: '256GB', priceMultiplier: 1.0 },
      { label: '512GB', priceMultiplier: 1.13 },
    ],
  },
  {
    id: 'prod-dji-zenmuse-l2',
    name: 'DJI Zenmuse L2 + Inspire 3 Fleet',
    badge: '240K pts/s LiDAR Payload',
    category: 'Aerial LiDAR Station',
    description: 'Integrated LiDAR payload, 4/3 CMOS RGB mapping sensor, 5 simultaneous returns, and 3-axis stabilized gimbal.',
    basePrice: 899000,
    image: 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?q=80&w=800&auto=format&fit=crop',
    specs: {
      Payload: 'DJI Zenmuse L2 Frame-based LiDAR',
      Acquisition: '240,000 pts/sec at 450m range',
      Accuracy: 'Vertical: 4 cm, Horizontal: 5 cm',
      Gimbal: '3-axis stabilized mechanical gimbal',
    },
    colors: [
      { name: 'Stealth Carbon', hex: '#1A1D20' },
      { name: 'Aviation Matte Gray', hex: '#4B5358' },
    ],
    storageOptions: [
      { label: '512GB Enterprise SSD', priceMultiplier: 1.0 },
      { label: '1TB High-Speed SSD', priceMultiplier: 1.08 },
    ],
  },
];

interface DroneGalleryStoreProps {
  onAddToCart: (product: HardwareProduct, color: string, storage: string, price: number) => void;
}

export const DroneGalleryStore: React.FC<DroneGalleryStoreProps> = ({ onAddToCart }) => {
  const [selectedColors, setSelectedColors] = useState<{ [key: string]: string }>({
    'prod-iphone-16-pro-max': 'Desert Titanium',
    'prod-galaxy-s25-ultra': 'Titanium Gray',
    'prod-pixel-9-pro-fold': 'Obsidian',
    'prod-dji-zenmuse-l2': 'Stealth Carbon',
  });

  const [selectedStorage, setSelectedStorage] = useState<{ [key: string]: string }>({
    'prod-iphone-16-pro-max': '256GB',
    'prod-galaxy-s25-ultra': '256GB',
    'prod-pixel-9-pro-fold': '256GB',
    'prod-dji-zenmuse-l2': '512GB Enterprise SSD',
  });

  const [addedItem, setAddedItem] = useState<string | null>(null);

  const handleAdd = (prod: HardwareProduct) => {
    const color = selectedColors[prod.id] || prod.colors[0].name;
    const storage = selectedStorage[prod.id] || prod.storageOptions[0].label;
    const opt = prod.storageOptions.find((s) => s.label === storage);
    const finalPrice = Math.round(prod.basePrice * (opt?.priceMultiplier || 1));

    onAddToCart(prod, color, storage, finalPrice);
    setAddedItem(prod.id);
    setTimeout(() => setAddedItem(null), 2000);
  };

  return (
    <section id="gallery-store" className="bg-[#FDFDFD] px-6 py-28 border-t border-ink/24">
      {/* Top Header */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-end justify-between border-b border-ink/24 pb-12">
        <div>
          <span className="font-mono text-xs text-blue-600 uppercase tracking-widest block mb-2">
            // NEW RADHASWAMI MOBILE GALLERY
          </span>
          <h2 className="text-4xl sm:text-6xl font-light text-[#24363F] tracking-tight">
            Flagship Hardware Fleet
          </h2>
        </div>

        <div className="flex items-center gap-3 mt-4 md:mt-0">
          <span className="w-8 h-8 rounded-full border border-ink/24 flex items-center justify-center font-mono text-sm text-ink/64">
            7
          </span>
          <span className="font-mono text-xs text-ink/64 uppercase tracking-widest">
            // Authorized Official Inventory
          </span>
        </div>
      </div>

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 pt-12">
        {PRODUCTS.map((prod) => {
          const activeColor = selectedColors[prod.id] || prod.colors[0].name;
          const activeStorage = selectedStorage[prod.id] || prod.storageOptions[0].label;
          const opt = prod.storageOptions.find((s) => s.label === activeStorage);
          const computedPrice = Math.round(prod.basePrice * (opt?.priceMultiplier || 1));
          const monthlyEMI = Math.round(computedPrice / 12);

          return (
            <div
              key={prod.id}
              className="flex flex-col justify-between p-6 sm:p-8 rounded-lg border border-ink/24 bg-white hover:border-[#24363F] transition-all shadow-sm hover:shadow-md"
            >
              <div>
                {/* Header & Badge */}
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <span className="inline-block px-2.5 py-0.5 rounded-full bg-ink/8 text-ink/80 text-[11px] font-mono uppercase tracking-wider mb-2">
                      {prod.badge}
                    </span>
                    <h3 className="text-2xl font-light text-[#24363F] tracking-tight">
                      {prod.name}
                    </h3>
                  </div>

                  <div className="text-right">
                    <div className="text-2xl font-mono text-[#24363F] font-semibold">
                      ₹{computedPrice.toLocaleString('en-IN')}
                    </div>
                    <div className="text-[11px] font-mono text-ink/64">
                      or ₹{monthlyEMI.toLocaleString('en-IN')}/mo (0% EMI)
                    </div>
                  </div>
                </div>

                {/* Product Image */}
                <div className="relative aspect-[16/10] w-full rounded-md overflow-hidden my-6 bg-[#F8F9FA] border border-ink/12">
                  <img
                    src={prod.image}
                    alt={prod.name}
                    className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 px-2 py-0.5 rounded bg-black/60 backdrop-blur-sm text-white font-mono text-[10px] uppercase">
                    {prod.category}
                  </div>
                </div>

                <p className="text-sm text-ink/70 font-light leading-relaxed mb-6">
                  {prod.description}
                </p>

                {/* Technical Specs Pills */}
                <div className="grid grid-cols-2 gap-2 text-xs font-mono text-ink/80 border-t border-b border-ink/12 py-4 mb-6">
                  {Object.entries(prod.specs).map(([key, val]) => (
                    <div key={key}>
                      <span className="text-ink/48 block text-[10px] uppercase">{key}</span>
                      <span className="truncate block">{val}</span>
                    </div>
                  ))}
                </div>

                {/* Color Swatches */}
                <div className="mb-4">
                  <div className="text-xs font-mono text-ink/64 uppercase mb-2">
                    Finishes: <span className="text-ink font-semibold">{activeColor}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {prod.colors.map((c) => (
                      <button
                        key={c.name}
                        onClick={() =>
                          setSelectedColors((prev) => ({ ...prev, [prod.id]: c.name }))
                        }
                        title={c.name}
                        className={`w-6 h-6 rounded-full border-2 transition-transform cursor-pointer ${
                          activeColor === c.name
                            ? 'border-[#24363F] scale-110 shadow'
                            : 'border-transparent opacity-80 hover:opacity-100'
                        }`}
                        style={{ backgroundColor: c.hex }}
                      />
                    ))}
                  </div>
                </div>

                {/* Storage Picker */}
                <div className="mb-6">
                  <div className="text-xs font-mono text-ink/64 uppercase mb-2">
                    Storage / Memory Capacity:
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {prod.storageOptions.map((s) => (
                      <button
                        key={s.label}
                        onClick={() =>
                          setSelectedStorage((prev) => ({ ...prev, [prod.id]: s.label }))
                        }
                        className={`px-3 py-1.5 rounded text-xs font-mono transition-all cursor-pointer ${
                          activeStorage === s.label
                            ? 'bg-[#24363F] text-white font-semibold'
                            : 'bg-ink/8 text-ink/70 hover:bg-ink/12'
                        }`}
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={() => handleAdd(prod)}
                type="button"
                className={`w-full py-3.5 px-4 rounded text-xs font-mono uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  addedItem === prod.id
                    ? 'bg-emerald-600 text-white'
                    : 'bg-[#24363F] text-white hover:bg-black'
                }`}
              >
                {addedItem === prod.id ? (
                  <>
                    <Check size={16} />
                    <span>Added to Cart</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag size={16} />
                    <span>Add to Cart • Instant Dispatch</span>
                  </>
                )}
              </button>
            </div>
          );
        })}
      </div>

      {/* Assurance Bar */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 pt-16 border-t border-ink/12 mt-16 text-center md:text-left">
        <div className="flex items-center gap-3">
          <ShieldCheck size={20} className="text-blue-600 shrink-0" />
          <div>
            <div className="text-sm font-semibold text-[#24363F]">100% Brand Sealed & Genuine</div>
            <div className="text-xs font-mono text-ink/64">Direct official manufacturer warranty</div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Sparkles size={20} className="text-blue-600 shrink-0" />
          <div>
            <div className="text-sm font-semibold text-[#24363F]">0% No-Cost EMI Simulator</div>
            <div className="text-xs font-mono text-ink/64">Instant approval across HDFC, ICICI & Bajaj</div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <ShieldCheck size={20} className="text-blue-600 shrink-0" />
          <div>
            <div className="text-sm font-semibold text-[#24363F]">Express Insured Transit</div>
            <div className="text-xs font-mono text-ink/64">Secured courier with live GPS carrier tracking</div>
          </div>
        </div>
      </div>
    </section>
  );
};
