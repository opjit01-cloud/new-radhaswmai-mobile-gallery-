import React, { useState, useEffect } from 'react';
import { Product } from '../../data/products';
import { StaffPortal } from './StaffPortal';
import { MobileQuickAddModal } from './MobileQuickAddModal';
import { toggleStockStatus, deleteProduct, saveAnnouncement } from '../../services/cloudSync';
import { ThemeToggle } from '../common/ThemeToggle';
import { 
  Sliders, 
  Palette, 
  ShieldCheck, 
  Sparkles, 
  Building, 
  FileText, 
  KeyRound, 
  Download, 
  ArrowLeft, 
  LogOut, 
  CheckCircle2, 
  Save, 
  RefreshCw,
  Eye,
  Smartphone,
  Phone,
  Mail,
  MapPin,
  MessageSquare,
  TrendingUp,
  DollarSign,
  Tag,
  CreditCard,
  Check,
  Plus,
  Trash2,
  Lock,
  PieChart,
  Megaphone,
  Copy,
  Clock,
  Volume2,
  VolumeX,
  ExternalLink,
  ChevronRight,
  BarChart3,
  Percent,
  Layers,
  Upload,
  ImageIcon,
  UserCheck,
  UserPlus,
  Users,
  MailCheck,
  ShieldAlert,
  Search,
  Edit,
  Zap,
  Package,
  X,
  MoreHorizontal
} from 'lucide-react';
import { SpotlightCard } from '../reactbits/SpotlightCard';
import { CountUp } from '../reactbits/CountUp';
import { TrueFocus } from '../reactbits/TrueFocus';
import { DecryptedText } from '../reactbits/DecryptedText';

export interface WhitelistEntry {
  id: string;
  email: string;
  role: 'owner' | 'staff';
  name: string;
  addedAt: string;
  status: 'Active' | 'Suspended';
}

const DEFAULT_WHITELIST: WhitelistEntry[] = [
  { id: 'wl-1', email: 'opjit01@gmail.com', role: 'owner', name: 'Admin (Master Owner)', addedAt: new Date().toISOString(), status: 'Active' }
];

interface OwnerMasterPortalProps {
  onLogout: () => void;
  onBackToStore: () => void;
  products: Product[];
  onRefreshProducts: () => void;
}

export const OwnerMasterPortal: React.FC<OwnerMasterPortalProps> = ({
  onLogout,
  onBackToStore,
  products,
  onRefreshProducts
}) => {
  const [activeSection, setActiveSection] = useState<'financials' | 'coupons' | 'announcements' | 'ui_design' | 'store_info' | 'emi_rules' | 'security' | 'inventory' | 'whitelist'>('inventory');
  const [isMobileMoreOpen, setIsMobileMoreOpen] = useState(false);
  const [saveSuccessMessage, setSaveSuccessMessage] = useState<string | null>(null);

  // Root Inventory State (Universal Cross-Device Real-Time Sync)
  const [localProducts, setLocalProducts] = useState<Product[]>(products);
  useEffect(() => {
    setLocalProducts(products);
  }, [products]);

  // Real-time polling & BroadcastChannel bus for live sync across devices & tabs
  useEffect(() => {
    const pollInterval = setInterval(() => {
      onRefreshProducts();
    }, 3000);

    let bc: BroadcastChannel | null = null;
    try {
      if (typeof BroadcastChannel !== 'undefined') {
        bc = new BroadcastChannel('nr_sync_bus');
        bc.onmessage = () => {
          onRefreshProducts();
        };
      }
    } catch {}

    const handleCatalogUpdate = () => {
      onRefreshProducts();
    };
    window.addEventListener('nr_catalog_updated', handleCatalogUpdate);

    return () => {
      clearInterval(pollInterval);
      if (bc) bc.close();
      window.removeEventListener('nr_catalog_updated', handleCatalogUpdate);
    };
  }, [onRefreshProducts]);

  const [productSearch, setProductSearch] = useState('');
  const [stockStatusFilter, setStockStatusFilter] = useState<'all' | 'inStock' | 'outOfStock'>('all');
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const handleToggleStock = async (prod: Product, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const newStock = !prod.inStock;
    setLocalProducts(prev => prev.map(p => p.id === prod.id ? { ...p, inStock: newStock } : p));
    triggerSuccess(`${prod.name} is now marked as ${newStock ? 'IN STOCK' : 'OUT OF STOCK'}`);
    await toggleStockStatus(prod.id, newStock);
    onRefreshProducts();
  };

  const handleQuickPriceAdjust = async (prod: Product, delta: number) => {
    const newPrice = Math.max(999, prod.price + delta);
    setLocalProducts(prev => prev.map(p => p.id === prod.id ? { ...p, price: newPrice } : p));
    triggerSuccess(`${prod.name} updated to ₹${newPrice.toLocaleString('en-IN')}`);
    try {
      await fetch(`/api/products/${prod.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ price: newPrice })
      });
      onRefreshProducts();
    } catch {}
  };

  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [isDeletingProduct, setIsDeletingProduct] = useState(false);

  const handleDeleteProduct = (prod: Product, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setProductToDelete(prod);
  };

  const handleConfirmDeleteProduct = async () => {
    if (!productToDelete) return;
    setIsDeletingProduct(true);
    const target = productToDelete;
    // 0ms Optimistic Removal
    setLocalProducts(prev => prev.filter(p => p.id !== target.id));
    setProductToDelete(null);
    setIsDeletingProduct(false);
    triggerSuccess(`Removed ${target.name} from showroom inventory`);
    await deleteProduct(target.id);
    onRefreshProducts();
  };

  const filteredProducts = localProducts.filter(p => {
    const matchesSearch = productSearch === '' || 
      p.name.toLowerCase().includes(productSearch.toLowerCase()) || 
      p.brand.toLowerCase().includes(productSearch.toLowerCase());
    const matchesStock = stockStatusFilter === 'all' || 
      (stockStatusFilter === 'inStock' ? p.inStock : !p.inStock);
    return matchesSearch && matchesStock;
  });

  // Announcement State
  const [announcement, setAnnouncement] = useState<any>(() => {
    try {
      const saved = localStorage.getItem('nr_announcement_data');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object') return parsed;
      }
    } catch {}
    return {
      active: true,
      title: 'Royal Privilege Flagship Drop',
      subtitle: 'Official Manufacturer Sealed Stock • Pithampur Showroom Exclusive',
      message: 'Enjoy an instant 10% privilege concession across all Apple, Samsung & Google flagships. Complimentary MagSafe carbon shield included with every verified purchase.',
      imageUrl: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=1200&q=80',
      badge: 'VIP Showroom Exclusive',
      theme: 'champagne',
      promoCode: 'ROYAL10',
      discountAmount: '10% OFF',
      countdownExpiry: new Date(Date.now() + 86400000 * 2.5).toISOString(),
      ctaText: 'Claim VIP Privilege',
      ctaLink: '#shop',
      soundEnabled: true,
      tickerActive: true
    };
  });

  const [uploadingFlyer, setUploadingFlyer] = useState(false);
  const flyerInputRef = React.useRef<HTMLInputElement | null>(null);

  const handleFlyerUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingFlyer(true);
    try {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const base64Data = event.target?.result as string;
        try {
          const res = await fetch('/api/upload', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              fileName: file.name,
              fileData: base64Data
            })
          });
          const json = await res.json();
          if (json.success && json.imageUrl) {
            setAnnouncement((prev: any) => ({ ...prev, imageUrl: json.imageUrl }));
          } else {
            setAnnouncement((prev: any) => ({ ...prev, imageUrl: base64Data }));
          }
        } catch {
          setAnnouncement((prev: any) => ({ ...prev, imageUrl: base64Data }));
        } finally {
          setUploadingFlyer(false);
        }
      };
      reader.readAsDataURL(file);
    } catch {
      setUploadingFlyer(false);
    }
  };

  // Coupons State with persistent local storage
  const [coupons, setCoupons] = useState<any[]>(() => {
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
  const [newCouponCode, setNewCouponCode] = useState('');
  const [newCouponType, setNewCouponType] = useState<'percentage' | 'flat'>('percentage');
  const [newCouponValue, setNewCouponValue] = useState<number>(10);
  const [newCouponMinCart, setNewCouponMinCart] = useState<number>(10000);
  const [newCouponDesc, setNewCouponDesc] = useState('');

  // Live UI Design & Store Settings
  const [settings, setSettings] = useState<any>(() => {
    try {
      const saved = localStorage.getItem('nr_store_settings');
      if (saved) return JSON.parse(saved);
    } catch {}
    return {
      announcementText: 'Authorized Mobile Gallery • Pithampur, Madhya Pradesh',
      announcementBadge: '100% Sealed Indian Stock • BlueDart Insured Air Express',
      heroBadge: 'iPhone 16 Pro Max • Galaxy S25 Ultra • Pixel 9 Pro Fold',
      heroTitle: 'Premium Flagship',
      heroSubtitle: 'Phones & Accessories.',
      heroDescription: "India's most trusted destination for original, manufacturer-sealed flagship smartphones. Official brand warranty, instant tax invoice, and 0% interest EMI options.",
      themeAccent: 'champagne',
      gimbalMode: 'follow',
      storeAddress: 'JHQJ+7PC Vijay Nagar Colony, Pithampur Industrial Area, Madhya Pradesh',
      storePhone: '+91 96910 11335',
      storeEmail: 'support@radhaswamigallery.in',
      whatsappNumber: '919691011335',
      emiMinCart: 10000,
      enabledBanks: ['HDFC Bank', 'ICICI Bank', 'SBI Card', 'Axis Bank', 'Bajaj Finserv', 'OneCard']
    };
  });

  // Whitelist State & Access Management
  const [whitelist, setWhitelist] = useState<WhitelistEntry[]>(() => {
    try {
      const saved = localStorage.getItem('nr_whitelist_emails');
      return saved ? JSON.parse(saved) : DEFAULT_WHITELIST;
    } catch {
      return DEFAULT_WHITELIST;
    }
  });
  const [whitelistSearch, setWhitelistSearch] = useState('');
  const [whitelistRoleFilter, setWhitelistRoleFilter] = useState<'all' | 'owner' | 'staff'>('all');
  const [isAddWhitelistOpen, setIsAddWhitelistOpen] = useState(false);
  const [newWhitelistForm, setNewWhitelistForm] = useState({
    email: '',
    role: 'staff' as 'owner' | 'staff',
    name: ''
  });

  // Security Credentials Form
  const [credentialsForm, setCredentialsForm] = useState(() => {
    try {
      const saved = localStorage.getItem('nr_credentials_db');
      if (saved) return JSON.parse(saved);
    } catch {}
    return {
      newStaffPin: '4321',
      newOwnerPin: '9876',
      newOwnerPassword: 'radha@master2026'
    };
  });

  // Fetch Data on mount
  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => {
        if (data.settings) setSettings(data.settings);
      })
      .catch(() => {});

    fetch('/api/announcement')
      .then(res => res.json())
      .then(data => {
        if (data.announcement) setAnnouncement((prev: any) => ({ ...prev, ...data.announcement }));
      })
      .catch(() => {});

    fetch('/api/coupons')
      .then(res => res.json())
      .then(data => {
        if (data.coupons && data.coupons.length > 0) setCoupons(data.coupons);
      })
      .catch(() => {});

    fetch('/api/admin/whitelist')
      .then(res => res.json())
      .then(data => {
        if (data.whitelist && data.whitelist.length > 0) {
          setWhitelist(data.whitelist);
          localStorage.setItem('nr_whitelist_emails', JSON.stringify(data.whitelist));
        }
      })
      .catch(() => {});
  }, []);

  // Whitelist Management Action Handlers
  const handleAddWhitelist = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = newWhitelistForm.email.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@')) {
      alert('Please enter a valid email address.');
      return;
    }

    try {
      const res = await fetch('/api/admin/whitelist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: cleanEmail,
          role: newWhitelistForm.role,
          name: newWhitelistForm.name
        })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setWhitelist(data.whitelist);
        localStorage.setItem('nr_whitelist_emails', JSON.stringify(data.whitelist));
        setNewWhitelistForm({ email: '', role: 'staff', name: '' });
        setIsAddWhitelistOpen(false);
        triggerSuccess(`Email "${cleanEmail}" added to authorized whitelist.`);
      } else {
        alert(data.message || 'Failed to add email');
      }
    } catch {
      const newEntry: WhitelistEntry = {
        id: 'wl-' + Date.now(),
        email: cleanEmail,
        role: newWhitelistForm.role,
        name: newWhitelistForm.name || (newWhitelistForm.role === 'owner' ? 'Owner Executive' : 'Staff Operations'),
        addedAt: new Date().toISOString(),
        status: 'Active'
      };
      const updated = [newEntry, ...whitelist];
      setWhitelist(updated);
      localStorage.setItem('nr_whitelist_emails', JSON.stringify(updated));
      setNewWhitelistForm({ email: '', role: 'staff', name: '' });
      setIsAddWhitelistOpen(false);
      triggerSuccess(`Email "${cleanEmail}" added to whitelist locally.`);
    }
  };

  const handleToggleWhitelistStatus = async (id: string, currentStatus: 'Active' | 'Suspended') => {
    const newStatus: 'Active' | 'Suspended' = currentStatus === 'Active' ? 'Suspended' : 'Active';
    try {
      const res = await fetch(`/api/admin/whitelist/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      const data = await res.json();
      if (data.success && data.whitelist) {
        setWhitelist(data.whitelist);
        localStorage.setItem('nr_whitelist_emails', JSON.stringify(data.whitelist));
      } else {
        const updated = whitelist.map(w => w.id === id ? { ...w, status: newStatus } : w);
        setWhitelist(updated);
        localStorage.setItem('nr_whitelist_emails', JSON.stringify(updated));
      }
      triggerSuccess(`Access status set to ${newStatus}`);
    } catch {
      const updated = whitelist.map(w => w.id === id ? { ...w, status: newStatus } : w);
      setWhitelist(updated);
      localStorage.setItem('nr_whitelist_emails', JSON.stringify(updated));
      triggerSuccess(`Access status set to ${newStatus}`);
    }
  };

  const handleUpdateWhitelistRole = async (id: string, newRole: 'owner' | 'staff') => {
    try {
      const res = await fetch(`/api/admin/whitelist/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: newRole })
      });
      const data = await res.json();
      if (data.success && data.whitelist) {
        setWhitelist(data.whitelist);
        localStorage.setItem('nr_whitelist_emails', JSON.stringify(data.whitelist));
      } else {
        const updated = whitelist.map(w => w.id === id ? { ...w, role: newRole } : w);
        setWhitelist(updated);
        localStorage.setItem('nr_whitelist_emails', JSON.stringify(updated));
      }
      triggerSuccess(`Clearance updated to ${newRole.toUpperCase()}`);
    } catch {
      const updated = whitelist.map(w => w.id === id ? { ...w, role: newRole } : w);
      setWhitelist(updated);
      localStorage.setItem('nr_whitelist_emails', JSON.stringify(updated));
      triggerSuccess(`Clearance updated to ${newRole.toUpperCase()}`);
    }
  };

  const handleDeleteWhitelist = async (id: string, email: string) => {
    if (!confirm(`Revoke clearance and remove "${email}" from the security whitelist?`)) return;
    try {
      const res = await fetch(`/api/admin/whitelist/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (res.ok && data.success && data.whitelist) {
        setWhitelist(data.whitelist);
        localStorage.setItem('nr_whitelist_emails', JSON.stringify(data.whitelist));
        triggerSuccess(`Clearance for "${email}" revoked.`);
      } else {
        alert(data.message || 'Failed to remove from whitelist');
      }
    } catch {
      const updated = whitelist.filter(w => w.id !== id);
      setWhitelist(updated);
      localStorage.setItem('nr_whitelist_emails', JSON.stringify(updated));
      triggerSuccess(`Clearance for "${email}" revoked locally.`);
    }
  };

  const triggerSuccess = (msg: string) => {
    setSaveSuccessMessage(msg);
    setTimeout(() => setSaveSuccessMessage(null), 3500);
  };

  // Save Settings to Backend
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      localStorage.setItem('nr_store_settings', JSON.stringify(settings));
      window.dispatchEvent(new CustomEvent('nr_settings_updated'));
    } catch {}
    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          triggerSuccess('Storefront configuration updated and live across all client browsers.');
          return;
        }
      }
    } catch {}
    triggerSuccess('Storefront settings updated and live!');
  };

  // Save Announcement
  const handleSaveAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await saveAnnouncement(announcement);
      triggerSuccess('Global announcement broadcasted live to all devices!');
    } catch {
      triggerSuccess('Announcement updated locally.');
    }
  };

  // Create New Coupon
  const handleCreateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCouponCode.trim()) return;

    const payload = {
      code: newCouponCode.trim().toUpperCase(),
      discountType: newCouponType,
      value: newCouponValue,
      minCart: newCouponMinCart,
      description: newCouponDesc || `Special voucher code ${newCouponCode.toUpperCase()}`,
      active: true
    };

    const updated = [payload, ...coupons.filter(c => c.code !== payload.code)];
    setCoupons(updated);
    try {
      localStorage.setItem('nr_coupons_db', JSON.stringify(updated));
      localStorage.setItem('nr_coupons_last_updated', Date.now().toString());
      window.dispatchEvent(new CustomEvent('nr_coupons_updated'));
    } catch {}

    try {
      const res = await fetch('/api/coupons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success && data.coupon) {
        const finalCoupons = [data.coupon, ...coupons.filter(c => c.code !== data.coupon.code)];
        setCoupons(finalCoupons);
        try {
          localStorage.setItem('nr_coupons_db', JSON.stringify(finalCoupons));
        } catch {}
        setNewCouponCode('');
        setNewCouponDesc('');
        triggerSuccess(`Voucher ${payload.code} created and live!`);
        return;
      }
    } catch {}

    setNewCouponCode('');
    setNewCouponDesc('');
    triggerSuccess(`Voucher ${payload.code} saved locally and live!`);
  };

  // Toggle Coupon Status
  const handleToggleCoupon = async (code: string) => {
    const updated = coupons.map(c => c.code === code ? { ...c, active: !c.active } : c);
    setCoupons(updated);
    try {
      localStorage.setItem('nr_coupons_db', JSON.stringify(updated));
      localStorage.setItem('nr_coupons_last_updated', Date.now().toString());
      window.dispatchEvent(new CustomEvent('nr_coupons_updated'));
    } catch {}

    try {
      await fetch(`/api/coupons/${code}/toggle`, { method: 'PUT' });
      triggerSuccess(`Coupon ${code} status changed`);
    } catch {
      triggerSuccess(`Coupon ${code} status changed`);
    }
  };

  // Delete Coupon
  const handleDeleteCoupon = async (code: string) => {
    if (!confirm(`Permanently delete voucher ${code}?`)) return;
    const updated = coupons.filter(c => c.code !== code);
    setCoupons(updated);
    try {
      localStorage.setItem('nr_coupons_db', JSON.stringify(updated));
      localStorage.setItem('nr_coupons_last_updated', Date.now().toString());
      window.dispatchEvent(new CustomEvent('nr_coupons_updated'));
    } catch {}

    try {
      await fetch(`/api/coupons/${code}`, { method: 'DELETE' });
      triggerSuccess(`Voucher ${code} removed`);
    } catch {
      triggerSuccess(`Voucher ${code} removed`);
    }
  };

  // Update Security Credentials
  const handleUpdateCredentials = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      localStorage.setItem('nr_credentials_db', JSON.stringify(credentialsForm));
      window.dispatchEvent(new CustomEvent('nr_credentials_updated'));
    } catch {}
    try {
      const res = await fetch('/api/admin/credentials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentialsForm)
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          triggerSuccess('Master Owner PIN and Staff access keys updated.');
          return;
        }
      }
    } catch {}
    triggerSuccess('Credentials updated and saved!');
  };

  // Export Complete Store Database
  const handleExportData = () => {
    const backupData = {
      timestamp: new Date().toISOString(),
      store: 'New Radhaswami Mobile Gallery',
      settings,
      products: localProducts,
      coupons,
      announcement
    };
    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `radhaswami_master_backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    triggerSuccess('Full store database exported as JSON');
  };

  return (
    <div className="min-h-screen bg-[#F6F7F9] dark:bg-[#07090D] text-neutral-900 dark:text-[#E8E6E3] font-sans pb-28 sm:pb-16 selection:bg-neutral-900 selection:text-white dark:selection:bg-white dark:selection:text-black transition-colors duration-200">
      
      {/* Master Executive Header */}
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-[#0C0F16]/95 border-b border-neutral-200 dark:border-white/10 backdrop-blur-xl px-3 sm:px-8 py-2.5 sm:py-3.5 flex items-center justify-between shadow-xs dark:shadow-2xl">
        <div className="flex items-center gap-2.5 sm:gap-3">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full overflow-hidden border border-neutral-300 dark:border-white/20 shadow-md shrink-0">
            <img src="/nrs-logo.png" alt="NRS Logo" className="w-full h-full object-cover" />
          </div>
          <div>
            <h1 className="font-serif-luxury text-sm sm:text-lg text-neutral-900 dark:text-white font-medium flex items-center gap-1.5 sm:gap-2">
              <DecryptedText text="Owner Master Suite" speed={30} maxIterations={10} animateOn="view" className="text-neutral-900 dark:text-white font-medium" />
              <span className="px-2 py-0.5 rounded-full bg-neutral-100 dark:bg-white/10 border border-neutral-200 dark:border-white/20 text-[9px] sm:text-[10px] text-neutral-800 dark:text-white font-mono font-bold">
                Master PIN Active
              </span>
            </h1>
            <div className="text-[10px] text-neutral-500 dark:text-neutral-400 truncate max-w-[160px] sm:max-w-none">Financials • Promotions • Broadcast Studio • Catalog</div>
          </div>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-3">
          {/* Direct Theme Switcher in Owner Portal */}
          <ThemeToggle className="scale-85 sm:scale-95" />

          <button
            onClick={handleExportData}
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-neutral-100 hover:bg-neutral-200 dark:bg-white/5 dark:hover:bg-white/10 text-xs text-neutral-800 dark:text-white border border-neutral-200 dark:border-white/15 transition-all cursor-pointer shadow-xs"
            title="Download JSON Database"
          >
            <Download size={13} />
            <span className="text-[11px] font-semibold">Export JSON</span>
          </button>

          <button
            onClick={onBackToStore}
            className="flex items-center gap-1.5 px-2.5 sm:px-4 py-1.5 rounded-full bg-neutral-100 hover:bg-neutral-200 dark:bg-white/5 dark:hover:bg-white/10 text-xs text-neutral-700 hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-white transition-all cursor-pointer border border-neutral-200 dark:border-white/10"
          >
            <ArrowLeft size={13} />
            <span className="text-[11px]">Storefront</span>
          </button>

          <button
            onClick={onLogout}
            className="p-1.5 sm:px-3 sm:py-1.5 rounded-full bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 text-xs flex items-center gap-1.5 transition-all cursor-pointer border border-red-500/20"
            title="Lock Suite"
          >
            <LogOut size={13} />
            <span className="hidden sm:inline text-[11px] font-semibold">Lock</span>
          </button>
        </div>
      </header>

      {/* Workspace Container */}
      <div className="max-w-7xl mx-auto px-3 sm:px-8 pt-4 sm:pt-6">
        
        {/* Toast Alert */}
        {saveSuccessMessage && (
          <div className="mb-4 sm:mb-6 p-3.5 sm:p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs flex items-center gap-2.5 animate-tab-in shadow-lg">
            <CheckCircle2 size={16} />
            <span>{saveSuccessMessage}</span>
          </div>
        )}

        {/* Mobile Quick Status & Action Bar (md:hidden) */}
        <div className="md:hidden flex items-center justify-between mb-4 p-3.5 rounded-2xl bg-white dark:bg-[#0E121B] border border-neutral-200 dark:border-white/10 shadow-sm">
          <div className="flex items-center gap-2 min-w-0">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
            <span className="text-xs font-bold capitalize truncate text-neutral-900 dark:text-white">
              {activeSection === 'inventory' ? 'Root Stock' : activeSection === 'financials' ? 'Financials' : activeSection === 'coupons' ? 'Coupons' : activeSection === 'announcements' ? 'Broadcasts' : activeSection}
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-neutral-100 dark:bg-white/10 text-neutral-600 dark:text-neutral-400 font-mono shrink-0">
              {activeSection === 'inventory' ? `${localProducts.length} Items` : 'Active'}
            </span>
          </div>

          <button
            onClick={() => {
              setEditingProduct(null);
              setIsQuickAddOpen(true);
            }}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-neutral-900 hover:bg-black dark:bg-white dark:hover:bg-neutral-200 text-white dark:text-black text-xs font-bold shadow-md active:scale-95 transition-all shrink-0 cursor-pointer"
          >
            <Plus size={14} />
            <span>+ Express Add</span>
          </button>
        </div>

        {/* Master Executive Navigation Bar (hidden md:flex) - Redesigned Luxury Segmented Bar */}
        <div className="hidden md:flex items-center gap-1.5 p-1.5 rounded-2xl bg-neutral-100/90 dark:bg-[#0D1018]/90 border border-neutral-200/80 dark:border-white/10 backdrop-blur-xl shadow-sm dark:shadow-2xl overflow-x-auto [scrollbar-width:none] no-scrollbar mb-8">
          <button
            onClick={() => setActiveSection('inventory')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all duration-200 cursor-pointer whitespace-nowrap shrink-0 ${
              activeSection === 'inventory'
                ? 'bg-neutral-900 text-white dark:bg-white dark:text-black shadow-md dark:shadow-white/10 font-bold scale-[1.02] border border-neutral-800 dark:border-white'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-white dark:hover:bg-white/10 border border-transparent'
            }`}
          >
            <Smartphone size={15} className={activeSection === 'inventory' ? 'text-emerald-400 dark:text-emerald-600' : ''} />
            <span>Root Inventory</span>
            <span className={`px-1.5 py-0.5 rounded-full text-[9px] font-mono uppercase font-bold ${
              activeSection === 'inventory' ? 'bg-white text-black dark:bg-black dark:text-white' : 'bg-neutral-200 dark:bg-white/15 text-neutral-700 dark:text-neutral-300'
            }`}>
              Primary
            </span>
          </button>

          <button
            onClick={() => setActiveSection('financials')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all duration-200 cursor-pointer whitespace-nowrap shrink-0 ${
              activeSection === 'financials'
                ? 'bg-neutral-900 text-white dark:bg-white dark:text-black shadow-md dark:shadow-white/10 font-bold scale-[1.02] border border-neutral-800 dark:border-white'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-white dark:hover:bg-white/10 border border-transparent'
            }`}
          >
            <TrendingUp size={15} className={activeSection === 'financials' ? 'text-blue-400 dark:text-blue-600' : ''} />
            <span>Financials</span>
          </button>

          <button
            onClick={() => setActiveSection('coupons')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all duration-200 cursor-pointer whitespace-nowrap shrink-0 ${
              activeSection === 'coupons'
                ? 'bg-neutral-900 text-white dark:bg-white dark:text-black shadow-md dark:shadow-white/10 font-bold scale-[1.02] border border-neutral-800 dark:border-white'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-white dark:hover:bg-white/10 border border-transparent'
            }`}
          >
            <Tag size={15} className={activeSection === 'coupons' ? 'text-amber-400 dark:text-amber-600' : ''} />
            <span>Coupons</span>
          </button>

          <button
            onClick={() => setActiveSection('announcements')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all duration-200 cursor-pointer whitespace-nowrap shrink-0 ${
              activeSection === 'announcements'
                ? 'bg-neutral-900 text-white dark:bg-white dark:text-black shadow-md dark:shadow-white/10 font-bold scale-[1.02] border border-neutral-800 dark:border-white'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-white dark:hover:bg-white/10 border border-transparent'
            }`}
          >
            <Megaphone size={15} className={activeSection === 'announcements' ? 'text-purple-400 dark:text-purple-600' : ''} />
            <span>Broadcasts</span>
          </button>

          <button
            onClick={() => setActiveSection('ui_design')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all duration-200 cursor-pointer whitespace-nowrap shrink-0 ${
              activeSection === 'ui_design'
                ? 'bg-neutral-900 text-white dark:bg-white dark:text-black shadow-md dark:shadow-white/10 font-bold scale-[1.02] border border-neutral-800 dark:border-white'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-white dark:hover:bg-white/10 border border-transparent'
            }`}
          >
            <Palette size={15} className={activeSection === 'ui_design' ? 'text-pink-400 dark:text-pink-600' : ''} />
            <span>Storefront UI</span>
          </button>

          <button
            onClick={() => setActiveSection('store_info')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all duration-200 cursor-pointer whitespace-nowrap shrink-0 ${
              activeSection === 'store_info'
                ? 'bg-neutral-900 text-white dark:bg-white dark:text-black shadow-md dark:shadow-white/10 font-bold scale-[1.02] border border-neutral-800 dark:border-white'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-white dark:hover:bg-white/10 border border-transparent'
            }`}
          >
            <Building size={15} className={activeSection === 'store_info' ? 'text-cyan-400 dark:text-cyan-600' : ''} />
            <span>Showroom Info</span>
          </button>

          <button
            onClick={() => setActiveSection('emi_rules')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all duration-200 cursor-pointer whitespace-nowrap shrink-0 ${
              activeSection === 'emi_rules'
                ? 'bg-neutral-900 text-white dark:bg-white dark:text-black shadow-md dark:shadow-white/10 font-bold scale-[1.02] border border-neutral-800 dark:border-white'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-white dark:hover:bg-white/10 border border-transparent'
            }`}
          >
            <CreditCard size={15} className={activeSection === 'emi_rules' ? 'text-emerald-400 dark:text-emerald-600' : ''} />
            <span>0% EMI</span>
          </button>

          <button
            onClick={() => setActiveSection('security')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all duration-200 cursor-pointer whitespace-nowrap shrink-0 ${
              activeSection === 'security'
                ? 'bg-neutral-900 text-white dark:bg-white dark:text-black shadow-md dark:shadow-white/10 font-bold scale-[1.02] border border-neutral-800 dark:border-white'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-white dark:hover:bg-white/10 border border-transparent'
            }`}
          >
            <KeyRound size={15} className={activeSection === 'security' ? 'text-amber-400 dark:text-amber-600' : ''} />
            <span>Security PINs</span>
          </button>

          <button
            onClick={() => setActiveSection('whitelist')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all duration-200 cursor-pointer whitespace-nowrap shrink-0 ${
              activeSection === 'whitelist'
                ? 'bg-neutral-900 text-white dark:bg-white dark:text-black shadow-md dark:shadow-white/10 font-bold scale-[1.02] border border-neutral-800 dark:border-white'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-white dark:hover:bg-white/10 border border-transparent'
            }`}
          >
            <ShieldCheck size={15} className={activeSection === 'whitelist' ? 'text-emerald-400 dark:text-emerald-600' : ''} />
            <span>Email Whitelist</span>
            <span className={`px-1.5 py-0.5 rounded-full text-[9px] font-mono font-bold ${
              activeSection === 'whitelist' ? 'bg-white text-black dark:bg-black dark:text-white' : 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300'
            }`}>
              {whitelist.length}
            </span>
          </button>
        </div>

        {/* ========================================================================= */}
        {/* SECTION 0: ROOT INVENTORY & STOCK CONTROLLER (LIVE CLOUD SYNC) */}
        {/* ========================================================================= */}
        {activeSection === 'inventory' && (
          <div className="space-y-4 sm:space-y-6 animate-tab-in">
            {/* Inventory KPI Summary */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <SpotlightCard className="p-3.5 sm:p-5 rounded-2xl bg-white dark:bg-[#0E121B] border border-neutral-200 dark:border-white/10 shadow-xs dark:shadow-lg">
                <div className="text-[10px] uppercase font-bold tracking-wider text-neutral-500 dark:text-[#8E8A85]">Total Catalog Handsets</div>
                <div className="font-mono text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-white mt-1">
                  <CountUp to={localProducts.length} duration={1.2} />
                </div>
                <div className="text-[10px] sm:text-[11px] text-neutral-500 dark:text-neutral-400 mt-1 truncate">Synced across all devices</div>
              </SpotlightCard>

              <SpotlightCard className="p-3.5 sm:p-5 rounded-2xl bg-white dark:bg-[#0E121B] border border-neutral-200 dark:border-white/10 shadow-xs dark:shadow-lg">
                <div className="text-[10px] uppercase font-bold tracking-wider text-neutral-500 dark:text-[#8E8A85]">In Stock (Ready)</div>
                <div className="font-mono text-2xl sm:text-3xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">
                  <CountUp to={localProducts.filter(p => p.inStock).length} duration={1.2} />
                </div>
                <div className="text-[10px] sm:text-[11px] text-neutral-500 dark:text-neutral-400 mt-1 truncate">Available for live checkout</div>
              </SpotlightCard>

              <SpotlightCard className="p-3.5 sm:p-5 rounded-2xl bg-white dark:bg-[#0E121B] border border-neutral-200 dark:border-white/10 shadow-xs dark:shadow-lg">
                <div className="text-[10px] uppercase font-bold tracking-wider text-neutral-500 dark:text-[#8E8A85]">Out of Stock Units</div>
                <div className="font-mono text-2xl sm:text-3xl font-bold text-rose-600 dark:text-red-400 mt-1">
                  <CountUp to={localProducts.filter(p => !p.inStock).length} duration={1.2} />
                </div>
                <div className="text-[10px] sm:text-[11px] text-neutral-500 dark:text-neutral-400 mt-1 truncate">Restock required</div>
              </SpotlightCard>

              <SpotlightCard className="p-3.5 sm:p-5 rounded-2xl bg-white dark:bg-[#0E121B] border border-neutral-200 dark:border-white/10 shadow-xs dark:shadow-lg">
                <div className="text-[10px] uppercase font-bold tracking-wider text-neutral-500 dark:text-[#8E8A85]">Live Sync Mode</div>
                <div className="font-mono text-base sm:text-lg font-bold text-emerald-600 dark:text-emerald-400 mt-1 flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping inline-block" />
                  <span>Cloud Active</span>
                </div>
                <div className="text-[10px] sm:text-[11px] text-neutral-500 dark:text-neutral-400 mt-1 truncate">Vercel Edge + GitHub DB</div>
              </SpotlightCard>
            </div>

            {/* Controls Toolbar */}
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-[#0E121B] border border-neutral-200 dark:border-white/10 shadow-xs">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 w-full md:w-auto">
                <div className="relative flex-1 sm:w-72">
                  <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 dark:text-neutral-500" />
                  <input
                    type="text"
                    placeholder="Search model, brand or specs..."
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-neutral-100 dark:bg-black/60 border border-neutral-200 dark:border-white/10 text-neutral-900 dark:text-white text-xs outline-none focus:border-neutral-400 dark:focus:border-white transition-all placeholder:text-neutral-400"
                  />
                </div>

                <select
                  value={stockStatusFilter}
                  onChange={(e: any) => setStockStatusFilter(e.target.value)}
                  className="px-3 py-2 rounded-xl bg-neutral-100 dark:bg-black/60 border border-neutral-200 dark:border-white/10 text-neutral-800 dark:text-white text-xs outline-none focus:border-neutral-400 dark:focus:border-white cursor-pointer shrink-0"
                >
                  <option value="all">All Inventory ({localProducts.length})</option>
                  <option value="inStock">Only In Stock ({localProducts.filter(p => p.inStock).length})</option>
                  <option value="outOfStock">Only Out of Stock ({localProducts.filter(p => !p.inStock).length})</option>
                </select>
              </div>

              <div className="flex items-center gap-2 w-full md:w-auto justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setEditingProduct(null);
                    setIsQuickAddOpen(true);
                  }}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-200 text-white dark:text-black font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md active:scale-95"
                >
                  <Plus size={15} />
                  <span>Add Handset (Express)</span>
                </button>
              </div>
            </div>

            {/* Handsets Grid (Responsive Mobile Cards & Desktop Grid) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {filteredProducts.map((prod) => (
                <div
                  key={prod.id}
                  className="p-4 rounded-2xl bg-white dark:bg-[#0E121B] border border-neutral-200 dark:border-white/10 hover:border-neutral-300 dark:hover:border-white/20 transition-all flex flex-col justify-between space-y-3 shadow-xs dark:shadow-md group"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-neutral-100 dark:bg-black/60 border border-neutral-200 dark:border-white/10 shrink-0 relative">
                      <img src={prod.image} alt={prod.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                      {!prod.inStock && (
                        <div className="absolute inset-0 bg-rose-950/70 flex items-center justify-center">
                          <span className="text-[8px] font-bold text-rose-300 uppercase px-1 py-0.5 rounded bg-rose-900/80">OOS</span>
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-neutral-100 dark:bg-white/10 text-neutral-700 dark:text-neutral-300 font-semibold uppercase">{prod.brand}</span>
                        <span className={`text-[9px] px-1.5 py-0.2 rounded font-bold uppercase ${
                          prod.inStock ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400' : 'bg-rose-50 text-rose-700 dark:bg-red-500/20 dark:text-red-400'
                        }`}>
                          {prod.inStock ? 'In Stock' : 'Out of Stock'}
                        </span>
                      </div>
                      <h4 className="text-xs font-bold text-neutral-900 dark:text-white truncate mt-1">{prod.name}</h4>
                      <div className="flex items-baseline gap-1.5 mt-0.5">
                        <span className="text-xs font-mono font-bold text-neutral-900 dark:text-white">₹{prod.price.toLocaleString('en-IN')}</span>
                        {prod.originalPrice && prod.originalPrice > prod.price && (
                          <span className="text-[10px] font-mono text-neutral-400 line-through">₹{prod.originalPrice.toLocaleString('en-IN')}</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Storage variants chips */}
                  {prod.storageVariants && prod.storageVariants.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {prod.storageVariants.map((s, idx) => (
                        <span key={idx} className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-neutral-100 dark:bg-black/50 border border-neutral-200 dark:border-white/10 text-neutral-700 dark:text-neutral-300">
                          {s.size}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* 1-Tap Stock Switch & Quick Reprice Chips */}
                  <div className="space-y-2 pt-1 border-t border-neutral-100 dark:border-white/10">
                    <button
                      type="button"
                      onClick={(e) => handleToggleStock(prod, e)}
                      className={`w-full py-2 px-3 rounded-xl border flex items-center justify-center gap-1.5 text-xs font-bold transition-all cursor-pointer shadow-xs active:scale-98 ${
                        prod.inStock
                          ? 'bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-500/15 dark:hover:bg-emerald-500/25 border-emerald-300 dark:border-emerald-500/40 text-emerald-700 dark:text-emerald-400'
                          : 'bg-rose-50 hover:bg-rose-100 dark:bg-red-500/15 dark:hover:bg-red-500/25 border-rose-300 dark:border-red-500/40 text-rose-700 dark:text-red-400'
                      }`}
                    >
                      {prod.inStock ? <Check size={13} className="stroke-[2.5]" /> : <X size={13} className="stroke-[2.5]" />}
                      <span>{prod.inStock ? 'IN STOCK • Tap to Mark Out' : 'OUT OF STOCK • Tap to Restock'}</span>
                    </button>

                    <div className="flex items-center justify-between gap-1.5">
                      <div className="flex items-center gap-1">
                        <span className="text-[10px] text-neutral-500 font-medium mr-0.5">Quick Price:</span>
                        <button
                          type="button"
                          onClick={() => handleQuickPriceAdjust(prod, -500)}
                          className="px-2 py-0.5 rounded-lg bg-neutral-100 hover:bg-neutral-200 dark:bg-white/5 dark:hover:bg-white/10 text-neutral-700 dark:text-neutral-300 text-[10px] font-mono font-bold transition-all active:scale-95 cursor-pointer"
                          title="Decrease price by ₹500"
                        >
                          -500
                        </button>
                        <button
                          type="button"
                          onClick={() => handleQuickPriceAdjust(prod, 500)}
                          className="px-2 py-0.5 rounded-lg bg-neutral-100 hover:bg-neutral-200 dark:bg-white/5 dark:hover:bg-white/10 text-neutral-700 dark:text-neutral-300 text-[10px] font-mono font-bold transition-all active:scale-95 cursor-pointer"
                          title="Increase price by ₹500"
                        >
                          +500
                        </button>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingProduct(prod);
                            setIsQuickAddOpen(true);
                          }}
                          className="p-1.5 rounded-xl bg-neutral-100 hover:bg-neutral-200 dark:bg-white/5 dark:hover:bg-white/15 text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white transition-all cursor-pointer"
                          title="Edit Handset"
                        >
                          <Edit size={13} />
                        </button>

                        <button
                          type="button"
                          onClick={(e) => handleDeleteProduct(prod, e)}
                          className="p-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 dark:bg-red-500/10 dark:hover:bg-red-500/20 text-rose-600 dark:text-red-400 transition-all cursor-pointer"
                          title="Remove from Showroom"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredProducts.length === 0 && (
              <div className="p-12 text-center rounded-3xl bg-[#0E121B] border border-white/10 text-neutral-400 space-y-3">
                <Package size={32} className="mx-auto text-neutral-500 opacity-60" />
                <div className="text-sm font-bold text-white">No Handsets Found</div>
                <div className="text-xs">No products matched your search or filters.</div>
                <button
                  type="button"
                  onClick={() => {
                    setProductSearch('');
                    setStockStatusFilter('all');
                  }}
                  className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-xs text-white cursor-pointer"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* SECTION 1: EXECUTIVE FINANCIALS BENTO HUB */}
        {/* ========================================================================= */}
        {activeSection === 'financials' && (
          <div className="space-y-6 animate-tab-in">
            
            {/* Top KPI Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <SpotlightCard className="p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-white dark:bg-[#0E121B] border border-neutral-200 dark:border-white/10 shadow-xs dark:shadow-xl space-y-2">
                <div className="text-[10px] uppercase font-bold tracking-widest text-neutral-500 dark:text-[#8E8A85]">Gross Revenue (YTD)</div>
                <div className="font-mono text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-white">
                  <CountUp to={14892400} prefix="₹" separator="," duration={1.8} />
                </div>
                <div className="text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-semibold">
                  <TrendingUp size={13} />
                  <span>+28.4% vs last quarter</span>
                </div>
              </SpotlightCard>

              <SpotlightCard className="p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-white dark:bg-[#0E121B] border border-neutral-200 dark:border-white/10 shadow-xs dark:shadow-xl space-y-2">
                <div className="text-[10px] uppercase font-bold tracking-widest text-neutral-500 dark:text-[#8E8A85]">Net Profit Margin</div>
                <div className="font-mono text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-white">
                  <CountUp to={14.8} decimals={1} suffix="%" duration={1.5} />
                </div>
                <div className="text-xs text-neutral-500 dark:text-neutral-400">Net after showroom overheads &amp; courier insurance</div>
              </SpotlightCard>

              <SpotlightCard className="p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-white dark:bg-[#0E121B] border border-neutral-200 dark:border-white/10 shadow-xs dark:shadow-xl space-y-2">
                <div className="text-[10px] uppercase font-bold tracking-widest text-neutral-500 dark:text-[#8E8A85]">Average Order Value (AOV)</div>
                <div className="font-mono text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-white">
                  <CountUp to={134500} prefix="₹" separator="," duration={1.8} />
                </div>
                <div className="text-xs text-neutral-500 dark:text-neutral-400">Driven by 1TB &amp; 512GB flagships</div>
              </SpotlightCard>

              <SpotlightCard className="p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-white dark:bg-[#0E121B] border border-neutral-200 dark:border-white/10 shadow-xs dark:shadow-xl space-y-2">
                <div className="text-[10px] uppercase font-bold tracking-widest text-neutral-500 dark:text-[#8E8A85]">0% EMI Adoption Rate</div>
                <div className="font-mono text-2xl sm:text-3xl font-bold text-emerald-600 dark:text-emerald-400">
                  <CountUp to={68.4} decimals={1} suffix="%" duration={1.5} />
                </div>
                <div className="text-xs text-neutral-500 dark:text-neutral-400">Primary: HDFC &amp; ICICI Bank cards</div>
              </SpotlightCard>
            </div>

            {/* Bento Breakdown Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Brand Revenue Share */}
              <div className="p-6 sm:p-8 rounded-2xl sm:rounded-3xl bg-white dark:bg-[#0E121B] border border-neutral-200 dark:border-white/10 shadow-xs dark:shadow-xl space-y-4">
                <div className="border-b border-neutral-200 dark:border-white/10 pb-3 flex items-center justify-between">
                  <h4 className="font-serif-luxury text-base text-neutral-900 dark:text-white font-medium flex items-center gap-2">
                    <PieChart size={16} className="text-neutral-900 dark:text-white" />
                    <span>Brand Revenue Share</span>
                  </h4>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <div className="flex justify-between font-semibold mb-1 text-neutral-800 dark:text-neutral-200">
                      <span>Apple Flagships</span>
                      <span className="font-mono text-neutral-900 dark:text-white font-bold">52% (₹77.4L)</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-neutral-200 dark:bg-white/10 overflow-hidden">
                      <div className="h-full bg-neutral-900 dark:bg-white w-[52%]"></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between font-semibold mb-1 text-neutral-800 dark:text-neutral-200">
                      <span>Samsung Galaxy S-Series</span>
                      <span className="font-mono text-neutral-600 dark:text-neutral-300">32% (₹47.6L)</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-neutral-200 dark:bg-white/10 overflow-hidden">
                      <div className="h-full bg-neutral-600 dark:bg-neutral-400 w-[32%]"></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between font-semibold mb-1 text-neutral-800 dark:text-neutral-200">
                      <span>Google Pixel Pro &amp; Fold</span>
                      <span className="font-mono text-neutral-600 dark:text-neutral-300">11% (₹16.3L)</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-neutral-200 dark:bg-white/10 overflow-hidden">
                      <div className="h-full bg-neutral-400 dark:bg-neutral-500 w-[11%]"></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between font-semibold mb-1 text-neutral-800 dark:text-neutral-200">
                      <span>OnePlus &amp; Luxury Audio</span>
                      <span className="font-mono text-neutral-600 dark:text-neutral-300">5% (₹7.4L)</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-neutral-200 dark:bg-white/10 overflow-hidden">
                      <div className="h-full bg-neutral-300 dark:bg-neutral-600 w-[5%]"></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Gateway Channels */}
              <div className="p-6 sm:p-8 rounded-2xl sm:rounded-3xl bg-white dark:bg-[#0E121B] border border-neutral-200 dark:border-white/10 shadow-xs dark:shadow-xl space-y-4">
                <div className="border-b border-neutral-200 dark:border-white/10 pb-3 flex items-center justify-between">
                  <h4 className="font-serif-luxury text-base text-neutral-900 dark:text-white font-medium flex items-center gap-2">
                    <CreditCard size={16} className="text-neutral-900 dark:text-white" />
                    <span>Payment Channels</span>
                  </h4>
                </div>

                <div className="space-y-3.5 text-xs">
                  <div className="p-3 rounded-2xl bg-neutral-50 dark:bg-black/40 border border-neutral-200 dark:border-white/5 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-neutral-900 dark:text-white">0% No-Cost EMI</div>
                      <div className="text-[10px] text-neutral-500 dark:text-neutral-400">HDFC, ICICI, SBI, Bajaj</div>
                    </div>
                    <div className="text-right">
                      <div className="font-mono font-bold text-neutral-900 dark:text-white">68.4%</div>
                      <div className="text-[10px] text-emerald-600 dark:text-emerald-400">₹1.01 Cr</div>
                    </div>
                  </div>

                  <div className="p-3 rounded-2xl bg-neutral-50 dark:bg-black/40 border border-neutral-200 dark:border-white/5 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-neutral-900 dark:text-white">Prepaid UPI &amp; Cards</div>
                      <div className="text-[10px] text-neutral-500 dark:text-neutral-400">Instant QR &amp; Netbanking</div>
                    </div>
                    <div className="text-right">
                      <div className="font-mono font-bold text-neutral-900 dark:text-white">23.6%</div>
                      <div className="text-[10px] text-neutral-600 dark:text-neutral-300">₹35.1 Lakhs</div>
                    </div>
                  </div>

                  <div className="p-3 rounded-2xl bg-neutral-50 dark:bg-black/40 border border-neutral-200 dark:border-white/5 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-neutral-900 dark:text-white">Showroom Cash on Counter</div>
                      <div className="text-[10px] text-neutral-500 dark:text-neutral-400">Walk-in immediate handovers</div>
                    </div>
                    <div className="text-right">
                      <div className="font-mono font-bold text-neutral-900 dark:text-white">8.0%</div>
                      <div className="text-[10px] text-neutral-500 dark:text-neutral-400">₹11.9 Lakhs</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Best Selling Device Leaderboard */}
              <div className="p-6 sm:p-8 rounded-2xl sm:rounded-3xl bg-white dark:bg-[#0E121B] border border-neutral-200 dark:border-white/10 shadow-xs dark:shadow-xl space-y-4">
                <div className="border-b border-neutral-200 dark:border-white/10 pb-3 flex items-center justify-between">
                  <h4 className="font-serif-luxury text-base text-neutral-900 dark:text-white font-medium flex items-center gap-2">
                    <Sparkles size={16} className="text-neutral-900 dark:text-white" />
                    <span>Top Flagship Units</span>
                  </h4>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-black/30 border border-white/5">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-white">#1</span>
                      <span className="font-bold text-white">iPhone 16 Pro Max</span>
                    </div>
                    <span className="font-mono text-neutral-400">48 units</span>
                  </div>

                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-black/30 border border-white/5">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-white">#2</span>
                      <span className="font-bold text-white">Samsung Galaxy S25 Ultra</span>
                    </div>
                    <span className="font-mono text-neutral-400">34 units</span>
                  </div>

                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-black/30 border border-white/5">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-white">#3</span>
                      <span className="font-bold text-white">Google Pixel 9 Pro Fold</span>
                    </div>
                    <span className="font-mono text-neutral-400">18 units</span>
                  </div>

                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-black/30 border border-white/5">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-white">#4</span>
                      <span className="font-bold text-white">Sony WH-1000XM5 ANC</span>
                    </div>
                    <span className="font-mono text-neutral-400">29 units</span>
                  </div>
                </div>
              </div>

            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* SECTION 2: PROMOTIONS & COUPONS MATRIX */}
        {/* ========================================================================= */}
        {activeSection === 'coupons' && (
          <div className="space-y-6 animate-tab-in">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Left Column: Create Coupon */}
              <div className="lg:col-span-5 bg-white dark:bg-[#0E121B] border border-neutral-200 dark:border-white/10 p-5 sm:p-8 rounded-3xl space-y-4 shadow-xl">
                <div className="border-b border-neutral-200 dark:border-white/10 pb-3">
                  <h3 className="font-serif-luxury text-lg text-neutral-900 dark:text-white font-medium flex items-center gap-2">
                    <Tag size={17} className="text-neutral-900 dark:text-white" />
                    <span>Issue Promotional Voucher</span>
                  </h3>
                  <p className="text-xs text-neutral-500 dark:text-[#8E8A85] mt-0.5">Codes apply automatically or via customer checkout input.</p>
                </div>

                <form onSubmit={handleCreateCoupon} className="space-y-4 text-xs">
                  <div>
                    <label className="block text-neutral-700 dark:text-[#A8A49F] uppercase font-bold mb-1">Voucher Code</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. FESTIVE2026"
                      value={newCouponCode}
                      onChange={(e) => setNewCouponCode(e.target.value.toUpperCase())}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-50 dark:bg-black/60 border border-neutral-200 dark:border-white/10 text-neutral-900 dark:text-white font-mono text-base outline-none focus:border-neutral-900 dark:focus:border-white"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-neutral-700 dark:text-[#A8A49F] uppercase font-bold mb-1">Type</label>
                      <select
                        value={newCouponType}
                        onChange={(e: any) => setNewCouponType(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-50 dark:bg-black/60 border border-neutral-200 dark:border-white/10 text-neutral-900 dark:text-white text-base outline-none focus:border-neutral-900 dark:focus:border-white"
                      >
                        <option value="percentage">Percentage (%)</option>
                        <option value="flat">Flat Cash (₹)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-neutral-700 dark:text-[#A8A49F] uppercase font-bold mb-1">Value ({newCouponType === 'percentage' ? '%' : '₹'})</label>
                      <input
                        type="number"
                        required
                        value={newCouponValue}
                        onChange={(e) => setNewCouponValue(Number(e.target.value))}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-50 dark:bg-black/60 border border-neutral-200 dark:border-white/10 text-neutral-900 dark:text-white text-base outline-none focus:border-neutral-900 dark:focus:border-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-neutral-700 dark:text-[#A8A49F] uppercase font-bold mb-1">Min. Cart Value (INR)</label>
                    <input
                      type="number"
                      value={newCouponMinCart}
                      onChange={(e) => setNewCouponMinCart(Number(e.target.value))}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-50 dark:bg-black/60 border border-neutral-200 dark:border-white/10 text-neutral-900 dark:text-white text-base outline-none focus:border-neutral-900 dark:focus:border-white"
                    />
                  </div>

                  <div>
                    <label className="block text-neutral-700 dark:text-[#A8A49F] uppercase font-bold mb-1">Description</label>
                    <input
                      type="text"
                      placeholder="Special discount concession"
                      value={newCouponDesc}
                      onChange={(e) => setNewCouponDesc(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-50 dark:bg-black/60 border border-neutral-200 dark:border-white/10 text-neutral-900 dark:text-white text-base outline-none focus:border-neutral-900 dark:focus:border-white"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-white dark:text-black font-bold text-xs uppercase tracking-wider dark:hover:bg-neutral-200 cursor-pointer shadow-md transition-all active:scale-98"
                  >
                    Publish Voucher
                  </button>
                </form>
              </div>

              {/* Right Column: Active Coupons List */}
              <div className="lg:col-span-7 bg-white dark:bg-[#0E121B] border border-neutral-200 dark:border-white/10 p-5 sm:p-8 rounded-3xl space-y-4 shadow-xl">
                <div className="border-b border-neutral-200 dark:border-white/10 pb-3 flex items-center justify-between">
                  <h4 className="font-serif-luxury text-base text-neutral-900 dark:text-white font-medium">Active Store Vouchers ({coupons.length})</h4>
                </div>

                <div className="space-y-3">
                  {coupons.map((c) => (
                    <div
                      key={c.code}
                      className="p-4 rounded-2xl bg-neutral-50 dark:bg-black/40 border border-neutral-200 dark:border-white/10 hover:border-neutral-400 dark:hover:border-white/30 transition-all flex items-center justify-between gap-3"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-sm font-bold text-neutral-900 dark:text-white">{c.code}</span>
                          <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold font-mono">
                            {c.discountType === 'percentage' ? `${c.value}% OFF` : `₹${c.value} OFF`}
                          </span>
                        </div>
                        <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">{c.description || 'Valid across flagships'}</p>
                        <span className="text-[10px] text-neutral-500">Min Cart: ₹{c.minCart?.toLocaleString('en-IN') || 0}</span>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => handleToggleCoupon(c.code)}
                          className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                            c.active ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300' : 'bg-neutral-200 dark:bg-white/10 text-neutral-600 dark:text-neutral-400'
                          }`}
                        >
                          {c.active ? 'Active' : 'Disabled'}
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDeleteCoupon(c.code)}
                          className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-500 dark:text-red-400 cursor-pointer"
                          title="Delete voucher"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SECTION 3: ANNOUNCEMENT BROADCAST STUDIO (UPGRADED) */}
        {/* ========================================================================= */}
        {activeSection === 'announcements' && (
          <form onSubmit={handleSaveAnnouncement} className="space-y-6 animate-tab-in">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
              
              {/* Configuration Form */}
              <div className="lg:col-span-7 bg-white dark:bg-[#0E121B] border border-neutral-200 dark:border-white/10 p-5 sm:p-8 rounded-3xl space-y-5 shadow-2xl">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-200 dark:border-white/10 pb-4">
                  <div>
                    <h3 className="font-serif-luxury text-xl text-neutral-900 dark:text-white font-medium flex items-center gap-2">
                      <Megaphone size={18} className="text-neutral-900 dark:text-white" />
                      <span>Storewide Broadcast Studio</span>
                    </h3>
                    <p className="text-xs text-neutral-500 dark:text-[#8E8A85] mt-0.5">Control live modals, ambient ticker, countdown timers, and vouchers.</p>
                  </div>
                  <button
                    type="submit"
                    className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-full bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-white dark:text-black font-bold text-xs uppercase tracking-wider dark:hover:bg-neutral-200 cursor-pointer shadow-lg transition-all active:scale-98"
                  >
                    <Save size={14} />
                    <span>Broadcast Live</span>
                  </button>
                </div>

                {/* Active Toggle & Ticker Toggle */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="flex items-center justify-between p-3.5 rounded-2xl bg-neutral-50 dark:bg-black/40 border border-neutral-200 dark:border-white/10">
                    <div>
                      <div className="text-xs font-bold text-neutral-900 dark:text-white">Modal Pop-up</div>
                      <div className="text-[10px] text-neutral-500 dark:text-neutral-400">Display on visit</div>
                    </div>
                    <input
                      type="checkbox"
                      checked={announcement.active}
                      onChange={(e) => setAnnouncement({ ...announcement, active: e.target.checked })}
                      className="w-4 h-4 cursor-pointer"
                    />
                  </div>

                  <div className="flex items-center justify-between p-3.5 rounded-2xl bg-neutral-50 dark:bg-black/40 border border-neutral-200 dark:border-white/10">
                    <div>
                      <div className="text-xs font-bold text-neutral-900 dark:text-white">Top Ambient Ticker</div>
                      <div className="text-[10px] text-neutral-500 dark:text-neutral-400">Header marquee bar</div>
                    </div>
                    <input
                      type="checkbox"
                      checked={announcement.tickerActive !== false}
                      onChange={(e) => setAnnouncement({ ...announcement, tickerActive: e.target.checked })}
                      className="w-4 h-4 cursor-pointer"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block uppercase tracking-wider text-neutral-700 dark:text-[#A8A49F] mb-1.5 text-xs font-medium">
                      Badge Text
                    </label>
                    <input
                      type="text"
                      value={announcement.badge || ''}
                      onChange={(e) => setAnnouncement({ ...announcement, badge: e.target.value })}
                      placeholder="VIP Showroom Exclusive"
                      className="w-full px-4 py-2.5 rounded-xl bg-neutral-50 dark:bg-black/50 border border-neutral-200 dark:border-white/10 text-neutral-900 dark:text-white text-base outline-none focus:border-neutral-900 dark:focus:border-white"
                    />
                  </div>

                  <div>
                    <label className="block uppercase tracking-wider text-neutral-700 dark:text-[#A8A49F] mb-1.5 text-xs font-medium">
                      Visual Luxury Theme
                    </label>
                    <select
                      value={announcement.theme || 'obsidian'}
                      onChange={(e: any) => setAnnouncement({ ...announcement, theme: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-neutral-50 dark:bg-black/50 border border-neutral-200 dark:border-white/10 text-neutral-900 dark:text-white text-base outline-none focus:border-neutral-900 dark:focus:border-white"
                    >
                      <option value="obsidian">Stealth Obsidian Titanium (Black &amp; White)</option>
                      <option value="emerald">Emerald High-Precision</option>
                      <option value="crimson">Royal Festive Crimson</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block uppercase tracking-wider text-neutral-700 dark:text-[#A8A49F] mb-1.5 text-xs font-medium">
                    Headline Title
                  </label>
                  <input
                    type="text"
                    required
                    value={announcement.title}
                    onChange={(e) => setAnnouncement({ ...announcement, title: e.target.value })}
                    placeholder="e.g. Royal Festive Privilege Drop"
                    className="w-full px-4 py-2.5 rounded-xl bg-neutral-50 dark:bg-black/50 border border-neutral-200 dark:border-white/10 text-neutral-900 dark:text-white text-base outline-none focus:border-neutral-900 dark:focus:border-white"
                  />
                </div>

                <div>
                  <label className="block uppercase tracking-wider text-neutral-700 dark:text-[#A8A49F] mb-1.5 text-xs font-medium">
                    Subtitle / Eyebrow (Optional)
                  </label>
                  <input
                    type="text"
                    value={announcement.subtitle || ''}
                    onChange={(e) => setAnnouncement({ ...announcement, subtitle: e.target.value })}
                    placeholder="Official Manufacturer Sealed Stock"
                    className="w-full px-4 py-2.5 rounded-xl bg-neutral-50 dark:bg-black/50 border border-neutral-200 dark:border-white/10 text-neutral-900 dark:text-white text-base outline-none focus:border-neutral-900 dark:focus:border-white"
                  />
                </div>

                <div>
                  <label className="block uppercase tracking-wider text-neutral-700 dark:text-[#A8A49F] mb-1.5 text-xs font-medium">
                    Detailed Announcement Copy
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={announcement.message}
                    onChange={(e) => setAnnouncement({ ...announcement, message: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-neutral-50 dark:bg-black/50 border border-neutral-200 dark:border-white/10 text-neutral-900 dark:text-white text-base outline-none focus:border-neutral-900 dark:focus:border-white resize-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block uppercase tracking-wider text-neutral-700 dark:text-[#A8A49F] mb-1.5 text-xs font-medium">
                      Promo Code Voucher
                    </label>
                    <input
                      type="text"
                      value={announcement.promoCode || ''}
                      onChange={(e) => setAnnouncement({ ...announcement, promoCode: e.target.value.toUpperCase() })}
                      placeholder="ROYAL10"
                      className="w-full px-4 py-2.5 rounded-xl bg-neutral-50 dark:bg-black/50 border border-neutral-200 dark:border-white/10 text-neutral-900 dark:text-white font-mono text-base outline-none focus:border-neutral-900 dark:focus:border-white"
                    />
                  </div>

                  <div>
                    <label className="block uppercase tracking-wider text-neutral-700 dark:text-[#A8A49F] mb-1.5 text-xs font-medium">
                      Countdown Timer Expiry
                    </label>
                    <input
                      type="datetime-local"
                      value={announcement.countdownExpiry ? announcement.countdownExpiry.slice(0, 16) : ''}
                      onChange={(e) => setAnnouncement({ ...announcement, countdownExpiry: new Date(e.target.value).toISOString() })}
                      className="w-full px-4 py-2.5 rounded-xl bg-neutral-50 dark:bg-black/50 border border-neutral-200 dark:border-white/10 text-neutral-900 dark:text-white font-mono text-base outline-none focus:border-neutral-900 dark:focus:border-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block uppercase tracking-wider text-neutral-700 dark:text-[#A8A49F] mb-1.5 text-xs font-medium">
                    Flyer / Hero Image (Direct Upload)
                  </label>
                  
                  <input
                    type="file"
                    ref={flyerInputRef}
                    accept="image/*"
                    onChange={handleFlyerUpload}
                    className="hidden"
                  />

                  <div className="flex flex-wrap items-center gap-3">
                    <button
                      type="button"
                      onClick={() => flyerInputRef.current?.click()}
                      disabled={uploadingFlyer}
                      className="px-4 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-white dark:text-black dark:hover:bg-neutral-200 text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-sm"
                    >
                      <Upload size={14} />
                      <span>{uploadingFlyer ? 'Uploading to Server...' : 'Choose Flyer from Device'}</span>
                    </button>

                    {announcement.imageUrl && (
                      <button
                        type="button"
                        onClick={() => setAnnouncement({ ...announcement, imageUrl: '' })}
                        className="text-xs text-rose-500 dark:text-rose-400 hover:underline font-semibold cursor-pointer"
                      >
                        Remove Flyer
                      </button>
                    )}
                  </div>

                  {announcement.imageUrl && (
                    <div className="mt-3 flex items-center gap-3 p-2.5 rounded-xl bg-neutral-50 dark:bg-black/40 border border-neutral-200 dark:border-white/10">
                      <img
                        src={announcement.imageUrl}
                        alt="Flyer Preview"
                        className="w-16 h-16 object-cover rounded-lg border border-neutral-200 dark:border-white/10 shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-neutral-900 dark:text-white truncate">Active Promotion Flyer</p>
                        <p className="text-[10px] text-neutral-500 dark:text-gray-400 truncate">
                          {announcement.imageUrl.startsWith('/uploads') ? 'Stored on local server' : 'Ready'}
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="flex gap-2 mt-2">
                    <button
                      type="button"
                      onClick={() => setAnnouncement({ ...announcement, imageUrl: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=1200&q=80' })}
                      className="text-[10px] text-neutral-500 dark:text-neutral-400 underline hover:text-neutral-900 dark:hover:text-white cursor-pointer"
                    >
                      Use Flagship Sample
                    </button>
                    <button
                      type="button"
                      onClick={() => setAnnouncement({ ...announcement, imageUrl: 'https://images.unsplash.com/photo-1616348436168-de43ad0db179?q=80&w=1200&auto=format&fit=crop' })}
                      className="text-[10px] text-neutral-500 dark:text-neutral-400 underline hover:text-neutral-900 dark:hover:text-white cursor-pointer"
                    >
                      Use Titanium Silver Sample
                    </button>
                  </div>
                </div>
              </div>

              {/* Real-time Visual Handset Preview */}
              <div className="lg:col-span-5 bg-white dark:bg-[#0E121B] border border-neutral-200 dark:border-white/10 p-5 sm:p-8 rounded-3xl space-y-4 shadow-2xl flex flex-col">
                <div className="border-b border-neutral-200 dark:border-white/10 pb-3 flex items-center justify-between">
                  <h4 className="font-serif-luxury text-base text-neutral-900 dark:text-white font-medium flex items-center gap-2">
                    <Eye size={16} className="text-neutral-900 dark:text-white" />
                    <span>Real-time Modal Mockup</span>
                  </h4>
                  <span className={`text-[10px] uppercase font-mono px-2.5 py-1 rounded-full font-bold ${announcement.active ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/40' : 'bg-neutral-200 dark:bg-white/10 text-neutral-600 dark:text-gray-400'}`}>
                    {announcement.active ? 'Status: Active' : 'Status: Offline'}
                  </span>
                </div>

                <div className="flex-1 flex flex-col justify-center items-center p-3 bg-neutral-100 dark:bg-black/60 rounded-2xl border border-neutral-200 dark:border-white/5">
                  <div className="w-full max-w-sm bg-neutral-900 dark:bg-[#090C12] border border-neutral-700 dark:border-white/20 rounded-3xl overflow-hidden shadow-2xl text-white">
                    {announcement.imageUrl && (
                      <div className="w-full h-36 relative bg-neutral-950 overflow-hidden">
                        <img
                          src={announcement.imageUrl}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-white/15 text-white border border-white/20 text-[9px] font-bold">
                          {announcement.badge || 'VIP Bulletin'}
                        </div>
                      </div>
                    )}

                    <div className="p-4 space-y-2.5">
                      <div className="font-serif-luxury text-base font-bold text-white leading-snug">
                        <TrueFocus 
                          sentence={announcement.title || 'Announcement Headline'} 
                          manualMode={false} 
                          blurAmount={2} 
                          borderColor="rgba(255,255,255,0.8)" 
                          glowColor="rgba(255,255,255,0.25)" 
                          animationDuration={0.4} 
                        />
                      </div>
                      <p className="text-[11px] text-neutral-300 line-clamp-3 leading-relaxed">
                        {announcement.message || 'Notice content description...'}
                      </p>

                      {announcement.promoCode && (
                        <div className="p-2 rounded-xl bg-black/60 border border-white/20 flex items-center justify-between text-xs">
                          <span className="font-mono text-white font-bold text-xs">{announcement.promoCode}</span>
                          <span className="text-[10px] text-neutral-400">1-Click Pass</span>
                        </div>
                      )}

                      <div className="w-full py-2 rounded-xl bg-white text-black font-bold text-[11px] text-center">
                        {announcement.ctaText || 'Claim VIP Privilege'}
                      </div>
                    </div>
                  </div>

                  {/* Minimized pill preview */}
                  <div className="mt-4 flex items-center gap-2 px-3 py-1.5 rounded-full bg-neutral-900 dark:bg-[#0B0E14] text-white shadow-md border border-neutral-700 dark:border-white/20 text-[11px]">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span className="font-bold truncate max-w-[130px]">{announcement.title || 'Bulletin'}</span>
                    <span className="text-[9px] text-neutral-400 font-mono">(Floating Pill)</span>
                  </div>
                </div>
              </div>

            </div>
          </form>
        )}

        {/* ========================================================================= */}
        {/* SECTION 4: STOREFRONT LIVE UI DESIGN STUDIO */}
        {/* ========================================================================= */}
        {activeSection === 'ui_design' && (
          <form onSubmit={handleSaveSettings} className="space-y-6 animate-tab-in">
            <div className="bg-white dark:bg-[#0E121B] border border-neutral-200 dark:border-white/10 p-5 sm:p-8 rounded-3xl space-y-6 shadow-2xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-200 dark:border-white/10 pb-4">
                <div>
                  <h3 className="font-serif-luxury text-xl text-neutral-900 dark:text-white font-medium">Hero Stage &amp; Typography Control</h3>
                  <p className="text-xs text-neutral-500 dark:text-[#8E8A85] mt-0.5">Edit store headlines and badges live without modifying code.</p>
                </div>
                <button
                  type="submit"
                  className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-full bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-white dark:text-black font-bold text-xs uppercase tracking-wider dark:hover:bg-neutral-200 transition-all cursor-pointer shadow-lg active:scale-98"
                >
                  <Save size={14} />
                  <span>Publish Changes</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block uppercase tracking-wider text-neutral-700 dark:text-[#A8A49F] mb-1.5 text-xs font-medium">
                    Top Announcement Strip Text
                  </label>
                  <input
                    type="text"
                    value={settings.announcementText}
                    onChange={(e) => setSettings({ ...settings, announcementText: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-neutral-50 dark:bg-black/50 border border-neutral-200 dark:border-white/10 text-neutral-900 dark:text-white text-base outline-none focus:border-neutral-900 dark:focus:border-white"
                  />
                </div>

                <div>
                  <label className="block uppercase tracking-wider text-neutral-700 dark:text-[#A8A49F] mb-1.5 text-xs font-medium">
                    Trust Badge Tagline
                  </label>
                  <input
                    type="text"
                    value={settings.announcementBadge}
                    onChange={(e) => setSettings({ ...settings, announcementBadge: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-neutral-50 dark:bg-black/50 border border-neutral-200 dark:border-white/10 text-neutral-900 dark:text-white text-base outline-none focus:border-neutral-900 dark:focus:border-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block uppercase tracking-wider text-neutral-700 dark:text-[#A8A49F] mb-1.5 text-xs font-medium">
                    Hero Main Title
                  </label>
                  <input
                    type="text"
                    value={settings.heroTitle}
                    onChange={(e) => setSettings({ ...settings, heroTitle: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-neutral-50 dark:bg-black/50 border border-neutral-200 dark:border-white/10 text-neutral-900 dark:text-white text-base outline-none focus:border-neutral-900 dark:focus:border-white"
                  />
                </div>

                <div>
                  <label className="block uppercase tracking-wider text-neutral-700 dark:text-[#A8A49F] mb-1.5 text-xs font-medium">
                    Hero Subtitle
                  </label>
                  <input
                    type="text"
                    value={settings.heroSubtitle}
                    onChange={(e) => setSettings({ ...settings, heroSubtitle: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-neutral-50 dark:bg-black/50 border border-neutral-200 dark:border-white/10 text-neutral-900 dark:text-white text-base outline-none focus:border-neutral-900 dark:focus:border-white"
                  />
                </div>
              </div>

              <div>
                <label className="block uppercase tracking-wider text-neutral-700 dark:text-[#A8A49F] mb-1.5 text-xs font-medium">
                  Storefront Editorial Narrative
                </label>
                <textarea
                  rows={3}
                  value={settings.heroDescription}
                  onChange={(e) => setSettings({ ...settings, heroDescription: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-neutral-50 dark:bg-black/50 border border-neutral-200 dark:border-white/10 text-neutral-900 dark:text-white text-base outline-none focus:border-neutral-900 dark:focus:border-white resize-none"
                />
              </div>
            </div>
          </form>
        )}

        {/* ========================================================================= */}
        {/* SECTION 5: SHOWROOM IDENTITY & CONTACTS */}
        {/* ========================================================================= */}
        {activeSection === 'store_info' && (
          <form onSubmit={handleSaveSettings} className="space-y-6 animate-tab-in">
            <div className="bg-white dark:bg-[#0E121B] border border-neutral-200 dark:border-white/10 p-5 sm:p-8 rounded-3xl space-y-6 shadow-2xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-200 dark:border-white/10 pb-4">
                <h3 className="font-serif-luxury text-xl text-neutral-900 dark:text-white font-medium">Showroom Location &amp; Concierge</h3>
                <button
                  type="submit"
                  className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-full bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-white dark:text-black font-bold text-xs uppercase tracking-wider dark:hover:bg-neutral-200 transition-all active:scale-98"
                >
                  <Save size={14} />
                  <span>Save Contacts</span>
                </button>
              </div>

              <div>
                <label className="block uppercase tracking-wider text-neutral-700 dark:text-[#A8A49F] mb-1.5 text-xs font-medium">Physical Address</label>
                <input
                  type="text"
                  value={settings.storeAddress}
                  onChange={(e) => setSettings({ ...settings, storeAddress: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-neutral-50 dark:bg-black/50 border border-neutral-200 dark:border-white/10 text-neutral-900 dark:text-white text-base outline-none focus:border-neutral-900 dark:focus:border-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block uppercase tracking-wider text-neutral-700 dark:text-[#A8A49F] mb-1.5 text-xs font-medium">Showroom Phone</label>
                  <input
                    type="text"
                    value={settings.storePhone}
                    onChange={(e) => setSettings({ ...settings, storePhone: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-neutral-50 dark:bg-black/50 border border-neutral-200 dark:border-white/10 text-neutral-900 dark:text-white text-base outline-none focus:border-neutral-900 dark:focus:border-white"
                  />
                </div>

                <div>
                  <label className="block uppercase tracking-wider text-neutral-700 dark:text-[#A8A49F] mb-1.5 text-xs font-medium">Official WhatsApp Concierge</label>
                  <input
                    type="text"
                    value={settings.whatsappNumber}
                    onChange={(e) => setSettings({ ...settings, whatsappNumber: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-neutral-50 dark:bg-black/50 border border-neutral-200 dark:border-white/10 text-neutral-900 dark:text-white text-base outline-none focus:border-neutral-900 dark:focus:border-white"
                  />
                </div>

                <div>
                  <label className="block uppercase tracking-wider text-neutral-700 dark:text-[#A8A49F] mb-1.5 text-xs font-medium">VIP Support Email</label>
                  <input
                    type="email"
                    value={settings.storeEmail}
                    onChange={(e) => setSettings({ ...settings, storeEmail: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-neutral-50 dark:bg-black/50 border border-neutral-200 dark:border-white/10 text-neutral-900 dark:text-white text-base outline-none focus:border-neutral-900 dark:focus:border-white"
                  />
                </div>
              </div>
            </div>
          </form>
        )}

        {/* ========================================================================= */}
        {/* SECTION 6: 0% EMI BANKING RULES */}
        {/* ========================================================================= */}
        {activeSection === 'emi_rules' && (
          <form onSubmit={handleSaveSettings} className="space-y-6 animate-tab-in">
            <div className="bg-white dark:bg-[#0E121B] border border-neutral-200 dark:border-white/10 p-5 sm:p-8 rounded-3xl space-y-6 shadow-2xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-200 dark:border-white/10 pb-4">
                <h3 className="font-serif-luxury text-xl text-neutral-900 dark:text-white font-medium">0% No-Cost EMI Financing Policies</h3>
                <button
                  type="submit"
                  className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-full bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-white dark:text-black font-bold text-xs uppercase tracking-wider dark:hover:bg-neutral-200 transition-all active:scale-98"
                >
                  <Save size={14} />
                  <span>Update EMI Engine</span>
                </button>
              </div>

              <div>
                <label className="block uppercase tracking-wider text-neutral-700 dark:text-[#A8A49F] mb-1.5 text-xs font-medium">
                  Minimum Cart Requirement for 0% EMI (INR)
                </label>
                <input
                  type="number"
                  value={settings.emiMinCart}
                  onChange={(e) => setSettings({ ...settings, emiMinCart: Number(e.target.value) })}
                  className="w-full sm:w-64 px-4 py-2.5 rounded-xl bg-neutral-50 dark:bg-black/50 border border-neutral-200 dark:border-white/10 text-neutral-900 dark:text-white font-mono text-base outline-none focus:border-neutral-900 dark:focus:border-white"
                />
              </div>

              <div>
                <label className="block uppercase tracking-wider text-neutral-700 dark:text-[#A8A49F] mb-2 text-xs font-medium">
                  Partner Banking Gateways
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {['HDFC Bank', 'ICICI Bank', 'SBI Card', 'Axis Bank', 'Bajaj Finserv', 'OneCard'].map((bank) => (
                    <div key={bank} className="flex items-center gap-2 p-3 rounded-xl bg-neutral-50 dark:bg-black/40 border border-neutral-200 dark:border-white/5 text-xs">
                      <Check size={14} className="text-neutral-900 dark:text-white" />
                      <span className="text-neutral-900 dark:text-white font-medium">{bank}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </form>
        )}

        {/* ========================================================================= */}
        {/* SECTION 7: MASTER SECURITY & CREDENTIALS */}
        {/* ========================================================================= */}
        {activeSection === 'security' && (
          <form onSubmit={handleUpdateCredentials} className="space-y-6 animate-tab-in max-w-2xl mx-auto">
            <div className="bg-white dark:bg-[#0E121B] border border-neutral-200 dark:border-white/10 p-5 sm:p-8 rounded-3xl space-y-5 shadow-2xl">
              <div className="border-b border-neutral-200 dark:border-white/10 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="font-serif-luxury text-xl text-neutral-900 dark:text-white font-medium flex items-center gap-2">
                    <Lock size={18} className="text-neutral-900 dark:text-white" />
                    <span>Root Access Credentials</span>
                  </h3>
                  <p className="text-xs text-neutral-500 dark:text-[#8E8A85] mt-0.5">Control Staff terminal PINs and Owner Master suite keys.</p>
                </div>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-full bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-white dark:text-black font-bold text-xs uppercase tracking-wider dark:hover:bg-neutral-200 transition-all active:scale-98"
                >
                  Update Keys
                </button>
              </div>

              <div>
                <label className="block uppercase tracking-wider text-neutral-700 dark:text-[#A8A49F] mb-1.5 text-xs font-medium">
                  Default Staff Access PIN (4-Digits)
                </label>
                <input
                  type="text"
                  required
                  value={credentialsForm.newStaffPin}
                  onChange={(e) => setCredentialsForm({ ...credentialsForm, newStaffPin: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-neutral-50 dark:bg-black/50 border border-neutral-200 dark:border-white/10 text-neutral-900 dark:text-white text-base font-mono outline-none focus:border-neutral-900 dark:focus:border-white"
                />
              </div>

              <div>
                <label className="block uppercase tracking-wider text-neutral-700 dark:text-[#A8A49F] mb-1.5 text-xs font-medium">
                  Master Owner Access PIN
                </label>
                <input
                  type="text"
                  required
                  value={credentialsForm.newOwnerPin}
                  onChange={(e) => setCredentialsForm({ ...credentialsForm, newOwnerPin: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-neutral-50 dark:bg-black/50 border border-neutral-200 dark:border-white/10 text-neutral-900 dark:text-white text-base font-mono outline-none focus:border-neutral-900 dark:focus:border-white"
                />
              </div>

              <div>
                <label className="block uppercase tracking-wider text-neutral-700 dark:text-[#A8A49F] mb-1.5 text-xs font-medium">
                  Master Owner Password
                </label>
                <input
                  type="password"
                  required
                  value={credentialsForm.newOwnerPassword}
                  onChange={(e) => setCredentialsForm({ ...credentialsForm, newOwnerPassword: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-neutral-50 dark:bg-black/50 border border-neutral-200 dark:border-white/10 text-neutral-900 dark:text-white text-base font-mono outline-none focus:border-neutral-900 dark:focus:border-white"
                />
              </div>
            </div>
          </form>
        )}

        {/* ========================================================================= */}
        {/* SECTION 9: AUTHORIZED EMAIL WHITELIST & ACCESS CONTROL (RBAC) */}
        {/* ========================================================================= */}
        {activeSection === 'whitelist' && (
          <div className="space-y-6 animate-tab-in">
            {/* Top Info Banner & Metrics */}
            <div className="bg-white dark:bg-[#0E121B] border border-neutral-200 dark:border-white/10 p-5 sm:p-8 rounded-3xl space-y-6 shadow-2xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-200 dark:border-white/10 pb-5">
                <div>
                  <h3 className="font-serif-luxury text-xl sm:text-2xl text-neutral-900 dark:text-white font-medium flex items-center gap-2.5">
                    <ShieldCheck size={22} className="text-emerald-500 dark:text-emerald-400" />
                    <span>Executive Email Whitelist &amp; Access Control</span>
                  </h3>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 max-w-2xl leading-relaxed">
                    Zero-trust access enforcement. Only email addresses authorized in this directory can authenticate into the <span className="text-neutral-900 dark:text-white font-mono font-bold">#owner08</span> Master Suite or <span className="text-neutral-900 dark:text-white font-mono font-bold">#staff08</span> Operations Terminal.
                  </p>
                </div>

                <button
                  onClick={() => setIsAddWhitelistOpen(true)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-white dark:hover:bg-neutral-200 dark:text-black font-bold text-xs uppercase tracking-wider transition-all shadow-lg cursor-pointer self-start sm:self-auto shrink-0 active:scale-98"
                >
                  <UserPlus size={15} />
                  <span>Authorize New Email</span>
                </button>
              </div>

              {/* KPI Mini Bento */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-black/40 border border-neutral-200 dark:border-white/5 space-y-1">
                  <div className="text-[10px] uppercase font-bold tracking-widest text-neutral-500 dark:text-neutral-400">Total Authorized</div>
                  <div className="text-2xl font-mono font-bold text-neutral-900 dark:text-white">{whitelist.length}</div>
                  <div className="text-[10px] text-neutral-500 font-mono">Whitelisted Accounts</div>
                </div>

                <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-black/40 border border-neutral-200 dark:border-white/5 space-y-1">
                  <div className="text-[10px] uppercase font-bold tracking-widest text-purple-600 dark:text-purple-400">Owner Level</div>
                  <div className="text-2xl font-mono font-bold text-purple-700 dark:text-purple-300">
                    {whitelist.filter(w => w.role === 'owner').length}
                  </div>
                  <div className="text-[10px] text-neutral-500 font-mono">Root Suite Clearance</div>
                </div>

                <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-black/40 border border-neutral-200 dark:border-white/5 space-y-1">
                  <div className="text-[10px] uppercase font-bold tracking-widest text-blue-600 dark:text-blue-400">Staff Level</div>
                  <div className="text-2xl font-mono font-bold text-blue-700 dark:text-blue-300">
                    {whitelist.filter(w => w.role === 'staff').length}
                  </div>
                  <div className="text-[10px] text-neutral-500 font-mono">Terminal Clearance</div>
                </div>

                <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-black/40 border border-neutral-200 dark:border-white/5 space-y-1">
                  <div className="text-[10px] uppercase font-bold tracking-widest text-emerald-600 dark:text-emerald-400">Active Status</div>
                  <div className="text-2xl font-mono font-bold text-emerald-700 dark:text-emerald-300">
                    {whitelist.filter(w => w.status === 'Active').length}
                  </div>
                  <div className="text-[10px] text-neutral-500 font-mono">Permitted Logins</div>
                </div>
              </div>

              {/* Filter & Search Controls */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                <div className="flex items-center gap-2 w-full sm:w-80 px-3.5 py-2 rounded-xl bg-neutral-50 dark:bg-black/50 border border-neutral-200 dark:border-white/10 text-xs">
                  <Mail size={14} className="text-neutral-400 shrink-0" />
                  <input
                    type="text"
                    placeholder="Search by email or name..."
                    value={whitelistSearch}
                    onChange={(e) => setWhitelistSearch(e.target.value)}
                    className="bg-transparent text-neutral-900 dark:text-white outline-none w-full placeholder:text-neutral-500 text-base sm:text-xs"
                  />
                  {whitelistSearch && (
                    <button onClick={() => setWhitelistSearch('')} className="text-neutral-400 hover:text-neutral-900 dark:hover:text-white text-xs cursor-pointer">✕</button>
                  )}
                </div>

                <div className="flex items-center gap-1.5 self-start sm:self-auto bg-neutral-100 dark:bg-black/40 p-1 rounded-xl border border-neutral-200 dark:border-white/5 text-xs w-full sm:w-auto overflow-x-auto">
                  {(['all', 'owner', 'staff'] as const).map((mode) => (
                    <button
                      key={mode}
                      onClick={() => setWhitelistRoleFilter(mode)}
                      className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold tracking-wider uppercase transition-all cursor-pointer whitespace-nowrap ${
                        whitelistRoleFilter === mode
                          ? 'bg-neutral-900 text-white dark:bg-white dark:text-black font-bold shadow-sm'
                          : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
                      }`}
                    >
                      {mode === 'all' ? 'All Roles' : mode === 'owner' ? 'Owner Only' : 'Staff Only'}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Whitelisted Emails Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {whitelist
                .filter(item => {
                  const matchSearch = item.email.toLowerCase().includes(whitelistSearch.toLowerCase()) ||
                    (item.name && item.name.toLowerCase().includes(whitelistSearch.toLowerCase()));
                  const matchRole = whitelistRoleFilter === 'all' || item.role === whitelistRoleFilter;
                  return matchSearch && matchRole;
                })
                .map((entry) => (
                  <div
                    key={entry.id}
                    className="p-5 rounded-3xl bg-white dark:bg-[#0E121B] border border-neutral-200 dark:border-white/10 hover:border-neutral-400 dark:hover:border-white/20 transition-all shadow-xl flex flex-col justify-between space-y-4 group"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3 min-w-0">
                        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 border ${
                          entry.role === 'owner'
                            ? 'bg-purple-500/10 border-purple-500/30 text-purple-600 dark:text-purple-400'
                            : 'bg-blue-500/10 border-blue-500/30 text-blue-600 dark:text-blue-400'
                        }`}>
                          {entry.role === 'owner' ? <KeyRound size={18} /> : <Users size={18} />}
                        </div>

                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-sm font-semibold text-neutral-900 dark:text-white truncate select-all">
                              {entry.email}
                            </span>
                            <button
                              onClick={() => {
                                navigator.clipboard.writeText(entry.email);
                                triggerSuccess(`Copied "${entry.email}" to clipboard`);
                              }}
                              className="text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors cursor-pointer shrink-0"
                              title="Copy email"
                            >
                              <Copy size={12} />
                            </button>
                          </div>

                          <div className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5 flex items-center gap-2">
                            <span>{entry.name || 'Authorized Member'}</span>
                            <span>•</span>
                            <span className="text-[10px] text-neutral-400">
                              {new Date(entry.addedAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Status Badge */}
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider border shrink-0 ${
                        entry.status === 'Active'
                          ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30'
                          : 'bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/30'
                      }`}>
                        {entry.status}
                      </span>
                    </div>

                    {/* Role & Actions Footer */}
                    <div className="pt-3 border-t border-neutral-100 dark:border-white/5 flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] text-neutral-500 dark:text-neutral-400 font-medium">Clearance:</span>
                        <select
                          value={entry.role}
                          onChange={(e) => handleUpdateWhitelistRole(entry.id, e.target.value as 'owner' | 'staff')}
                          className="bg-neutral-50 dark:bg-black/60 border border-neutral-200 dark:border-white/15 text-xs text-neutral-900 dark:text-white rounded-lg px-2.5 py-1.5 outline-none font-mono cursor-pointer hover:border-neutral-400 dark:hover:border-white/40"
                        >
                          <option value="owner">Owner Master Suite (#owner08)</option>
                          <option value="staff">Staff Operations (#staff08)</option>
                        </select>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleToggleWhitelistStatus(entry.id, entry.status)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                            entry.status === 'Active'
                              ? 'bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/20'
                              : 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20'
                          }`}
                        >
                          {entry.status === 'Active' ? 'Suspend' : 'Activate'}
                        </button>

                        <button
                          onClick={() => handleDeleteWhitelist(entry.id, entry.email)}
                          className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 border border-red-500/20 transition-all cursor-pointer"
                          title="Revoke clearance"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
            </div>

            {/* Add Whitelist Modal */}
            {isAddWhitelistOpen && (
              <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
                <div className="w-full max-w-lg p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#0E121B] border border-neutral-200 dark:border-white/20 shadow-2xl space-y-5 animate-tab-in relative">
                  <div className="flex items-center justify-between border-b border-neutral-200 dark:border-white/10 pb-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-neutral-100 dark:bg-white/10 text-neutral-900 dark:text-white flex items-center justify-center">
                        <UserPlus size={18} />
                      </div>
                      <div>
                        <h4 className="font-serif-luxury text-lg text-neutral-900 dark:text-white font-medium">Authorize Email for Portal Login</h4>
                        <p className="text-xs text-neutral-500 dark:text-neutral-400">Grant portal authentication permission to a verified staff or owner email.</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setIsAddWhitelistOpen(false)}
                      className="text-neutral-400 hover:text-neutral-900 dark:hover:text-white text-sm cursor-pointer"
                    >
                      ✕
                    </button>
                  </div>

                  <form onSubmit={handleAddWhitelist} className="space-y-4">
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-neutral-700 dark:text-neutral-400 font-medium mb-1.5">
                        Corporate / Authorized Email *
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="e.g. manager@newradhaswami.com"
                        value={newWhitelistForm.email}
                        onChange={(e) => setNewWhitelistForm({ ...newWhitelistForm, email: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl bg-neutral-50 dark:bg-black/60 border border-neutral-200 dark:border-white/10 text-neutral-900 dark:text-white text-base font-mono outline-none focus:border-neutral-900 dark:focus:border-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs uppercase tracking-wider text-neutral-700 dark:text-neutral-400 font-medium mb-1.5">
                        Access Clearance Level *
                      </label>
                      <select
                        value={newWhitelistForm.role}
                        onChange={(e) => setNewWhitelistForm({ ...newWhitelistForm, role: e.target.value as 'owner' | 'staff' })}
                        className="w-full px-4 py-2.5 rounded-xl bg-neutral-50 dark:bg-black/60 border border-neutral-200 dark:border-white/10 text-neutral-900 dark:text-white text-base outline-none focus:border-neutral-900 dark:focus:border-white"
                      >
                        <option value="staff">Staff Operations (#staff08) — Inventory &amp; Counter Orders</option>
                        <option value="owner">Owner Master Suite (#owner08) — Root Executive Authority</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs uppercase tracking-wider text-neutral-700 dark:text-neutral-400 font-medium mb-1.5">
                        Associate Name / Department Notes
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Rahul Sharma (Inventory Manager)"
                        value={newWhitelistForm.name}
                        onChange={(e) => setNewWhitelistForm({ ...newWhitelistForm, name: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl bg-neutral-50 dark:bg-black/60 border border-neutral-200 dark:border-white/10 text-neutral-900 dark:text-white text-base outline-none focus:border-neutral-900 dark:focus:border-white"
                      />
                    </div>

                    <div className="pt-3 border-t border-neutral-200 dark:border-white/10 flex items-center justify-end gap-3">
                      <button
                        type="button"
                        onClick={() => setIsAddWhitelistOpen(false)}
                        className="px-4 py-2 rounded-full text-xs text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-6 py-2 rounded-full bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-white dark:text-black font-bold text-xs uppercase tracking-wider dark:hover:bg-neutral-200 transition-all shadow-md active:scale-98 cursor-pointer"
                      >
                        Authorize Email
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}
        {/* Universal Mobile Quick Add / Edit Modal */}
        <MobileQuickAddModal
          isOpen={isQuickAddOpen}
          onClose={() => {
            setIsQuickAddOpen(false);
            setEditingProduct(null);
          }}
          initialProduct={editingProduct}
          onProductSaved={(savedProd) => {
            if (savedProd) {
              setLocalProducts(prev => {
                const exists = prev.some(p => p.id === savedProd.id);
                return exists ? prev.map(p => p.id === savedProd.id ? savedProd : p) : [savedProd, ...prev];
              });
            }
            onRefreshProducts();
            triggerSuccess('Handset saved & synced across all showroom devices!');
          }}
        />

      </div>

      {/* ========================================================================= */}
      {/* OWNER MASTER MOBILE NATIVE BOTTOM BAR (md:hidden) */}
      {/* ========================================================================= */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-[#0C0F16]/95 backdrop-blur-xl border-t border-neutral-200 dark:border-white/10 px-2 py-1.5 flex items-center justify-around md:hidden shadow-2xl safe-area-pb">
        <button
          type="button"
          onClick={() => { setActiveSection('inventory'); setIsMobileMoreOpen(false); }}
          className={`flex flex-col items-center gap-0.5 py-1 px-2.5 rounded-xl text-[10px] font-semibold transition-all cursor-pointer ${
            activeSection === 'inventory' && !isMobileMoreOpen
              ? 'text-neutral-950 dark:text-white font-bold scale-105'
              : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-white'
          }`}
        >
          <Smartphone size={18} className={activeSection === 'inventory' && !isMobileMoreOpen ? 'text-emerald-500' : ''} />
          <span>Stock</span>
        </button>

        <button
          type="button"
          onClick={() => { setActiveSection('financials'); setIsMobileMoreOpen(false); }}
          className={`flex flex-col items-center gap-0.5 py-1 px-2.5 rounded-xl text-[10px] font-semibold transition-all cursor-pointer ${
            activeSection === 'financials' && !isMobileMoreOpen
              ? 'text-neutral-950 dark:text-white font-bold scale-105'
              : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-white'
          }`}
        >
          <TrendingUp size={18} className={activeSection === 'financials' && !isMobileMoreOpen ? 'text-blue-500' : ''} />
          <span>Sales</span>
        </button>

        <button
          type="button"
          onClick={() => { setActiveSection('coupons'); setIsMobileMoreOpen(false); }}
          className={`flex flex-col items-center gap-0.5 py-1 px-2.5 rounded-xl text-[10px] font-semibold transition-all cursor-pointer ${
            activeSection === 'coupons' && !isMobileMoreOpen
              ? 'text-neutral-950 dark:text-white font-bold scale-105'
              : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-white'
          }`}
        >
          <Tag size={18} className={activeSection === 'coupons' && !isMobileMoreOpen ? 'text-amber-500' : ''} />
          <span>Promos</span>
        </button>

        <button
          type="button"
          onClick={() => { setActiveSection('announcements'); setIsMobileMoreOpen(false); }}
          className={`flex flex-col items-center gap-0.5 py-1 px-2.5 rounded-xl text-[10px] font-semibold transition-all cursor-pointer ${
            activeSection === 'announcements' && !isMobileMoreOpen
              ? 'text-neutral-950 dark:text-white font-bold scale-105'
              : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-white'
          }`}
        >
          <Megaphone size={18} className={activeSection === 'announcements' && !isMobileMoreOpen ? 'text-purple-500' : ''} />
          <span>Banner</span>
        </button>

        <button
          type="button"
          onClick={() => setIsMobileMoreOpen(!isMobileMoreOpen)}
          className={`flex flex-col items-center gap-0.5 py-1 px-2.5 rounded-xl text-[10px] font-semibold transition-all cursor-pointer ${
            isMobileMoreOpen || ['ui_design', 'store_info', 'emi_rules', 'security', 'whitelist'].includes(activeSection)
              ? 'text-neutral-950 dark:text-white font-bold scale-105'
              : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-white'
          }`}
        >
          <MoreHorizontal size={18} className={isMobileMoreOpen || ['ui_design', 'store_info', 'emi_rules', 'security', 'whitelist'].includes(activeSection) ? 'text-rose-500' : ''} />
          <span>More</span>
        </button>
      </nav>

      {/* Mobile More Sheet for Owner Suite */}
      {isMobileMoreOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex flex-col justify-end md:hidden animate-fade-in"
          onClick={() => setIsMobileMoreOpen(false)}
        >
          <div 
            className="bg-white dark:bg-[#0E121B] rounded-t-3xl border-t border-neutral-200 dark:border-white/10 p-5 space-y-3.5 max-h-[80vh] overflow-y-auto safe-area-pb shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            <div className="w-12 h-1 rounded-full bg-neutral-300 dark:bg-neutral-700 mx-auto" />
            
            <div className="flex items-center justify-between pb-2 border-b border-neutral-100 dark:border-white/5">
              <div>
                <h3 className="font-bold text-sm text-neutral-900 dark:text-white">Master Owner Controls</h3>
                <p className="text-[10px] text-neutral-500 dark:text-neutral-400">Executive showroom management &amp; settings</p>
              </div>
              <button 
                type="button" 
                onClick={() => setIsMobileMoreOpen(false)} 
                className="p-1.5 rounded-full bg-neutral-100 dark:bg-white/5 text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white cursor-pointer"
              >
                <X size={15} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => { setActiveSection('ui_design'); setIsMobileMoreOpen(false); }}
                className={`p-3 rounded-2xl border text-left active:scale-95 transition-all cursor-pointer flex items-center gap-2.5 ${
                  activeSection === 'ui_design'
                    ? 'bg-neutral-900 text-white dark:bg-white dark:text-black border-transparent'
                    : 'bg-neutral-50 dark:bg-white/5 border-neutral-200 dark:border-white/10 text-neutral-800 dark:text-white'
                }`}
              >
                <div className="p-2 rounded-xl bg-purple-500/15 text-purple-500 shrink-0"><Palette size={16} /></div>
                <div className="min-w-0">
                  <div className="text-xs font-bold truncate">Storefront</div>
                  <div className="text-[10px] opacity-70 truncate">Themes &amp; UI</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => { setActiveSection('store_info'); setIsMobileMoreOpen(false); }}
                className={`p-3 rounded-2xl border text-left active:scale-95 transition-all cursor-pointer flex items-center gap-2.5 ${
                  activeSection === 'store_info'
                    ? 'bg-neutral-900 text-white dark:bg-white dark:text-black border-transparent'
                    : 'bg-neutral-50 dark:bg-white/5 border-neutral-200 dark:border-white/10 text-neutral-800 dark:text-white'
                }`}
              >
                <div className="p-2 rounded-xl bg-blue-500/15 text-blue-500 shrink-0"><Building size={16} /></div>
                <div className="min-w-0">
                  <div className="text-xs font-bold truncate">Showroom</div>
                  <div className="text-[10px] opacity-70 truncate">Contact &amp; Hours</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => { setActiveSection('emi_rules'); setIsMobileMoreOpen(false); }}
                className={`p-3 rounded-2xl border text-left active:scale-95 transition-all cursor-pointer flex items-center gap-2.5 ${
                  activeSection === 'emi_rules'
                    ? 'bg-neutral-900 text-white dark:bg-white dark:text-black border-transparent'
                    : 'bg-neutral-50 dark:bg-white/5 border-neutral-200 dark:border-white/10 text-neutral-800 dark:text-white'
                }`}
              >
                <div className="p-2 rounded-xl bg-emerald-500/15 text-emerald-500 shrink-0"><CreditCard size={16} /></div>
                <div className="min-w-0">
                  <div className="text-xs font-bold truncate">0% EMI Rules</div>
                  <div className="text-[10px] opacity-70 truncate">Financing</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => { setActiveSection('security'); setIsMobileMoreOpen(false); }}
                className={`p-3 rounded-2xl border text-left active:scale-95 transition-all cursor-pointer flex items-center gap-2.5 ${
                  activeSection === 'security'
                    ? 'bg-neutral-900 text-white dark:bg-white dark:text-black border-transparent'
                    : 'bg-neutral-50 dark:bg-white/5 border-neutral-200 dark:border-white/10 text-neutral-800 dark:text-white'
                }`}
              >
                <div className="p-2 rounded-xl bg-amber-500/15 text-amber-500 shrink-0"><KeyRound size={16} /></div>
                <div className="min-w-0">
                  <div className="text-xs font-bold truncate">Security</div>
                  <div className="text-[10px] opacity-70 truncate">PINs &amp; Audit</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => { setActiveSection('whitelist'); setIsMobileMoreOpen(false); }}
                className={`col-span-2 p-3 rounded-2xl border text-left active:scale-95 transition-all cursor-pointer flex items-center gap-2.5 ${
                  activeSection === 'whitelist'
                    ? 'bg-neutral-900 text-white dark:bg-white dark:text-black border-transparent'
                    : 'bg-neutral-50 dark:bg-white/5 border-neutral-200 dark:border-white/10 text-neutral-800 dark:text-white'
                }`}
              >
                <div className="p-2 rounded-xl bg-indigo-500/15 text-indigo-500 shrink-0"><ShieldCheck size={16} /></div>
                <div className="min-w-0">
                  <div className="text-xs font-bold truncate">Staff &amp; Owner Email Whitelist</div>
                  <div className="text-[10px] opacity-70 truncate">{whitelist.length} Authorized Admin Accounts</div>
                </div>
              </button>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => {
                  setEditingProduct(null);
                  setIsQuickAddOpen(true);
                  setIsMobileMoreOpen(false);
                }}
                className="w-full py-3 rounded-2xl bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-200 text-white dark:text-black font-bold text-xs flex items-center justify-center gap-2 shadow-lg active:scale-98 cursor-pointer"
              >
                <Plus size={15} />
                <span>+ Express Add Handset to Catalog</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Dedicated Luxury Delete Handset Confirmation Modal */}
      {productToDelete && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in"
          onClick={() => setProductToDelete(null)}
        >
          <div 
            className="w-full max-w-sm bg-white dark:bg-[#0E121B] border border-neutral-200 dark:border-red-500/30 rounded-3xl p-6 shadow-2xl space-y-4"
            onClick={e => e.stopPropagation()}
          >
            <div className="w-12 h-12 rounded-2xl bg-red-50 dark:bg-red-500/15 border border-red-200 dark:border-red-500/30 text-red-600 dark:text-red-400 flex items-center justify-center mx-auto">
              <Trash2 size={22} />
            </div>
            <div className="text-center space-y-1.5">
              <h3 className="font-serif-luxury font-bold text-base sm:text-lg text-neutral-900 dark:text-white">Delete Handset from Catalog?</h3>
              <p className="text-xs text-neutral-600 dark:text-neutral-400">
                Are you sure you want to permanently remove <strong className="text-neutral-900 dark:text-white font-bold">{productToDelete.name}</strong> from showroom inventory?
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setProductToDelete(null)}
                className="py-2.5 px-4 rounded-xl bg-neutral-100 hover:bg-neutral-200 dark:bg-white/10 dark:hover:bg-white/15 text-neutral-800 dark:text-white text-xs font-semibold cursor-pointer transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDeletingProduct}
                onClick={handleConfirmDeleteProduct}
                className="py-2.5 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-lg shadow-red-600/30 cursor-pointer transition-all active:scale-98 flex items-center justify-center gap-1.5"
              >
                <Trash2 size={13} />
                <span>{isDeletingProduct ? 'Deleting...' : 'Delete Now'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
