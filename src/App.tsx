import React, { useState, useEffect } from 'react';
import Lenis from 'lenis';
import { Product, PRODUCTS } from './data/products';
import { fetchLiveProducts } from './services/cloudSync';
import { StoreHeader } from './components/store/StoreHeader';
import { HeroMobileStage } from './components/store/HeroMobileStage';
import { ShopPage } from './components/store/ShopPage';
import { MobileCatalogSection } from './components/store/MobileCatalogSection';
import { EmiCalculatorSection } from './components/store/EmiCalculatorSection';
import { AccessoriesSection } from './components/store/AccessoriesSection';
import { Phone3DStudioSection } from './components/store/Phone3DStudioSection';
import { ComparisonMatrix } from './components/ComparisonMatrix';
import { CustomerReviews } from './components/store/CustomerReviews';
import { StoreFooter } from './components/store/StoreFooter';
import { AuthModal } from './components/store/AuthModal';
import { ProductDetailModal } from './components/store/ProductDetailModal';
import { CartDrawer, CartItem } from './components/CartDrawer';
import { OrderTrackModal } from './components/OrderTrackModal';
import { TermsConditionsModal } from './components/store/TermsConditionsModal';
import { CustomerReviewsModal } from './components/store/CustomerReviewsModal';
import { PortalGate } from './components/portal/PortalGate';
import { MobileBottomBar } from './components/mobile/MobileBottomBar';
import { NoiseOverlay } from './components/reactbits/NoiseOverlay';
import { Dock, DockItem } from './components/reactbits/Dock';
import { SalonDepartmentBar } from './components/store/SalonDepartmentBar';
import { AnnouncementWidget } from './components/store/AnnouncementWidget';
import { BrandHighlightsSection } from './components/store/BrandHighlightsSection';
import { TileReveal } from './components/reactbits/TileReveal';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle2,
  Home,
  Rotate3d,
  Smartphone,
  CreditCard,
  Headphones,
  Layers,
  Star,
  Truck,
  ShoppingBag
} from 'lucide-react';


export const App: React.FC = () => {
  // Storefront vs Secret Portal view
  const [currentView, setCurrentView] = useState<'store' | 'portal'>('store');
  const [currentPage, setCurrentPage] = useState<'showroom' | 'shop'>('showroom');
  const [portalRole, setPortalRole] = useState<'staff' | 'owner' | null>(null);

  // Products from live cloud database (ZERO localStorage)
  const [catalogProducts, setCatalogProducts] = useState<Product[]>(PRODUCTS);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeSalon, setActiveSalon] = useState<string>('all');
  const [focusedMode, setFocusedMode] = useState<boolean>(false);

  // Proactively erase any legacy catalog cache from localStorage
  useEffect(() => {
    try {
      localStorage.removeItem('nr_catalog_products');
      localStorage.removeItem('nr_products_last_updated');
      localStorage.removeItem('nr_deleted_product_ids');
    } catch {}
  }, []);

  // User-isolated Cart Storage Helper
  const getCartStorageKey = (user: { phone?: string } | null) => {
    if (user && user.phone) {
      const clean = user.phone.replace(/[^0-9]/g, '').slice(-10);
      return `radhaswami_cart_${clean}`;
    }
    return 'radhaswami_cart_guest';
  };

  // Auth & User Profile State (Persistent Session)
  const [isAuthOpen, setIsAuthOpen] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<{ name: string; phone?: string; email?: string; address?: string } | null>(() => {
    try {
      const saved = localStorage.getItem('radhaswami_client_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Cart & Orders State (Isolated per User)
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const savedUser = localStorage.getItem('radhaswami_client_user');
      const user = savedUser ? JSON.parse(savedUser) : null;
      const key = user && user.phone ? `radhaswami_cart_${user.phone.replace(/[^0-9]/g, '').slice(-10)}` : 'radhaswami_cart_guest';
      const savedCart = localStorage.getItem(key);
      return savedCart ? JSON.parse(savedCart) : [];
    } catch {
      return [];
    }
  });
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isTrackModalOpen, setIsTrackModalOpen] = useState<boolean>(false);
  const [activeOrderId, setActiveOrderId] = useState<string>('');

  // Switch cart dynamically when user logs in or out
  useEffect(() => {
    const key = getCartStorageKey(currentUser);
    try {
      const savedCart = localStorage.getItem(key);
      setCartItems(savedCart ? JSON.parse(savedCart) : []);
    } catch {}
  }, [currentUser]);

  // Persist cart to user's isolated storage
  useEffect(() => {
    const key = getCartStorageKey(currentUser);
    try {
      localStorage.setItem(key, JSON.stringify(cartItems));
      if (currentUser && currentUser.phone) {
        const clean = currentUser.phone.replace(/[^0-9]/g, '').slice(-10);
        fetch(`/api/users/${clean}/cart`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ cart: cartItems })
        }).catch(() => {});
      }
    } catch {}
  }, [cartItems, currentUser]);

  // Modals & Notifications
  const [selectedProductForModal, setSelectedProductForModal] = useState<Product | null>(null);
  const [selectedEmiProduct, setSelectedEmiProduct] = useState<Product | null>(null);
  const [isTermsOpen, setIsTermsOpen] = useState<boolean>(false);
  const [isReviewsOpen, setIsReviewsOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Global Luxury Theme Synchronization (React Bits Dark / Light Toggle)
  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem('radhaswami_theme') || 'light';
      const root = document.documentElement;
      if (savedTheme === 'light') {
        root.classList.remove('dark');
        root.classList.add('light');
        root.setAttribute('data-theme', 'light');
        document.body.classList.remove('dark-mode');
        document.body.classList.add('light-mode');
      } else {
        root.classList.remove('light');
        root.classList.add('dark');
        root.setAttribute('data-theme', 'dark');
        document.body.classList.remove('light-mode');
        document.body.classList.add('dark-mode');
      }
    } catch {}
  }, []);

  // Initialize Lenis Smooth Scroll (Desktop Only - strictly disabled on mobile/touch screens for 120Hz/60Hz zero-lag native momentum scrolling)
  useEffect(() => {
    if (currentView === 'portal') return;

    const isTouchOrMobile = typeof window !== 'undefined' && (
      window.innerWidth < 768 ||
      ('ontouchstart' in window) ||
      (navigator && navigator.maxTouchPoints > 0)
    );

    if (isTouchOrMobile) {
      // Mobile relies on hardware-accelerated native momentum touch scroll for 100% butter-smooth, 0-lag experience
      return;
    }

    const lenis = new Lenis({
      duration: 0.5,
      easing: (t) => 1 - Math.pow(1 - t, 3),
      orientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.05,
      syncTouch: false,
      touchMultiplier: 0
    });

    let rafId: number;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, [currentView]);

  // Check Secret Entry Routes & Keyboard Shortcuts (Zero Trace in Public UI)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const portalParam = params.get('portal');
    const viewParam = params.get('view');
    const hash = window.location.hash;

    // Strictly block legacy or public probe routes (#admin, #staff, #owner, etc.)
    if (
      hash === '#admin' || 
      hash === '#owner' || 
      hash === '#staff' || 
      hash === '#admin08' ||
      portalParam === 'admin' ||
      portalParam === 'owner' ||
      portalParam === 'staff' ||
      viewParam === 'admin'
    ) {
      // Erase probe hash completely and keep user on public storefront
      try {
        window.history.replaceState(null, '', window.location.pathname);
      } catch {}
      setCurrentView('store');
      setPortalRole(null);
      return;
    }

    if (hash === '#staff08') {
      setCurrentView('portal');
      setPortalRole('staff');
    } else if (hash === '#owner08') {
      setCurrentView('portal');
      setPortalRole('owner');
    }

    // Secret Keybinds: Ctrl + Shift + S (Staff), Ctrl + Shift + O (Owner Master)
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey) {
        if (e.key === 'S' || e.key === 's') {
          e.preventDefault();
          window.location.hash = '#staff08';
          setCurrentView(prev => prev === 'portal' ? 'store' : 'portal');
          setPortalRole('staff');
        } else if (e.key === 'O' || e.key === 'o') {
          e.preventDefault();
          window.location.hash = '#owner08';
          setCurrentView(prev => prev === 'portal' ? 'store' : 'portal');
          setPortalRole('owner');
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Handle Browser Hash Changes & Tab Routing for Showroom vs Dedicated Shop Page
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      const params = new URLSearchParams(window.location.search);
      const tab = params.get('tab') || params.get('page');

      if (
        hash === '#admin' || 
        hash === '#owner' || 
        hash === '#staff' || 
        hash === '#admin08'
      ) {
        try {
          window.history.replaceState(null, '', window.location.pathname);
        } catch {}
        setCurrentView('store');
        setPortalRole(null);
        return;
      }

      if (hash === '#staff08') {
        setCurrentView('portal');
        setPortalRole('staff');
        return;
      } else if (hash === '#owner08') {
        setCurrentView('portal');
        setPortalRole('owner');
        return;
      }

      if (hash === '#shop' || tab === 'shop') {
        setCurrentPage('shop');
      } else if (hash === '#showroom' || tab === 'showroom' || (!hash.startsWith('#admin') && !hash.startsWith('#owner') && !hash.startsWith('#staff') && (!hash || hash === '#hero' || hash === '#emi-studio' || hash === '#handset-3d-studio' || hash === '#compare' || hash === '#reviews'))) {
        if (currentView !== 'portal') {
          setCurrentPage('showroom');
        }
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    window.addEventListener('popstate', handleHashChange);
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
      window.removeEventListener('popstate', handleHashChange);
    };
  }, [currentView]);

  // Page Switcher with smooth top scroll and hash update
  const handleNavigatePage = (page: 'showroom' | 'shop') => {
    setCurrentPage(page);
    window.location.hash = page === 'shop' ? '#shop' : '';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Fetch live products directly from cloud database without any localStorage caching
  const fetchProducts = () => {
    fetchLiveProducts()
      .then(prods => {
        if (Array.isArray(prods) && prods.length > 0) {
          setCatalogProducts(prods);
        }
      })
      .catch(() => {
        setCatalogProducts(prev => (prev && prev.length > 0 ? prev : PRODUCTS));
      });
  };

  // Real-time synchronization: 2.5s live polling, BroadcastChannel, tab focus, and visibility change
  useEffect(() => {
    fetchProducts();

    // 2.5s poll for real-time cross-device updates (PC & Phone in exact sync)
    const pollInterval = setInterval(fetchProducts, 2500);

    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        fetchProducts();
      }
    };
    window.addEventListener('visibilitychange', handleVisibility);
    window.addEventListener('focus', fetchProducts);

    const handleCustomUpdate = () => {
      fetchProducts();
    };
    window.addEventListener('nr_catalog_updated', handleCustomUpdate);

    // BroadcastChannel for instant 0ms same-device synchronization across tabs
    let bc: BroadcastChannel | null = null;
    try {
      if (typeof BroadcastChannel !== 'undefined') {
        bc = new BroadcastChannel('nr_sync_bus');
        bc.onmessage = () => {
          fetchProducts();
        };
      }
    } catch {}

    return () => {
      clearInterval(pollInterval);
      document.removeEventListener('visibilitychange', handleVisibility);
      window.removeEventListener('focus', fetchProducts);
      window.removeEventListener('nr_catalog_updated', handleCustomUpdate);
      if (bc) bc.close();
    };
  }, []);

  // Show floating toast
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Add to Cart handler with strict Out-of-Stock Protection
  const handleAddToCart = (product: Product, color: string, storage?: string, price?: number) => {
    if (product.inStock === false || (product.stockCount !== undefined && product.stockCount <= 0)) {
      showToast(`⚠️ "${product.name}" is currently Out of Stock and cannot be added.`);
      return;
    }

    const finalPrice = price || product.price;
    const finalProduct = { ...product, price: finalPrice };

    setCartItems(prev => {
      const existing = prev.find(
        item =>
          item.product.id === product.id &&
          item.selectedColor === color &&
          item.selectedStorage === storage
      );

      if (existing) {
        return prev.map(item =>
          item.product.id === product.id &&
          item.selectedColor === color &&
          item.selectedStorage === storage
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [
        ...prev,
        {
          product: finalProduct,
          selectedColor: color,
          selectedStorage: storage,
          quantity: 1
        }
      ];
    });

    showToast(`Added ${product.name} (${storage ? storage + ', ' : ''}${color}) to your shopping bag`);
  };

  // Buy Now: adds item to cart and immediately launches the checkout drawer
  const handleBuyNow = (product: Product, color: string, storage?: string, price?: number) => {
    if (product.inStock === false || (product.stockCount !== undefined && product.stockCount <= 0)) {
      showToast(`⚠️ "${product.name}" is currently Out of Stock.`);
      return;
    }
    handleAddToCart(product, color, storage, price);
    setIsCartOpen(true);
  };

  // 0% EMI Auto-detection: syncs clicked handset with calculator and smooth scrolls to studio
  const handleSelectEmiProduct = (product: Product) => {
    setSelectedEmiProduct(product);
    const emiEl = document.getElementById('emi-studio');
    if (emiEl) {
      emiEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleUpdateQuantity = (productId: string, color: string, qty: number) => {
    if (qty <= 0) {
      handleRemoveItem(productId, color);
      return;
    }
    setCartItems(prev =>
      prev.map(item =>
        item.product.id === productId && item.selectedColor === color
          ? { ...item, quantity: qty }
          : item
      )
    );
  };

  const handleRemoveItem = (productId: string, color: string) => {
    setCartItems(prev =>
      prev.filter(
        item => !(item.product.id === productId && item.selectedColor === color)
      )
    );
  };

  const totalCartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSelectSalon = (salonId: string) => {
    setActiveSalon(salonId);
    if (!focusedMode) {
      if (salonId === 'all') {
        scrollTo('showroom-departments');
      } else {
        scrollTo(salonId);
      }
    } else {
      scrollTo('showroom-departments');
    }
  };

  // Pro React Bits Floating Dock Items
  const dockItems: DockItem[] = [
    {
      icon: <Home size={18} />,
      label: 'Showroom Home',
      onClick: () => {
        if (currentPage !== 'showroom') handleNavigatePage('showroom');
        setTimeout(() => scrollTo('hero'), 50);
      }
    },
    {
      icon: <ShoppingBag size={18} />,
      label: 'Shop Boutique (TAB)',
      onClick: () => handleNavigatePage('shop')
    },
    {
      icon: <Rotate3d size={18} />,
      label: '3D Studio',
      onClick: () => {
        if (currentPage !== 'showroom') handleNavigatePage('showroom');
        setTimeout(() => scrollTo('handset-3d-studio'), 100);
      }
    },
    {
      icon: <CreditCard size={18} />,
      label: '0% EMI',
      onClick: () => {
        if (currentPage !== 'showroom') handleNavigatePage('showroom');
        setTimeout(() => scrollTo('emi-studio'), 100);
      }
    },
    {
      icon: <Layers size={18} />,
      label: 'Phone Showdown',
      onClick: () => {
        if (currentPage !== 'showroom') handleNavigatePage('showroom');
        setTimeout(() => scrollTo('compare'), 100);
      }
    },
    {
      icon: <Star size={18} />,
      label: 'Reviews',
      onClick: () => {
        if (currentPage !== 'showroom') handleNavigatePage('showroom');
        setTimeout(() => scrollTo('reviews'), 100);
      }
    },
    {
      icon: <Truck size={18} />,
      label: 'Track Order',
      onClick: () => setIsTrackModalOpen(true)
    },
    {
      icon: <ShoppingBag size={18} />,
      label: 'Shopping Bag',
      onClick: () => setIsCartOpen(true),
      badge: totalCartCount > 0 ? totalCartCount : undefined
    }
  ];

  // Filtered by live search query
  const displayedProducts = searchQuery
    ? catalogProducts.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.brand.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : catalogProducts;

  // Render Secret Portal (Staff or Master Owner) if active
  if (currentView === 'portal') {
    return (
      <PortalGate
        onBackToStore={() => {
          setCurrentView('store');
          window.history.replaceState(null, '', window.location.pathname);
        }}
        products={catalogProducts}
        onRefreshProducts={fetchProducts}
        initialRole={portalRole}
      />
    );
  }

  return (
    <div className="relative min-h-screen bg-[#FAFAFB] dark:bg-[#07080A] text-[#0A0B0E] dark:text-[#F8FAFC] selection:bg-black selection:text-white dark:selection:bg-white dark:selection:text-black font-sans transition-colors duration-300">
      {/* Fixed Luxury Glassmorphic Header (Showroom Only) */}
      {currentPage === 'showroom' && (
        <>
          <NoiseOverlay opacity={0.015} />
          <StoreHeader
            cartCount={totalCartCount}
            onOpenCart={() => setIsCartOpen(true)}
            onOpenAuth={() => setIsAuthOpen(true)}
            onOpenTracking={() => setIsTrackModalOpen(true)}
            currentUser={currentUser}
            onSearchQuery={(q) => setSearchQuery(q)}
            currentPage={currentPage}
            onNavigatePage={handleNavigatePage}
            onNavigateSection={scrollTo}
            onOpenPortal={() => {
              window.location.hash = '#owner08';
              setCurrentView('portal');
              setPortalRole('owner');
            }}
          />
        </>
      )}

      {/* BUTTERY SMOOTH ANIMATED PAGE TRANSITIONS (SHOWROOM VS SHOP) */}
      <AnimatePresence mode="wait">
        {currentPage === 'shop' ? (
          <motion.main
            key="shop-page"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
            className="min-h-screen pb-16"
          >
            <ShopPage
              products={catalogProducts}
              onAddToCart={handleAddToCart}
              onBuyNow={handleBuyNow}
              onSelectEmiProduct={(product) => {
                handleSelectEmiProduct(product);
                handleNavigatePage('showroom');
              }}
              onOpenSpecsModal={(p) => setSelectedProductForModal(p)}
              onBackToShowroom={() => handleNavigatePage('showroom')}
              onOpenCart={() => setIsCartOpen(true)}
              onOpenAuth={() => setIsAuthOpen(true)}
              cartCount={totalCartCount}
              currentUser={currentUser}
              onOpenPortal={() => {
              window.location.hash = '#owner08';
              setCurrentView('portal');
              setPortalRole('owner');
            }}
            />
          </motion.main>
        ) : (
          <motion.main
            key="showroom-page"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
            className="pb-24 md:pb-0"
          >
            {/* SECTION 01: 3D Titanium Smartphone Stage & 60 FPS Gimbal */}
            <HeroMobileStage
              onExploreClick={() => handleNavigatePage('shop')}
              onSelectHandset={(brand) => {
                setSearchQuery(brand);
                handleNavigatePage('shop');
              }}
            />

            {/* SEPARATED SHOWROOM DEPARTMENTS & SALON SWITCHER */}
            <div id="showroom-departments">
              <SalonDepartmentBar
                activeSalon={activeSalon}
                onSelectSalon={(salonId) => {
                  if (salonId === 'shop-section' || salonId === 'catalog') {
                    handleNavigatePage('shop');
                  } else {
                    handleSelectSalon(salonId);
                  }
                }}
                focusedMode={focusedMode}
                onToggleFocusedMode={(focused) => {
                  setFocusedMode(focused);
                  if (focused && activeSalon === 'all') {
                    setActiveSalon('shop-section');
                  }
                }}
              />
            </div>

            {/* Focused Mode Banner Indicator */}
            {focusedMode && (
              <div className="bg-neutral-100 border-b border-neutral-200 px-4 py-3 text-center text-xs backdrop-blur-xl">
                <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
                  <span className="text-neutral-600">
                    Viewing in <strong className="text-black font-bold">Focused Department Mode</strong>.
                  </span>
                  <button
                    onClick={() => {
                      setFocusedMode(false);
                      setActiveSalon('all');
                    }}
                    className="text-black hover:text-neutral-700 underline text-xs font-bold cursor-pointer"
                  >
                    Return to Full Showroom Tour →
                  </button>
                </div>
              </div>
            )}

            {/* BRAND PILLARS / OFFICIAL STANDARDS (REPLACES MOBILE CATALOG DUMP ON LANDING PAGE) */}
            <BrandHighlightsSection
              onShopClick={() => handleNavigatePage('shop')}
              onEmiClick={() => scrollTo('emi-studio')}
            />

            {/* 2. 360° INTERACTIVE TITANIUM HANDSET STUDIO */}
            {(!focusedMode || activeSalon === 'all' || activeSalon === 'handset-3d-studio') && (
              <Phone3DStudioSection
                onAddToCart={(phoneName, color) => {
                  const prod = catalogProducts.find(p => p.name === phoneName) || catalogProducts[0];
                  handleAddToCart(prod, color);
                }}
                onBuyNow={(phoneName, color) => {
                  const prod = catalogProducts.find(p => p.name === phoneName) || catalogProducts[0];
                  handleBuyNow(prod, color);
                }}
              />
            )}

            {/* 3. 0% NO-COST EMI FINANCING LOUNGE */}
            {(!focusedMode || activeSalon === 'all' || activeSalon === 'emi-studio') && (
              <EmiCalculatorSection
                selectedProduct={selectedEmiProduct}
                products={catalogProducts}
                onAddToCart={handleAddToCart}
                onBuyNow={handleBuyNow}
              />
            )}

            {/* 4. FLAGSHIP HEAD-TO-HEAD SHOWDOWN */}
            {(!focusedMode || activeSalon === 'all' || activeSalon === 'compare') && (
              <ComparisonMatrix
                onAddToCart={(p, color) => handleAddToCart(p, color)}
                products={catalogProducts}
              />
            )}

            {/* 5. Verified Client Endorsements */}
            <CustomerReviews />

            {/* Pro React Bits: Sticky Scroll Tile Reveal Stage (Bottom of Landing Page) */}
            <TileReveal
              onPrimaryCta={() => handleNavigatePage('shop')}
              onSecondaryCta={() => scrollTo('emi-studio')}
            />

            {/* 6. Luxury Store Footer (Sanitized - Terms & Reviews Links) */}
            <StoreFooter
              onOpenTracking={() => setIsTrackModalOpen(true)}
              onOpenTerms={() => setIsTermsOpen(true)}
              onOpenReviews={() => setIsReviewsOpen(true)}
            />
          </motion.main>
        )}
      </AnimatePresence>

      {/* Pro React Bits: Floating Spring Magnification Dock (Desktop Viewports) */}
      <Dock items={dockItems} className="hidden md:flex" panelHeight={66} baseItemSize={44} magnification={60} />

      {/* Mobile Sticky Bottom Navigation Bar */}
      <MobileBottomBar
        cartCount={totalCartCount}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
        currentUser={currentUser}
        currentPage={currentPage}
        onNavigatePage={handleNavigatePage}
        onOpenPortal={() => {
          window.location.hash = '#owner08';
          setCurrentView('portal');
          setPortalRole('owner');
        }}
      />

      {/* Shopping Cart Drawer (Separate User Cart) */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={() => setCartItems([])}
        currentUser={currentUser}
        onOrderPlaced={(orderId) => {
          setActiveOrderId(orderId);
          setIsCartOpen(false);
          setIsTrackModalOpen(true);
        }}
      />

      {/* Customer Login & Auth Modal (Real Carrier SMS & Isolated Data) */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        currentUser={currentUser}
        onTrackOrder={(orderId) => {
          setActiveOrderId(orderId);
          setIsTrackModalOpen(true);
        }}
        onLoginSuccess={(user) => {
          setCurrentUser(user);
          try {
            localStorage.setItem('radhaswami_client_user', JSON.stringify(user));
          } catch {}
          showToast(`Welcome back, ${user.name}! VIP Privileges active.`);
        }}
        onLogout={() => {
          setCurrentUser(null);
          try {
            localStorage.removeItem('radhaswami_client_user');
          } catch {}
          showToast('Signed out of session');
        }}
      />

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={selectedProductForModal}
        onClose={() => setSelectedProductForModal(null)}
        onAddToCart={handleAddToCart}
      />

      {/* Order Tracking Modal */}
      <OrderTrackModal
        isOpen={isTrackModalOpen}
        onClose={() => setIsTrackModalOpen(false)}
        initialOrderId={activeOrderId}
      />

      {/* Showroom Terms & Conditions Modal */}
      <TermsConditionsModal
        isOpen={isTermsOpen}
        onClose={() => setIsTermsOpen(false)}
      />

      {/* Verified Customer Reviews Modal */}
      <CustomerReviewsModal
        isOpen={isReviewsOpen}
        onClose={() => setIsReviewsOpen(false)}
      />

      {/* Floating Notification Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-[60] flex items-center gap-3 px-5 py-3.5 rounded-full bg-white text-black shadow-2xl text-xs font-bold animate-fade-in border border-white/20">
          <CheckCircle2 size={16} className="text-black" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Global Announcement Widget */}
      <AnnouncementWidget />

    </div>
  );
};

export default App;
