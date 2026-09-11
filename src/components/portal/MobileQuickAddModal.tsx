import React, { useState, useRef } from 'react';
import { 
  X, 
  Camera, 
  ImageIcon, 
  Save, 
  Check, 
  Sparkles, 
  Smartphone, 
  DollarSign, 
  HardDrive, 
  Palette, 
  Trash2, 
  Upload,
  RefreshCw,
  Plus,
  Zap,
  Sliders
} from 'lucide-react';
import { Product } from '../../data/products';
import { compressMobileImage, saveProduct } from '../../services/cloudSync';

interface MobileQuickAddModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProductSaved: (product: Product) => void;
  initialProduct?: Product | null;
}

// Popular Showroom Flagship Handset Presets (1-Tap Autofill)
const POPULAR_PRESETS = [
  {
    label: 'iPhone 16 Pro Max',
    icon: '🍏',
    name: 'iPhone 16 Pro Max',
    brand: 'Apple',
    category: 'smartphones',
    price: 144900,
    originalPrice: 159900,
    image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=800&q=80',
    colors: [
      { name: 'Desert Titanium', hex: '#C2A387', inStock: true },
      { name: 'Natural Titanium', hex: '#9E9B94', inStock: true },
      { name: 'White Titanium', hex: '#E3E4E5', inStock: true },
      { name: 'Black Titanium', hex: '#3B3B3D', inStock: true }
    ],
    storages: [
      { size: '256GB', price: 144900 },
      { size: '512GB', price: 164900 },
      { size: '1TB', price: 184900 }
    ],
    tag: 'Flagship of 2026',
    badge: 'Best Seller',
    description: 'Forged in Grade 5 titanium with A18 Pro silicon, revolutionary Camera Control button, and unmatched battery endurance.'
  },
  {
    label: 'iPhone 16 Pro',
    icon: '🍏',
    name: 'iPhone 16 Pro',
    brand: 'Apple',
    category: 'smartphones',
    price: 119900,
    originalPrice: 129900,
    image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=800&q=80',
    colors: [
      { name: 'Desert Titanium', hex: '#C2A387', inStock: true },
      { name: 'Natural Titanium', hex: '#9E9B94', inStock: true },
      { name: 'White Titanium', hex: '#E3E4E5', inStock: true },
      { name: 'Black Titanium', hex: '#3B3B3D', inStock: true }
    ],
    storages: [
      { size: '128GB', price: 119900 },
      { size: '256GB', price: 129900 },
      { size: '512GB', price: 149900 }
    ],
    tag: 'Pro Studio Compact',
    badge: 'Fast Mover',
    description: 'Pro performance in a 6.3-inch titanium chassis with 5x telephoto optical zoom.'
  },
  {
    label: 'iPhone 16',
    icon: '🍏',
    name: 'iPhone 16',
    brand: 'Apple',
    category: 'smartphones',
    price: 79900,
    originalPrice: 89900,
    image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=800&q=80',
    colors: [
      { name: 'Ultramarine', hex: '#2F4E75', inStock: true },
      { name: 'Teal', hex: '#3A6B6B', inStock: true },
      { name: 'Pink', hex: '#DCA2A9', inStock: true },
      { name: 'Black', hex: '#242527', inStock: true }
    ],
    storages: [
      { size: '128GB', price: 79900 },
      { size: '256GB', price: 89900 },
      { size: '512GB', price: 109900 }
    ],
    tag: 'Color Infused Glass',
    badge: 'Popular',
    description: 'Equipped with A18 chip, Action button, 48MP Fusion 2-in-1 camera, and vibrant new color finishes.'
  },
  {
    label: 'Galaxy S25 Ultra',
    icon: '📱',
    name: 'Samsung Galaxy S25 Ultra 5G',
    brand: 'Samsung',
    category: 'smartphones',
    price: 129999,
    originalPrice: 141999,
    image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=800&q=80',
    colors: [
      { name: 'Titanium Silver', hex: '#C5C6C8', inStock: true },
      { name: 'Titanium Black', hex: '#212121', inStock: true },
      { name: 'Titanium Blue', hex: '#3E546B', inStock: true }
    ],
    storages: [
      { size: '256GB', price: 129999 },
      { size: '512GB', price: 141999 },
      { size: '1TB', price: 165999 }
    ],
    tag: 'Galaxy AI Flagship',
    badge: 'Best Camera',
    description: '200MP sensor, Snapdragon 8 Elite, embedded S-Pen stylus, and flat titanium frame.'
  },
  {
    label: 'OnePlus 13',
    icon: '🔴',
    name: 'OnePlus 13 5G',
    brand: 'OnePlus',
    category: 'smartphones',
    price: 69999,
    originalPrice: 76999,
    image: 'https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&w=800&q=80',
    colors: [
      { name: 'Midnight Ocean', hex: '#1F2A38', inStock: true },
      { name: 'Black Eclipse', hex: '#1C1C1E', inStock: true },
      { name: 'Arctic Dawn', hex: '#F0F3F5', inStock: true }
    ],
    storages: [
      { size: '256GB', price: 69999 },
      { size: '512GB', price: 76999 }
    ],
    tag: 'Speed & Hasselblad',
    badge: 'Value Flagship',
    description: 'Snapdragon 8 Elite, 6000mAh silicon-carbon battery, and 100W SUPERVOOC charging.'
  },
  {
    label: 'Pixel 9 Pro',
    icon: '🔵',
    name: 'Google Pixel 9 Pro 5G',
    brand: 'Google',
    category: 'smartphones',
    price: 109999,
    originalPrice: 119999,
    image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=800&q=80',
    colors: [
      { name: 'Obsidian', hex: '#2A2C2E', inStock: true },
      { name: 'Porcelain', hex: '#F2EFE9', inStock: true },
      { name: 'Hazel', hex: '#83877E', inStock: true }
    ],
    storages: [
      { size: '128GB', price: 109999 },
      { size: '256GB', price: 119999 },
      { size: '512GB', price: 134999 }
    ],
    tag: 'Pure Google AI',
    badge: 'Pro Optics',
    description: 'Tensor G4 silicon, Super Res Zoom up to 30x, and 7 years of official Android updates.'
  },
  {
    label: 'AirPods Pro 2',
    icon: '🎧',
    name: 'Apple AirPods Pro (2nd Gen USB-C)',
    brand: 'Apple',
    category: 'audio',
    price: 24900,
    originalPrice: 26900,
    image: 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?auto=format&fit=crop&w=800&q=80',
    colors: [{ name: 'White', hex: '#FFFFFF', inStock: true }],
    storages: [{ size: 'Standard', price: 24900 }],
    tag: 'Active Noise Cancelling',
    badge: 'Best Audio',
    description: 'H2 chip with 2x Active Noise Cancellation, Adaptive Audio, and MagSafe USB-C Case.'
  },
  {
    label: 'Apple 20W Charger',
    icon: '⚡',
    name: 'Apple 20W USB-C Power Adapter',
    brand: 'Apple',
    category: 'chargers',
    price: 1900,
    originalPrice: 2100,
    image: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=800&q=80',
    colors: [{ name: 'White', hex: '#FFFFFF', inStock: true }],
    storages: [{ size: '20W', price: 1900 }],
    tag: 'Fast Charging',
    badge: 'Essential',
    description: 'Official Apple fast charger for all iPhone 16, 15, and iPad models.'
  }
];

const BRAND_OPTIONS = ['Apple', 'Samsung', 'OnePlus', 'Google', 'Vivo', 'Xiaomi', 'Sony', 'Other'];

export const COLOR_PRESETS = [
  { name: 'Black Titanium', hex: '#1D1D1F' },
  { name: 'Natural Titanium', hex: '#9E9EA0' },
  { name: 'White Titanium', hex: '#F5F5F7' },
  { name: 'Desert Titanium', hex: '#C5A880' },
  { name: 'Deep Midnight', hex: '#1E293B' },
  { name: 'Alpine Green', hex: '#2D4A3E' },
  { name: 'Rose Gold', hex: '#E2A9A9' },
  { name: 'Cosmic Orange', hex: '#C25E2E' }
];

export const MobileQuickAddModal: React.FC<MobileQuickAddModalProps> = ({
  isOpen,
  onClose,
  onProductSaved,
  initialProduct = null
}) => {
  if (!isOpen) return null;

  // View Mode: 'express' (Fast 30-second mobile add) vs 'pro' (Full granular details)
  const [viewMode, setViewMode] = useState<'express' | 'pro'>('express');

  // Core fields
  const [name, setName] = useState(initialProduct?.name || '');
  const [brand, setBrand] = useState(initialProduct?.brand || 'Apple');
  const [customBrand, setCustomBrand] = useState('');
  const [category, setCategory] = useState<any>(initialProduct?.category || 'smartphones');
  const [price, setPrice] = useState<number | string>(initialProduct?.price || 144900);
  const [originalPrice, setOriginalPrice] = useState<number | string>(initialProduct?.originalPrice || 159900);
  const [inStock, setInStock] = useState(initialProduct ? initialProduct.inStock !== false : true);
  const [images, setImages] = useState<string[]>(initialProduct?.images || (initialProduct?.image ? [initialProduct.image] : []));
  const [colors, setColors] = useState<any[]>(
    initialProduct?.colors || [
      { name: 'Titanium Black', hex: '#212121', inStock: true },
      { name: 'Natural Silver', hex: '#E5E5E5', inStock: true }
    ]
  );
  const [showCustomColor, setShowCustomColor] = useState(false);
  const [customColorName, setCustomColorName] = useState('');
  const [customColorHex, setCustomColorHex] = useState('#C5A880');
  const [customColorInStock, setCustomColorInStock] = useState(true);

  const [storages, setStorages] = useState<any[]>(
    initialProduct?.storageVariants || [
      { size: '256GB', price: 144900 },
      { size: '512GB', price: 164900 }
    ]
  );
  const [showCustomStorage, setShowCustomStorage] = useState(false);
  const [customStorageInput, setCustomStorageInput] = useState('');
  const [customStoragePriceInput, setCustomStoragePriceInput] = useState('');
  const [warranty, setWarranty] = useState(
    initialProduct?.specs?.['Warranty'] || '1 Year Official Brand Manufacturer Warranty'
  );
  const [description, setDescription] = useState(
    initialProduct?.description || '100% Sealed Indian Retail Stock with Genuine Brand GST Invoice.'
  );

  const [isProcessingImage, setIsProcessingImage] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const cameraInputRef = useRef<HTMLInputElement | null>(null);
  const galleryInputRef = useRef<HTMLInputElement | null>(null);

  // Apply a 1-tap Flagship Preset
  const handleApplyPreset = (preset: typeof POPULAR_PRESETS[0]) => {
    setName(preset.name);
    setBrand(preset.brand);
    setCategory(preset.category);
    setPrice(preset.price);
    setOriginalPrice(preset.originalPrice);
    setImages([preset.image]);
    setColors(preset.colors);
    setStorages(preset.storages);
    setDescription(preset.description);
    setStatusMessage(`Applied preset: ${preset.name}`);
    setTimeout(() => setStatusMessage(null), 3000);
  };

  // Image Upload with Instant Compression (Camera or Gallery)
  const handleImageFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsProcessingImage(true);
    setStatusMessage(`Compressing ${files.length} photo(s)...`);

    try {
      for (let i = 0; i < files.length; i++) {
        const compressedBase64 = await compressMobileImage(files[i], 540, 0.65);
        if (compressedBase64) {
          setImages(prev => [compressedBase64, ...prev]);
        }
      }
      setStatusMessage('Photos attached successfully!');
      setTimeout(() => setStatusMessage(null), 2500);
    } catch (err) {
      console.error('Image compression error:', err);
    } finally {
      setIsProcessingImage(false);
      if (e.target) e.target.value = '';
    }
  };

  // Quick Price Adjustments
  const adjustPrice = (amount: number) => {
    const current = Number(price) || 0;
    const next = Math.max(0, current + amount);
    setPrice(next);
  };

  const applyPercentDiscount = (percent: number) => {
    const orig = Number(originalPrice) || Number(price) || 0;
    if (orig > 0) {
      const discountVal = Math.round(orig * (1 - percent / 100));
      setPrice(discountVal);
    }
  };

  // Storage pill toggler
  const toggleStorageTier = (tier: string) => {
    const exists = storages.some(s => s.size === tier);
    if (exists) {
      if (storages.length > 1) {
        setStorages(storages.filter(s => s.size !== tier));
      }
    } else {
      const base = Number(price) || 99900;
      let multiplier = 1.0;
      if (tier === '32GB') multiplier = 0.75;
      if (tier === '64GB') multiplier = 0.88;
      if (tier === '68GB') multiplier = 0.90;
      if (tier === '128GB') multiplier = 1.0;
      if (tier === '256GB') multiplier = 1.12;
      if (tier === '512GB') multiplier = 1.25;
      if (tier === '1TB') multiplier = 1.45;
      setStorages([...storages, { size: tier, price: Math.round(base * multiplier) }]);
    }
  };

  const handleAddCustomStorageTier = () => {
    const trimmed = customStorageInput.trim();
    if (!trimmed) return;
    const p = Number(customStoragePriceInput) || Number(price) || 99900;
    if (!storages.some(s => s.size.toLowerCase() === trimmed.toLowerCase())) {
      setStorages([...storages, { size: trimmed, price: p }]);
    }
    setCustomStorageInput('');
    setCustomStoragePriceInput('');
    setShowCustomStorage(false);
  };

  const handleAddCustomColor = () => {
    const trimmed = customColorName.trim();
    if (!trimmed) {
      alert('Please enter a color finish name (e.g. Desert Titanium, Cosmic Orange)');
      return;
    }
    const newColor = {
      name: trimmed,
      hex: customColorHex || '#888888',
      inStock: customColorInStock
    };
    setColors(prev => [...prev, newColor]);
    setCustomColorName('');
    setShowCustomColor(false);
  };

  // Save product to Universal Cloud Sync (Reliable cross-device publish)
  const handleSave = async (e?: React.FormEvent | React.MouseEvent) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!name.trim()) {
      setStatusMessage('⚠️ Please enter handset name or select a preset template.');
      alert('Please enter product name or select a preset template.');
      return;
    }

    setIsSaving(true);
    setStatusMessage('Broadcasting live to store across all devices...');

    const finalBrand = brand === 'Other' && customBrand.trim() ? customBrand.trim() : brand;
    const finalPrice = Number(price) || 99900;
    const finalOriginalPrice = Number(originalPrice) || Math.round(finalPrice * 1.12);

    const fallbackImg = category === 'audio' 
      ? 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?auto=format&fit=crop&w=800&q=80'
      : category === 'chargers'
      ? 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=800&q=80'
      : 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=800&q=80';

    const productPayload: Partial<Product> = {
      name: name.trim(),
      brand: finalBrand,
      category,
      price: finalPrice,
      originalPrice: finalOriginalPrice,
      image: images[0] || fallbackImg,
      images: images.length > 0 ? images : [fallbackImg],
      inStock,
      colors: colors.length > 0 ? colors : [{ name: 'Default Finish', hex: '#888888', inStock: true }],
      storageVariants: storages.length > 0 ? storages : [{ size: '256GB', price: finalPrice }],
      specs: {
        'Warranty': warranty,
        'Packaging': '100% Sealed Indian Retail Stock with Genuine Brand Invoice'
      },
      description,
      tag: 'Verified Showroom Inventory',
      badge: inStock ? 'In Stock' : 'Out of Stock'
    };

    try {
      const result = await saveProduct(productPayload, initialProduct?.id);
      setIsSaving(false);
      const savedProd = result.products.find(p => p.name === productPayload.name) || (productPayload as Product);
      onProductSaved(savedProd);
      onClose();
    } catch (err: any) {
      console.error('Save product error:', err);
      setIsSaving(false);
      alert('Handset published locally. Cloud will sync in background.');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-black/60 dark:bg-black/85 backdrop-blur-md p-0 sm:p-4 select-none font-sans overflow-hidden animate-fade-in">
      
      {/* Hidden file inputs for Camera and Gallery */}
      <input 
        ref={cameraInputRef}
        type="file" 
        accept="image/*" 
        capture="environment"
        onChange={handleImageFile}
        className="hidden" 
      />
      <input 
        ref={galleryInputRef}
        type="file" 
        multiple
        accept="image/*" 
        onChange={handleImageFile}
        className="hidden" 
      />

      <div className="w-full sm:max-w-2xl max-h-[92vh] sm:max-h-[88vh] bg-white dark:bg-[#0C0F17] border border-neutral-200 dark:border-white/15 sm:rounded-3xl rounded-t-3xl flex flex-col shadow-2xl overflow-hidden text-neutral-900 dark:text-white relative animate-sheet-up transition-colors duration-200">
        
        {/* Modal Top Header */}
        <div className="px-4 sm:px-6 py-3.5 border-b border-neutral-200 dark:border-white/10 flex items-center justify-between bg-neutral-50 dark:bg-[#121622]/90 backdrop-blur-md shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-black flex items-center justify-center font-bold shadow-xs">
              <Zap size={16} />
            </div>
            <div>
              <h2 className="text-sm font-bold text-neutral-900 dark:text-white tracking-wide flex items-center gap-1.5">
                <span>{initialProduct ? 'Edit Handset' : 'Quick Add Handset'}</span>
                <span className="px-1.5 py-0.2 rounded text-[9px] bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 font-mono">
                  Cloud Live
                </span>
              </h2>
              <p className="text-[10px] text-neutral-500 dark:text-neutral-400">
                1-Tap Presets • Instant Cross-Device Sync
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* View Mode Toggle */}
            <div className="bg-neutral-200/70 dark:bg-black/60 p-0.5 rounded-xl border border-neutral-300 dark:border-white/15 flex items-center text-[10px]">
              <button
                type="button"
                onClick={() => setViewMode('express')}
                className={`px-2.5 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                  viewMode === 'express' ? 'bg-white dark:bg-white text-black font-bold shadow-xs' : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
                }`}
              >
                Express
              </button>
              <button
                type="button"
                onClick={() => setViewMode('pro')}
                className={`px-2.5 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                  viewMode === 'pro' ? 'bg-white dark:bg-white text-black font-bold shadow-xs' : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
                }`}
              >
                Detailed
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-full bg-neutral-100 hover:bg-neutral-200 dark:bg-white/5 dark:hover:bg-white/15 text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-all cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Status Toast Banner */}
        {statusMessage && (
          <div className="bg-white/10 px-4 py-2 border-b border-white/10 text-xs text-white flex items-center gap-2 font-mono shrink-0 animate-pulse">
            <RefreshCw size={13} className="animate-spin text-emerald-400" />
            <span>{statusMessage}</span>
          </div>
        )}

        {/* Scrollable Form Body */}
        <form id="mobile-quick-add-form" onSubmit={handleSave} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 text-xs [scrollbar-width:thin]">
          
          {/* 1. HORIZONTAL 1-TAP FLAGSHIP PRESETS BAR */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider flex items-center gap-1">
                <Sparkles size={12} className="text-amber-400" />
                <span>1-Tap Flagship Templates (Auto-Fill)</span>
              </span>
              <span className="text-[9px] text-neutral-500">Tap any card to auto-fill</span>
            </div>
            
            <div className="flex items-center gap-2 overflow-x-auto pb-2 [scrollbar-width:none] no-scrollbar">
              {POPULAR_PRESETS.map((p, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleApplyPreset(p)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-[#141A29] hover:bg-white hover:text-black border border-white/15 text-white transition-all cursor-pointer shrink-0 text-left active:scale-95 shadow-sm group"
                >
                  <span className="text-sm">{p.icon}</span>
                  <div>
                    <div className="text-xs font-bold leading-tight group-hover:text-black">{p.label}</div>
                    <div className="text-[10px] text-neutral-400 group-hover:text-neutral-700 font-mono">₹{p.price.toLocaleString('en-IN')}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* 2. BRAND SELECTOR CHIPS */}
          <div className="space-y-1.5">
            <label className="block text-[11px] font-bold text-neutral-300 uppercase tracking-wider">Manufacturer Brand</label>
            <div className="flex flex-wrap gap-1.5">
              {BRAND_OPTIONS.map((b) => (
                <button
                  key={b}
                  type="button"
                  onClick={() => setBrand(b)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    brand === b 
                      ? 'bg-white text-black font-bold shadow-md' 
                      : 'bg-white/5 hover:bg-white/10 text-neutral-300 border border-white/10'
                  }`}
                >
                  {b}
                </button>
              ))}
            </div>
            {brand === 'Other' && (
              <input 
                type="text"
                placeholder="Enter Brand Name"
                value={customBrand}
                onChange={(e) => setCustomBrand(e.target.value)}
                className="w-full mt-2 px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/20 text-white text-base outline-none focus:border-white"
              />
            )}
          </div>

          {/* 3. PRODUCT NAME */}
          <div className="space-y-1">
            <label className="block text-[11px] font-bold text-neutral-300 uppercase tracking-wider">Model Name *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. iPhone 16 Pro Max 256GB"
              className="w-full px-4 py-3 rounded-2xl bg-black/60 border border-white/15 text-white text-base outline-none focus:border-white focus:ring-1 focus:ring-white/20 transition-all font-medium"
            />
          </div>

          {/* 4. COMMERCIAL PRICING (LARGE TOUCHPAD INPUT) */}
          <div className="p-3.5 rounded-2xl bg-[#141A29] border border-white/10 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-neutral-300 uppercase tracking-wider flex items-center gap-1">
                <DollarSign size={13} className="text-emerald-400" />
                <span>Selling Price (₹ INR) *</span>
              </span>
              <span className="text-[10px] text-neutral-400 font-mono">
                MRP: ₹{Number(originalPrice || price).toLocaleString('en-IN')}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 font-mono text-base font-bold">₹</span>
                <input
                  type="number"
                  required
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="144900"
                  className="w-full pl-8 pr-4 py-2.5 rounded-xl bg-black/80 border border-white/20 text-white font-mono text-base font-bold outline-none focus:border-emerald-400 transition-all"
                />
              </div>

              {/* Stock Status Toggle Right in Commercials */}
              <button
                type="button"
                onClick={() => setInStock(!inStock)}
                className={`px-4 py-2.5 rounded-xl border flex items-center gap-1.5 font-bold text-xs transition-all cursor-pointer shrink-0 ${
                  inStock
                    ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400'
                    : 'bg-red-500/20 border-red-500/50 text-red-400'
                }`}
              >
                {inStock ? <Check size={14} /> : <X size={14} />}
                <span>{inStock ? 'In Stock' : 'Out of Stock'}</span>
              </button>
            </div>

            {/* Quick Price Adjustment Chips */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              <button
                type="button"
                onClick={() => adjustPrice(-1000)}
                className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-[10px] text-neutral-300 font-mono cursor-pointer"
              >
                -₹1,000
              </button>
              <button
                type="button"
                onClick={() => adjustPrice(1000)}
                className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-[10px] text-neutral-300 font-mono cursor-pointer"
              >
                +₹1,000
              </button>
              <button
                type="button"
                onClick={() => applyPercentDiscount(5)}
                className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-[10px] text-neutral-300 font-mono cursor-pointer"
              >
                -5% Discount
              </button>
              <button
                type="button"
                onClick={() => applyPercentDiscount(10)}
                className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-[10px] text-neutral-300 font-mono cursor-pointer"
              >
                -10% Discount
              </button>
            </div>
          </div>

          {/* 5. MOBILE CAMERA SNAP & GALLERY PICKER (ZERO-CRASH AUTO-COMPRESSION) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-bold text-neutral-300 uppercase tracking-wider flex items-center gap-1.5">
                <ImageIcon size={13} className="text-white" />
                <span>Handset Photos ({images.length})</span>
              </label>
              {isProcessingImage && (
                <span className="text-[10px] text-emerald-400 font-mono animate-pulse">Auto-compressing to WebP...</span>
              )}
            </div>

            {/* Big Touch Action Buttons for Mobile Phone */}
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => cameraInputRef.current?.click()}
                disabled={isProcessingImage}
                className="py-3 px-4 rounded-2xl bg-white text-black font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md active:scale-95 text-xs hover:bg-neutral-200"
              >
                <Camera size={16} />
                <span>Take Photo</span>
              </button>

              <button
                type="button"
                onClick={() => galleryInputRef.current?.click()}
                disabled={isProcessingImage}
                className="py-3 px-4 rounded-2xl bg-[#141A29] hover:bg-white/10 border border-white/20 text-white font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-95 text-xs"
              >
                <Upload size={16} />
                <span>Photo Gallery</span>
              </button>
            </div>

            {/* Thumbnails preview */}
            {images.length > 0 && (
              <div className="flex items-center gap-2 overflow-x-auto pt-1 pb-2 [scrollbar-width:none]">
                {images.map((imgUrl, idx) => (
                  <div key={idx} className="relative rounded-2xl overflow-hidden border border-white/20 bg-black/60 w-20 h-20 shrink-0 shadow-md">
                    <img src={imgUrl} alt="phone" className="w-full h-full object-cover" />
                    {idx === 0 && (
                      <span className="absolute bottom-1 left-1 px-1.5 py-0.2 rounded bg-white text-black text-[8px] font-bold">
                        Cover
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => setImages(images.filter((_, i) => i !== idx))}
                      className="absolute top-1 right-1 p-1 rounded-full bg-black/80 text-white hover:bg-red-600 transition-colors cursor-pointer"
                    >
                      <Trash2 size={10} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 6. STORAGE TIERS & CUSTOM SIZES */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-bold text-neutral-800 dark:text-neutral-300 uppercase tracking-wider flex items-center gap-1.5">
                <HardDrive size={13} className="text-neutral-900 dark:text-white" />
                <span>Storage Options ({storages.length} configured)</span>
              </label>
              <button
                type="button"
                onClick={() => setShowCustomStorage(!showCustomStorage)}
                className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20"
              >
                <Plus size={12} />
                <span>+ Custom (e.g. 68GB)</span>
              </button>
            </div>
            
            {/* Quick 1-Tap Chips */}
            <div className="flex flex-wrap gap-1.5">
              {['32GB', '64GB', '68GB', '128GB', '256GB', '512GB', '1TB'].map((tier) => {
                const isSelected = storages.some(s => s.size === tier);
                return (
                  <button
                    key={tier}
                    type="button"
                    onClick={() => toggleStorageTier(tier)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-neutral-900 text-white dark:bg-white dark:text-black shadow-md ring-1 ring-neutral-900 dark:ring-white'
                        : 'bg-neutral-100 text-neutral-700 dark:bg-white/5 dark:text-neutral-400 border border-neutral-200 dark:border-white/10 hover:border-neutral-400 dark:hover:border-white/20'
                    }`}
                  >
                    {tier} {isSelected && '✓'}
                  </button>
                );
              })}
            </div>

            {/* Inline Custom Storage Creator */}
            {showCustomStorage && (
              <div className="p-3 rounded-2xl bg-neutral-100 dark:bg-black/70 border border-emerald-500/40 space-y-2 animate-tab-in">
                <div className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
                  <HardDrive size={12} />
                  <span>Add Custom Storage or RAM Spec</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] uppercase font-bold text-neutral-500 dark:text-neutral-400 block mb-1">
                      Capacity Label (e.g. 68GB, 6GB/68GB)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 68GB"
                      value={customStorageInput}
                      onChange={(e) => setCustomStorageInput(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-white dark:bg-black/60 border border-neutral-300 dark:border-white/20 text-neutral-900 dark:text-white text-base outline-none focus:border-emerald-500 font-mono font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-bold text-neutral-500 dark:text-neutral-400 block mb-1">
                      Price for this variant (₹ INR)
                    </label>
                    <input
                      type="number"
                      placeholder={String(price)}
                      value={customStoragePriceInput}
                      onChange={(e) => setCustomStoragePriceInput(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-white dark:bg-black/60 border border-neutral-300 dark:border-white/20 text-neutral-900 dark:text-white text-base outline-none focus:border-emerald-500 font-mono font-bold"
                    />
                  </div>
                </div>
                <div className="flex items-center justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setShowCustomStorage(false)}
                    className="px-3 py-1.5 rounded-xl text-xs text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleAddCustomStorageTier}
                    className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md cursor-pointer transition-all active:scale-95"
                  >
                    + Add Variant
                  </button>
                </div>
              </div>
            )}

            {/* Currently Active Storage Variants with Remove Button */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {storages.map((st, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-neutral-200/80 dark:bg-white/10 border border-neutral-300 dark:border-white/15 text-[11px] font-mono text-neutral-900 dark:text-white font-semibold"
                >
                  <span>{st.size}</span>
                  <span className="text-emerald-600 dark:text-emerald-400">₹{Number(st.price).toLocaleString('en-IN')}</span>
                  {storages.length > 1 && (
                    <button
                      type="button"
                      onClick={() => setStorages(storages.filter((_, i) => i !== idx))}
                      className="ml-1 text-neutral-400 hover:text-red-500 cursor-pointer p-0.5"
                      title={`Remove ${st.size}`}
                    >
                      <X size={12} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* 7. COLOR FINISHES & CUSTOM FINISH CREATOR */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-bold text-neutral-800 dark:text-neutral-300 uppercase tracking-wider flex items-center gap-1.5">
                <Palette size={13} className="text-neutral-900 dark:text-white" />
                <span>Color Finishes ({colors.length} configured)</span>
              </label>
              <button
                type="button"
                onClick={() => setShowCustomColor(!showCustomColor)}
                className="text-[11px] font-bold text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-1 cursor-pointer bg-purple-500/10 px-2.5 py-1 rounded-lg border border-purple-500/20"
              >
                <Plus size={12} />
                <span>+ Custom Color</span>
              </button>
            </div>

            {/* Inline Custom Color Creator */}
            {showCustomColor && (
              <div className="p-3.5 rounded-2xl bg-neutral-100 dark:bg-black/70 border border-purple-500/40 space-y-3 animate-tab-in">
                <div className="text-[11px] font-bold text-purple-700 dark:text-purple-400 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Palette size={13} />
                    <span>Create Custom Color Finish</span>
                  </span>
                  <span className="text-[10px] text-neutral-500">Pick color &amp; name</span>
                </div>

                {/* Trending Flagship Finish Presets */}
                <div>
                  <span className="text-[10px] text-neutral-500 uppercase font-bold block mb-1.5">1-Tap Trending Finishes:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {COLOR_PRESETS.map((cp) => (
                      <button
                        key={cp.name}
                        type="button"
                        onClick={() => {
                          setCustomColorName(cp.name);
                          setCustomColorHex(cp.hex);
                        }}
                        className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white dark:bg-white/5 border border-neutral-300 dark:border-white/15 text-[11px] hover:border-purple-500 cursor-pointer transition-all active:scale-95 shadow-xs"
                      >
                        <span className="w-2.5 h-2.5 rounded-full border border-black/20 shrink-0" style={{ backgroundColor: cp.hex }} />
                        <span className="text-neutral-800 dark:text-white font-medium">{cp.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Color Input Controls */}
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5 items-end">
                  <div className="sm:col-span-4">
                    <label className="text-[10px] uppercase font-bold text-neutral-500 dark:text-neutral-400 block mb-1">
                      Color Swatch
                    </label>
                    <div className="flex items-center gap-2 p-1.5 rounded-xl bg-white dark:bg-black/60 border border-neutral-300 dark:border-white/20">
                      <input
                        type="color"
                        value={customColorHex}
                        onChange={(e) => setCustomColorHex(e.target.value)}
                        className="w-8 h-8 rounded-lg border-0 cursor-pointer bg-transparent"
                      />
                      <span className="font-mono text-xs font-bold text-neutral-900 dark:text-white uppercase">
                        {customColorHex}
                      </span>
                    </div>
                  </div>

                  <div className="sm:col-span-5">
                    <label className="text-[10px] uppercase font-bold text-neutral-500 dark:text-neutral-400 block mb-1">
                      Color Finish Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Desert Titanium, Midnight Blue"
                      value={customColorName}
                      onChange={(e) => setCustomColorName(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-white dark:bg-black/60 border border-neutral-300 dark:border-white/20 text-neutral-900 dark:text-white text-base outline-none focus:border-purple-500 font-medium"
                    />
                  </div>

                  <div className="sm:col-span-3 flex items-center justify-end gap-2 pt-1 sm:pt-0">
                    <button
                      type="button"
                      onClick={() => setShowCustomColor(false)}
                      className="px-3 py-2 rounded-xl text-xs text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleAddCustomColor}
                      className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-md cursor-pointer transition-all active:scale-95"
                    >
                      + Add
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Currently Active Color Finishes with Stock Toggle and Remove */}
            <div className="flex flex-wrap gap-2 pt-1">
              {colors.map((c, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-neutral-100 dark:bg-black/60 border border-neutral-200 dark:border-white/15 shadow-xs"
                >
                  <div
                    className="w-4 h-4 rounded-full border border-black/20 dark:border-white/40 shadow-xs shrink-0"
                    style={{ backgroundColor: c.hex }}
                  />
                  <span className="text-xs text-neutral-900 dark:text-white font-medium">{c.name}</span>
                  <button
                    type="button"
                    onClick={() => {
                      const updated = colors.map((col, i) => i === idx ? { ...col, inStock: col.inStock === false ? true : false } : col);
                      setColors(updated);
                    }}
                    className={`px-1.5 py-0.5 rounded text-[9px] font-mono font-bold cursor-pointer transition-all ${
                      c.inStock !== false
                        ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                        : 'bg-rose-500/15 text-rose-600 dark:text-rose-400'
                    }`}
                    title="Toggle color stock"
                  >
                    {c.inStock !== false ? 'In Stock' : 'Out'}
                  </button>
                  {colors.length > 1 && (
                    <button
                      type="button"
                      onClick={() => setColors(colors.filter((_, i) => i !== idx))}
                      className="text-neutral-400 hover:text-red-500 ml-0.5 cursor-pointer p-0.5"
                      title={`Remove ${c.name}`}
                    >
                      <X size={12} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* PRO MODE EXTENSIONS (ONLY IF DETAILED MODE IS SELECTED) */}
          {viewMode === 'pro' && (
            <div className="space-y-4 pt-3 border-t border-neutral-200 dark:border-white/10 animate-fade-in">
              <div>
                <label className="block text-[11px] font-bold text-neutral-700 dark:text-neutral-300 uppercase mb-1">Warranty &amp; Compliance</label>
                <input
                  type="text"
                  value={warranty}
                  onChange={(e) => setWarranty(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-50 dark:bg-black/60 border border-neutral-200 dark:border-white/15 text-neutral-900 dark:text-white text-base outline-none focus:border-neutral-900 dark:focus:border-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-neutral-700 dark:text-neutral-300 uppercase mb-1">Showroom Description</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-50 dark:bg-black/60 border border-neutral-200 dark:border-white/15 text-neutral-900 dark:text-white text-base outline-none focus:border-neutral-900 dark:focus:border-white resize-none"
                />
              </div>
            </div>
          )}

        </form>

        {/* Sticky Mobile Touch Footer */}
        <div className="p-3.5 sm:p-4 bg-neutral-50 dark:bg-[#0A0D14] border-t border-neutral-200 dark:border-white/10 shrink-0 flex items-center gap-2.5 safe-area-pb">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-3.5 rounded-2xl bg-neutral-200 hover:bg-neutral-300 dark:bg-white/10 dark:hover:bg-white/15 text-neutral-800 dark:text-white font-bold text-xs uppercase tracking-wider transition-all cursor-pointer active:scale-95 shadow-xs"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => handleSave()}
            disabled={isSaving}
            className="flex-[2] py-3.5 rounded-2xl bg-neutral-900 hover:bg-black dark:bg-white dark:hover:bg-neutral-200 text-white dark:text-black font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xl active:scale-95 disabled:opacity-50"
          >
            {isSaving ? (
              <>
                <RefreshCw size={15} className="animate-spin" />
                <span>Publishing to Store...</span>
              </>
            ) : (
              <>
                <Save size={15} />
                <span>{initialProduct ? 'Update in Store' : 'Publish to Store'}</span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};
