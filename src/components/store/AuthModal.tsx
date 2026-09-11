import React, { useState, useEffect } from 'react';
import { 
  X, 
  User, 
  Lock, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  ShieldCheck, 
  LogOut, 
  ArrowRight, 
  Package, 
  MapPin, 
  AlertCircle, 
  Smartphone, 
  ExternalLink, 
  Sparkles, 
  Award,
  Crown,
  KeyRound,
  MessageCircle
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: { name: string; phone?: string; email?: string; address?: string } | null;
  onLoginSuccess: (user: { name: string; phone?: string; email?: string; address?: string }) => void;
  onLogout: () => void;
  onTrackOrder?: (orderId: string) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onLoginSuccess,
  onLogout,
  onTrackOrder
}) => {
  const [tab, setTab] = useState<'signin' | 'register'>('signin');
  
  // Registration form fields
  const [regName, setRegName] = useState('');
  const [regPhoneOrEmail, setRegPhoneOrEmail] = useState('');
  const [regAddress, setRegAddress] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');

  // Login form fields
  const [loginPhoneOrEmail, setLoginPhoneOrEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);

  // UI state
  const [showPassword, setShowPassword] = useState(false);
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // User-Isolated Orders State for Profile View
  const [userOrders, setUserOrders] = useState<any[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);

  // Pre-fill remembered phone/email
  useEffect(() => {
    try {
      const remembered = localStorage.getItem('radhaswami_remembered_phone');
      if (remembered) setLoginPhoneOrEmail(remembered);
    } catch {}
  }, []);

  // Fetch isolated orders for logged in user
  useEffect(() => {
    if (currentUser && currentUser.phone) {
      const cleanPhone = currentUser.phone.replace(/[^0-9]/g, '').slice(-10);
      setOrdersLoading(true);
      fetch(`/api/users/${cleanPhone}/orders`)
        .then(res => res.json())
        .then(data => {
          setOrdersLoading(false);
          if (data.orders) {
            setUserOrders(data.orders);
          }
        })
        .catch(() => setOrdersLoading(false));
    }
  }, [currentUser]);

  if (!isOpen) return null;

  // Handle Login with Password
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const cleanTarget = loginPhoneOrEmail.trim();
    if (!cleanTarget) {
      setErrorMessage('Please enter your registered mobile number or email.');
      return;
    }
    if (!loginPassword.trim()) {
      setErrorMessage('Please enter your account password.');
      return;
    }

    const isEmail = cleanTarget.includes('@');
    const cleanDigits = cleanTarget.replace(/[^0-9]/g, '').slice(-10);

    if (isEmail) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(cleanTarget)) {
        setErrorMessage('Please enter a valid email address (e.g. client@example.com).');
        setLoading(false);
        return;
      }
    } else {
      if (cleanDigits.length !== 10) {
        setErrorMessage('Please enter a valid 10-digit mobile number.');
        setLoading(false);
        return;
      }
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phoneOrEmail: cleanTarget,
          password: loginPassword.trim()
        })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.user) {
          if (rememberMe) {
            try {
              localStorage.setItem('radhaswami_remembered_phone', cleanTarget);
            } catch {}
          }
          // Also sync to local registered users cache
          try {
            const users = JSON.parse(localStorage.getItem('radhaswami_registered_users') || '[]');
            const idx = users.findIndex((u: any) => u.phone === data.user.phone || (data.user.email && u.email === data.user.email));
            if (idx >= 0) {
              users[idx] = { ...users[idx], ...data.user, password: loginPassword.trim() };
            } else {
              users.push({ ...data.user, password: loginPassword.trim() });
            }
            localStorage.setItem('radhaswami_registered_users', JSON.stringify(users));
          } catch {}

          onLoginSuccess(data.user);
          onClose();
          setLoading(false);
          return;
        } else if (data.message) {
          setErrorMessage(data.message);
          setLoading(false);
          return;
        }
      }
    } catch {
      // Network/Vercel static deploy fallback - proceed to fail-safe local validation
    }

    // Fail-Safe Offline / Vercel Authentication Gateway
    let storedUsers: any[] = [];
    try {
      storedUsers = JSON.parse(localStorage.getItem('radhaswami_registered_users') || '[]');
    } catch {}

    const existing = storedUsers.find((u: any) => {
      const uDigits = (u.phone || '').replace(/[^0-9]/g, '').slice(-10);
      const matchIdentity =
        (isEmail && u.email?.toLowerCase() === cleanTarget.toLowerCase()) ||
        (!isEmail && cleanDigits && uDigits === cleanDigits) ||
        u.phone === cleanTarget;
      return matchIdentity;
    });

    if (existing) {
      if (existing.password && existing.password !== loginPassword.trim()) {
        setErrorMessage('Incorrect password. Please check your credentials and try again.');
        setLoading(false);
        return;
      }

      const sessionUser = {
        name: existing.name,
        phone: existing.phone || (isEmail ? '' : `+91 ${cleanDigits}`),
        email: existing.email || (isEmail ? cleanTarget : ''),
        address: existing.address || 'JHQJ+7PC Vijay Nagar Colony, Pithampur Industrial Area, Madhya Pradesh 454775'
      };
      if (rememberMe) {
        try {
          localStorage.setItem('radhaswami_remembered_phone', cleanTarget);
        } catch {}
      }
      onLoginSuccess(sessionUser);
      onClose();
      setLoading(false);
      return;
    }

    // Account does NOT exist - strictly block bypass!
    setErrorMessage('Account not found for this mobile or email. Please click "Create New Account" below to register.');
    setLoading(false);
  };

  // Handle Register with Password
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const cleanName = regName.trim();
    const cleanTarget = regPhoneOrEmail.trim();
    const cleanPass = regPassword.trim();

    if (!cleanName || cleanName.length < 2) {
      setErrorMessage('Please enter your full legal name (at least 2 characters).');
      return;
    }
    if (!cleanTarget) {
      setErrorMessage('Please enter your 10-digit mobile number or email address.');
      return;
    }

    const isEmail = cleanTarget.includes('@');
    const cleanDigits = cleanTarget.replace(/[^0-9]/g, '').slice(-10);

    if (isEmail) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(cleanTarget)) {
        setErrorMessage('Please enter a valid email address (e.g. yourname@gmail.com).');
        return;
      }
    } else {
      if (cleanDigits.length !== 10) {
        setErrorMessage('Please enter a valid 10-digit mobile number (e.g. 9691011335).');
        return;
      }
    }

    if (cleanPass.length < 4) {
      setErrorMessage('Password must be at least 4 characters long.');
      return;
    }
    if (cleanPass !== regConfirmPassword.trim()) {
      setErrorMessage('Passwords do not match. Please re-check.');
      return;
    }

    setLoading(true);

    // Fail-Safe Offline-First & Vercel Registration Check
    let storedUsers: any[] = [];
    try {
      storedUsers = JSON.parse(localStorage.getItem('radhaswami_registered_users') || '[]');
    } catch {}

    const alreadyExists = storedUsers.find((u: any) => {
      const uDigits = (u.phone || '').replace(/[^0-9]/g, '').slice(-10);
      return (
        (isEmail && u.email?.toLowerCase() === cleanTarget.toLowerCase()) ||
        (!isEmail && cleanDigits && uDigits === cleanDigits) ||
        u.phone === cleanTarget
      );
    });

    if (alreadyExists) {
      setErrorMessage('An account with this mobile number or email already exists. Please log in.');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: cleanName,
          phoneOrEmail: cleanTarget,
          password: cleanPass,
          address: regAddress.trim()
        })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.user) {
          try {
            localStorage.setItem('radhaswami_remembered_phone', cleanTarget);
            storedUsers.push({ ...data.user, password: cleanPass });
            localStorage.setItem('radhaswami_registered_users', JSON.stringify(storedUsers));
          } catch {}
          onLoginSuccess(data.user);
          onClose();
          setLoading(false);
          return;
        } else if (data.message) {
          setErrorMessage(data.message);
          setLoading(false);
          return;
        }
      }
    } catch {
      // Vercel / Offline fallback - register locally
    }

    const newUser = {
      name: cleanName,
      phone: isEmail ? '' : `+91 ${cleanDigits}`,
      email: isEmail ? cleanTarget : `${cleanDigits}@client.radhaswamigallery.in`,
      address: regAddress.trim() || 'JHQJ+7PC Vijay Nagar Colony, Pithampur Industrial Area, Madhya Pradesh 454775'
    };

    storedUsers.push({ ...newUser, password: cleanPass });
    try {
      localStorage.setItem('radhaswami_registered_users', JSON.stringify(storedUsers));
      localStorage.setItem('radhaswami_remembered_phone', cleanTarget);
    } catch {}

    onLoginSuccess(newUser);
    onClose();
    setLoading(false);
  };

  const openWhatsAppReset = () => {
    const msg = `Hello New Radhaswami Private Concierge, I need assistance resetting the password for my client account (${loginPhoneOrEmail || 'registered number'}).`;
    window.open(`https://wa.me/919691011335?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-xl animate-fade-in font-sans">
      <div className="relative w-full max-w-md bg-[#0B0E14] border border-white/15 rounded-3xl p-6 sm:p-8 shadow-2xl text-white overflow-hidden max-h-[92vh] overflow-y-auto">
        
        {/* Ambient Top Radial Halo */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-64 h-64 bg-white/5 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors cursor-pointer z-20"
        >
          <X size={18} />
        </button>

        {/* =====================================================================
            1. LOGGED IN VIP PROFILE VIEW (ISOLATED DATA)
        ===================================================================== */}
        {currentUser ? (
          <div className="space-y-5 pt-2 relative z-10">
            <div className="flex items-center gap-4 border-b border-white/10 pb-5">
              <div className="w-14 h-14 rounded-2xl bg-white p-[1.5px] shadow-lg shrink-0">
                <div className="w-full h-full bg-[#0B0E14] rounded-2xl flex items-center justify-center text-white font-serif-luxury font-bold text-2xl">
                  {currentUser.name.charAt(0).toUpperCase()}
                </div>
              </div>
              <div className="min-w-0">
                <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-white/10 border border-white/15 text-[10px] text-white uppercase tracking-widest font-mono font-bold">
                  <Crown size={12} className="text-white" />
                  <span>PLATINUM CLIENT</span>
                </div>
                <h3 className="text-xl font-serif-luxury font-medium text-white leading-tight truncate mt-1">
                  {currentUser.name}
                </h3>
                <div className="text-xs text-neutral-400 mt-0.5 font-mono truncate">
                  {currentUser.phone || currentUser.email}
                </div>
              </div>
            </div>

            {/* User Isolated Data Cards */}
            <div className="space-y-3 text-xs">
              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2.5">
                <div className="flex items-center justify-between text-neutral-400">
                  <span className="flex items-center gap-2">
                    <Package size={14} className="text-white" />
                    <span className="font-semibold text-white">Your Orders History</span>
                  </span>
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-neutral-300">
                    {ordersLoading ? 'Syncing...' : `${userOrders.length} Recorded`}
                  </span>
                </div>

                {userOrders.length > 0 ? (
                  <div className="space-y-2 pt-1">
                    {userOrders.slice(0, 4).map((ord, idx) => (
                      <div 
                        key={idx}
                        onClick={() => {
                          if (onTrackOrder) {
                            onTrackOrder(ord.orderId);
                            onClose();
                          }
                        }}
                        className="p-3 rounded-xl bg-black/60 border border-white/10 hover:border-white/30 flex items-center justify-between transition-all cursor-pointer group"
                      >
                        <div className="min-w-0">
                          <div className="font-mono font-bold text-white text-xs flex items-center gap-1.5 group-hover:underline">
                            <span>#{ord.orderId}</span>
                            <ExternalLink size={11} className="text-neutral-400" />
                          </div>
                          <div className="text-[11px] text-neutral-300 truncate mt-0.5">
                            {ord.items?.[0]?.name || 'Flagship Smartphone'}
                          </div>
                          <div className="text-[10px] text-neutral-400 font-mono mt-0.5">
                            ₹{ord.total?.toLocaleString('en-IN')} • {ord.paymentMethod || 'WhatsApp Pay'}
                          </div>
                        </div>
                        <span className="text-[10px] px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 font-semibold shrink-0">
                          {ord.status || 'Dispatched'}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-[11px] text-neutral-400 italic py-1">
                    No orders registered yet. Completed purchases will be saved to your private profile.
                  </p>
                )}
              </div>

              {currentUser.address && (
                <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 flex items-start gap-3">
                  <MapPin size={16} className="text-white shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[10px] text-neutral-400 block uppercase font-mono tracking-wider">Default Delivery Address:</span>
                    <span className="text-white text-xs mt-0.5 block">{currentUser.address}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Sign Out Button */}
            <button
              onClick={() => {
                onLogout();
                onClose();
              }}
              className="w-full py-3.5 rounded-full bg-white/5 hover:bg-red-500/10 text-neutral-300 hover:text-red-400 border border-white/10 hover:border-red-500/30 flex items-center justify-center gap-2 text-xs font-semibold transition-all cursor-pointer"
            >
              <LogOut size={14} />
              <span>Sign Out of Client Session</span>
            </button>
          </div>
        ) : (
          /* =====================================================================
              2. ULTRA-PREMIUM PASSWORD AUTHENTICATION (NO OTP)
          ===================================================================== */
          <div className="relative z-10">
            {/* Luxury Brand Header */}
            <div className="flex flex-col items-center text-center mb-6 pt-1">
              <div className="w-16 h-16 rounded-full overflow-hidden border border-white/20 shadow-xl p-0.5 bg-gradient-to-br from-white via-neutral-300 to-neutral-700 mb-3 shrink-0">
                <img src="/nrs-logo.png" alt="New Radhaswami Official Logo" className="w-full h-full object-cover rounded-full" />
              </div>
              <div className="text-[10px] tracking-[0.25em] text-neutral-300 font-mono uppercase font-bold flex items-center gap-1.5">
                <ShieldCheck size={13} className="text-white" />
                <span>NEW RADHASWAMI PRIVATE CONCIERGE</span>
              </div>
              <h2 className="text-2xl font-serif-luxury text-white tracking-tight mt-1.5 font-medium">
                {tab === 'signin' ? 'Sign In to Your Account' : 'Create Exclusive Member Account'}
              </h2>
              <p className="text-xs text-neutral-400 max-w-xs mt-1 leading-relaxed">
                {tab === 'signin' 
                  ? 'Access your private bag, VIP privileges, and isolated tracking.' 
                  : 'Register your details to enjoy white-glove delivery and guaranteed sealed stock.'}
              </p>
            </div>

            {/* Switcher Tabs */}
            <div className="flex rounded-2xl bg-white/[0.04] p-1 mb-5 border border-white/10 text-xs">
              <button
                type="button"
                onClick={() => { setTab('signin'); setErrorMessage(null); }}
                className={`w-1/2 py-2.5 rounded-xl font-bold transition-all cursor-pointer ${
                  tab === 'signin'
                    ? 'bg-white text-black font-bold shadow-md'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => { setTab('register'); setErrorMessage(null); }}
                className={`w-1/2 py-2.5 rounded-xl font-bold transition-all cursor-pointer ${
                  tab === 'register'
                    ? 'bg-white text-black font-bold shadow-md'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                Create Account
              </button>
            </div>

            {/* Error Message Alert */}
            {errorMessage && (
              <div className="mb-4 p-3.5 rounded-2xl bg-red-950/40 border border-red-500/40 text-red-200 text-xs flex items-center gap-2.5 animate-fade-in">
                <AlertCircle size={16} className="shrink-0 text-red-400" />
                <span className="leading-snug">{errorMessage}</span>
              </div>
            )}

            {/* TAB 1: SIGN IN WITH PASSWORD */}
            {tab === 'signin' ? (
              <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block text-neutral-300 mb-1.5 font-medium text-[11px] uppercase tracking-wider">
                    Mobile Number or Email
                  </label>
                  <div className="flex items-center gap-2.5 px-3.5 py-3 rounded-xl bg-black/50 border border-white/10 focus-within:border-white focus-within:ring-1 focus-within:ring-white/20 transition-all">
                    <Smartphone size={15} className="text-neutral-400" />
                    <input
                      type="text"
                      placeholder="e.g. 9691011335 or client@domain.com"
                      value={loginPhoneOrEmail}
                      onChange={(e) => setLoginPhoneOrEmail(e.target.value)}
                      required
                      className="bg-transparent w-full outline-none text-white placeholder-neutral-500 font-sans text-xs"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-neutral-300 font-medium text-[11px] uppercase tracking-wider">Password</label>
                    <button
                      type="button"
                      onClick={openWhatsAppReset}
                      className="text-[11px] text-neutral-300 hover:text-white hover:underline cursor-pointer flex items-center gap-1"
                    >
                      <MessageCircle size={11} />
                      <span>Forgot Password?</span>
                    </button>
                  </div>
                  <div className="flex items-center gap-2.5 px-3.5 py-3 rounded-xl bg-black/50 border border-white/10 focus-within:border-white focus-within:ring-1 focus-within:ring-white/20 transition-all">
                    <Lock size={15} className="text-neutral-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter your account password"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      required
                      className="bg-transparent w-full outline-none text-white placeholder-neutral-500 font-sans text-xs"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(prev => !prev)}
                      className="text-neutral-400 hover:text-white p-1 cursor-pointer transition-colors"
                      title={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <label className="flex items-center gap-2 cursor-pointer text-neutral-300 hover:text-white">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="rounded accent-white cursor-pointer"
                    />
                    <span className="text-[11px]">Remember this device</span>
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 rounded-xl bg-white hover:bg-neutral-200 active:scale-[0.98] text-black font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg mt-2"
                >
                  <span>{loading ? 'Authenticating...' : 'Sign In to Client Portal'}</span>
                  <ArrowRight size={14} />
                </button>
              </form>
            ) : (
              /* TAB 2: REGISTER WITH PASSWORD */
              <form onSubmit={handleRegisterSubmit} className="space-y-3.5 text-xs">
                <div>
                  <label className="block text-neutral-300 mb-1 font-medium text-[11px] uppercase tracking-wider">
                    Full Name *
                  </label>
                  <div className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/10 focus-within:border-white focus-within:ring-1 focus-within:ring-white/20 transition-all">
                    <User size={15} className="text-neutral-400" />
                    <input
                      type="text"
                      placeholder="e.g. Vikramaditya Sharma"
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      required
                      className="bg-transparent w-full outline-none text-white placeholder-neutral-500 font-sans text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-neutral-300 mb-1 font-medium text-[11px] uppercase tracking-wider">
                    Mobile Number or Email *
                  </label>
                  <div className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/10 focus-within:border-white focus-within:ring-1 focus-within:ring-white/20 transition-all">
                    <Smartphone size={15} className="text-neutral-400" />
                    <input
                      type="text"
                      placeholder="e.g. 9691011335 or client@domain.com"
                      value={regPhoneOrEmail}
                      onChange={(e) => setRegPhoneOrEmail(e.target.value)}
                      required
                      className="bg-transparent w-full outline-none text-white placeholder-neutral-500 font-sans text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-neutral-300 mb-1 font-medium text-[11px] uppercase tracking-wider">
                    Delivery Address / City
                  </label>
                  <div className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/10 focus-within:border-white focus-within:ring-1 focus-within:ring-white/20 transition-all">
                    <MapPin size={15} className="text-neutral-400" />
                    <input
                      type="text"
                      placeholder="e.g. Vijay Nagar Colony, Pithampur 454775"
                      value={regAddress}
                      onChange={(e) => setRegAddress(e.target.value)}
                      className="bg-transparent w-full outline-none text-white placeholder-neutral-500 font-sans text-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-neutral-300 mb-1 font-medium text-[11px] uppercase tracking-wider">
                      Password *
                    </label>
                    <div className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-black/50 border border-white/10 focus-within:border-white focus-within:ring-1 focus-within:ring-white/20 transition-all">
                      <Lock size={14} className="text-neutral-400 shrink-0" />
                      <input
                        type={showRegPassword ? 'text' : 'password'}
                        placeholder="Min 4 chars"
                        value={regPassword}
                        onChange={(e) => setRegPassword(e.target.value)}
                        required
                        className="bg-transparent w-full outline-none text-white placeholder-neutral-500 font-sans text-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-neutral-300 mb-1 font-medium text-[11px] uppercase tracking-wider">
                      Confirm *
                    </label>
                    <div className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-black/50 border border-white/10 focus-within:border-white focus-within:ring-1 focus-within:ring-white/20 transition-all">
                      <Lock size={14} className="text-neutral-400 shrink-0" />
                      <input
                        type={showRegPassword ? 'text' : 'password'}
                        placeholder="Re-enter"
                        value={regConfirmPassword}
                        onChange={(e) => setRegConfirmPassword(e.target.value)}
                        required
                        className="bg-transparent w-full outline-none text-white placeholder-neutral-500 font-sans text-xs"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-end">
                  <button
                    type="button"
                    onClick={() => setShowRegPassword(prev => !prev)}
                    className="text-[11px] text-neutral-400 hover:text-white flex items-center gap-1 cursor-pointer"
                  >
                    {showRegPassword ? <EyeOff size={13} /> : <Eye size={13} />}
                    <span>{showRegPassword ? 'Hide Passwords' : 'Show Passwords'}</span>
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 rounded-xl bg-white hover:bg-neutral-200 active:scale-[0.98] text-black font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg mt-3"
                >
                  <span>{loading ? 'Creating Member Profile...' : 'Create Exclusive Account'}</span>
                  <ArrowRight size={14} />
                </button>
              </form>
            )}

            {/* Security Guarantee Strip */}
            <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-center gap-3 text-[10px] text-neutral-500">
              <span className="flex items-center gap-1">
                <ShieldCheck size={12} className="text-white" />
                <span>256-Bit SSL Encrypted</span>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Award size={12} className="text-white" />
                <span>100% Sealed Indian Stock</span>
              </span>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
