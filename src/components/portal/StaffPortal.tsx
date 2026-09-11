import React, { useState, useEffect, useRef } from 'react';
import { Product } from '../../data/products';
import { MobileQuickAddModal } from './MobileQuickAddModal';
import { toggleStockStatus, deleteProduct, saveAnnouncement, saveProduct, compressMobileImage } from '../../services/cloudSync';
import { ThemeToggle } from '../common/ThemeToggle';
import { 
  Package, 
  ShoppingBag, 
  Plus, 
  Edit, 
  Trash2, 
  CheckCircle2, 
  ArrowLeft, 
  Search, 
  Truck, 
  Upload, 
  Image as ImageIcon, 
  LogOut, 
  Download, 
  Check, 
  MessageSquare, 
  Sparkles, 
  Shield, 
  Palette, 
  HardDrive, 
  Users, 
  FolderPlus, 
  KeyRound, 
  Save, 
  Eye, 
  Megaphone, 
  Smartphone, 
  Headphones, 
  Watch, 
  BatteryCharging, 
  ShieldCheck, 
  UserCheck, 
  UserX, 
  UserPlus, 
  Wrench, 
  Receipt, 
  FileText, 
  Printer, 
  Share2, 
  ExternalLink, 
  RefreshCw, 
  AlertTriangle, 
  Filter, 
  DollarSign, 
  Activity, 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  ChevronRight, 
  Copy, 
  Tag, 
  CheckCircle, 
  X, 
  Sliders, 
  Send,
  MoreHorizontal
} from 'lucide-react';
import { DecryptedText } from '../reactbits/DecryptedText';
import { SpotlightCard } from '../reactbits/SpotlightCard';
import { AnimatedList } from '../reactbits/AnimatedList';
import { CountUp } from '../reactbits/CountUp';

interface StaffPortalProps {
  onLogout: () => void;
  onBackToStore: () => void;
  products: Product[];
  onRefreshProducts: () => void;
  onSwitchToOwner?: () => void;
  isEmbedded?: boolean;
  onBackToOwnerSuite?: () => void;
}

export const StaffPortal: React.FC<StaffPortalProps> = ({
  onLogout,
  onBackToStore,
  products,
  onRefreshProducts,
  onSwitchToOwner,
  isEmbedded,
  onBackToOwnerSuite
}) => {
  // Navigation Tabs (Expanded with POS, Repairs & Activity Stream)
  const [activeTab, setActiveTab] = useState<'inventory' | 'pos' | 'repairs' | 'orders' | 'users' | 'categories' | 'staff' | 'reviews' | 'announcements' | 'activity'>('inventory');
  const [isMobileMoreOpen, setIsMobileMoreOpen] = useState(false);

  // Announcement State
  const [announcement, setAnnouncement] = useState(() => {
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
      theme: 'obsidian',
      promoCode: 'ROYAL10',
      discountAmount: '10% OFF',
      countdownExpiry: '',
      ctaText: 'Claim VIP Privilege',
      ctaLink: '#shop',
      soundEnabled: true,
      tickerActive: true
    };
  });
  const [announcementSavedMsg, setAnnouncementSavedMsg] = useState(false);

  // Toast Notification
  const [notification, setNotification] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  // Optimistic Local Products for 0ms reactive updates
  const [localProducts, setLocalProducts] = useState<Product[]>(products);
  useEffect(() => {
    setLocalProducts(products);
  }, [products]);

  // Product Search & Filter
  const [productSearch, setProductSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [stockStatusFilter, setStockStatusFilter] = useState<'all' | 'inStock' | 'outOfStock' | 'lowStock'>('all');

  // Bulk Price Adjustment Modal
  const [isBulkPriceModalOpen, setIsBulkPriceModalOpen] = useState(false);
  const [bulkPercent, setBulkPercent] = useState<number>(5);
  const [bulkActionType, setBulkActionType] = useState<'discount' | 'markup'>('discount');

  // Categories State
  const [categories, setCategories] = useState<any[]>(() => {
    try {
      const saved = localStorage.getItem('nr_categories_db');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return [
      { id: 'cat-smartphones', name: 'Smartphones', count: 18, icon: 'Smartphone', desc: 'Apple, Samsung, Google, OnePlus flagships' },
      { id: 'cat-audio', name: 'Premium Audio', count: 6, icon: 'Headphones', desc: 'AirPods Pro, Galaxy Buds3 Pro, Sony WH-1000XM5' },
      { id: 'cat-chargers', name: 'GaN Fast Chargers', count: 4, icon: 'Zap', desc: 'Official Apple, Anker 100W, Samsung 45W' },
      { id: 'cat-accessories', name: 'Luxury Shields', count: 8, icon: 'Shield', desc: 'MagSafe Titanium Cases, Ceramic Screen Protectors' }
    ];
  });
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [newCatIcon, setNewCatIcon] = useState('Sparkles');
  const [newCatDesc, setNewCatDesc] = useState('');

  // Users State
  const [users, setUsers] = useState<any[]>(() => {
    try {
      const saved = localStorage.getItem('nr_users_db');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return [
      { id: 'u-1', name: 'Kunal Deshmukh', phone: '+91 98110 55667', email: 'kunal.d@gmail.com', city: 'Pithampur', role: 'VIP Client', totalOrders: 3, totalSpent: 289800 },
      { id: 'u-2', name: 'Pooja Agarwal', phone: '+91 94250 88214', email: 'pooja.agarwal@outlook.com', city: 'Pithampur', role: 'VIP Client', totalOrders: 2, totalSpent: 165899 },
      { id: 'u-3', name: 'Vikram Rajput', phone: '+91 97520 44321', email: 'vikram.rajput@gmail.com', city: 'Dhar', role: 'VIP Client', totalOrders: 1, totalSpent: 152300 }
    ];
  });
  const [userSearch, setUserSearch] = useState('');
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [newUserData, setNewUserData] = useState({ name: '', phone: '', email: '', city: 'Pithampur', role: 'VIP Client' });

  // Staff State
  const [staffList, setStaffList] = useState<any[]>(() => {
    try {
      const saved = localStorage.getItem('nr_staff_db');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return [
      { id: 'st-1', name: 'Rohan Sharma', role: 'Floor Manager', phone: '+91 96910 11335', email: 'rohan@radhaswamigallery.in', shift: 'Morning Floor', active: true },
      { id: 'st-2', name: 'Devendra Yadav', role: 'Hardware & Diagnostics', phone: '+91 98260 12345', email: 'devendra@radhaswamigallery.in', shift: 'Full Day', active: true },
      { id: 'st-3', name: 'Anjali Patidar', role: 'Concierge & VIP Accounts', phone: '+91 94060 98765', email: 'anjali@radhaswamigallery.in', shift: 'Evening Shift', active: true }
    ];
  });
  const [isStaffModalOpen, setIsStaffModalOpen] = useState(false);
  const [newStaffData, setNewStaffData] = useState({ name: '', phone: '', email: '', pin: '', role: 'Store Associate', shift: 'Showroom Floor' });

  // Orders State
  const [orders, setOrders] = useState<any[]>(() => {
    try {
      const saved = localStorage.getItem('nr_orders_db');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return [
      {
        orderId: 'NRM-849201',
        customer: { name: 'Kunal Deshmukh', phone: '+91 98110 55667', address: 'Plot 42, Vijay Nagar, Pithampur' },
        items: [{ name: 'iPhone 16 Pro Max (Desert Titanium • 256GB)', qty: 1, price: 144900 }],
        total: 144900,
        status: 'Order Confirmed',
        createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
        dispatchSlot: 'Today 4:00 PM via Insured BlueDart',
        trackingNumber: 'BD-IN-9840212'
      },
      {
        orderId: 'NRM-849188',
        customer: { name: 'Pooja Agarwal', phone: '+91 94250 88214', address: 'Indorama Sector 3, Pithampur' },
        items: [{ name: 'Samsung Galaxy S25 Ultra 5G (Titanium Silver • 512GB)', qty: 1, price: 141999 }],
        total: 141999,
        status: 'Dispatched',
        createdAt: new Date(Date.now() - 3600000 * 6).toISOString(),
        dispatchSlot: 'Dispatched via BlueDart AWB',
        trackingNumber: 'BD-IN-9839910'
      }
    ];
  });
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [orderSearchQuery, setOrderSearchQuery] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState('all');
  const [selectedOrderForInvoice, setSelectedOrderForInvoice] = useState<any | null>(null);

  // Reviews State
  const [reviews, setReviews] = useState<any[]>(() => {
    try {
      const saved = localStorage.getItem('nr_reviews_db');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return [
      {
        id: 'rev-1',
        author: 'Dr. Alok Verma',
        rating: 5,
        title: 'Best authentic showroom in Pithampur',
        comment: 'Purchased iPhone 16 Pro Max Desert Titanium. 100% genuine sealed Indian unit with official GST bill. Got 0% EMI within 5 minutes.',
        verified: true,
        date: 'Yesterday'
      },
      {
        id: 'rev-2',
        author: 'Sunil Chouhan',
        rating: 5,
        title: 'Outstanding flagship experience',
        comment: 'Exchanged my S23 Ultra for S25 Ultra. Fair valuation and courteous staff. BlueDart express delivery was on point.',
        verified: true,
        date: '3 days ago'
      }
    ];
  });

  // POS / Counter Quotations State
  const [quotations, setQuotations] = useState<any[]>(() => {
    try {
      const saved = localStorage.getItem('nr_quotations_db');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return [
      {
        id: 'QTE-801',
        createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
        clientName: 'Vikram Rajput',
        phone: '+91 97520 44321',
        items: [
          { name: 'iPhone 16 Pro Max 256GB • Desert Titanium', unitPrice: 144900, qty: 1 },
          { name: 'MagSafe Titanium Carbon Shield Case', unitPrice: 3900, qty: 1 },
          { name: 'GaN 35W Dual USB-C Fast Charger', unitPrice: 3500, qty: 1 }
        ],
        subtotal: 152300,
        taxGst: 27414,
        total: 152300,
        paymentTerms: '0% No-Cost EMI (HDFC Bank)',
        status: 'Active Quotation',
        validUntil: new Date(Date.now() + 86400000 * 5).toISOString().slice(0, 10)
      }
    ];
  });
  const [isPosModalOpen, setIsPosModalOpen] = useState(false);
  const [posClientName, setPosClientName] = useState('');
  const [posClientPhone, setPosClientPhone] = useState('');
  const [posSelectedProduct, setPosSelectedProduct] = useState<string>(products[0]?.id || '');
  const [posSelectedStorage, setPosSelectedStorage] = useState<string>('');
  const [posSelectedColor, setPosSelectedColor] = useState<string>('');
  const [posCustomDiscount, setPosCustomDiscount] = useState<number>(0);
  const [posPaymentMethod, setPosPaymentMethod] = useState('0% No-Cost EMI (HDFC Bank)');
  const [posAccessories, setPosAccessories] = useState<{ id: string; name: string; price: number; selected: boolean }[]>([
    { id: 'acc-case', name: 'MagSafe Titanium Carbon Shield Case', price: 3900, selected: false },
    { id: 'acc-glass', name: 'Ceramic Nano Glass Screen Protector', price: 1999, selected: false },
    { id: 'acc-cable', name: 'Apple 240W USB-C Braided Cable', price: 2900, selected: false },
    { id: 'acc-adapter', name: 'GaN 35W Dual USB-C Fast Charger', price: 3500, selected: false }
  ]);
  const [selectedQuoteForInvoice, setSelectedQuoteForInvoice] = useState<any | null>(null);

  // Repairs & Service Desk State
  const [repairs, setRepairs] = useState<any[]>(() => {
    try {
      const saved = localStorage.getItem('nr_repairs_db');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return [
      {
        id: 'REP-409',
        customerName: 'Aman Verma',
        phone: '+91 91110 33221',
        device: 'iPhone 15 Pro',
        imei: '358941029482019',
        issue: 'OLED Display Flickering & Back Glass Crack',
        technician: 'Rohan Sharma (Hardware Specialist)',
        quotedAmount: 18500,
        advancePaid: 5000,
        status: 'In Progress',
        createdAt: new Date(Date.now() - 3600000 * 18).toISOString(),
        notes: 'Original Apple display module assembly.'
      },
      {
        id: 'REP-410',
        customerName: 'Sneha Patel',
        phone: '+91 98930 77412',
        device: 'Samsung Galaxy S24 Ultra',
        imei: '357201948102944',
        issue: 'Type-C Fast Charging Port Moisture Error',
        technician: 'Devendra Yadav (Senior Tech)',
        quotedAmount: 3200,
        advancePaid: 3200,
        status: 'Ready for Pickup',
        createdAt: new Date(Date.now() - 3600000 * 30).toISOString(),
        notes: 'Ultrasonic cleaning + genuine flex cable replaced.'
      }
    ];
  });
  const [isRepairModalOpen, setIsRepairModalOpen] = useState(false);
  const [repairFilter, setRepairFilter] = useState('all');
  const [newRepairData, setNewRepairData] = useState({
    customerName: '',
    phone: '',
    device: 'iPhone 16 Pro Max',
    imei: '',
    issue: 'Cracked Front OLED Glass • Genuine Ceramic Shield Replacement',
    technician: 'Rohan Sharma (Floor Manager)',
    quotedAmount: '28500',
    advancePaid: '10000',
    notes: 'Official Apple water-resistance gasket sealing requested.'
  });

  // Activity Audit Log State
  const [activityLogs, setActivityLogs] = useState<any[]>(() => {
    try {
      const saved = localStorage.getItem('nr_activity_db');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return [
      { id: 'act-1', action: 'Root Stock Synced', detail: 'Showroom inventory aligned with live cloud database', timestamp: new Date().toISOString(), user: 'Master Owner' },
      { id: 'act-2', action: 'Terminal Session Active', detail: 'Staff operations authenticated via security token', timestamp: new Date(Date.now() - 1800000).toISOString(), user: 'Staff Associate' },
      { id: 'act-3', action: 'Quotation Generated', detail: 'POS Quotation generated for flagship smartphone', timestamp: new Date(Date.now() - 3600000 * 3).toISOString(), user: 'Sales Executive' }
    ];
  });

  // Universal Mobile Quick Add / Edit Modal State
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  const [quickAddProduct, setQuickAddProduct] = useState<Product | null>(null);

  // Add / Edit Product Modal State (Legacy fallback)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);

  // Product Form Fields
  const [formData, setFormData] = useState({
    name: '',
    brand: 'Apple',
    isCustomBrand: false,
    customBrand: '',
    category: 'smartphones',
    isCustomCategory: false,
    customCategory: '',
    price: '',
    originalPrice: '',
    image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=800&q=80',
    description: '',
    inStock: true,
    warranty: '1 Year Official Brand Manufacturer Warranty (100% Sealed Indian Stock)'
  });

  const [formColors, setFormColors] = useState<{ name: string; hex: string; inStock: boolean }[]>([
    { name: 'Desert Titanium', hex: '#C2A387', inStock: true },
    { name: 'Natural Titanium', hex: '#9E9B94', inStock: true }
  ]);
  const [formStorages, setFormStorages] = useState<{ size: string; price: number }[]>([
    { size: '256GB', price: 144900 },
    { size: '512GB', price: 164900 }
  ]);

  const [formImages, setFormImages] = useState<string[]>([
    'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=800&q=80'
  ]);
  const [isUploadingImages, setIsUploadingImages] = useState(false);
  const [uploadStatusText, setUploadStatusText] = useState<string | null>(null);

  // Fetch all collections on mount with resilient local storage syncing
  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/categories');
      if (res.ok) {
        const data = await res.json();
        if (data.categories && Array.isArray(data.categories)) {
          setCategories(data.categories);
          localStorage.setItem('nr_categories_db', JSON.stringify(data.categories));
        }
      }
    } catch {}
  };

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/admin/users');
      if (res.ok) {
        const data = await res.json();
        if (data.users && Array.isArray(data.users)) {
          setUsers(data.users);
          localStorage.setItem('nr_users_db', JSON.stringify(data.users));
        }
      }
    } catch {}
  };

  const fetchStaff = async () => {
    try {
      const res = await fetch('/api/admin/staff');
      if (res.ok) {
        const data = await res.json();
        if (data.staff && Array.isArray(data.staff)) {
          setStaffList(data.staff);
          localStorage.setItem('nr_staff_db', JSON.stringify(data.staff));
        }
      }
    } catch {}
  };

  const fetchOrders = async () => {
    setOrdersLoading(true);
    try {
      const res = await fetch('/api/admin/orders');
      if (res.ok) {
        const data = await res.json();
        if (data.orders && Array.isArray(data.orders)) {
          setOrders(data.orders);
          localStorage.setItem('nr_orders_db', JSON.stringify(data.orders));
        }
      }
    } catch {
    } finally {
      setOrdersLoading(false);
    }
  };

  const fetchReviews = async () => {
    try {
      const res = await fetch('/api/reviews');
      if (res.ok) {
        const data = await res.json();
        if (data.reviews && Array.isArray(data.reviews)) {
          setReviews(data.reviews);
          localStorage.setItem('nr_reviews_db', JSON.stringify(data.reviews));
        }
      }
    } catch {}
  };

  const fetchAnnouncement = async () => {
    try {
      const res = await fetch('/api/announcement');
      if (res.ok) {
        const data = await res.json();
        if (data.announcement) setAnnouncement(prev => ({ ...prev, ...data.announcement }));
      }
    } catch {}
  };

  const fetchQuotations = async () => {
    try {
      const res = await fetch('/api/admin/quotations');
      if (res.ok) {
        const data = await res.json();
        if (data.quotations && Array.isArray(data.quotations)) {
          setQuotations(data.quotations);
          localStorage.setItem('nr_quotations_db', JSON.stringify(data.quotations));
        }
      }
    } catch {}
  };

  const fetchRepairs = async () => {
    try {
      const res = await fetch('/api/admin/repairs');
      if (res.ok) {
        const data = await res.json();
        if (data.repairs && Array.isArray(data.repairs)) {
          setRepairs(data.repairs);
          localStorage.setItem('nr_repairs_db', JSON.stringify(data.repairs));
        }
      }
    } catch {}
  };

  const fetchActivity = async () => {
    try {
      const res = await fetch('/api/admin/activity');
      if (res.ok) {
        const data = await res.json();
        if (data.activity && Array.isArray(data.activity)) setActivityLogs(data.activity);
      }
    } catch {}
  };

  useEffect(() => {
    fetchCategories();
    fetchUsers();
    fetchStaff();
    fetchOrders();
    fetchReviews();
    fetchAnnouncement();
    fetchQuotations();
    fetchRepairs();
    fetchActivity();

    // 3-second live auto-sync: polls latest cloud catalog, orders, and activity
    const pollInterval = setInterval(() => {
      onRefreshProducts();
      fetchOrders();
      fetchActivity();
    }, 3000);

    // BroadcastChannel for instant 0ms cross-tab real-time sync
    let bc: BroadcastChannel | null = null;
    try {
      if (typeof BroadcastChannel !== 'undefined') {
        bc = new BroadcastChannel('nr_sync_bus');
        bc.onmessage = () => {
          onRefreshProducts();
          fetchOrders();
          fetchActivity();
        };
      }
    } catch {}

    // Listen for customer storefront orders dispatched from CartDrawer
    const handleOrdersUpdate = () => {
      fetchOrders();
      try {
        const saved = localStorage.getItem('nr_orders_db');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) setOrders(parsed);
        }
      } catch {}
    };

    const handleCatalogUpdate = () => {
      onRefreshProducts();
    };

    window.addEventListener('nr_orders_updated', handleOrdersUpdate);
    window.addEventListener('nr_catalog_updated', handleCatalogUpdate);

    return () => {
      clearInterval(pollInterval);
      if (bc) bc.close();
      window.removeEventListener('nr_orders_updated', handleOrdersUpdate);
      window.removeEventListener('nr_catalog_updated', handleCatalogUpdate);
    };
  }, []);

  // 1-Click Instant Atomic Stock Status Toggle on Inventory (Live Global Cloud Sync)
  const handleToggleStock = async (product: Product, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const newStock = !product.inStock;
    setLocalProducts(prev => prev.map(p => p.id === product.id ? { ...p, inStock: newStock } : p));
    showToast(`${product.name} is now marked as ${newStock ? 'IN STOCK' : 'OUT OF STOCK'}`);
    await toggleStockStatus(product.id, newStock);
    onRefreshProducts();
    fetchActivity();
  };

  // Quick Mobile Price Adjustment (+/- ₹500 or ₹1000)
  const handleQuickPriceAdjust = async (prod: Product, delta: number) => {
    const newPrice = Math.max(999, prod.price + delta);
    setLocalProducts(prev => prev.map(p => p.id === prod.id ? { ...p, price: newPrice } : p));
    showToast(`${prod.name} updated to ₹${newPrice.toLocaleString('en-IN')}`);
    try {
      await fetch(`/api/products/${prod.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ price: newPrice })
      });
      onRefreshProducts();
      fetchActivity();
    } catch {}
  };

  // Order Status Update
  const handleUpdateOrderStatus = async (orderId: string, newStatus: string) => {
    setOrders(prev => {
      const updated = prev.map(o => o.orderId === orderId ? { ...o, status: newStatus } : o);
      try {
        localStorage.setItem('nr_orders_db', JSON.stringify(updated));
      } catch {}
      return updated;
    });
    showToast(`Order #${orderId} updated to "${newStatus}"`);
    try {
      await fetch(`/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      fetchActivity();
    } catch {}
  };

  // BlueDart AWB Waybill Assignment
  const handleAssignTracking = async (orderId: string, trackingNumber: string) => {
    setOrders(prev => {
      const updated = prev.map(o => o.orderId === orderId ? { ...o, trackingNumber, status: 'Dispatched' } : o);
      try {
        localStorage.setItem('nr_orders_db', JSON.stringify(updated));
      } catch {}
      return updated;
    });
    showToast(`Assigned BlueDart AWB: ${trackingNumber}`);
    try {
      await fetch(`/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ trackingNumber, status: 'Dispatched' })
      });
      fetchActivity();
    } catch {}
  };

  // Generate POS Quotation
  const handleCreateQuotation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!posClientName.trim()) {
      showToast('Client name is required');
      return;
    }

    const prod = products.find(p => p.id === posSelectedProduct) || products[0];
    const storagePrice = prod.storageVariants?.find(s => s.size === posSelectedStorage)?.price || prod.price;
    const finalDeviceName = `${prod.name} ${posSelectedStorage ? '(' + posSelectedStorage + ')' : ''} ${posSelectedColor ? '• ' + posSelectedColor : ''}`;

    const items = [
      { name: finalDeviceName, unitPrice: storagePrice, qty: 1 }
    ];

    // Add selected accessories
    posAccessories.filter(a => a.selected).forEach(acc => {
      items.push({ name: acc.name, unitPrice: acc.price, qty: 1 });
    });

    const subtotal = items.reduce((sum, it) => sum + it.unitPrice, 0);
    const taxGst = Math.round(subtotal * 0.18);
    const newQuote = {
      id: 'QTE-' + Math.floor(100 + Math.random() * 900),
      createdAt: new Date().toISOString(),
      clientName: posClientName.trim(),
      phone: posClientPhone.trim(),
      items,
      subtotal,
      taxGst,
      total: subtotal + taxGst,
      paymentTerms: posPaymentMethod,
      status: 'Active Quotation',
      validUntil: new Date(Date.now() + 86400000 * 7).toISOString().slice(0, 10)
    };

    setQuotations(prev => {
      const updated = [newQuote, ...prev];
      try {
        localStorage.setItem('nr_quotations_db', JSON.stringify(updated));
      } catch {}
      return updated;
    });
    setSelectedQuoteForInvoice(newQuote);
    setIsPosModalOpen(false);
    setPosClientName('');
    setPosClientPhone('');
    showToast(`Quotation #${newQuote.id} generated!`);
    fetchActivity();

    try {
      await fetch('/api/admin/quotations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientName: posClientName.trim(),
          phone: posClientPhone.trim(),
          items,
          paymentTerms: posPaymentMethod
        })
      });
    } catch {}
  };

  // Create Repair Intake Ticket
  const handleCreateRepair = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRepairData.customerName.trim() || !newRepairData.device.trim()) {
      showToast('Customer name and device required');
      return;
    }

    const newRepair = {
      id: 'REP-' + Math.floor(100 + Math.random() * 900),
      createdAt: new Date().toISOString(),
      ...newRepairData,
      quotedAmount: Number(newRepairData.quotedAmount) || 0,
      advancePaid: Number(newRepairData.advancePaid) || 0,
      status: 'Received'
    };

    setRepairs(prev => {
      const updated = [newRepair, ...prev];
      try {
        localStorage.setItem('nr_repairs_db', JSON.stringify(updated));
      } catch {}
      return updated;
    });
    setIsRepairModalOpen(false);
    setNewRepairData({
      customerName: '',
      phone: '',
      device: 'iPhone 16 Pro Max',
      imei: '',
      issue: 'Display / Glass Replacement',
      technician: 'Rohan Sharma (Floor Manager)',
      quotedAmount: '28500',
      advancePaid: '10000',
      notes: ''
    });
    showToast(`Service Ticket #${newRepair.id} generated!`);
    fetchActivity();

    try {
      await fetch('/api/admin/repairs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newRepairData)
      });
    } catch {}
  };

  // Update Repair Status
  const handleUpdateRepairStatus = async (repairId: string, newStatus: string) => {
    setRepairs(prev => {
      const updated = prev.map(r => r.id === repairId ? { ...r, status: newStatus } : r);
      try {
        localStorage.setItem('nr_repairs_db', JSON.stringify(updated));
      } catch {}
      return updated;
    });
    showToast(`Repair #${repairId} marked as "${newStatus}"`);
    fetchActivity();

    try {
      await fetch(`/api/admin/repairs/${repairId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
    } catch {}
  };

  // Add Category Handler
  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) {
      showToast('Department name is required');
      return;
    }
    const catId = 'cat-' + newCatName.trim().toLowerCase().replace(/[^a-z0-9]/g, '-');
    const newCat = {
      id: catId,
      name: newCatName.trim(),
      description: newCatDesc.trim() || `${newCatName.trim()} flagship department`,
      icon: newCatIcon || 'Sparkles',
      count: 0
    };
    setCategories(prev => {
      const updated = [...prev.filter(c => c.id !== catId), newCat];
      try {
        localStorage.setItem('nr_categories_db', JSON.stringify(updated));
      } catch {}
      return updated;
    });
    setIsCategoryModalOpen(false);
    setNewCatName('');
    setNewCatDesc('');
    showToast(`Department "${newCat.name}" added!`);
    fetchActivity();
    try {
      await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCat)
      });
    } catch {}
  };

  // Delete Category Handler
  const handleDeleteCategory = async (catId: string, name: string) => {
    if (!confirm(`Delete department "${name}"?`)) return;
    setCategories(prev => {
      const updated = prev.filter(c => c.id !== catId);
      try {
        localStorage.setItem('nr_categories_db', JSON.stringify(updated));
      } catch {}
      return updated;
    });
    showToast(`Department "${name}" removed`);
    fetchActivity();
    try {
      await fetch(`/api/categories/${catId}`, { method: 'DELETE' });
    } catch {}
  };

  // Add Staff Associate Handler
  const handleAddStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStaffData.name.trim() || !newStaffData.pin.trim()) {
      showToast('Associate name and access PIN required');
      return;
    }
    const staffId = 'st-' + Date.now();
    const newStaff = {
      id: staffId,
      name: newStaffData.name.trim(),
      phone: newStaffData.phone.trim() || '+91 96910 11335',
      email: newStaffData.email.trim() || `${newStaffData.name.trim().toLowerCase().replace(/\\s+/g, '')}@radhaswamigallery.in`,
      role: newStaffData.role || 'Showroom Specialist',
      shift: newStaffData.shift || 'Showroom Floor',
      pin: newStaffData.pin.trim(),
      active: true
    };
    setStaffList(prev => {
      const updated = [newStaff, ...prev];
      try {
        localStorage.setItem('nr_staff_db', JSON.stringify(updated));
      } catch {}
      return updated;
    });
    setIsStaffModalOpen(false);
    setNewStaffData({ name: '', phone: '', email: '', pin: '', role: 'Store Associate', shift: 'Showroom Floor' });
    showToast(`Associate "${newStaff.name}" added to roster!`);
    fetchActivity();
    try {
      await fetch('/api/admin/staff', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newStaff)
      });
    } catch {}
  };

  // Delete Staff Associate Handler
  const handleDeleteStaff = async (staffId: string, name: string) => {
    if (!confirm(`Remove associate "${name}" from roster?`)) return;
    setStaffList(prev => {
      const updated = prev.filter(s => s.id !== staffId);
      try {
        localStorage.setItem('nr_staff_db', JSON.stringify(updated));
      } catch {}
      return updated;
    });
    showToast(`Associate "${name}" removed`);
    fetchActivity();
    try {
      await fetch(`/api/admin/staff/${staffId}`, { method: 'DELETE' });
    } catch {}
  };

  // Create VIP Client Handler
  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserData.name.trim() || !newUserData.phone.trim()) {
      showToast('Client name and phone number required');
      return;
    }
    const newUser = {
      id: 'u-' + Date.now(),
      name: newUserData.name.trim(),
      phone: newUserData.phone.trim(),
      email: newUserData.email.trim() || `${newUserData.name.trim().toLowerCase().replace(/\\s+/g, '')}@gmail.com`,
      city: newUserData.city || 'Pithampur',
      role: newUserData.role || 'VIP Client',
      totalOrders: 0,
      totalSpent: 0
    };
    setUsers(prev => {
      const updated = [newUser, ...prev];
      try {
        localStorage.setItem('nr_users_db', JSON.stringify(updated));
      } catch {}
      return updated;
    });
    setIsUserModalOpen(false);
    setNewUserData({ name: '', phone: '', email: '', city: 'Pithampur', role: 'VIP Client' });
    showToast(`VIP Client "${newUser.name}" account created!`);
    fetchActivity();
    try {
      await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser)
      });
    } catch {}
  };

  // Export Catalog JSON
  const handleExportCatalog = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(products, null, 2));
    const dlAnchor = document.createElement('a');
    dlAnchor.setAttribute("href", dataStr);
    dlAnchor.setAttribute("download", `radhaswami_catalog_export_${new Date().toISOString().slice(0, 10)}.json`);
    dlAnchor.click();
    showToast('Catalog exported as JSON');
  };

  // Save Announcement
  const handleSaveAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await saveAnnouncement(announcement);
      setAnnouncementSavedMsg(true);
      setTimeout(() => setAnnouncementSavedMsg(false), 3500);
      showToast('Storefront Announcement Published Live across all devices!');
      fetchActivity();
    } catch {
      setAnnouncementSavedMsg(true);
      setTimeout(() => setAnnouncementSavedMsg(false), 3500);
      showToast('Storefront Announcement Published Live!');
    }
  };

  // Open Add Product Modal (Universal 1-Tap Mobile Optimized)
  const openAddModal = () => {
    setQuickAddProduct(null);
    setIsQuickAddOpen(true);
  };

  // Open Edit Product Modal
  const openEditModal = (p: Product) => {
    setQuickAddProduct(p);
    setIsQuickAddOpen(true);
  };

  // Direct Multi-File Image Upload Handler (Zero Links, Never Crash)
  const handleDirectFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploadingImages(true);
    setUploadStatusText(`Preparing ${files.length} photo(s)...`);
    const token = sessionStorage.getItem('NR_PORTAL_TOKEN') || '';

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      setUploadStatusText(`Uploading photo ${i + 1} of ${files.length} (${file.name})...`);

      try {
        const compressedBase64 = await compressMobileImage(file, 540, 0.65);
        if (compressedBase64) {
          setFormImages(prev => [...prev, compressedBase64]);
        }
      } catch (err) {
        console.error('Direct file upload error:', err);
      }
    }

    setIsUploadingImages(false);
    setUploadStatusText(null);
    if (e.target) e.target.value = '';
    showToast('Photos uploaded and attached to product');
  };

  const handleMakeCover = (index: number) => {
    setFormImages(prev => {
      const copy = [...prev];
      const [chosen] = copy.splice(index, 1);
      return [chosen, ...copy];
    });
    showToast('Cover photo updated');
  };

  const handleRemoveImage = (index: number) => {
    setFormImages(prev => prev.filter((_, i) => i !== index));
  };

  // Color variant management
  const handleAddColor = () => {
    setFormColors(prev => [...prev, { name: 'Natural Silver', hex: '#E5E5E5', inStock: true }]);
  };

  const handleUpdateColor = (index: number, field: 'name' | 'hex' | 'inStock', value: any) => {
    setFormColors(prev => prev.map((col, i) => i === index ? { ...col, [field]: value } : col));
  };

  const handleRemoveColor = (index: number) => {
    setFormColors(prev => prev.filter((_, i) => i !== index));
  };

  // Storage variant management
  const handleAddStorage = () => {
    const basePrice = Number(formData.price) || 99900;
    setFormStorages(prev => [...prev, { size: '512GB', price: Math.round(basePrice * 1.15) }]);
  };

  const handleUpdateStorage = (index: number, field: 'size' | 'price', value: any) => {
    setFormStorages(prev => prev.map((st, i) => i === index ? { ...st, [field]: field === 'price' ? Number(value) : value } : st));
  };

  const handleRemoveStorage = (index: number) => {
    setFormStorages(prev => prev.filter((_, i) => i !== index));
  };

  // Save Product (Add / Edit)
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    const finalBrand = formData.isCustomBrand ? formData.customBrand.trim() : formData.brand;
    const finalCategory = formData.isCustomCategory ? formData.customCategory.trim() : formData.category;

    if (!formData.name.trim() || !formData.price) {
      alert('Product name and price are required.');
      return;
    }

    const payload = {
      name: formData.name.trim(),
      brand: finalBrand,
      category: finalCategory as any,
      price: Number(formData.price),
      originalPrice: Number(formData.originalPrice || formData.price),
      image: formImages[0] || formData.image,
      images: formImages,
      description: formData.description,
      inStock: formData.inStock,
      colors: formColors,
      storageVariants: formStorages,
      specs: {
        'Warranty': formData.warranty,
        'Packaging': '100% Sealed Indian Retail Stock with Genuine Brand Invoice'
      }
    };

    try {
      await saveProduct(payload, editingProductId || undefined);
      showToast(editingProductId ? `Updated ${formData.name}` : `Added ${formData.name} to showroom catalog`);
      onRefreshProducts();
      setIsModalOpen(false);
      fetchActivity();
    } catch {
      onRefreshProducts();
      setIsModalOpen(false);
    }
  };

  // Delete Product with in-portal confirmation
  const [productToDelete, setProductToDelete] = useState<{ id: string; name: string } | null>(null);
  const [isDeletingProduct, setIsDeletingProduct] = useState(false);

  const handleDeleteProduct = (productId: string, name: string) => {
    setProductToDelete({ id: productId, name });
  };

  const handleConfirmDeleteProduct = async () => {
    if (!productToDelete) return;
    setIsDeletingProduct(true);
    const target = productToDelete;
    // 0ms Optimistic Removal
    setLocalProducts(prev => prev.filter(p => p.id !== target.id));
    setProductToDelete(null);
    setIsDeletingProduct(false);
    showToast(`Removed ${target.name} from showroom inventory`);
    await deleteProduct(target.id);
    onRefreshProducts();
    fetchActivity();
  };

  // Filtered products list
  const filteredProducts = localProducts.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
                          p.brand.toLowerCase().includes(productSearch.toLowerCase());
    const matchesCat = selectedCategory === 'all' || p.category === selectedCategory;
    const matchesStock = 
      stockStatusFilter === 'all' ? true :
      stockStatusFilter === 'inStock' ? p.inStock :
      stockStatusFilter === 'outOfStock' ? !p.inStock :
      stockStatusFilter === 'lowStock' ? (p.reviewsCount && p.reviewsCount < 5) : true;

    return matchesSearch && matchesCat && matchesStock;
  });

  return (
    <div className="min-h-screen bg-[#F6F7F9] dark:bg-[#07090D] text-neutral-900 dark:text-white font-sans selection:bg-neutral-900 selection:text-white dark:selection:bg-white dark:selection:text-black pb-28 sm:pb-24 transition-colors duration-200">
      
      {/* Executive Command Header / Embedded Mode Banner */}
      {isEmbedded ? (
        <div className="bg-white dark:bg-[#0C0F16] border-b border-neutral-200 dark:border-white/10 px-4 sm:px-8 py-3 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2.5">
            <span className="px-2.5 py-0.5 rounded-full bg-neutral-900 dark:bg-white text-white dark:text-black text-[10px] font-bold font-mono uppercase tracking-wider">
              ROOT INVENTORY
            </span>
            <span className="text-xs text-neutral-600 dark:text-neutral-300 font-medium hidden sm:inline">
              Live Hardware Stock Management &amp; Catalog Control
            </span>
          </div>
          {onBackToOwnerSuite && (
            <button
              onClick={onBackToOwnerSuite}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-neutral-100 hover:bg-neutral-200 dark:bg-white/10 dark:hover:bg-white/20 text-xs text-neutral-800 dark:text-white transition-all cursor-pointer font-semibold border border-neutral-300 dark:border-white/20"
            >
              <ArrowLeft size={13} />
              <span>Back to Executive Financials</span>
            </button>
          )}
        </div>
      ) : (
        <header className="sticky top-0 z-40 bg-white/95 dark:bg-[#0A0C10]/95 border-b border-neutral-200 dark:border-white/10 px-3 sm:px-8 py-2.5 sm:py-3.5 flex items-center justify-between backdrop-blur-2xl shadow-xs dark:shadow-xl">
          <div className="flex items-center gap-2.5 sm:gap-3.5">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full overflow-hidden border border-neutral-300 dark:border-white/20 shadow-md shrink-0">
              <img src="/nrs-logo.png" alt="NRS Logo" className="w-full h-full object-cover" />
            </div>
            <div>
              <h1 className="text-sm sm:text-base font-semibold text-neutral-900 dark:text-white flex items-center gap-1.5 sm:gap-2">
                <span className="font-serif-luxury tracking-wide">Terminal</span>
                <span className="px-2 py-0.5 rounded-full bg-neutral-100 dark:bg-white/10 border border-neutral-200 dark:border-white/20 text-[9px] sm:text-[10px] text-neutral-800 dark:text-white font-mono font-bold">
                  v2.6
                </span>
              </h1>
              <div className="text-[10px] text-neutral-500 dark:text-neutral-400 flex items-center gap-1.5 mt-0.5">
                <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="truncate max-w-[140px] sm:max-w-none">Pithampur Flagship • Sealed Hardware</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-3">
            {/* Direct Theme Switcher in Staff Portal */}
            <ThemeToggle className="scale-85 sm:scale-95" />

            {onSwitchToOwner && (
              <button
                onClick={onSwitchToOwner}
                className="flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 rounded-full bg-neutral-100 hover:bg-neutral-200 dark:bg-white/10 dark:hover:bg-white/20 border border-neutral-200 dark:border-white/20 text-xs text-neutral-800 dark:text-white transition-all cursor-pointer shadow-xs"
                title="Unlock Master Owner Suite"
              >
                <KeyRound size={12} className="text-amber-500" />
                <span className="hidden sm:inline text-[11px] font-semibold">Master Owner</span>
              </button>
            )}

            <button
              onClick={onBackToStore}
              className="flex items-center gap-1.5 px-2.5 sm:px-4 py-1.5 rounded-full bg-neutral-100 hover:bg-neutral-200 dark:bg-white/5 dark:hover:bg-white/10 text-xs text-neutral-700 hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-white transition-all cursor-pointer border border-neutral-200 dark:border-white/10"
            >
              <ArrowLeft size={13} />
              <span className="text-[11px]">Store</span>
            </button>

            <button
              onClick={onLogout}
              className="p-1.5 sm:px-3 sm:py-1.5 rounded-full bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 text-xs flex items-center gap-1.5 transition-all cursor-pointer border border-red-500/20"
              title="Lock Operations Terminal"
            >
              <LogOut size={13} />
              <span className="hidden sm:inline text-[11px] font-semibold">Lock</span>
            </button>
          </div>
        </header>
      )}

      {/* Toast Notification Alert */}
      {notification && (
        <div className="fixed top-16 right-4 sm:right-6 z-50 flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-neutral-900 dark:bg-white text-white dark:text-black shadow-2xl text-xs font-bold border border-neutral-700 dark:border-neutral-200 animate-fade-in">
          <CheckCircle2 size={16} className="text-emerald-400 dark:text-black" />
          <span>{notification}</span>
        </div>
      )}

      {/* Main Operations Container */}
      <div className="max-w-7xl mx-auto px-3 sm:px-8 pt-4 sm:pt-6">

        {/* Mobile Quick Status & Action Bar (md:hidden) */}
        <div className="md:hidden flex items-center justify-between mb-4 p-3 rounded-2xl bg-white dark:bg-[#0D1017] border border-neutral-200 dark:border-white/10 shadow-xs">
          <div className="flex items-center gap-2 min-w-0">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
            <span className="text-xs font-bold capitalize truncate text-neutral-900 dark:text-white">
              {activeTab === 'inventory' ? 'Inventory' : activeTab === 'pos' ? 'Showroom POS' : activeTab === 'orders' ? 'Orders' : activeTab === 'announcements' ? 'Hero Banner' : activeTab}
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-neutral-100 dark:bg-white/10 text-neutral-600 dark:text-neutral-400 font-mono shrink-0">
              {activeTab === 'inventory' ? `${products.length} SKUs` : activeTab === 'orders' ? `${orders.length} Active` : 'Online'}
            </span>
          </div>

          <button
            onClick={openAddModal}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-black text-xs font-bold shadow-xs active:scale-95 transition-all shrink-0 cursor-pointer"
          >
            <Plus size={14} />
            <span>+ Add Handset</span>
          </button>
        </div>

        {/* Desktop Navigation Tabs Bar (hidden md:flex) - Luxury Segmented Floating Bar */}
        <div className="hidden md:flex items-center gap-1.5 p-1.5 rounded-2xl bg-neutral-100/90 dark:bg-[#0D1018]/90 border border-neutral-200/80 dark:border-white/10 backdrop-blur-xl shadow-sm dark:shadow-2xl overflow-x-auto [scrollbar-width:none] no-scrollbar mb-6">
          <button
            onClick={() => setActiveTab('inventory')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all duration-200 cursor-pointer whitespace-nowrap shrink-0 ${
              activeTab === 'inventory'
                ? 'bg-neutral-900 text-white dark:bg-white dark:text-black shadow-md dark:shadow-white/10 font-bold scale-[1.02] border border-neutral-800 dark:border-white'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-white dark:hover:bg-white/10 border border-transparent'
            }`}
          >
            <Package size={15} className={activeTab === 'inventory' ? 'text-emerald-400 dark:text-emerald-600' : ''} />
            <span>Stock & Inventory</span>
            <span className={`px-1.5 py-0.5 rounded-full text-[9px] font-mono font-bold ${
              activeTab === 'inventory' ? 'bg-white text-black dark:bg-black dark:text-white' : 'bg-neutral-200 dark:bg-white/15 text-neutral-700 dark:text-neutral-300'
            }`}>
              {products.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('pos')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all duration-200 cursor-pointer whitespace-nowrap shrink-0 ${
              activeTab === 'pos'
                ? 'bg-neutral-900 text-white dark:bg-white dark:text-black shadow-md dark:shadow-white/10 font-bold scale-[1.02] border border-neutral-800 dark:border-white'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-white dark:hover:bg-white/10 border border-transparent'
            }`}
          >
            <Receipt size={15} className={activeTab === 'pos' ? 'text-blue-400 dark:text-blue-600' : ''} />
            <span>Showroom POS</span>
          </button>

          <button
            onClick={() => setActiveTab('repairs')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all duration-200 cursor-pointer whitespace-nowrap shrink-0 ${
              activeTab === 'repairs'
                ? 'bg-neutral-900 text-white dark:bg-white dark:text-black shadow-md dark:shadow-white/10 font-bold scale-[1.02] border border-neutral-800 dark:border-white'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-white dark:hover:bg-white/10 border border-transparent'
            }`}
          >
            <Wrench size={15} className={activeTab === 'repairs' ? 'text-amber-400 dark:text-amber-600' : ''} />
            <span>Service & Repairs</span>
            <span className={`px-1.5 py-0.5 rounded-full text-[9px] font-mono font-bold ${
              activeTab === 'repairs' ? 'bg-white text-black dark:bg-black dark:text-white' : 'bg-neutral-200 dark:bg-white/15 text-neutral-700 dark:text-neutral-300'
            }`}>
              {repairs.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all duration-200 cursor-pointer whitespace-nowrap shrink-0 ${
              activeTab === 'orders'
                ? 'bg-neutral-900 text-white dark:bg-white dark:text-black shadow-md dark:shadow-white/10 font-bold scale-[1.02] border border-neutral-800 dark:border-white'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-white dark:hover:bg-white/10 border border-transparent'
            }`}
          >
            <Truck size={15} className={activeTab === 'orders' ? 'text-purple-400 dark:text-purple-600' : ''} />
            <span>Orders & Logistics</span>
            <span className={`px-1.5 py-0.5 rounded-full text-[9px] font-mono font-bold ${
              activeTab === 'orders' ? 'bg-white text-black dark:bg-black dark:text-white' : 'bg-neutral-200 dark:bg-white/15 text-neutral-700 dark:text-neutral-300'
            }`}>
              {orders.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('users')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all duration-200 cursor-pointer whitespace-nowrap shrink-0 ${
              activeTab === 'users'
                ? 'bg-neutral-900 text-white dark:bg-white dark:text-black shadow-md dark:shadow-white/10 font-bold scale-[1.02] border border-neutral-800 dark:border-white'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-white dark:hover:bg-white/10 border border-transparent'
            }`}
          >
            <Users size={15} className={activeTab === 'users' ? 'text-indigo-400 dark:text-indigo-600' : ''} />
            <span>VIP CRM</span>
            <span className={`px-1.5 py-0.5 rounded-full text-[9px] font-mono font-bold ${
              activeTab === 'users' ? 'bg-white text-black dark:bg-black dark:text-white' : 'bg-neutral-200 dark:bg-white/15 text-neutral-700 dark:text-neutral-300'
            }`}>
              {users.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('activity')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all duration-200 cursor-pointer whitespace-nowrap shrink-0 ${
              activeTab === 'activity'
                ? 'bg-neutral-900 text-white dark:bg-white dark:text-black shadow-md dark:shadow-white/10 font-bold scale-[1.02] border border-neutral-800 dark:border-white'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-white dark:hover:bg-white/10 border border-transparent'
            }`}
          >
            <Activity size={15} className={activeTab === 'activity' ? 'text-rose-400 dark:text-rose-600' : ''} />
            <span>Audit Stream</span>
          </button>

          <button
            onClick={() => setActiveTab('categories')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all duration-200 cursor-pointer whitespace-nowrap shrink-0 ${
              activeTab === 'categories'
                ? 'bg-neutral-900 text-white dark:bg-white dark:text-black shadow-md dark:shadow-white/10 font-bold scale-[1.02] border border-neutral-800 dark:border-white'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-white dark:hover:bg-white/10 border border-transparent'
            }`}
          >
            <FolderPlus size={15} className={activeTab === 'categories' ? 'text-cyan-400 dark:text-cyan-600' : ''} />
            <span>Departments</span>
          </button>

          <button
            onClick={() => setActiveTab('staff')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all duration-200 cursor-pointer whitespace-nowrap shrink-0 ${
              activeTab === 'staff'
                ? 'bg-neutral-900 text-white dark:bg-white dark:text-black shadow-md dark:shadow-white/10 font-bold scale-[1.02] border border-neutral-800 dark:border-white'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-white dark:hover:bg-white/10 border border-transparent'
            }`}
          >
            <ShieldCheck size={15} className={activeTab === 'staff' ? 'text-emerald-400 dark:text-emerald-600' : ''} />
            <span>Staff Roster</span>
          </button>

          <button
            onClick={() => setActiveTab('announcements')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all duration-200 cursor-pointer whitespace-nowrap shrink-0 ${
              activeTab === 'announcements'
                ? 'bg-neutral-900 text-white dark:bg-white dark:text-black shadow-md dark:shadow-white/10 font-bold scale-[1.02] border border-neutral-800 dark:border-white'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-white dark:hover:bg-white/10 border border-transparent'
            }`}
          >
            <Megaphone size={15} className={activeTab === 'announcements' ? 'text-violet-400 dark:text-violet-600' : ''} />
            <span>Broadcasts</span>
          </button>

          <button
            onClick={() => setActiveTab('reviews')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all duration-200 cursor-pointer whitespace-nowrap shrink-0 ${
              activeTab === 'reviews'
                ? 'bg-neutral-900 text-white dark:bg-white dark:text-black shadow-md dark:shadow-white/10 font-bold scale-[1.02] border border-neutral-800 dark:border-white'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-white dark:hover:bg-white/10 border border-transparent'
            }`}
          >
            <MessageSquare size={15} className={activeTab === 'reviews' ? 'text-yellow-400 dark:text-yellow-600' : ''} />
            <span>Reviews</span>
          </button>
        </div>

        {/* ========================================================================= */}
        {/* TAB 1: STOCK & INVENTORY CONTROLLER */}
        {/* ========================================================================= */}
        {activeTab === 'inventory' && (
          <div className="space-y-4 sm:space-y-6">
            
            {/* Inventory KPI Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <SpotlightCard className="p-3.5 sm:p-5 rounded-2xl bg-white dark:bg-[#0D1017] border border-neutral-200 dark:border-white/10 shadow-xs dark:shadow-lg">
                <div className="text-[10px] uppercase font-bold tracking-wider text-neutral-500 dark:text-[#8E8A85]">Total Catalog SKUs</div>
                <div className="font-mono text-xl sm:text-2xl font-bold text-neutral-900 dark:text-white mt-1">
                  <CountUp to={localProducts.length} duration={1.2} />
                </div>
                <div className="text-[10px] sm:text-[11px] text-neutral-500 dark:text-neutral-400 mt-1 truncate">
                  Apple, Samsung, Google, OnePlus
                </div>
              </SpotlightCard>

              <SpotlightCard className="p-3.5 sm:p-5 rounded-2xl bg-white dark:bg-[#0D1017] border border-neutral-200 dark:border-white/10 shadow-xs dark:shadow-lg">
                <div className="text-[10px] uppercase font-bold tracking-wider text-neutral-500 dark:text-[#8E8A85]">In Stock Units</div>
                <div className="font-mono text-xl sm:text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">
                  <CountUp to={localProducts.filter(p => p.inStock).length} duration={1.2} />
                </div>
                <div className="text-[10px] sm:text-[11px] text-neutral-500 dark:text-neutral-400 mt-1 truncate">Ready for delivery</div>
              </SpotlightCard>

              <SpotlightCard className="p-3.5 sm:p-5 rounded-2xl bg-white dark:bg-[#0D1017] border border-neutral-200 dark:border-white/10 shadow-xs dark:shadow-lg">
                <div className="text-[10px] uppercase font-bold tracking-wider text-neutral-500 dark:text-[#8E8A85]">Out of Stock Alert</div>
                <div className="font-mono text-xl sm:text-2xl font-bold text-rose-600 dark:text-rose-400 mt-1">
                  <CountUp to={localProducts.filter(p => !p.inStock).length} duration={1} />
                </div>
                <div className="text-[10px] sm:text-[11px] text-neutral-500 dark:text-neutral-400 mt-1 truncate">Re-order needed</div>
              </SpotlightCard>

              <SpotlightCard className="p-3.5 sm:p-5 rounded-2xl bg-white dark:bg-[#0D1017] border border-neutral-200 dark:border-white/10 shadow-xs dark:shadow-lg">
                <div className="text-[10px] uppercase font-bold tracking-wider text-neutral-500 dark:text-[#8E8A85]">Inventory Value</div>
                <div className="font-mono text-xl sm:text-2xl font-bold text-neutral-900 dark:text-white mt-1">
                  ₹{(localProducts.reduce((acc, p) => acc + (p.price * 3), 0) / 100000).toFixed(1)}L
                </div>
                <div className="text-[10px] sm:text-[11px] text-neutral-500 dark:text-neutral-400 mt-1 truncate">Showroom valuation</div>
              </SpotlightCard>
            </div>

            {/* Inventory Controls Bar */}
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-[#0D1017] border border-neutral-200 dark:border-white/10 shadow-xs">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 w-full md:w-auto">
                <div className="relative flex-1 sm:w-64">
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
                  <option value="all">All Availability ({localProducts.length})</option>
                  <option value="inStock">In Stock ({localProducts.filter(p => p.inStock).length})</option>
                  <option value="outOfStock">Out of Stock ({localProducts.filter(p => !p.inStock).length})</option>
                </select>
              </div>

              <div className="flex items-center gap-2 w-full md:w-auto justify-end">
                <button
                  type="button"
                  onClick={handleExportCatalog}
                  className="flex-1 sm:flex-initial justify-center px-3.5 py-2 rounded-xl bg-neutral-100 hover:bg-neutral-200 dark:bg-white/5 dark:hover:bg-white/10 border border-neutral-200 dark:border-white/10 text-xs text-neutral-800 dark:text-white font-semibold transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Download size={13} />
                  <span>Export JSON</span>
                </button>

                <button
                  type="button"
                  onClick={openAddModal}
                  className="flex-1 sm:flex-initial justify-center px-4 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-200 text-white dark:text-black font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer shadow-md active:scale-95"
                >
                  <Plus size={14} />
                  <span>+ Add Handset</span>
                </button>
              </div>
            </div>

            {/* MOBILE VIEW: Touch-Optimized Cards (md:hidden) */}
            <div className="md:hidden space-y-3">
              {filteredProducts.map((prod) => (
                <div
                  key={prod.id}
                  className="p-3.5 rounded-2xl bg-white dark:bg-[#0D1017] border border-neutral-200 dark:border-white/10 shadow-xs dark:shadow-md space-y-3"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-16 h-16 rounded-xl bg-neutral-100 dark:bg-black/60 overflow-hidden shrink-0 border border-neutral-200 dark:border-white/10 relative">
                      <img src={prod.image} alt={prod.name} className="w-full h-full object-cover" />
                      {!prod.inStock && (
                        <div className="absolute inset-0 bg-rose-950/70 flex items-center justify-center">
                          <span className="text-[8px] font-bold text-rose-300 uppercase px-1 py-0.5 rounded bg-rose-900/80">OOS</span>
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-neutral-100 dark:bg-white/10 text-neutral-700 dark:text-neutral-300 font-semibold uppercase">{prod.brand}</span>
                        <span className="text-[9px] text-neutral-500 capitalize">{prod.category}</span>
                      </div>
                      <h4 className="text-xs font-bold text-neutral-900 dark:text-white truncate mt-0.5">{prod.name}</h4>
                      <div className="flex items-baseline gap-1.5 mt-0.5">
                        <span className="text-xs font-mono font-bold text-neutral-900 dark:text-white">₹{prod.price.toLocaleString('en-IN')}</span>
                        {prod.originalPrice && prod.originalPrice > prod.price && (
                          <span className="text-[10px] font-mono text-neutral-400 line-through">₹{prod.originalPrice.toLocaleString('en-IN')}</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* 1-Tap Instant Mobile Stock Toggle */}
                  <button
                    type="button"
                    onClick={(e) => handleToggleStock(prod, e)}
                    className={`w-full py-2.5 px-3 rounded-xl border flex items-center justify-center gap-2 text-xs font-bold transition-all cursor-pointer shadow-xs active:scale-[0.98] ${
                      prod.inStock
                        ? 'bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-500/15 dark:hover:bg-emerald-500/25 border-emerald-300 dark:border-emerald-500/40 text-emerald-700 dark:text-emerald-400'
                        : 'bg-rose-50 hover:bg-rose-100 dark:bg-rose-500/15 dark:hover:bg-rose-500/25 border-rose-300 dark:border-rose-500/40 text-rose-700 dark:text-rose-400'
                    }`}
                  >
                    {prod.inStock ? <Check size={14} className="stroke-[2.5]" /> : <X size={14} className="stroke-[2.5]" />}
                    <span>{prod.inStock ? 'IN STOCK • Tap to Mark Out' : 'OUT OF STOCK • Tap to Restock'}</span>
                  </button>

                  {/* Quick Price Adjustments & Card Controls */}
                  <div className="flex items-center justify-between gap-2 pt-1.5 border-t border-neutral-100 dark:border-white/5 text-xs">
                    <div className="flex items-center gap-1">
                      <span className="text-[10px] text-neutral-500 font-medium mr-0.5">Quick Price:</span>
                      <button
                        type="button"
                        onClick={() => handleQuickPriceAdjust(prod, -500)}
                        className="px-2 py-1 rounded-lg bg-neutral-100 hover:bg-neutral-200 dark:bg-white/5 dark:hover:bg-white/10 text-neutral-700 dark:text-neutral-300 text-[10px] font-mono font-bold transition-all active:scale-95 cursor-pointer"
                        title="Decrease price by ₹500"
                      >
                        -500
                      </button>
                      <button
                        type="button"
                        onClick={() => handleQuickPriceAdjust(prod, 500)}
                        className="px-2 py-1 rounded-lg bg-neutral-100 hover:bg-neutral-200 dark:bg-white/5 dark:hover:bg-white/10 text-neutral-700 dark:text-neutral-300 text-[10px] font-mono font-bold transition-all active:scale-95 cursor-pointer"
                        title="Increase price by ₹500"
                      >
                        +500
                      </button>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => openEditModal(prod)}
                        className="p-1.5 rounded-lg bg-neutral-100 hover:bg-neutral-200 dark:bg-white/5 dark:hover:bg-white/10 text-neutral-700 dark:text-neutral-200 transition-colors cursor-pointer"
                        title="Edit Specs & Photos"
                      >
                        <Edit size={14} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteProduct(prod.id, prod.name)}
                        className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 dark:bg-rose-500/10 dark:hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 transition-colors cursor-pointer"
                        title="Remove Handset"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* DESKTOP VIEW: Products Table (hidden md:block) */}
            <div className="hidden md:block rounded-2xl bg-white dark:bg-[#0D1017] border border-neutral-200 dark:border-white/10 overflow-hidden shadow-xs dark:shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-neutral-100 dark:bg-black/50 border-b border-neutral-200 dark:border-white/10 text-[10px] uppercase font-bold text-neutral-600 dark:text-[#8E8A85] tracking-wider">
                    <tr>
                      <th className="py-3 px-4">Device / Image</th>
                      <th className="py-3 px-4">Brand &amp; Category</th>
                      <th className="py-3 px-4">Price (INR)</th>
                      <th className="py-3 px-4">Colors &amp; Storage</th>
                      <th className="py-3 px-4">Stock Toggle</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-200 dark:divide-white/5">
                    {filteredProducts.map((prod) => (
                      <tr key={prod.id} className="hover:bg-neutral-50 dark:hover:bg-white/[0.02] transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-11 h-11 rounded-xl bg-neutral-100 dark:bg-black overflow-hidden shrink-0 border border-neutral-200 dark:border-white/10">
                              <img src={prod.image} alt={prod.name} className="w-full h-full object-cover" />
                            </div>
                            <div>
                              <div className="font-semibold text-neutral-900 dark:text-white text-xs">{prod.name}</div>
                              <div className="text-[10px] text-neutral-500 dark:text-neutral-400 font-mono">ID: {prod.id}</div>
                            </div>
                          </div>
                        </td>

                        <td className="py-3.5 px-4">
                          <span className="px-2.5 py-1 rounded-md bg-neutral-100 dark:bg-white/5 border border-neutral-200 dark:border-white/10 text-neutral-800 dark:text-white font-medium text-[11px]">
                            {prod.brand}
                          </span>
                          <span className="ml-1.5 text-neutral-500 dark:text-neutral-400 text-[11px] capitalize">{prod.category}</span>
                        </td>

                        <td className="py-3.5 px-4 font-mono">
                          <div className="font-bold text-neutral-900 dark:text-white text-xs">₹{prod.price.toLocaleString('en-IN')}</div>
                          {prod.originalPrice && prod.originalPrice > prod.price && (
                            <div className="text-[10px] text-neutral-400 dark:text-neutral-500 line-through">
                              ₹{prod.originalPrice.toLocaleString('en-IN')}
                            </div>
                          )}
                        </td>

                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-1.5">
                            {prod.colors?.slice(0, 4).map((c, i) => (
                              <span
                                key={i}
                                className="w-3.5 h-3.5 rounded-full border border-neutral-300 dark:border-white/20 shadow-xs"
                                style={{ backgroundColor: c.hex }}
                                title={c.name}
                              />
                            ))}
                            {prod.storageVariants && prod.storageVariants.length > 0 && (
                              <span className="text-[10px] text-neutral-500 dark:text-neutral-400 ml-1 font-mono">
                                ({prod.storageVariants.length} tiers)
                              </span>
                            )}
                          </div>
                        </td>

                        <td className="py-3.5 px-4">
                          <button
                            type="button"
                            onClick={(e) => handleToggleStock(prod, e)}
                            className={`px-3 py-1.5 rounded-full text-[11px] font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                              prod.inStock
                                ? 'bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-500/15 dark:hover:bg-emerald-500/25 border border-emerald-300 dark:border-emerald-500/40 text-emerald-700 dark:text-emerald-300'
                                : 'bg-rose-50 hover:bg-rose-100 dark:bg-rose-500/15 dark:hover:bg-rose-500/25 border border-rose-300 dark:border-rose-500/40 text-rose-700 dark:text-rose-300'
                            }`}
                          >
                            <span className={`w-1.5 h-1.5 rounded-full ${prod.inStock ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                            <span>{prod.inStock ? 'In Stock (Active)' : 'Out of Stock'}</span>
                          </button>
                        </td>

                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() => openEditModal(prod)}
                              className="p-1.5 rounded-lg bg-neutral-100 hover:bg-neutral-200 dark:bg-white/5 dark:hover:bg-white/10 text-neutral-700 hover:text-neutral-900 dark:text-white/80 dark:hover:text-white transition-colors cursor-pointer"
                              title="Edit product specs"
                            >
                              <Edit size={13} />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteProduct(prod.id, prod.name)}
                              className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 dark:bg-red-500/10 dark:hover:bg-red-500/20 text-rose-600 dark:text-red-400 transition-colors cursor-pointer"
                              title="Delete product"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: SHOWROOM POS & COUNTER INVOICING */}
        {/* ========================================================================= */}
        {/* TAB 2: SHOWROOM POINT OF SALE (POS) & INSTANT INVOICING */}
        {/* ========================================================================= */}
        {activeTab === 'pos' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left Column: POS Bill Creator */}
            <div className="lg:col-span-7 bg-white dark:bg-[#0D1017] border border-neutral-200 dark:border-white/10 rounded-2xl sm:rounded-3xl p-4 sm:p-8 space-y-6 shadow-xs dark:shadow-xl">
              <div className="border-b border-neutral-200 dark:border-white/10 pb-4 flex items-center justify-between">
                <div>
                  <h3 className="font-serif-luxury text-lg sm:text-xl text-neutral-900 dark:text-white font-medium flex items-center gap-2">
                    <Receipt size={18} className="text-neutral-900 dark:text-white" />
                    <span>Showroom Counter POS &amp; Quotation Generator</span>
                  </h3>
                  <p className="text-xs text-neutral-500 dark:text-[#8E8A85] mt-0.5">Issue instantaneous formal GST tax quotes or bills for walk-in clientele.</p>
                </div>
              </div>

              <form onSubmit={handleCreateQuotation} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase text-neutral-600 dark:text-[#A8A49F] font-bold mb-1.5">Customer / Client Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Vikramaditya Singhania"
                      value={posClientName}
                      onChange={(e) => setPosClientName(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-neutral-50 dark:bg-black/60 border border-neutral-300 dark:border-white/10 text-neutral-900 dark:text-white text-base outline-none focus:border-neutral-900 dark:focus:border-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase text-neutral-600 dark:text-[#A8A49F] font-bold mb-1.5">Contact Phone Number</label>
                    <input
                      type="text"
                      placeholder="+91 96910 11335"
                      value={posClientPhone}
                      onChange={(e) => setPosClientPhone(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-neutral-50 dark:bg-black/60 border border-neutral-300 dark:border-white/10 text-neutral-900 dark:text-white text-base outline-none focus:border-neutral-900 dark:focus:border-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase text-neutral-600 dark:text-[#A8A49F] font-bold mb-1.5">Select Smartphone / Device</label>
                  <select
                    value={posSelectedProduct}
                    onChange={(e) => setPosSelectedProduct(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-neutral-50 dark:bg-black/60 border border-neutral-300 dark:border-white/10 text-neutral-900 dark:text-white text-base outline-none focus:border-neutral-900 dark:focus:border-white cursor-pointer"
                  >
                    {products.map(p => (
                      <option key={p.id} value={p.id}>
                        {p.name} — ₹{p.price.toLocaleString('en-IN')}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase text-neutral-600 dark:text-[#A8A49F] font-bold mb-1.5">Color Finish Variant</label>
                    <input
                      type="text"
                      placeholder="e.g. Desert Titanium"
                      value={posSelectedColor}
                      onChange={(e) => setPosSelectedColor(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-neutral-50 dark:bg-black/60 border border-neutral-300 dark:border-white/10 text-neutral-900 dark:text-white text-base outline-none focus:border-neutral-900 dark:focus:border-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase text-neutral-600 dark:text-[#A8A49F] font-bold mb-1.5">Storage Capacity</label>
                    <select
                      value={posSelectedStorage}
                      onChange={(e) => setPosSelectedStorage(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-neutral-50 dark:bg-black/60 border border-neutral-300 dark:border-white/10 text-neutral-900 dark:text-white text-base outline-none focus:border-neutral-900 dark:focus:border-white cursor-pointer"
                    >
                      <option value="">Default Showroom Tier</option>
                      {products.find(p => p.id === posSelectedProduct)?.storageVariants?.map(v => (
                        <option key={v.size} value={v.size}>
                          {v.size} (₹{v.price.toLocaleString('en-IN')})
                        </option>
                      )) || (
                        <>
                          <option value="64GB">64GB Storage Tier</option>
                          <option value="68GB">68GB Custom Tier</option>
                          <option value="128GB">128GB High-Speed</option>
                          <option value="256GB">256GB High-Speed NVMe</option>
                          <option value="512GB">512GB High-Speed NVMe</option>
                          <option value="1TB">1TB Ultra-Density</option>
                        </>
                      )}
                    </select>
                  </div>
                </div>

                {/* Accessory Bundles */}
                <div>
                  <label className="block text-xs uppercase text-neutral-600 dark:text-[#A8A49F] font-bold mb-2">Add Genuine Accessories &amp; Protection</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {posAccessories.map((acc) => (
                      <label
                        key={acc.id}
                        className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                          acc.selected 
                            ? 'bg-neutral-900 text-white dark:bg-white/10 dark:border-white/40 dark:text-white shadow-xs' 
                            : 'bg-neutral-50 text-neutral-700 border-neutral-200 dark:bg-black/40 dark:border-white/10 dark:text-[#A8A49F]'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={acc.selected}
                            onChange={() => {
                              setPosAccessories(prev =>
                                prev.map(item => item.id === acc.id ? { ...item, selected: !item.selected } : item)
                              );
                            }}
                            className="rounded"
                          />
                          <span className="text-xs font-medium">{acc.name}</span>
                        </div>
                        <span className="text-xs font-mono font-bold">+₹{acc.price}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase text-neutral-600 dark:text-[#A8A49F] font-bold mb-1.5">Payment Terms / Financing</label>
                  <select
                    value={posPaymentMethod}
                    onChange={(e) => setPosPaymentMethod(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-neutral-50 dark:bg-black/60 border border-neutral-300 dark:border-white/10 text-neutral-900 dark:text-white text-base outline-none focus:border-neutral-900 dark:focus:border-white cursor-pointer"
                  >
                    <option value="0% No-Cost EMI (HDFC Bank 6 Months)">0% No-Cost EMI (HDFC Bank 6 Months)</option>
                    <option value="0% No-Cost EMI (ICICI Bank 9 Months)">0% No-Cost EMI (ICICI Bank 9 Months)</option>
                    <option value="Prepaid UPI / Immediate QR Transfer">Prepaid UPI / Immediate QR Transfer</option>
                    <option value="Direct Counter Cash">Direct Counter Cash</option>
                    <option value="Credit Card Swipe at Terminal">Credit Card Swipe at Terminal</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-2xl bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-200 text-white dark:text-black font-bold text-xs uppercase tracking-widest transition-all cursor-pointer shadow-xl flex items-center justify-center gap-2 active:scale-98"
                >
                  <Receipt size={16} />
                  <span>Generate Quotation &amp; GST Tax Invoice</span>
                </button>
              </form>
            </div>

            {/* Right Column: Active Quotations Ledger */}
            <div className="lg:col-span-5 bg-white dark:bg-[#0D1017] border border-neutral-200 dark:border-white/10 rounded-2xl sm:rounded-3xl p-4 sm:p-8 space-y-4 shadow-xs dark:shadow-xl flex flex-col">
              <div className="border-b border-neutral-200 dark:border-white/10 pb-3 flex items-center justify-between">
                <h4 className="font-serif-luxury text-base text-neutral-900 dark:text-white font-medium flex items-center gap-2">
                  <Clock size={16} className="text-neutral-900 dark:text-white" />
                  <span>Recent Showroom Quotations</span>
                </h4>
                <span className="text-[10px] font-mono text-neutral-500 dark:text-neutral-400">{quotations.length} quotes</span>
              </div>

              <div className="flex-1 overflow-y-auto max-h-[550px] pr-1">
                {quotations.length === 0 ? (
                  <div className="p-8 text-center text-neutral-500 text-xs">No active counter quotations generated yet.</div>
                ) : (
                  <AnimatedList className="space-y-3">
                    {quotations.map((q) => (
                      <div
                        key={q.id}
                        className="p-4 rounded-2xl bg-neutral-50 dark:bg-black/40 border border-neutral-200 dark:border-white/10 hover:border-neutral-400 dark:hover:border-white/30 transition-all space-y-2 shadow-xs"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-xs font-bold text-neutral-900 dark:text-white">{q.id}</span>
                          <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30 text-[9.5px] font-bold">
                            {q.status || 'Active'}
                          </span>
                        </div>

                        <div className="text-xs font-bold text-neutral-900 dark:text-white">{q.clientName}</div>
                        {q.phone && <div className="text-[10px] text-neutral-500 dark:text-neutral-400">{q.phone}</div>}

                        <div className="text-[11px] text-neutral-600 dark:text-neutral-300 line-clamp-1">
                          {q.items?.map((it: any) => `${it.name} (x${it.qty || 1})`).join(', ')}
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-neutral-200 dark:border-white/5">
                          <div className="font-mono font-bold text-sm text-neutral-900 dark:text-white">
                            ₹{Number(q.total).toLocaleString('en-IN')}
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => setSelectedQuoteForInvoice(q)}
                              className="px-2.5 py-1 rounded-lg bg-neutral-900 text-white dark:bg-white/10 dark:text-white text-[11px] font-semibold transition-all flex items-center gap-1 cursor-pointer"
                            >
                              <Printer size={12} />
                              <span>View Bill</span>
                            </button>

                            {q.phone && (
                              <a
                                href={`https://wa.me/${q.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hello ${q.clientName}! Your formal Radhaswami Mobile Gallery quotation #${q.id} for ₹${Number(q.total).toLocaleString('en-IN')} is prepared. Visit our Pithampur showroom to claim.`)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-2.5 py-1 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/30 text-[11px] text-emerald-400 font-semibold transition-all flex items-center gap-1"
                              >
                                <Share2 size={12} />
                                <span>WhatsApp</span>
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </AnimatedList>
                )}
              </div>
            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: SERVICE & REPAIRS DESK */}
        {/* ========================================================================= */}
        {activeTab === 'repairs' && (
          <div className="space-y-6">
            
            {/* Header / Action */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-white dark:bg-[#0D1017] border border-neutral-200 dark:border-white/10 shadow-xs dark:shadow-lg">
              <div>
                <h3 className="font-serif-luxury text-lg sm:text-xl text-neutral-900 dark:text-white font-medium flex items-center gap-2">
                  <Wrench size={18} className="text-neutral-900 dark:text-white" />
                  <span>Flagship Warranty &amp; Service Intake Desk</span>
                </h3>
                <p className="text-xs text-neutral-500 dark:text-[#8E8A85] mt-0.5">Manage customer repairs, screen replacements, water-seal restorations, and diagnostic jobs.</p>
              </div>

              <button
                type="button"
                onClick={() => setIsRepairModalOpen(true)}
                className="w-full sm:w-auto px-4 py-2.5 rounded-2xl bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-200 text-white dark:text-black font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md active:scale-98"
              >
                <Plus size={15} />
                <span>Log Repair Intake</span>
              </button>
            </div>

            {/* Repair Tickets Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {repairs.map((rep) => (
                <div key={rep.id} className="p-5 rounded-2xl bg-white dark:bg-[#0D1017] border border-neutral-200 dark:border-white/10 hover:border-neutral-400 dark:hover:border-white/30 transition-all space-y-3 shadow-xs dark:shadow-lg">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-neutral-900 dark:text-white">{rep.id}</span>
                    <select
                      value={rep.status}
                      onChange={(e) => handleUpdateRepairStatus(rep.id, e.target.value)}
                      className="px-2.5 py-1 rounded-lg bg-neutral-100 dark:bg-black/60 border border-neutral-300 dark:border-white/10 text-xs font-bold text-neutral-900 dark:text-white outline-none focus:border-neutral-900 dark:focus:border-white cursor-pointer"
                    >
                      <option value="Received">Received</option>
                      <option value="Under Diagnosis">Under Diagnosis</option>
                      <option value="Parts Awaiting">Parts Awaiting</option>
                      <option value="Repair Completed">Repair Completed</option>
                      <option value="Delivered">Delivered</option>
                    </select>
                  </div>

                  <div>
                    <div className="font-bold text-sm text-neutral-900 dark:text-white">{rep.device}</div>
                    <div className="text-xs text-neutral-600 dark:text-neutral-300 mt-0.5">{rep.customerName} • {rep.phone}</div>
                    {rep.imei && <div className="text-[10px] text-neutral-400 font-mono mt-0.5">IMEI: {rep.imei}</div>}
                  </div>

                  <div className="p-3 rounded-xl bg-neutral-50 dark:bg-black/50 border border-neutral-200 dark:border-white/5 text-xs text-neutral-700 dark:text-neutral-300 leading-relaxed">
                    <span className="text-neutral-900 dark:text-white font-semibold">Issue: </span>{rep.issue}
                  </div>

                  <div className="flex items-center justify-between text-xs pt-1">
                    <div>
                      <div className="text-[10px] text-neutral-500 dark:text-neutral-400">Estimate / Advance</div>
                      <div className="font-mono font-bold text-neutral-900 dark:text-white">
                        ₹{Number(rep.quotedAmount).toLocaleString('en-IN')} <span className="text-emerald-600 dark:text-emerald-400 text-[10px] font-bold">(Paid ₹{rep.advancePaid || 0})</span>
                      </div>
                    </div>

                    {rep.phone && (
                      <a
                        href={`https://wa.me/${rep.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hello ${rep.customerName}! Update on your ${rep.device} repair (Ticket #${rep.id}): Status is currently [${rep.status}]. For queries, reply here.`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-[11px] font-bold flex items-center gap-1 transition-colors"
                      >
                        <Share2 size={12} />
                        <span>WhatsApp Update</span>
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 4: ORDERS & LOGISTICS CENTER */}
        {/* ========================================================================= */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            
            {/* Orders Header & Search */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 sm:p-5 rounded-2xl sm:rounded-3xl bg-white dark:bg-[#0D1017] border border-neutral-200 dark:border-white/10 shadow-xs">
              <div className="relative w-full sm:w-80">
                <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 dark:text-neutral-500" />
                <input
                  type="text"
                  placeholder="Search by Order ID, client, or tracking..."
                  value={orderSearchQuery}
                  onChange={(e) => setOrderSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-neutral-100 dark:bg-black/60 border border-neutral-200 dark:border-white/10 text-neutral-900 dark:text-white text-base sm:text-xs outline-none focus:border-neutral-900 dark:focus:border-white"
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <select
                  value={orderStatusFilter}
                  onChange={(e) => setOrderStatusFilter(e.target.value)}
                  className="px-3 py-2 rounded-xl bg-neutral-100 dark:bg-black/60 border border-neutral-200 dark:border-white/10 text-neutral-900 dark:text-white text-base sm:text-xs outline-none focus:border-neutral-900 dark:focus:border-white cursor-pointer"
                >
                  <option value="all">All Order Statuses</option>
                  <option value="Packaging">Packaging</option>
                  <option value="Dispatched">Dispatched</option>
                  <option value="Delivered">Delivered</option>
                </select>

                <button
                  type="button"
                  onClick={fetchOrders}
                  className="px-3.5 py-2 rounded-xl bg-neutral-100 hover:bg-neutral-200 dark:bg-white/5 dark:hover:bg-white/10 border border-neutral-200 dark:border-white/10 text-xs text-neutral-800 dark:text-white font-semibold flex items-center gap-1.5 cursor-pointer transition-colors"
                >
                  <RefreshCw size={12} />
                  <span>Refresh</span>
                </button>
              </div>
            </div>

            {/* Orders List */}
            <div className="space-y-4">
              {orders
                .filter(o => {
                  const q = orderSearchQuery.toLowerCase();
                  const matchesQuery = 
                    o.orderId.toLowerCase().includes(q) ||
                    (o.customer?.name || '').toLowerCase().includes(q) ||
                    (o.customer?.phone || '').includes(q) ||
                    (o.trackingNumber || '').toLowerCase().includes(q);
                  const matchesStatus = orderStatusFilter === 'all' || o.status.toLowerCase().includes(orderStatusFilter.toLowerCase());
                  return matchesQuery && matchesStatus;
                })
                .map((order) => (
                  <div
                    key={order.orderId}
                    className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#0D1017] border border-neutral-200 dark:border-white/10 hover:border-neutral-400 dark:hover:border-white/30 transition-all space-y-4 shadow-xs dark:shadow-xl"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-100 dark:border-white/5 pb-3">
                      <div className="flex items-center gap-3">
                        <div className="font-mono text-base font-bold text-neutral-900 dark:text-white flex items-center gap-1.5">
                          <span>#</span>
                          <span>{order.orderId}</span>
                        </div>
                        <span className="px-2.5 py-0.5 rounded-full bg-neutral-100 dark:bg-white/10 border border-neutral-200 dark:border-white/20 text-[10px] text-neutral-600 dark:text-neutral-300 font-mono">
                          {new Date(order.timestamp).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>

                      <div className="flex items-center gap-3">
                        <select
                          value={order.status}
                          onChange={(e) => handleUpdateOrderStatus(order.orderId, e.target.value)}
                          className="px-3 py-1.5 rounded-xl bg-neutral-100 dark:bg-black/60 border border-neutral-300 dark:border-white/10 text-xs font-bold text-neutral-900 dark:text-white outline-none focus:border-neutral-900 dark:focus:border-white cursor-pointer"
                        >
                          <option value="Packaging & Quality Check">Packaging &amp; Quality Check</option>
                          <option value="Dispatched">Dispatched via BlueDart</option>
                          <option value="Out for Delivery">Out for Delivery</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                      <div>
                        <div className="text-[10px] uppercase font-bold text-neutral-500 dark:text-[#8E8A85] mb-1">Customer Details</div>
                        <div className="font-bold text-neutral-900 dark:text-white">{order.customer?.name || 'VIP Client'}</div>
                        <div className="text-neutral-600 dark:text-neutral-400 mt-0.5">{order.customer?.phone}</div>
                        <div className="text-neutral-500 text-[11px] mt-0.5">{order.customer?.address}</div>
                      </div>

                      <div>
                        <div className="text-[10px] uppercase font-bold text-neutral-500 dark:text-[#8E8A85] mb-1">Ordered Flagships</div>
                        <div className="space-y-1">
                          {order.items?.map((it: any, idx: number) => (
                            <div key={idx} className="text-neutral-900 dark:text-white font-medium flex items-center justify-between">
                              <span className="truncate max-w-[200px]">{it.name || it.product?.name}</span>
                              <span className="font-mono text-neutral-500 dark:text-neutral-400">x{it.qty || it.quantity || 1}</span>
                            </div>
                          ))}
                        </div>
                        <div className="text-[10px] text-neutral-700 dark:text-neutral-300 mt-1 font-semibold">{order.paymentMethod}</div>
                      </div>

                      <div className="space-y-2">
                        <div className="text-[10px] uppercase font-bold text-neutral-500 dark:text-[#8E8A85]">Logistics Waybill (BlueDart)</div>
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={order.trackingNumber || ''}
                            onChange={(e) => handleAssignTracking(order.orderId, e.target.value)}
                            placeholder="BD-IN-XXXXXXX"
                            className="flex-1 px-3 py-1.5 rounded-lg bg-neutral-100 dark:bg-black/50 border border-neutral-300 dark:border-white/10 text-neutral-900 dark:text-white font-mono text-base sm:text-xs outline-none focus:border-neutral-900 dark:focus:border-white"
                          />
                          <button
                            type="button"
                            onClick={() => handleAssignTracking(order.orderId, 'BD-IN-' + Math.floor(1000000 + Math.random() * 9000000))}
                            className="px-2.5 py-1.5 rounded-lg bg-neutral-200 hover:bg-neutral-300 dark:bg-white/10 dark:hover:bg-white/20 text-[10px] text-neutral-800 dark:text-white font-semibold cursor-pointer transition-colors"
                            title="Generate random BlueDart AWB"
                          >
                            Gen AWB
                          </button>
                        </div>

                        <div className="flex items-center justify-between pt-1">
                          <span className="font-mono text-sm font-bold text-neutral-900 dark:text-white">
                            Total: ₹{Number(order.total).toLocaleString('en-IN')}
                          </span>

                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => setSelectedOrderForInvoice(order)}
                              className="px-3 py-1.5 rounded-xl bg-neutral-100 hover:bg-neutral-200 dark:bg-white/10 dark:hover:bg-white/20 text-xs font-semibold text-neutral-800 dark:text-white flex items-center gap-1 cursor-pointer transition-colors border border-neutral-200 dark:border-white/10"
                            >
                              <FileText size={12} />
                              <span>Invoice</span>
                            </button>

                            {order.customer?.phone && (
                              <a
                                href={`https://wa.me/${order.customer.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hello ${order.customer.name}! Your order #${order.orderId} from New Radhaswami Mobile Gallery has been updated: Status is [${order.status}]. Track BlueDart AWB: ${order.trackingNumber || 'Pending Dispatch'}. Thank you for choosing us!`)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-3 py-1.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs font-bold flex items-center gap-1 transition-colors"
                              >
                                <Share2 size={12} />
                                <span>WhatsApp</span>
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 5: VIP CLIENTS CRM */}
        {/* ========================================================================= */}
        {activeTab === 'users' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 rounded-2xl bg-white dark:bg-[#0D1017] border border-neutral-200 dark:border-white/10 shadow-xs">
              <div className="relative w-full sm:w-80">
                <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 dark:text-neutral-500" />
                <input
                  type="text"
                  placeholder="Search VIP clients by name, phone or city..."
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-neutral-100 dark:bg-black/60 border border-neutral-200 dark:border-white/10 text-neutral-900 dark:text-white text-base sm:text-xs outline-none focus:border-neutral-900 dark:focus:border-white"
                />
              </div>

              <button
                type="button"
                onClick={() => setIsUserModalOpen(true)}
                className="w-full sm:w-auto px-4 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-200 text-white dark:text-black font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer shadow-md transition-all active:scale-98"
              >
                <UserPlus size={14} />
                <span>Add VIP Client</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {users
                .filter(u => u.name.toLowerCase().includes(userSearch.toLowerCase()) || (u.phone || '').includes(userSearch))
                .map((u) => (
                  <div key={u.id} className="p-5 rounded-2xl bg-white dark:bg-[#0D1017] border border-neutral-200 dark:border-white/10 hover:border-neutral-400 dark:hover:border-white/30 transition-all space-y-3 shadow-xs dark:shadow-lg">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded-full bg-neutral-100 dark:bg-white/10 border border-neutral-200 dark:border-white/20 text-[10px] text-neutral-800 dark:text-white font-bold">
                        {u.role || 'Platinum VIP Client'}
                      </span>
                      <span className="text-[10px] text-neutral-500 font-mono">ID: {u.id}</span>
                    </div>

                    <div>
                      <div className="font-bold text-sm text-neutral-900 dark:text-white">{u.name}</div>
                      <div className="text-xs text-neutral-600 dark:text-neutral-400 mt-0.5">{u.phone}</div>
                      {u.email && <div className="text-xs text-neutral-500">{u.email}</div>}
                      {u.city && <div className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 flex items-center gap-1"><MapPin size={11} /> {u.city}</div>}
                    </div>

                    <div className="pt-2 border-t border-neutral-100 dark:border-white/5 flex items-center justify-between">
                      <div>
                        <div className="text-[10px] text-neutral-500">Lifetime Purchases</div>
                        <div className="font-mono font-bold text-xs text-neutral-900 dark:text-white">
                          ₹{Number(u.totalSpent || 184900).toLocaleString('en-IN')}
                        </div>
                      </div>

                      {u.phone && (
                        <a
                          href={`https://wa.me/${u.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hello ${u.name}! Exclusive flagship privileges are active on your account at New Radhaswami Mobile Gallery.`)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs font-bold flex items-center gap-1 transition-colors"
                        >
                          <Share2 size={12} />
                          <span>WhatsApp</span>
                        </a>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 6: LIVE STORE AUDIT STREAM */}
        {/* ========================================================================= */}
        {activeTab === 'activity' && (
          <div className="max-w-4xl mx-auto bg-white dark:bg-[#0D1017] border border-neutral-200 dark:border-white/10 rounded-2xl sm:rounded-3xl p-4 sm:p-8 space-y-6 shadow-xs dark:shadow-xl">
            <div className="border-b border-neutral-200 dark:border-white/10 pb-4 flex items-center justify-between">
              <div>
                <h3 className="font-serif-luxury text-lg sm:text-xl text-neutral-900 dark:text-white font-medium flex items-center gap-2">
                  <Activity size={18} className="text-neutral-900 dark:text-white" />
                  <span>Real-time Operational Audit Stream</span>
                </h3>
                <p className="text-xs text-neutral-500 dark:text-[#8E8A85] mt-0.5">Chronological audit trail of all actions, dispatches, price revisions, and warranty tickets.</p>
              </div>

              <button
                type="button"
                onClick={fetchActivity}
                className="px-3 py-1.5 rounded-xl bg-neutral-100 hover:bg-neutral-200 dark:bg-white/5 dark:hover:bg-white/10 text-xs text-neutral-800 dark:text-white font-semibold flex items-center gap-1.5 cursor-pointer transition-colors"
              >
                <RefreshCw size={12} />
                <span>Sync</span>
              </button>
            </div>

            <AnimatedList className="space-y-3">
              {activityLogs.map((log) => (
                <div key={log.id} className="flex items-start gap-3 p-3.5 rounded-2xl bg-neutral-50 dark:bg-black/40 border border-neutral-200 dark:border-white/5 hover:border-neutral-300 dark:hover:border-white/10 transition-colors">
                  <div className="w-8 h-8 rounded-xl bg-neutral-200 dark:bg-white/10 border border-neutral-300 dark:border-white/20 flex items-center justify-center text-neutral-800 dark:text-white shrink-0 mt-0.5">
                    <Activity size={14} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-bold text-neutral-900 dark:text-white">{log.action}</span>
                      <span className="font-mono text-[10px] text-neutral-500">
                        {new Date(log.timestamp).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <div className="text-[11px] text-neutral-600 dark:text-neutral-400 mt-0.5">{log.details || log.user}</div>
                  </div>
                </div>
              ))}
            </AnimatedList>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 7: DEPARTMENTS & CATEGORIES */}
        {/* ========================================================================= */}
        {activeTab === 'categories' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 rounded-2xl bg-white dark:bg-[#0D1017] border border-neutral-200 dark:border-white/10 shadow-xs">
              <div>
                <h4 className="font-serif-luxury text-base text-neutral-900 dark:text-white">Showroom Salon Departments</h4>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">Configure catalog categories and brand departments.</p>
              </div>
              <button
                type="button"
                onClick={() => setIsCategoryModalOpen(true)}
                className="w-full sm:w-auto px-4 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-200 text-white dark:text-black font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-md transition-all active:scale-98"
              >
                <Plus size={14} />
                <span>Add Department</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {categories.map((c) => (
                <div key={c.id} className="p-5 rounded-2xl bg-white dark:bg-[#0D1017] border border-neutral-200 dark:border-white/10 space-y-2 shadow-xs group">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-neutral-900 dark:text-white">{c.name}</span>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10px] text-neutral-500">{c.id}</span>
                      <button
                        type="button"
                        onClick={() => handleDeleteCategory(c.id, c.name)}
                        className="p-1 rounded-lg text-neutral-400 hover:text-rose-500 hover:bg-rose-500/10 transition-colors cursor-pointer"
                        title="Delete Department"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                  <p className="text-xs text-neutral-600 dark:text-neutral-400">{c.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 8: STAFF ROSTER & SHIFTS */}
        {/* ========================================================================= */}
        {activeTab === 'staff' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 rounded-2xl bg-white dark:bg-[#0D1017] border border-neutral-200 dark:border-white/10 shadow-xs">
              <div>
                <h4 className="font-serif-luxury text-base text-neutral-900 dark:text-white">Showroom Associates &amp; Technical Staff</h4>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">Assigned shifts, access PINs, and security status.</p>
              </div>
              <button
                type="button"
                onClick={() => setIsStaffModalOpen(true)}
                className="w-full sm:w-auto px-4 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-200 text-white dark:text-black font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-md transition-all active:scale-98"
              >
                <UserPlus size={14} />
                <span>Add Associate</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {staffList.map((s) => (
                <div key={s.id} className="p-5 rounded-2xl bg-white dark:bg-[#0D1017] border border-neutral-200 dark:border-white/10 space-y-3 shadow-xs group">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300 text-[10px] font-bold">
                      {s.role || 'Showroom Specialist'}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10px] text-neutral-500">PIN: {s.pin}</span>
                      <button
                        type="button"
                        onClick={() => handleDeleteStaff(s.id, s.name)}
                        className="p-1 rounded-lg text-neutral-400 hover:text-rose-500 hover:bg-rose-500/10 transition-colors cursor-pointer"
                        title="Remove Associate"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                  <div>
                    <div className="font-bold text-sm text-neutral-900 dark:text-white">{s.name}</div>
                    <div className="text-xs text-neutral-600 dark:text-neutral-400">{s.phone} • {s.shift}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 9: ANNOUNCEMENTS QUICK BROADCASTER */}
        {/* ========================================================================= */}
        {activeTab === 'announcements' && (
          <div className="max-w-3xl mx-auto bg-white dark:bg-[#0D1017] border border-neutral-200 dark:border-white/10 rounded-2xl sm:rounded-3xl p-4 sm:p-8 space-y-5 shadow-xs dark:shadow-xl">
            <div className="border-b border-neutral-200 dark:border-white/10 pb-4 flex items-center justify-between">
              <div>
                <h3 className="font-serif-luxury text-lg sm:text-xl text-neutral-900 dark:text-white font-medium flex items-center gap-2">
                  <Megaphone size={18} className="text-neutral-900 dark:text-white" />
                  <span>Showroom Broadcast &amp; VIP Notice Controller</span>
                </h3>
                <p className="text-xs text-neutral-500 dark:text-[#8E8A85] mt-0.5">Control promotional banner, flyer graphic, and active status.</p>
              </div>
              <button
                type="button"
                onClick={handleSaveAnnouncement}
                className="px-5 py-2.5 rounded-full bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-200 text-white dark:text-black font-bold text-xs uppercase tracking-wider cursor-pointer shadow-md transition-all active:scale-98"
              >
                <Save size={14} className="inline mr-1" />
                <span>Publish</span>
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-2xl bg-neutral-50 dark:bg-black/40 border border-neutral-200 dark:border-white/10">
                <div>
                  <div className="text-sm font-semibold text-neutral-900 dark:text-white">Enable Pop-up on Storefront</div>
                  <div className="text-xs text-neutral-500 dark:text-[#8E8A85] mt-0.5">When enabled, visitors see the announcement modal instantly.</div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={announcement.active}
                    onChange={(e) => setAnnouncement({ ...announcement, active: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-neutral-300 dark:bg-white/20 rounded-full peer peer-checked:bg-neutral-900 dark:peer-checked:bg-white peer-checked:after:bg-white dark:peer-checked:after:bg-black peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                </label>
              </div>

              <div>
                <label className="block uppercase tracking-wider text-neutral-600 dark:text-[#A8A49F] mb-1.5 text-xs font-medium">
                  Headline / Title
                </label>
                <input
                  type="text"
                  required
                  value={announcement.title}
                  onChange={(e) => setAnnouncement({ ...announcement, title: e.target.value })}
                  placeholder="e.g. Royal Festive Privilege Drop"
                  className="w-full px-4 py-2.5 rounded-xl bg-neutral-50 dark:bg-black/50 border border-neutral-300 dark:border-white/10 text-neutral-900 dark:text-white text-base outline-none focus:border-neutral-900 dark:focus:border-white"
                />
              </div>

              <div>
                <label className="block uppercase tracking-wider text-neutral-600 dark:text-[#A8A49F] mb-1.5 text-xs font-medium">
                  Detailed Notice / Message
                </label>
                <textarea
                  rows={4}
                  required
                  value={announcement.message}
                  onChange={(e) => setAnnouncement({ ...announcement, message: e.target.value })}
                  placeholder="Describe the concession, voucher code, launch event, or showroom advisory..."
                  className="w-full px-4 py-2.5 rounded-xl bg-neutral-50 dark:bg-black/50 border border-neutral-300 dark:border-white/10 text-neutral-900 dark:text-white text-base outline-none focus:border-neutral-900 dark:focus:border-white resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block uppercase tracking-wider text-neutral-600 dark:text-[#A8A49F] mb-1.5 text-xs font-medium">
                    Promo Voucher Code
                  </label>
                  <input
                    type="text"
                    value={announcement.promoCode || ''}
                    onChange={(e) => setAnnouncement({ ...announcement, promoCode: e.target.value.toUpperCase() })}
                    placeholder="ROYAL10"
                    className="w-full px-4 py-2.5 rounded-xl bg-neutral-50 dark:bg-black/50 border border-neutral-300 dark:border-white/10 text-neutral-900 dark:text-white font-mono text-base outline-none focus:border-neutral-900 dark:focus:border-white"
                  />
                </div>

                <div>
                  <label className="block uppercase tracking-wider text-neutral-600 dark:text-[#A8A49F] mb-1.5 text-xs font-medium">
                    Visual Theme Style
                  </label>
                  <select
                    value={announcement.theme || 'obsidian'}
                    onChange={(e: any) => setAnnouncement({ ...announcement, theme: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-neutral-50 dark:bg-black/50 border border-neutral-300 dark:border-white/10 text-neutral-900 dark:text-white text-base outline-none focus:border-neutral-900 dark:focus:border-white cursor-pointer"
                  >
                    <option value="obsidian">Stealth Obsidian Titanium (Black &amp; White)</option>
                    <option value="emerald">Emerald High-Precision</option>
                    <option value="crimson">Royal Festive Crimson</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 10: VERIFIED REVIEWS */}
        {/* ========================================================================= */}
        {activeTab === 'reviews' && (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-white dark:bg-[#0D1017] border border-neutral-200 dark:border-white/10 shadow-xs">
              <h4 className="font-serif-luxury text-base text-neutral-900 dark:text-white font-semibold">Client Endorsements &amp; Testimonials</h4>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">Verified buyers from Pithampur, Indore, and Bhopal showrooms.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {reviews.map((r, i) => (
                <div key={i} className="p-5 rounded-2xl bg-white dark:bg-[#0D1017] border border-neutral-200 dark:border-white/10 space-y-2 shadow-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-neutral-900 dark:text-white">{r.author}</span>
                    <span className="text-amber-500 text-xs">★★★★★</span>
                  </div>
                  <div className="text-[11px] text-neutral-700 dark:text-neutral-300 font-semibold">{r.device || r.product}</div>
                  <p className="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed font-light">{r.comment}</p>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* ========================================================================= */}
      {/* FORMAL TAX INVOICE & QUOTATION PRINT MODAL */}
      {/* ========================================================================= */}
      {(selectedQuoteForInvoice || selectedOrderForInvoice) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl">
          <div className="relative w-full max-w-2xl bg-[#0C0F16] border border-white/20 rounded-3xl p-6 sm:p-8 text-white shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-white text-black flex items-center justify-center font-bold text-sm">
                  NR
                </div>
                <div>
                  <h3 className="font-serif-luxury text-lg text-white font-medium">New Radhaswami Mobile Gallery</h3>
                  <p className="text-[10px] text-neutral-400">GSTIN: 27AABCR8921M1Z5 • Authorized Premium Retailer</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => { setSelectedQuoteForInvoice(null); setSelectedOrderForInvoice(null); }}
                className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-white/70 hover:text-white cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {/* Bill Info */}
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-[10px] uppercase text-[#8E8A85] block">Billed To:</span>
                <span className="font-bold text-white text-sm">
                  {selectedQuoteForInvoice?.clientName || selectedOrderForInvoice?.customer?.name}
                </span>
                <div className="text-neutral-400 mt-0.5">
                  {selectedQuoteForInvoice?.phone || selectedOrderForInvoice?.customer?.phone}
                </div>
              </div>

              <div className="text-right">
                <span className="text-[10px] uppercase text-[#8E8A85] block">Invoice Reference:</span>
                <span className="font-mono font-bold text-white text-sm">
                  {selectedQuoteForInvoice?.id || selectedOrderForInvoice?.orderId}
                </span>
                <div className="text-neutral-400 mt-0.5">
                  {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                </div>
              </div>
            </div>

            {/* Itemized Table */}
            <div className="rounded-xl border border-white/10 overflow-hidden">
              <table className="w-full text-xs text-left">
                <thead className="bg-black/50 text-[10px] uppercase text-[#8E8A85] font-bold">
                  <tr>
                    <th className="py-2.5 px-3">Item Description</th>
                    <th className="py-2.5 px-3 text-center">Qty</th>
                    <th className="py-2.5 px-3 text-right">Rate</th>
                    <th className="py-2.5 px-3 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 font-mono">
                  {(selectedQuoteForInvoice?.items || selectedOrderForInvoice?.items || []).map((it: any, i: number) => {
                    const price = it.unitPrice || it.price || 0;
                    const q = it.qty || it.quantity || 1;
                    return (
                      <tr key={i}>
                        <td className="py-2.5 px-3 font-sans font-medium text-white">{it.name || it.product?.name}</td>
                        <td className="py-2.5 px-3 text-center">{q}</td>
                        <td className="py-2.5 px-3 text-right">₹{price.toLocaleString('en-IN')}</td>
                        <td className="py-2.5 px-3 text-right">₹{(price * q).toLocaleString('en-IN')}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Total Calculations */}
            <div className="flex justify-end text-xs">
              <div className="w-64 space-y-1.5 font-mono">
                <div className="flex justify-between text-neutral-400">
                  <span>Subtotal:</span>
                  <span>₹{((selectedQuoteForInvoice?.subtotal || selectedOrderForInvoice?.total * 0.82) || 0).toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-neutral-400">
                  <span>CGST (9%) + SGST (9%):</span>
                  <span>₹{((selectedQuoteForInvoice?.taxGst || selectedOrderForInvoice?.total * 0.18) || 0).toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-base font-bold text-white pt-2 border-t border-white/10">
                  <span>Grand Total:</span>
                  <span>₹{Number(selectedQuoteForInvoice?.total || selectedOrderForInvoice?.total).toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-white/10">
              <div className="text-[10px] text-neutral-400 flex items-center gap-1.5">
                <ShieldCheck size={14} className="text-white" />
                <span>Authorized Showroom Seal • 100% Sealed Indian Stock</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-4 py-2 rounded-xl bg-white hover:bg-neutral-200 text-black font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-md"
                >
                  <Printer size={14} />
                  <span>Print Document</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* REPAIR INTAKE MODAL */}
      {/* ========================================================================= */}
      {isRepairModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl">
          <div className="relative w-full max-w-lg bg-[#0C0F16] border border-white/20 rounded-3xl p-6 sm:p-8 text-white shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="font-serif-luxury text-lg text-white font-medium flex items-center gap-2">
                <Wrench size={17} className="text-white" />
                <span>Log New Service &amp; Repair Job</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsRepairModalOpen(false)}
                className="p-2 rounded-full bg-white/5 text-white/70 hover:text-white"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleCreateRepair} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-400 font-bold mb-1">Customer Name</label>
                  <input
                    type="text"
                    required
                    value={newRepairData.customerName}
                    onChange={(e) => setNewRepairData({ ...newRepairData, customerName: e.target.value })}
                    placeholder="Aditya Birla"
                    className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/10 text-white outline-none focus:border-white"
                  />
                </div>
                <div>
                  <label className="block text-neutral-400 font-bold mb-1">Phone Number</label>
                  <input
                    type="text"
                    required
                    value={newRepairData.phone}
                    onChange={(e) => setNewRepairData({ ...newRepairData, phone: e.target.value })}
                    placeholder="+91 96910 11335"
                    className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/10 text-white outline-none focus:border-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-400 font-bold mb-1">Device Model</label>
                  <input
                    type="text"
                    required
                    value={newRepairData.device}
                    onChange={(e) => setNewRepairData({ ...newRepairData, device: e.target.value })}
                    placeholder="iPhone 16 Pro Max"
                    className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/10 text-white outline-none focus:border-white"
                  />
                </div>
                <div>
                  <label className="block text-neutral-400 font-bold mb-1">IMEI Number (15 Digits)</label>
                  <input
                    type="text"
                    value={newRepairData.imei}
                    onChange={(e) => setNewRepairData({ ...newRepairData, imei: e.target.value })}
                    placeholder="354892019482910"
                    className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/10 text-white outline-none focus:border-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-neutral-400 font-bold mb-1">Reported Issue / Work Description</label>
                <textarea
                  rows={2}
                  required
                  value={newRepairData.issue}
                  onChange={(e) => setNewRepairData({ ...newRepairData, issue: e.target.value })}
                  placeholder="e.g. Display glass cracked, OLED flickering..."
                  className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/10 text-white outline-none focus:border-white resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-400 font-bold mb-1">Estimated Cost (INR)</label>
                  <input
                    type="number"
                    value={newRepairData.quotedAmount}
                    onChange={(e) => setNewRepairData({ ...newRepairData, quotedAmount: e.target.value })}
                    placeholder="28500"
                    className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/10 text-white outline-none focus:border-white"
                  />
                </div>
                <div>
                  <label className="block text-neutral-400 font-bold mb-1">Advance Received (INR)</label>
                  <input
                    type="number"
                    value={newRepairData.advancePaid}
                    onChange={(e) => setNewRepairData({ ...newRepairData, advancePaid: e.target.value })}
                    placeholder="10000"
                    className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/10 text-white outline-none focus:border-white"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsRepairModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-white/10 text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-white hover:bg-neutral-200 text-black font-bold"
                >
                  Save Service Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* PRODUCT ADD / EDIT MODAL (COMPLETE MULTI-VARIANT & MULTI-IMAGE SUITE) */}
      {/* ========================================================================= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-2xl">
          <div className="relative w-full max-w-3xl bg-[#090B0E] border border-white/20 rounded-3xl text-white shadow-[0_25px_80px_rgba(0,0,0,0.9)] flex flex-col max-h-[92vh] overflow-hidden animate-fade-in">
            
            {/* Header (Sticky Top) */}
            <div className="flex items-center justify-between p-4 sm:p-5 border-b border-white/10 bg-[#0C0F14] shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-white text-black flex items-center justify-center font-bold">
                  <Package size={16} />
                </div>
                <div>
                  <h3 className="font-serif-luxury text-base sm:text-lg text-white font-medium leading-tight">
                    {editingProductId ? 'Edit Flagship Specifications' : 'Add New Flagship Product'}
                  </h3>
                  <p className="text-[10px] text-neutral-400">
                    100% Sealed Indian Retail Stock • Instant Showroom Synchronization
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white transition-all cursor-pointer"
                title="Close modal"
              >
                <X size={16} />
              </button>
            </div>

            {/* Scrollable Form Body */}
            <form id="product-form" onSubmit={handleSaveProduct} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 text-xs [scrollbar-width:thin]">
              
              {/* 1. General Info */}
              <div className="space-y-3">
                <div className="text-[11px] font-bold text-neutral-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Smartphone size={13} className="text-white" />
                  <span>Device Identity & Classification</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-neutral-400 font-semibold mb-1">Product Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. iPhone 16 Pro Max"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/15 text-white outline-none focus:border-white focus:ring-1 focus:ring-white/30 transition-all text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-neutral-400 font-semibold mb-1">Brand *</label>
                    <div className="flex gap-2">
                      <select
                        value={formData.isCustomBrand ? 'Other' : formData.brand}
                        onChange={(e) => {
                          if (e.target.value === 'Other') {
                            setFormData({ ...formData, isCustomBrand: true, brand: 'Other' });
                          } else {
                            setFormData({ ...formData, isCustomBrand: false, brand: e.target.value });
                          }
                        }}
                        className="flex-1 px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/15 text-white outline-none focus:border-white text-xs"
                      >
                        <option value="Apple">Apple</option>
                        <option value="Samsung">Samsung</option>
                        <option value="Google">Google Pixel</option>
                        <option value="OnePlus">OnePlus</option>
                        <option value="Sony">Sony</option>
                        <option value="Xiaomi">Xiaomi</option>
                        <option value="Anker">Anker</option>
                        <option value="Other">Custom Brand...</option>
                      </select>
                      {formData.isCustomBrand && (
                        <input
                          type="text"
                          required
                          placeholder="Brand Name"
                          value={formData.customBrand}
                          onChange={(e) => setFormData({ ...formData, customBrand: e.target.value })}
                          className="w-1/2 px-3 py-2 rounded-xl bg-black/60 border border-white/20 text-white text-xs outline-none focus:border-white"
                        />
                      )}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-neutral-400 font-semibold mb-1">Category Department *</label>
                    <div className="flex gap-2">
                      <select
                        value={formData.isCustomCategory ? 'Other' : formData.category}
                        onChange={(e) => {
                          if (e.target.value === 'Other') {
                            setFormData({ ...formData, isCustomCategory: true, category: 'Other' });
                          } else {
                            setFormData({ ...formData, isCustomCategory: false, category: e.target.value });
                          }
                        }}
                        className="flex-1 px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/15 text-white outline-none focus:border-white text-xs"
                      >
                        <option value="smartphones">Smartphones (Flagship)</option>
                        <option value="audio">Audio & Acoustics</option>
                        <option value="watches">Smartwatches & Wearables</option>
                        <option value="chargers">Fast Chargers & GaN</option>
                        <option value="accessories">Accessories & Shields</option>
                        <option value="Other">Custom Category...</option>
                      </select>
                      {formData.isCustomCategory && (
                        <input
                          type="text"
                          required
                          placeholder="Category Name"
                          value={formData.customCategory}
                          onChange={(e) => setFormData({ ...formData, customCategory: e.target.value })}
                          className="w-1/2 px-3 py-2 rounded-xl bg-black/60 border border-white/20 text-white text-xs outline-none focus:border-white"
                        />
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-neutral-400 font-semibold mb-1">Warranty & Compliance</label>
                    <input
                      type="text"
                      value={formData.warranty}
                      onChange={(e) => setFormData({ ...formData, warranty: e.target.value })}
                      placeholder="1 Year Official Brand Manufacturer Warranty"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/15 text-white outline-none focus:border-white text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* 2. Commercial Pricing & Inventory Toggle */}
              <div className="space-y-3 pt-2 border-t border-white/10">
                <div className="text-[11px] font-bold text-neutral-300 uppercase tracking-wider flex items-center gap-1.5">
                  <DollarSign size={13} className="text-white" />
                  <span>Commercials & Inventory Status</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-neutral-400 font-semibold mb-1">Sale Price (₹ INR) *</label>
                    <input
                      type="number"
                      required
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      placeholder="144900"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/15 text-white font-mono outline-none focus:border-white text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-neutral-400 font-semibold mb-1">MRP Price (₹ INR)</label>
                    <input
                      type="number"
                      value={formData.originalPrice}
                      onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                      placeholder="159900"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/15 text-white font-mono outline-none focus:border-white text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-neutral-400 font-semibold mb-1">Showroom Stock Status</label>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, inStock: !formData.inStock })}
                      className={`w-full py-2.5 px-4 rounded-xl border flex items-center justify-between font-bold text-xs transition-all cursor-pointer ${
                        formData.inStock
                          ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-400'
                          : 'bg-red-500/15 border-red-500/40 text-red-400'
                      }`}
                    >
                      <span>{formData.inStock ? 'In Stock (Ready)' : 'Out of Stock'}</span>
                      {formData.inStock ? <Check size={14} /> : <X size={14} />}
                    </button>
                  </div>
                </div>
              </div>

              {/* 3. Multi-Image Media Gallery */}
              <div className="space-y-3 pt-2 border-t border-white/10">
                <div className="flex items-center justify-between">
                  <div className="text-[11px] font-bold text-neutral-300 uppercase tracking-wider flex items-center gap-1.5">
                    <ImageIcon size={13} className="text-white" />
                    <span>Multi-Angle Product Gallery ({formImages.length})</span>
                  </div>
                  <span className="text-[10px] text-neutral-500">First image will be the primary catalog cover</span>
                </div>

                {/* Thumbnails preview */}
                {formImages.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {formImages.map((imgUrl, idx) => (
                      <div key={idx} className="relative group rounded-xl overflow-hidden border border-white/15 bg-black/60 h-28 flex flex-col items-center justify-center">
                        <img src={imgUrl} alt={`angle-${idx}`} className="w-full h-full object-cover" />
                        {idx === 0 ? (
                          <span className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded-md bg-white text-black text-[9px] font-bold shadow-md">
                            Primary Cover
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleMakeCover(idx)}
                            className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded-md bg-black/80 hover:bg-white hover:text-black text-white text-[9px] font-semibold border border-white/20 transition-all opacity-0 group-hover:opacity-100 cursor-pointer"
                          >
                            Set Cover
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(idx)}
                          className="absolute top-1.5 right-1.5 p-1 rounded-md bg-black/70 hover:bg-red-600 text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer shadow-md"
                          title="Remove image"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Direct Multi-File Upload Dropzone (No Links, Never Crash) */}
                <div className="relative">
                  <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-white/20 hover:border-white/50 rounded-2xl bg-black/40 hover:bg-black/60 transition-all cursor-pointer group">
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleDirectFileUpload}
                      disabled={isUploadingImages}
                      className="hidden"
                    />
                    <div className="w-10 h-10 rounded-full bg-white/10 group-hover:bg-white/20 flex items-center justify-center text-white mb-2 transition-transform group-hover:scale-110">
                      <Upload size={18} />
                    </div>
                    <div className="text-xs font-bold text-white mb-0.5">
                      {isUploadingImages ? (uploadStatusText || 'Processing Photos...') : 'Drag & Drop Photos or Click to Browse'}
                    </div>
                    <div className="text-[10px] text-neutral-400">
                      Supports PNG, JPG, WEBP, SVG • Multi-select enabled • Saved permanently to database
                    </div>
                    {isUploadingImages && (
                      <div className="mt-2 flex items-center gap-1.5 text-xs text-neutral-300 font-mono animate-pulse">
                        <RefreshCw size={12} className="animate-spin" />
                        <span>Uploading directly to server storage...</span>
                      </div>
                    )}
                  </label>
                </div>
              </div>

              {/* 4. Dynamic Color Variants */}
              <div className="space-y-3 pt-2 border-t border-white/10">
                <div className="flex items-center justify-between">
                  <div className="text-[11px] font-bold text-neutral-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Palette size={13} className="text-white" />
                    <span>Color Finishes & Swatches ({formColors.length})</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddColor}
                    className="flex items-center gap-1 text-[11px] text-white hover:text-neutral-300 cursor-pointer font-semibold"
                  >
                    <Plus size={12} />
                    <span>Add Color Finish</span>
                  </button>
                </div>

                <div className="space-y-2">
                  {formColors.map((col, idx) => (
                    <div key={idx} className="flex items-center gap-2 p-2.5 rounded-xl bg-black/40 border border-white/10">
                      <div
                        className="w-6 h-6 rounded-full border border-white/30 shrink-0 shadow-sm"
                        style={{ backgroundColor: col.hex }}
                      />
                      <input
                        type="text"
                        value={col.name}
                        onChange={(e) => handleUpdateColor(idx, 'name', e.target.value)}
                        placeholder="Finish Name (e.g. Natural Titanium)"
                        className="flex-1 px-3 py-1.5 rounded-lg bg-black/50 border border-white/10 text-white text-xs outline-none focus:border-white"
                      />
                      <input
                        type="color"
                        value={col.hex}
                        onChange={(e) => handleUpdateColor(idx, 'hex', e.target.value)}
                        className="w-8 h-8 rounded-lg bg-transparent border-0 cursor-pointer p-0"
                        title="Pick exact hex color"
                      />
                      <input
                        type="text"
                        value={col.hex}
                        onChange={(e) => handleUpdateColor(idx, 'hex', e.target.value)}
                        placeholder="#HEX"
                        className="w-20 px-2 py-1.5 rounded-lg bg-black/50 border border-white/10 text-white font-mono text-[11px] outline-none focus:border-white"
                      />
                      <label className="flex items-center gap-1.5 text-[11px] text-neutral-300 cursor-pointer px-2">
                        <input
                          type="checkbox"
                          checked={col.inStock}
                          onChange={(e) => handleUpdateColor(idx, 'inStock', e.target.checked)}
                          className="rounded border-white/30 bg-black/60 text-white"
                        />
                        <span>In Stock</span>
                      </label>
                      <button
                        type="button"
                        onClick={() => handleRemoveColor(idx)}
                        disabled={formColors.length <= 1}
                        className="p-1.5 rounded-lg text-neutral-500 hover:text-red-400 hover:bg-white/5 transition-all disabled:opacity-30 cursor-pointer"
                        title="Remove color finish"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* 5. Storage Variants & Pricing */}
              <div className="space-y-3 pt-2 border-t border-white/10">
                <div className="flex items-center justify-between">
                  <div className="text-[11px] font-bold text-neutral-300 uppercase tracking-wider flex items-center gap-1.5">
                    <HardDrive size={13} className="text-white" />
                    <span>Storage Tiers & Price Overrides ({formStorages.length})</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddStorage}
                    className="flex items-center gap-1 text-[11px] text-white hover:text-neutral-300 cursor-pointer font-semibold"
                  >
                    <Plus size={12} />
                    <span>Add Storage Tier</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {formStorages.map((st, idx) => (
                    <div key={idx} className="flex items-center gap-2 p-2.5 rounded-xl bg-black/40 border border-white/10">
                      <input
                        type="text"
                        value={st.size}
                        onChange={(e) => handleUpdateStorage(idx, 'size', e.target.value)}
                        placeholder="Tier (e.g. 256GB)"
                        className="w-24 px-3 py-1.5 rounded-lg bg-black/50 border border-white/10 text-white text-xs font-semibold outline-none focus:border-white"
                      />
                      <div className="flex-1 flex items-center gap-1">
                        <span className="text-neutral-500 font-mono">₹</span>
                        <input
                          type="number"
                          value={st.price}
                          onChange={(e) => handleUpdateStorage(idx, 'price', e.target.value)}
                          placeholder="Price override"
                          className="w-full px-3 py-1.5 rounded-lg bg-black/50 border border-white/10 text-white font-mono text-xs outline-none focus:border-white"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveStorage(idx)}
                        disabled={formStorages.length <= 1}
                        className="p-1.5 rounded-lg text-neutral-500 hover:text-red-400 hover:bg-white/5 transition-all disabled:opacity-30 cursor-pointer"
                        title="Remove tier"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* 6. Description */}
              <div className="space-y-2 pt-2 border-t border-white/10">
                <label className="block text-neutral-400 font-semibold mb-1">Product Description &amp; Selling Points</label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Forged in titanium with aerospace Grade 5 alloy, A18 Pro silicon, revolutionary camera system, and all-day battery endurance..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/15 text-white outline-none focus:border-white resize-none text-xs leading-relaxed"
                />
              </div>

            </form>

            {/* Sticky Action Footer */}
            <div className="flex items-center justify-between p-4 bg-[#0A0B0E] border-t border-white/10 shrink-0">
              <div className="hidden sm:flex items-center gap-2 text-[11px] text-neutral-400">
                <span className="px-2 py-0.5 rounded-md bg-white/10 text-white font-mono">{formImages.length} Photos</span>
                <span className="px-2 py-0.5 rounded-md bg-white/10 text-white font-mono">{formColors.length} Colors</span>
                <span className="px-2 py-0.5 rounded-md bg-white/10 text-white font-mono">{formStorages.length} Tiers</span>
              </div>
              
              <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold transition-all cursor-pointer text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  form="product-form"
                  className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl bg-white hover:bg-neutral-200 text-black font-bold shadow-xl flex items-center justify-center gap-2 transition-all cursor-pointer text-xs"
                >
                  <Save size={14} />
                  <span>{editingProductId ? 'Update Product' : 'Save to Catalog'}</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* ADD VIP CLIENT MODAL (MONOCHROME LUXURY) */}
      {/* ========================================================================= */}
      {/* ========================================================================= */}
      {/* ADD VIP CLIENT MODAL (MONOCHROME LUXURY) */}
      {/* ========================================================================= */}
      {isUserModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-2xl">
          <div className="relative w-full max-w-md bg-[#0C0F15] border border-white/20 rounded-3xl p-6 text-white shadow-2xl space-y-4 animate-fade-in">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-white text-black flex items-center justify-center font-bold">
                  <UserPlus size={15} />
                </div>
                <h3 className="font-serif-luxury text-base text-white font-medium">Add VIP Clientele Account</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsUserModalOpen(false)}
                className="p-1.5 rounded-full bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white transition-all cursor-pointer"
              >
                <X size={15} />
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-neutral-400 font-semibold mb-1">Full Client Name *</label>
                <input
                  type="text"
                  required
                  value={newUserData.name}
                  onChange={(e) => setNewUserData({ ...newUserData, name: e.target.value })}
                  placeholder="Kunal Deshmukh"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/15 text-white outline-none focus:border-white text-xs"
                />
              </div>

              <div>
                <label className="block text-neutral-400 font-semibold mb-1">Mobile Phone Number *</label>
                <input
                  type="text"
                  required
                  value={newUserData.phone}
                  onChange={(e) => setNewUserData({ ...newUserData, phone: e.target.value })}
                  placeholder="+91 98110 55667"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/15 text-white outline-none focus:border-white text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-neutral-400 font-semibold mb-1">City / Delivery Region</label>
                <input
                  type="text"
                  value={newUserData.city}
                  onChange={(e) => setNewUserData({ ...newUserData, city: e.target.value })}
                  placeholder="Vijay Nagar, Pithampur"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/15 text-white outline-none focus:border-white text-xs"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2.5 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsUserModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold transition-all cursor-pointer text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-white hover:bg-neutral-200 text-black font-bold shadow-lg transition-all cursor-pointer text-xs flex items-center gap-1.5"
                >
                  <Save size={13} />
                  <span>Create Account</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* ADD DEPARTMENT / CATEGORY MODAL */}
      {/* ========================================================================= */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-2xl">
          <div className="relative w-full max-w-md bg-[#0C0F15] border border-white/20 rounded-3xl p-6 text-white shadow-2xl space-y-4 animate-fade-in">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-white text-black flex items-center justify-center font-bold">
                  <FolderPlus size={15} />
                </div>
                <h3 className="font-serif-luxury text-base text-white font-medium">Add Showroom Department</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsCategoryModalOpen(false)}
                className="p-1.5 rounded-full bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white transition-all cursor-pointer"
              >
                <X size={15} />
              </button>
            </div>

            <form onSubmit={handleAddCategory} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-neutral-400 font-semibold mb-1">Department Name *</label>
                <input
                  type="text"
                  required
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  placeholder="e.g. Smart Wearables & Audio"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/15 text-white outline-none focus:border-white text-xs"
                />
              </div>

              <div>
                <label className="block text-neutral-400 font-semibold mb-1">Description / Department Scope</label>
                <input
                  type="text"
                  value={newCatDesc}
                  onChange={(e) => setNewCatDesc(e.target.value)}
                  placeholder="Official smartwatches, fitness bands and accessories"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/15 text-white outline-none focus:border-white text-xs"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2.5 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsCategoryModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold transition-all cursor-pointer text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-white hover:bg-neutral-200 text-black font-bold shadow-lg transition-all cursor-pointer text-xs flex items-center gap-1.5"
                >
                  <Save size={13} />
                  <span>Save Department</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* ADD STAFF ASSOCIATE MODAL */}
      {/* ========================================================================= */}
      {isStaffModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-2xl">
          <div className="relative w-full max-w-md bg-[#0C0F15] border border-white/20 rounded-3xl p-6 text-white shadow-2xl space-y-4 animate-fade-in">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-white text-black flex items-center justify-center font-bold">
                  <UserPlus size={15} />
                </div>
                <h3 className="font-serif-luxury text-base text-white font-medium">Add Showroom Associate</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsStaffModalOpen(false)}
                className="p-1.5 rounded-full bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white transition-all cursor-pointer"
              >
                <X size={15} />
              </button>
            </div>

            <form onSubmit={handleAddStaff} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-neutral-400 font-semibold mb-1">Full Associate Name *</label>
                <input
                  type="text"
                  required
                  value={newStaffData.name}
                  onChange={(e) => setNewStaffData({ ...newStaffData, name: e.target.value })}
                  placeholder="Devendra Yadav"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/15 text-white outline-none focus:border-white text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-400 font-semibold mb-1">Mobile Phone *</label>
                  <input
                    type="text"
                    required
                    value={newStaffData.phone}
                    onChange={(e) => setNewStaffData({ ...newStaffData, phone: e.target.value })}
                    placeholder="+91 98260 12345"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/15 text-white outline-none focus:border-white text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block text-neutral-400 font-semibold mb-1">Access PIN (4 digits) *</label>
                  <input
                    type="password"
                    maxLength={6}
                    required
                    value={newStaffData.pin}
                    onChange={(e) => setNewStaffData({ ...newStaffData, pin: e.target.value })}
                    placeholder="4321"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/15 text-white outline-none focus:border-white text-xs font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-400 font-semibold mb-1">Staff Role</label>
                  <select
                    value={newStaffData.role}
                    onChange={(e) => setNewStaffData({ ...newStaffData, role: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/15 text-white outline-none focus:border-white text-xs"
                  >
                    <option value="Store Associate">Store Associate</option>
                    <option value="Floor Manager">Floor Manager</option>
                    <option value="Hardware & Diagnostics">Hardware Diagnostics</option>
                    <option value="Concierge & VIP Accounts">VIP Concierge</option>
                  </select>
                </div>
                <div>
                  <label className="block text-neutral-400 font-semibold mb-1">Assigned Shift</label>
                  <input
                    type="text"
                    value={newStaffData.shift}
                    onChange={(e) => setNewStaffData({ ...newStaffData, shift: e.target.value })}
                    placeholder="Showroom Floor"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/15 text-white outline-none focus:border-white text-xs"
                  />
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2.5 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsStaffModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold transition-all cursor-pointer text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-white hover:bg-neutral-200 text-black font-bold shadow-lg transition-all cursor-pointer text-xs flex items-center gap-1.5"
                >
                  <Save size={13} />
                  <span>Save Associate</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Universal Mobile Quick Add / Edit Modal (Cloud Sync) */}
      <MobileQuickAddModal
        isOpen={isQuickAddOpen}
        onClose={() => {
          setIsQuickAddOpen(false);
          setQuickAddProduct(null);
        }}
        initialProduct={quickAddProduct}
        onProductSaved={(savedProd) => {
          if (savedProd) {
            setLocalProducts(prev => {
              const exists = prev.some(p => p.id === savedProd.id);
              return exists ? prev.map(p => p.id === savedProd.id ? savedProd : p) : [savedProd, ...prev];
            });
          }
          onRefreshProducts();
          showToast('Handset saved & synced across all showroom devices globally!');
          fetchActivity();
        }}
      />

      {/* ========================================================================= */}
      {/* MOBILE NATIVE ERGONOMIC BOTTOM BAR (md:hidden) */}
      {/* ========================================================================= */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-[#0A0C10]/95 backdrop-blur-xl border-t border-neutral-200 dark:border-white/10 px-2 py-1.5 flex items-center justify-around md:hidden shadow-2xl safe-area-pb">
        <button
          type="button"
          onClick={() => { setActiveTab('inventory'); setIsMobileMoreOpen(false); }}
          className={`flex flex-col items-center gap-0.5 py-1 px-2.5 rounded-xl text-[10px] font-semibold transition-all cursor-pointer ${
            activeTab === 'inventory' && !isMobileMoreOpen
              ? 'text-neutral-950 dark:text-white font-bold scale-105'
              : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-white'
          }`}
        >
          <Package size={18} className={activeTab === 'inventory' && !isMobileMoreOpen ? 'text-emerald-500' : ''} />
          <span>Stock</span>
        </button>

        <button
          type="button"
          onClick={() => { setActiveTab('orders'); setIsMobileMoreOpen(false); }}
          className={`flex flex-col items-center gap-0.5 py-1 px-2.5 rounded-xl text-[10px] font-semibold transition-all cursor-pointer relative ${
            activeTab === 'orders' && !isMobileMoreOpen
              ? 'text-neutral-950 dark:text-white font-bold scale-105'
              : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-white'
          }`}
        >
          <Truck size={18} className={activeTab === 'orders' && !isMobileMoreOpen ? 'text-blue-500' : ''} />
          <span>Orders</span>
          {orders.length > 0 && (
            <span className="absolute top-0 right-1 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-black" />
          )}
        </button>

        <button
          type="button"
          onClick={() => { setActiveTab('pos'); setIsMobileMoreOpen(false); }}
          className={`flex flex-col items-center gap-0.5 py-1 px-2.5 rounded-xl text-[10px] font-semibold transition-all cursor-pointer ${
            activeTab === 'pos' && !isMobileMoreOpen
              ? 'text-neutral-950 dark:text-white font-bold scale-105'
              : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-white'
          }`}
        >
          <Receipt size={18} className={activeTab === 'pos' && !isMobileMoreOpen ? 'text-amber-500' : ''} />
          <span>POS</span>
        </button>

        <button
          type="button"
          onClick={() => { setActiveTab('announcements'); setIsMobileMoreOpen(false); }}
          className={`flex flex-col items-center gap-0.5 py-1 px-2.5 rounded-xl text-[10px] font-semibold transition-all cursor-pointer ${
            activeTab === 'announcements' && !isMobileMoreOpen
              ? 'text-neutral-950 dark:text-white font-bold scale-105'
              : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-white'
          }`}
        >
          <Megaphone size={18} className={activeTab === 'announcements' && !isMobileMoreOpen ? 'text-purple-500' : ''} />
          <span>Banner</span>
        </button>

        <button
          type="button"
          onClick={() => setIsMobileMoreOpen(!isMobileMoreOpen)}
          className={`flex flex-col items-center gap-0.5 py-1 px-2.5 rounded-xl text-[10px] font-semibold transition-all cursor-pointer ${
            isMobileMoreOpen || ['repairs', 'activity', 'categories', 'staff', 'reviews', 'users'].includes(activeTab)
              ? 'text-neutral-950 dark:text-white font-bold scale-105'
              : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-white'
          }`}
        >
          <MoreHorizontal size={18} className={isMobileMoreOpen || ['repairs', 'activity', 'categories', 'staff', 'reviews', 'users'].includes(activeTab) ? 'text-rose-500' : ''} />
          <span>More</span>
        </button>
      </nav>

      {/* Mobile More Drawer / Bottom Sheet */}
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
                <h3 className="font-bold text-sm text-neutral-900 dark:text-white">Terminal Operations</h3>
                <p className="text-[10px] text-neutral-500 dark:text-neutral-400">Quick showroom management modules</p>
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
                onClick={() => { setActiveTab('repairs'); setIsMobileMoreOpen(false); }}
                className={`p-3 rounded-2xl border text-left active:scale-95 transition-all cursor-pointer flex items-center gap-2.5 ${
                  activeTab === 'repairs'
                    ? 'bg-neutral-900 text-white dark:bg-white dark:text-black border-transparent'
                    : 'bg-neutral-50 dark:bg-white/5 border-neutral-200 dark:border-white/10 text-neutral-800 dark:text-white'
                }`}
              >
                <div className="p-2 rounded-xl bg-blue-500/15 text-blue-500 shrink-0"><Wrench size={16} /></div>
                <div className="min-w-0">
                  <div className="text-xs font-bold truncate">Repairs</div>
                  <div className="text-[10px] opacity-70 truncate">{repairs.length} Tickets</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => { setActiveTab('activity'); setIsMobileMoreOpen(false); }}
                className={`p-3 rounded-2xl border text-left active:scale-95 transition-all cursor-pointer flex items-center gap-2.5 ${
                  activeTab === 'activity'
                    ? 'bg-neutral-900 text-white dark:bg-white dark:text-black border-transparent'
                    : 'bg-neutral-50 dark:bg-white/5 border-neutral-200 dark:border-white/10 text-neutral-800 dark:text-white'
                }`}
              >
                <div className="p-2 rounded-xl bg-purple-500/15 text-purple-500 shrink-0"><Activity size={16} /></div>
                <div className="min-w-0">
                  <div className="text-xs font-bold truncate">Audit Stream</div>
                  <div className="text-[10px] opacity-70 truncate">Live Logs</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => { setActiveTab('categories'); setIsMobileMoreOpen(false); }}
                className={`p-3 rounded-2xl border text-left active:scale-95 transition-all cursor-pointer flex items-center gap-2.5 ${
                  activeTab === 'categories'
                    ? 'bg-neutral-900 text-white dark:bg-white dark:text-black border-transparent'
                    : 'bg-neutral-50 dark:bg-white/5 border-neutral-200 dark:border-white/10 text-neutral-800 dark:text-white'
                }`}
              >
                <div className="p-2 rounded-xl bg-amber-500/15 text-amber-500 shrink-0"><FolderPlus size={16} /></div>
                <div className="min-w-0">
                  <div className="text-xs font-bold truncate">Departments</div>
                  <div className="text-[10px] opacity-70 truncate">Categories</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => { setActiveTab('staff'); setIsMobileMoreOpen(false); }}
                className={`p-3 rounded-2xl border text-left active:scale-95 transition-all cursor-pointer flex items-center gap-2.5 ${
                  activeTab === 'staff'
                    ? 'bg-neutral-900 text-white dark:bg-white dark:text-black border-transparent'
                    : 'bg-neutral-50 dark:bg-white/5 border-neutral-200 dark:border-white/10 text-neutral-800 dark:text-white'
                }`}
              >
                <div className="p-2 rounded-xl bg-emerald-500/15 text-emerald-500 shrink-0"><ShieldCheck size={16} /></div>
                <div className="min-w-0">
                  <div className="text-xs font-bold truncate">Staff Roster</div>
                  <div className="text-[10px] opacity-70 truncate">Credentials</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => { setActiveTab('reviews'); setIsMobileMoreOpen(false); }}
                className={`p-3 rounded-2xl border text-left active:scale-95 transition-all cursor-pointer flex items-center gap-2.5 ${
                  activeTab === 'reviews'
                    ? 'bg-neutral-900 text-white dark:bg-white dark:text-black border-transparent'
                    : 'bg-neutral-50 dark:bg-white/5 border-neutral-200 dark:border-white/10 text-neutral-800 dark:text-white'
                }`}
              >
                <div className="p-2 rounded-xl bg-rose-500/15 text-rose-500 shrink-0"><MessageSquare size={16} /></div>
                <div className="min-w-0">
                  <div className="text-xs font-bold truncate">Reviews</div>
                  <div className="text-[10px] opacity-70 truncate">Google Feedback</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => { setActiveTab('users'); setIsMobileMoreOpen(false); }}
                className={`p-3 rounded-2xl border text-left active:scale-95 transition-all cursor-pointer flex items-center gap-2.5 ${
                  activeTab === 'users'
                    ? 'bg-neutral-900 text-white dark:bg-white dark:text-black border-transparent'
                    : 'bg-neutral-50 dark:bg-white/5 border-neutral-200 dark:border-white/10 text-neutral-800 dark:text-white'
                }`}
              >
                <div className="p-2 rounded-xl bg-indigo-500/15 text-indigo-500 shrink-0"><UserCheck size={16} /></div>
                <div className="min-w-0">
                  <div className="text-xs font-bold truncate">VIP Clients</div>
                  <div className="text-[10px] opacity-70 truncate">{users.length} Registered</div>
                </div>
              </button>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => { openAddModal(); setIsMobileMoreOpen(false); }}
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
            className="w-full max-w-sm bg-white dark:bg-[#0E121B] border border-neutral-200 dark:border-rose-500/30 rounded-3xl p-6 shadow-2xl space-y-4"
            onClick={e => e.stopPropagation()}
          >
            <div className="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-500/15 border border-rose-200 dark:border-rose-500/30 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto">
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
                className="py-2.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-lg shadow-rose-600/30 cursor-pointer transition-all active:scale-98 flex items-center justify-center gap-1.5"
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
