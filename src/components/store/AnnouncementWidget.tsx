import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchLiveAnnouncement } from '../../services/cloudSync';
import { 
  X, 
  Megaphone, 
  ArrowRight, 
  Sparkles, 
  Copy, 
  Check, 
  Clock, 
  Volume2, 
  VolumeX, 
  Tag, 
  ShieldCheck, 
  ChevronRight, 
  Maximize2
} from 'lucide-react';

export interface AnnouncementData {
  active: boolean;
  title: string;
  subtitle?: string;
  message: string;
  imageUrl?: string;
  badge?: string;
  theme?: 'champagne' | 'obsidian' | 'emerald' | 'crimson';
  promoCode?: string;
  discountAmount?: string;
  countdownExpiry?: string;
  ctaText?: string;
  ctaLink?: string;
  soundEnabled?: boolean;
  tickerActive?: boolean;
}

const DEFAULT_STORE_ANNOUNCEMENT: AnnouncementData = {
  active: true,
  title: 'Royal Privilege Flagship Drop',
  subtitle: 'Official Manufacturer Sealed Stock • Pithampur Showroom Exclusive',
  message: 'Enjoy an instant 10% privilege concession across all Apple, Samsung & Google flagships. Complimentary MagSafe carbon shield included with every verified purchase.',
  imageUrl: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=1200&q=80',
  badge: 'VIP Showroom Exclusive',
  theme: 'obsidian',
  promoCode: 'ROYAL10',
  discountAmount: '10% OFF',
  countdownExpiry: new Date(Date.now() + 86400000 * 3).toISOString(),
  ctaText: 'Claim VIP Privilege',
  ctaLink: '#shop',
  soundEnabled: true,
  tickerActive: true
};

export const AnnouncementWidget: React.FC = () => {
  const [announcement, setAnnouncement] = useState<AnnouncementData>(() => {
    try {
      const saved = localStorage.getItem('nr_announcement_data');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object') return parsed;
      }
    } catch {}
    return DEFAULT_STORE_ANNOUNCEMENT;
  });

  const [viewState, setViewState] = useState<'hidden' | 'modal' | 'minimized'>('modal');
  const [isHovered, setIsHovered] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [topTickerVisible, setTopTickerVisible] = useState(true);

  // Detect Touch / Mobile devices to disable stuck hover previews
  useEffect(() => {
    const checkTouch = () => {
      setIsTouchDevice(
        window.innerWidth < 768 ||
        'ontouchstart' in window ||
        (navigator && navigator.maxTouchPoints > 0)
      );
    };
    checkTouch();
    window.addEventListener('resize', checkTouch, { passive: true });
    return () => window.removeEventListener('resize', checkTouch);
  }, []);

  // Remaining time state
  const [timeLeft, setTimeLeft] = useState<{ hours: number; minutes: number; seconds: number } | null>(null);

  // Play luxury crystal chime via Web Audio API
  const playLuxuryChime = () => {
    if (isMuted) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      if (ctx.state === 'suspended') {
        ctx.resume().catch(() => {});
      }
      const now = ctx.currentTime;
      const freqs = [659.25, 830.61, 987.77];
      freqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.07);
        gain.gain.setValueAtTime(0, now + idx * 0.07);
        gain.gain.linearRampToValueAtTime(0.08 / (idx + 1), now + idx * 0.07 + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.07 + 1.1);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + idx * 0.07);
        osc.stop(now + idx * 0.07 + 1.2);
      });
    } catch {}
  };

  // Sync Announcement from localStorage, Backend & Broadcast Events
  useEffect(() => {
    const refreshAnnouncement = () => {
      fetchLiveAnnouncement()
        .then(ann => {
          if (ann && typeof ann === 'object') {
            setAnnouncement(ann);
          }
        })
        .catch(() => {
          try {
            const saved = localStorage.getItem('nr_announcement_data');
            if (saved) {
              const parsed = JSON.parse(saved);
              if (parsed && typeof parsed === 'object') {
                setAnnouncement(parsed);
              }
            }
          } catch {}
        });
    };

    refreshAnnouncement();

    // Check if dismissed in this tab session
    const closed = sessionStorage.getItem('radhaswami_announcement_dismissed');
    if (closed === 'true') {
      setViewState('minimized');
    } else {
      setViewState('modal');
      setTimeout(() => playLuxuryChime(), 600);
    }

    const handleOpenPopup = () => {
      setViewState('modal');
      sessionStorage.removeItem('radhaswami_announcement_dismissed');
    };
    window.addEventListener('open_announcement_popup', handleOpenPopup);
    window.addEventListener('nr_announcement_updated', refreshAnnouncement);
    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'nr_announcement_data' || e.key === 'nr_announcement_last_updated') {
        refreshAnnouncement();
      }
    };
    window.addEventListener('storage', handleStorage);

    return () => {
      window.removeEventListener('open_announcement_popup', handleOpenPopup);
      window.removeEventListener('nr_announcement_updated', refreshAnnouncement);
      window.removeEventListener('storage', handleStorage);
    };
  }, []);

  // Countdown Calculation
  useEffect(() => {
    if (!announcement?.countdownExpiry) return;

    const targetTime = new Date(announcement.countdownExpiry).getTime();

    const updateTimer = () => {
      const now = Date.now();
      const diff = Math.max(0, targetTime - now);

      if (diff <= 0) {
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft({ hours, minutes, seconds });
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [announcement?.countdownExpiry]);

  // Copy promo code handler
  const handleCopyCode = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!announcement?.promoCode) return;

    navigator.clipboard.writeText(announcement.promoCode).then(() => {
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2600);
    });
  };

  const handleCloseModal = () => {
    sessionStorage.setItem('radhaswami_announcement_dismissed', 'true');
    setViewState('minimized');
  };

  const handleOpenModal = () => {
    setViewState('modal');
    playLuxuryChime();
  };

  const handleActionClick = () => {
    if (announcement?.ctaLink) {
      if (announcement.ctaLink.startsWith('#')) {
        const id = announcement.ctaLink.replace('#', '');
        const el = document.getElementById(id);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        } else {
          window.location.hash = announcement.ctaLink;
        }
      } else {
        window.location.href = announcement.ctaLink;
      }
    }
    handleCloseModal();
  };

  if (viewState === 'hidden' || !announcement) {
    return null;
  }

  const theme = (announcement.theme === 'champagne' ? 'obsidian' : announcement.theme) || 'obsidian';
  const themeStyles = {
    champagne: {
      gradient: 'from-white via-neutral-300 to-neutral-500',
      glow: 'shadow-[0_0_50px_rgba(255,255,255,0.12)]',
      border: 'border-white/20',
      badgeBg: 'bg-white/10 text-white border-white/25',
      btnBg: 'bg-white text-black hover:bg-neutral-200',
      accentText: 'text-white'
    },
    obsidian: {
      gradient: 'from-white via-neutral-300 to-neutral-500',
      glow: 'shadow-[0_0_50px_rgba(255,255,255,0.12)]',
      border: 'border-white/20',
      badgeBg: 'bg-white/10 text-white border-white/25',
      btnBg: 'bg-white text-black hover:bg-neutral-200',
      accentText: 'text-white'
    },
    emerald: {
      gradient: 'from-emerald-400 via-teal-400 to-cyan-500',
      glow: 'shadow-[0_0_50px_rgba(16,185,129,0.25)]',
      border: 'border-emerald-500/30',
      badgeBg: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40',
      btnBg: 'bg-gradient-to-r from-emerald-400 to-teal-500 text-black',
      accentText: 'text-emerald-400'
    },
    crimson: {
      gradient: 'from-rose-400 via-rose-500 to-red-600',
      glow: 'shadow-[0_0_50px_rgba(244,63,94,0.3)]',
      border: 'border-rose-500/30',
      badgeBg: 'bg-rose-500/15 text-rose-300 border-rose-500/40',
      btnBg: 'bg-gradient-to-r from-rose-500 to-red-600 text-white',
      accentText: 'text-rose-400'
    }
  }[theme];

  return (
    <>
      {/* 1. LUXURY TOP AMBIENT TICKER BAR */}
      {announcement.tickerActive && topTickerVisible && (
        <aside aria-label="Announcement banner" className="relative z-[45] bg-[#07090D] border-b border-white/10 text-neutral-300 text-[11px] py-1.5 px-4 shadow-sm overflow-hidden select-none">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.04] to-transparent animate-pulse pointer-events-none" />
          
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 relative z-10">
            <div className="flex items-center gap-2 overflow-hidden">
              <span className="flex h-2 w-2 relative shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-neutral-300" />
              </span>
              <span className="font-semibold uppercase tracking-widest text-[9px] px-2 py-0.5 rounded-full bg-white/10 border border-white/20 text-white shrink-0">
                {announcement.badge || 'VIP Bulletin'}
              </span>
              <p className="text-white/90 truncate font-medium">
                {announcement.title}
                {announcement.promoCode && (
                  <span className="hidden sm:inline text-white ml-2 font-mono font-bold">
                    • Code: {announcement.promoCode}
                  </span>
                )}
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={handleOpenModal}
                className="text-[10px] font-bold text-white hover:text-neutral-300 transition-colors flex items-center gap-1 cursor-pointer underline underline-offset-2"
              >
                <span>View Details</span>
                <ChevronRight size={12} />
              </button>
              <button
                onClick={() => setTopTickerVisible(false)}
                className="p-1 text-white/50 hover:text-white transition-colors cursor-pointer"
                title="Dismiss ticker"
              >
                <X size={12} />
              </button>
            </div>
          </div>
        </aside>
      )}

      {/* 2. ULTRA-LUXURY CINEMATIC MODAL POP-UP */}
      <AnimatePresence>
        {viewState === 'modal' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.28 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-xl"
            onClick={handleCloseModal}
          >
            <motion.div
              layoutId="announcement-luxury-container"
              initial={{ scale: 0.92, y: 25, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.92, y: 25, opacity: 0 }}
              transition={{ type: 'spring', damping: 28, stiffness: 320 }}
              onClick={(e) => e.stopPropagation()}
              className={`relative w-full max-w-lg max-h-[85vh] flex flex-col bg-[#090C12] border ${themeStyles.border} rounded-3xl overflow-hidden ${themeStyles.glow} text-white shadow-2xl my-auto`}
            >
              {/* Top ambient luxury light beam */}
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-white/40 to-transparent opacity-80 z-20 pointer-events-none" />

              {/* Close & Mute Controls */}
              <div className="absolute top-3 right-3 z-30 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsMuted(prev => !prev)}
                  className="p-1.5 rounded-full bg-black/60 hover:bg-black/90 text-white/70 hover:text-white backdrop-blur-md border border-white/15 transition-all cursor-pointer"
                  title={isMuted ? 'Sound muted' : 'Sound enabled'}
                >
                  {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
                </button>
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="p-1.5 rounded-full bg-black/60 hover:bg-black/90 text-white/70 hover:text-white backdrop-blur-md border border-white/15 transition-all cursor-pointer"
                  title="Minimize announcement"
                >
                  <X size={15} />
                </button>
              </div>

              {/* Cover Graphic / Visual Studio Showcase */}
              {announcement.imageUrl && (
                <div className="relative w-full h-28 sm:h-44 bg-neutral-950 overflow-hidden group shrink-0">
                  <img
                    src={announcement.imageUrl}
                    alt={announcement.title}
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-1000 opacity-90"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#090C12] via-black/30 to-transparent" />

                  {/* Shimmer Badge */}
                  <div className="absolute top-3 left-3">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[9px] sm:text-[10px] font-bold tracking-wider uppercase backdrop-blur-md border shadow-lg ${themeStyles.badgeBg}`}>
                      <Sparkles size={10} className={themeStyles.accentText} />
                      <span>{announcement.badge || 'VIP Privilege'}</span>
                    </span>
                  </div>

                  {/* Countdown Timer Strip */}
                  {timeLeft && (
                    <div className="absolute bottom-2 left-3 sm:left-4 flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-black/80 backdrop-blur-md border border-white/15 text-[10px] sm:text-xs font-mono">
                      <Clock size={11} className={themeStyles.accentText} />
                      <span className="text-[9.5px] text-white/70 font-sans uppercase font-bold tracking-wider">Ends:</span>
                      <span className="font-bold text-white tracking-wider">
                        {String(timeLeft.hours).padStart(2, '0')}h : {String(timeLeft.minutes).padStart(2, '0')}m : {String(timeLeft.seconds).padStart(2, '0')}s
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* Content Body */}
              <div className="p-4 sm:p-6 pt-3 sm:pt-4 space-y-3 sm:space-y-4 overflow-y-auto flex-1 [scrollbar-width:thin]">
                {!announcement.imageUrl && (
                  <div className="flex items-center justify-between">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[9px] sm:text-[10px] font-bold tracking-wider uppercase border ${themeStyles.badgeBg}`}>
                      <Sparkles size={10} className={themeStyles.accentText} />
                      <span>{announcement.badge || 'Showroom Advisory'}</span>
                    </span>
                    {timeLeft && (
                      <div className="flex items-center gap-1.5 text-xs font-mono text-neutral-300">
                        <Clock size={11} />
                        <span>{timeLeft.hours}h : {timeLeft.minutes}m : {timeLeft.seconds}s</span>
                      </div>
                    )}
                  </div>
                )}

                <div>
                  {announcement.subtitle && (
                    <div className="text-[9px] sm:text-[10px] uppercase tracking-[0.18em] text-neutral-400 font-bold mb-1">
                      {announcement.subtitle}
                    </div>
                  )}
                  <h2 className="font-serif-luxury text-lg sm:text-2xl text-white font-medium leading-snug tracking-wide">
                    {announcement.title}
                  </h2>
                </div>

                <p className="text-neutral-300 text-xs sm:text-sm leading-relaxed whitespace-pre-line font-light">
                  {announcement.message}
                </p>

                {/* Promo Code Box */}
                {announcement.promoCode && (
                  <div className="p-2.5 sm:p-3 rounded-xl bg-black/60 border border-white/15 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-white/10 border border-white/15 flex items-center justify-center text-white shrink-0">
                        <Tag size={14} />
                      </div>
                      <div>
                        <div className="text-[8.5px] uppercase tracking-wider text-neutral-400 font-bold">
                          Exclusive Coupon Code
                        </div>
                        <div className="font-mono text-xs sm:text-sm font-bold text-white tracking-wider">
                          {announcement.promoCode}
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleCopyCode}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-md ${
                        copiedCode
                          ? 'bg-white text-black font-bold'
                          : 'bg-white/10 hover:bg-white/20 text-white border border-white/20'
                      }`}
                    >
                      {copiedCode ? (
                        <>
                          <Check size={12} />
                          <span>Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy size={12} />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 pt-1">
                  <button
                    type="button"
                    onClick={handleActionClick}
                    className={`w-full sm:flex-1 py-3 px-5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all cursor-pointer shadow-lg flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.98] ${themeStyles.btnBg}`}
                  >
                    <span>{announcement.ctaText || 'Claim VIP Privilege'}</span>
                    <ArrowRight size={14} />
                  </button>

                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="w-full sm:w-auto py-2.5 px-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-medium transition-all cursor-pointer text-center"
                  >
                    Dismiss
                  </button>
                </div>

                {/* Authenticity Watermark */}
                <div className="pt-1 flex items-center justify-center gap-1.5 text-[9.5px] text-neutral-400">
                  <ShieldCheck size={11} className="text-white" />
                  <span>New Radhaswami Mobile Gallery • Pithampur Showroom</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3. MINIMIZED FLOATING DYNAMIC ISLAND & HOVER PREVIEW */}
      <AnimatePresence>
        {viewState === 'minimized' && (
          <div
            className="fixed bottom-[74px] sm:bottom-7 right-3 sm:right-auto sm:left-7 z-40 select-none"
            onMouseEnter={() => {
              if (!isTouchDevice) setIsHovered(true);
            }}
            onMouseLeave={() => {
              if (!isTouchDevice) setIsHovered(false);
            }}
          >
            {/* Hover 3D Preview Card (DESKTOP ONLY - NEVER ON MOBILE TOUCH) */}
            <AnimatePresence>
              {!isTouchDevice && isHovered && (
                <motion.div
                  initial={{ opacity: 0, y: 15, scale: 0.94 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 15, scale: 0.94 }}
                  transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                  onClick={handleOpenModal}
                  className="hidden md:block absolute bottom-16 left-0 w-80 sm:w-96 p-4 rounded-3xl bg-[#0B0E14]/95 border border-white/20 shadow-[0_20px_60px_rgba(0,0,0,0.8)] backdrop-blur-2xl cursor-pointer text-white overflow-hidden z-50 mb-1 select-none"
                >
                  <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-white/30 to-transparent" />

                  {announcement.imageUrl && (
                    <div className="w-full h-32 rounded-2xl overflow-hidden mb-3 relative bg-black">
                      <img
                        src={announcement.imageUrl}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                      <div className="absolute bottom-2 left-3 text-[10px] font-bold text-white flex items-center gap-1">
                        <Sparkles size={11} />
                        <span>{announcement.badge || 'Showroom VIP Notice'}</span>
                      </div>
                    </div>
                  )}

                  <div className="font-serif-luxury text-sm font-medium text-white line-clamp-1 mb-1">
                    {announcement.title}
                  </div>

                  <p className="text-[11px] text-neutral-300 line-clamp-2 leading-relaxed mb-3">
                    {announcement.message}
                  </p>

                  {announcement.promoCode && (
                    <div className="flex items-center justify-between p-2 rounded-xl bg-black/50 border border-white/10 mb-3 text-xs">
                      <div className="flex items-center gap-1.5 font-mono text-white font-bold text-[11px]">
                        <Tag size={12} />
                        <span>{announcement.promoCode}</span>
                      </div>
                      <span className="text-[10px] text-neutral-400 font-semibold">Click to Open</span>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-2 border-t border-white/10 text-[11px] font-bold text-white">
                    <span>Expand Full Showroom Bulletin</span>
                    <Maximize2 size={12} />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Breathing Luxury Capsule Button with Dismiss Option */}
            <motion.div
              layoutId="announcement-luxury-container"
              initial={{ opacity: 0, scale: 0.8, y: 25 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 25 }}
              whileHover={{ scale: 1.03 }}
              className="flex items-center gap-2 p-1.5 sm:p-2 sm:pr-3 rounded-full bg-[#0B0E14]/95 backdrop-blur-2xl border border-white/20 shadow-[0_12px_35px_rgba(0,0,0,0.6)] group transition-all"
            >
              <button
                type="button"
                onClick={handleOpenModal}
                className="flex items-center gap-2.5 text-left cursor-pointer focus:outline-none"
              >
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-br from-white via-neutral-300 to-neutral-500 p-[1.5px] shrink-0 shadow-md shadow-white/10">
                  <div className="w-full h-full bg-[#080A0E] rounded-full flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                    <Megaphone size={14} />
                  </div>
                </div>

                <div className="min-w-0 pr-1">
                  <div className="text-[8px] sm:text-[8.5px] font-bold uppercase tracking-widest text-neutral-400 leading-none flex items-center gap-1">
                    <span className="truncate max-w-[80px] sm:max-w-none">{announcement.badge || 'VIP Bulletin'}</span>
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  </div>
                  <div className="text-[11px] sm:text-xs font-bold text-white truncate max-w-[100px] sm:max-w-[160px] mt-0.5">
                    {announcement.title}
                  </div>
                </div>

                {announcement.promoCode && (
                  <span className="hidden sm:inline-block text-[9px] font-mono font-bold px-2 py-0.5 rounded-md bg-white/10 border border-white/20 text-white">
                    {announcement.promoCode}
                  </span>
                )}
              </button>

              {/* Explicit Dismiss Button to prevent widget getting stuck on phone */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setViewState('hidden');
                  try {
                    sessionStorage.setItem('radhaswami_announcement_dismissed', 'true');
                  } catch {}
                }}
                className="p-1 sm:p-1.5 rounded-full text-neutral-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                title="Dismiss Announcement"
              >
                <X size={12} />
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

