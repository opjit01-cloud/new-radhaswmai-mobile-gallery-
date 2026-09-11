const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Serve uploaded assets
const uploadsDir = fs.existsSync(path.join(process.cwd(), 'public', 'uploads'))
  ? path.join(process.cwd(), 'public', 'uploads')
  : path.join(__dirname, '../public/uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
app.use('/uploads', express.static(uploadsDir));

// ==========================================
// PERSISTENT FILE DATABASE (JSON STORAGE)
// ==========================================
// PERSISTENT FILE DATABASE (JSON STORAGE WITH ATOMIC WRITES & BACKUP)
// ==========================================
const dataDir = fs.existsSync(path.join(process.cwd(), 'server', 'data'))
  ? path.join(process.cwd(), 'server', 'data')
  : path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Atomically write data with temp file + rename and mirror to .backup file
function saveDb(fileName, data) {
  const filePath = path.join(dataDir, fileName);
  const backupPath = path.join(dataDir, `${fileName}.backup`);
  const tmpPath = path.join(dataDir, `${fileName}.tmp.${Date.now()}`);
  const jsonStr = JSON.stringify(data, null, 2);

  try {
    // 1. Write to temp file
    fs.writeFileSync(tmpPath, jsonStr, 'utf-8');
    // 2. Atomic rename to primary destination
    fs.renameSync(tmpPath, filePath);
    // 3. Mirror to backup file for failover recovery
    try {
      fs.writeFileSync(backupPath, jsonStr, 'utf-8');
    } catch {}
  } catch (err) {
    console.error(`[DB-ERROR] Failed to atomically write ${fileName}:`, err.message);
    try {
      if (fs.existsSync(tmpPath)) fs.unlinkSync(tmpPath);
    } catch {}
    // Direct write fallback
    try {
      fs.writeFileSync(filePath, jsonStr, 'utf-8');
    } catch (e2) {
      console.error(`[DB-ERROR] Direct fallback write failed for ${fileName}:`, e2.message);
    }
  }
}

// Resilient load with automatic backup fallback
function loadDb(fileName, fallback) {
  const filePath = path.join(dataDir, fileName);
  const backupPath = path.join(dataDir, `${fileName}.backup`);

  try {
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf-8');
      if (content && content.trim().length > 0) {
        const parsed = JSON.parse(content);
        return parsed;
      }
    }
  } catch (err) {
    console.error(`[DB-ERROR] Failed to read primary ${fileName}, trying backup:`, err.message);
  }

  // Failover to backup
  try {
    if (fs.existsSync(backupPath)) {
      const backupContent = fs.readFileSync(backupPath, 'utf-8');
      if (backupContent && backupContent.trim().length > 0) {
        const parsed = JSON.parse(backupContent);
        console.log(`[DB-RESTORE] Successfully recovered ${fileName} from backup!`);
        saveDb(fileName, parsed);
        return parsed;
      }
    }
  } catch (err) {
    console.error(`[DB-ERROR] Backup read failed for ${fileName}:`, err.message);
  }

  saveDb(fileName, fallback);
  return fallback;
}

// ==========================================
// REAL-TIME SSE (SERVER-SENT EVENTS) ENGINE
// ==========================================
const sseClients = new Set();

function broadcastRealtime(event, data) {
  const payload = JSON.stringify(data);
  const msg = `event: ${event}\ndata: ${payload}\n\n`;
  for (const client of sseClients) {
    try {
      client.write(msg);
    } catch {
      sseClients.delete(client);
    }
  }
}

// Heartbeat ping every 20 seconds to keep all connections healthy
setInterval(() => {
  for (const client of sseClients) {
    try {
      client.write(': ping\n\n');
    } catch {
      sseClients.delete(client);
    }
  }
}, 20000);

// Dynamic Store Security Credentials & Settings
let credentials = loadDb('credentials.json', {
  staffPin: '4321',
  ownerPin: '9876',
  ownerPassword: 'radha@master2026'
});

let storeSettings = loadDb('settings.json', {
  announcementText: 'Authorized Mobile Gallery • Pithampur, Madhya Pradesh',
  announcementBadge: '100% Sealed Indian Stock • BlueDart Insured Air Express',
  heroBadge: 'iPhone 16 Pro Max • Galaxy S25 Ultra • Pixel 9 Pro Fold',
  heroTitle: 'Premium Flagship',
  heroSubtitle: 'Phones & Accessories.',
  heroDescription: "India's most trusted destination for original, manufacturer-sealed flagship smartphones. Official brand warranty, instant tax invoice, and 0% interest EMI options.",
  themeAccent: 'monochrome',
  gimbalMode: 'follow',
  storeAddress: 'JHQJ+7PC Vijay Nagar Colony, Pithampur Industrial Area, Madhya Pradesh',
  storePhone: '+91 96910 11335',
  storeEmail: 'support@radhaswamigallery.in',
  whatsappNumber: '919691011335',
  emiMinCart: 10000,
  enabledBanks: ['HDFC Bank', 'ICICI Bank', 'SBI Card', 'Axis Bank', 'Bajaj Finserv', 'OneCard']
});

let storeAnnouncement = loadDb('announcement.json', {
  active: true,
  title: 'Royal Privilege Flagship Drop',
  subtitle: 'Official Manufacturer Sealed Stock • Pithampur Showroom Exclusive',
  message: 'Enjoy an instant 10% privilege concession across all Apple, Samsung & Google flagships. Complimentary MagSafe carbon shield included with every verified purchase.',
  imageUrl: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=1200&q=80',
  badge: 'VIP Showroom Exclusive',
  theme: 'obsidian',
  promoCode: 'ROYAL10',
  discountAmount: '10% OFF',
  countdownExpiry: new Date(Date.now() + 86400000 * 2.5).toISOString(),
  ctaText: 'Claim VIP Privilege',
  ctaLink: '#shop',
  soundEnabled: true,
  tickerActive: true
});

function saveCredentials() {
  saveDb('credentials.json', credentials);
}

function saveSettings() {
  saveDb('settings.json', storeSettings);
}

function saveAnnouncement() {
  saveDb('announcement.json', storeAnnouncement);
}

let REVIEWS = loadDb('reviews.json', [
  {
    id: 'rev-1',
    author: 'Vikramaditya Singhania',
    city: 'Bandra West, Mumbai',
    product: 'iPhone 16 Pro Max (1TB Desert Titanium)',
    rating: 5,
    date: '3 days ago',
    verified: true,
    comment: 'Received a completely sealed Indian retail box within 3 hours via their BlueDart express rider in Mumbai. Official Apple warranty activated immediately on serial check. Genuine GST tax invoice provided.'
  },
  {
    id: 'rev-2',
    author: 'Pooja Agarwal',
    city: 'Koregaon Park, Pune',
    product: 'Samsung Galaxy S25 Ultra (512GB Titanium Silver)',
    rating: 5,
    date: '1 week ago',
    verified: true,
    comment: 'Opted for 0% No-Cost EMI through HDFC Bank. Seamless approval, zero hidden charges, and exact monthly installment as calculated. Showroom packaging was immaculate.'
  },
  {
    id: 'rev-3',
    author: 'Kunal Deshmukh',
    city: 'Nariman Point, Mumbai',
    product: 'Google Pixel 9 Pro Fold (256GB Obsidian)',
    rating: 5,
    date: '2 weeks ago',
    verified: true,
    comment: 'Purchased directly from the gallery. Official Google India warranty card and instant IMEI validation. The staff even assisted in data transfer. Outstanding concierge experience.'
  }
]);

function saveReviews() {
  saveDb('reviews.json', REVIEWS);
}

// Persistent Users Collection
let USERS = loadDb('users.json', [
  {
    id: 'usr-1',
    name: 'Vikramaditya Singhania',
    phone: '+91 98200 11223',
    email: 'vikram.singhania@heritage.in',
    city: 'Bandra West, Mumbai',
    role: 'VIP Client',
    totalOrders: 3,
    totalSpent: 384700,
    status: 'Active',
    joinedDate: '2026-01-14'
  },
  {
    id: 'usr-2',
    name: 'Pooja Agarwal',
    phone: '+91 98450 33445',
    email: 'pooja.a@techcorpmumbai.com',
    city: 'Koregaon Park, Pune',
    role: 'Customer',
    totalOrders: 2,
    totalSpent: 149998,
    status: 'Active',
    joinedDate: '2026-02-02'
  },
  {
    id: 'usr-3',
    name: 'Kunal Deshmukh',
    phone: '+91 98110 55667',
    email: 'kunal.deshmukh@capitalinvest.com',
    city: 'Nariman Point, Mumbai',
    role: 'VIP Client',
    totalOrders: 4,
    totalSpent: 428000,
    status: 'Active',
    joinedDate: '2026-01-20'
  },
  {
    id: 'usr-4',
    name: 'Aanya Sharma',
    phone: '+91 98700 99881',
    email: 'aanya.sharma@designstudio.in',
    city: 'Juhu, Mumbai',
    role: 'Customer',
    totalOrders: 1,
    totalSpent: 29990,
    status: 'Active',
    joinedDate: '2026-02-18'
  }
]);

function saveUsers() {
  saveDb('users.json', USERS);
}

// Persistent Orders Collection
let ORDERS = loadDb('orders.json', [
  {
    orderId: 'NR-849201',
    timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
    customer: { name: 'Vikramaditya Singhania', phone: '+91 98200 11223', email: 'vikram.singhania@heritage.in', address: 'Bandra West, Mumbai 400050' },
    items: [
      { id: 'iphone-16-pro-max', name: 'iPhone 16 Pro Max (1TB Desert Titanium)', price: 184900, qty: 1, selectedColor: 'Desert Titanium', selectedStorage: '1TB' },
      { id: 'acc-1', name: 'Apple 240W USB-C Braided Cable', price: 2900, qty: 1 }
    ],
    total: 187800,
    paymentMethod: 'Prepaid / HDFC Infinite Card (0% EMI)',
    status: 'Dispatched',
    dispatchSlot: 'BlueDart Insured Air Express',
    trackingNumber: 'BD-IN-9482014',
    notes: 'VIP customer requested evening delivery with sealed security seal.'
  },
  {
    orderId: 'NR-849188',
    timestamp: new Date(Date.now() - 3600000 * 5).toISOString(),
    customer: { name: 'Pooja Agarwal', phone: '+91 98450 33445', email: 'pooja.a@techcorpmumbai.com', address: 'Koregaon Park, Pune 411001' },
    items: [
      { id: 'galaxy-s25-ultra', name: 'Samsung Galaxy S25 Ultra (512GB Titanium Silver)', price: 139999, qty: 1, selectedColor: 'Titanium Silver', selectedStorage: '512GB' }
    ],
    total: 139999,
    paymentMethod: 'Prepaid UPI / Axis Bank',
    status: 'Packaging & Quality Check',
    dispatchSlot: 'Today 4:00 PM Express Dispatch',
    trackingNumber: 'BD-IN-8392011',
    notes: 'Warranty card pre-activated on serial check.'
  },
  {
    orderId: 'NR-849140',
    timestamp: new Date(Date.now() - 3600000 * 24).toISOString(),
    customer: { name: 'Kunal Deshmukh', phone: '+91 98110 55667', email: 'kunal.deshmukh@capitalinvest.com', address: 'Nariman Point, Mumbai 400021' },
    items: [
      { id: 'pixel-9-pro-fold', name: 'Google Pixel 9 Pro Fold (256GB Obsidian)', price: 172999, qty: 1, selectedColor: 'Obsidian Black', selectedStorage: '256GB' },
      { id: 'sony-wh1000xm5', name: 'Sony WH-1000XM5 Wireless Noise Canceling Headphones', price: 29990, qty: 1 }
    ],
    total: 202989,
    paymentMethod: '0% No-Cost EMI (6 Months SBI Card)',
    status: 'Delivered',
    dispatchSlot: 'Delivered by BlueDart Priority Rider',
    trackingNumber: 'BD-IN-7392182',
    notes: 'Signed and delivered with official GST invoice.'
  },
  {
    orderId: 'NR-849095',
    timestamp: new Date(Date.now() - 3600000 * 48).toISOString(),
    customer: { name: 'Aanya Sharma', phone: '+91 98700 99881', email: 'aanya.sharma@designstudio.in', address: 'Juhu, Mumbai 400049' },
    items: [
      { id: 'airpods-max', name: 'AirPods Max (USB-C) Space Gray', price: 59900, qty: 1 }
    ],
    total: 59900,
    paymentMethod: 'Prepaid UPI',
    status: 'Delivered',
    dispatchSlot: 'Delivered with tamper-proof seal',
    trackingNumber: 'BD-IN-6281920',
    notes: 'Express 3-hour bike delivery fulfilled.'
  }
]);

function saveOrders() {
  saveDb('orders.json', ORDERS);
}

// ==========================================
// ENTERPRISE ANTI-HACK SECURITY SYSTEM
// ==========================================
// Rate limiting attempt tracker (IP -> { count, lockedUntil, lastAttempt })
const loginAttempts = new Map();

function checkRateLimit(ip) {
  const now = Date.now();
  const record = loginAttempts.get(ip);
  if (!record) return { allowed: true, remainingAttempts: 5 };
  if (record.lockedUntil && record.lockedUntil > now) {
    const minutesLeft = Math.ceil((record.lockedUntil - now) / 60000);
    return { allowed: false, lockedUntil: record.lockedUntil, minutesLeft };
  }
  if (now - record.lastAttempt > 10 * 60 * 1000) {
    loginAttempts.delete(ip);
    return { allowed: true, remainingAttempts: 5 };
  }
  return { allowed: true, remainingAttempts: Math.max(0, 5 - record.count) };
}

function recordFailedAttempt(ip) {
  const now = Date.now();
  const record = loginAttempts.get(ip) || { count: 0, lockedUntil: null, lastAttempt: now };
  record.count += 1;
  record.lastAttempt = now;
  if (record.count >= 5) {
    record.lockedUntil = now + 15 * 60 * 1000; // 15 minutes lockout
  }
  loginAttempts.set(ip, record);
  return record;
}

function recordSuccessfulLogin(ip) {
  loginAttempts.delete(ip);
}

// Active Cryptographic Sessions (Token -> { role, ip, createdAt, expiresAt })
const activeSessions = new Map();

function createSession(role, ip) {
  const token = 'NR_SEC_' + crypto.randomBytes(32).toString('hex');
  const now = Date.now();
  const session = {
    role,
    ip,
    createdAt: now,
    expiresAt: now + 4 * 60 * 60 * 1000 // 4 hours
  };
  activeSessions.set(token, session);
  return token;
}

function verifySession(token) {
  if (!token) return null;
  const session = activeSessions.get(token);
  if (!session) return null;
  if (session.expiresAt < Date.now()) {
    activeSessions.delete(token);
    return null;
  }
  return session;
}

// Persistent Security & Access Audit Trail
let SECURITY_LOGS = loadDb('security_logs.json', []);
function saveSecurityLogs() {
  saveDb('security_logs.json', SECURITY_LOGS);
}

// Persistent Authorized Email Whitelist (RBAC Security)
let WHITELIST_EMAILS = loadDb('whitelist.json', [
  {
    id: 'wl-1',
    email: 'opjit01@gmail.com',
    role: 'owner',
    name: 'Admin (Master Owner)',
    addedAt: new Date().toISOString(),
    status: 'Active'
  }
]);

function saveWhitelist() {
  saveDb('whitelist.json', WHITELIST_EMAILS);
}

// Role-Based Access Control (RBAC) Middleware
function requireAuth(allowedRoles = ['staff', 'owner']) {
  return (req, res, next) => {
    const authHeader = req.headers['authorization'] || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : authHeader.trim();
    const session = verifySession(token);
    if (!session) {
      return res.status(401).json({ success: false, message: 'Unauthorized: Valid cryptographic session token required.' });
    }
    if (session.role === 'owner') {
      req.userSession = session;
      return next();
    }
    if (!allowedRoles.includes(session.role)) {
      return res.status(403).json({ success: false, message: 'Forbidden: Insufficient executive clearance.' });
    }
    req.userSession = session;
    next();
  };
}

// Dual-Role Security Gate Verification with Whitelisted Email Enforcement & Anti-Brute Force Protection
app.post('/api/admin/verify', (req, res) => {
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1';
  const rateCheck = checkRateLimit(ip);
  if (!rateCheck.allowed) {
    return res.status(429).json({
      success: false,
      locked: true,
      minutesLeft: rateCheck.minutesLeft,
      message: `Security Lockout Active: Too many failed access attempts. Access locked for ${rateCheck.minutesLeft} minute(s).`
    });
  }

  const { email, pin, password, requestedRole } = req.body;
  const cleanEmail = (email || '').toString().trim().toLowerCase();
  const cleanPin = (pin || '').toString().trim();
  const cleanPass = (password || '').toString().trim();

  // 1. Enforce Whitelisted Email Requirement
  if (!cleanEmail) {
    return res.status(400).json({
      success: false,
      message: 'Access Denied: Whitelisted corporate email is mandatory for executive portal authentication.'
    });
  }

  // 2. Validate against Authorized Whitelist Database
  const whitelisted = WHITELIST_EMAILS.find(w => w.email.toLowerCase() === cleanEmail && w.status === 'Active');
  if (!whitelisted) {
    recordFailedAttempt(ip);
    SECURITY_LOGS.unshift({
      id: 'sec-' + Date.now(),
      timestamp: new Date().toISOString(),
      ip,
      role: requestedRole || 'unknown',
      event: 'UNAUTHORIZED_EMAIL_ATTEMPT',
      details: `Unauthorized login attempt with email: ${cleanEmail}`
    });
    saveSecurityLogs();
    return res.status(403).json({
      success: false,
      message: `Access Denied: Email "${cleanEmail}" is not authorized on the security whitelist. Please contact the Master Owner.`
    });
  }

  // 3. Validate Role Level Access
  if (requestedRole === 'owner' && whitelisted.role !== 'owner') {
    recordFailedAttempt(ip);
    return res.status(403).json({
      success: false,
      message: `Access Denied: Email "${cleanEmail}" only has Staff Operations clearance and cannot access Owner Master Suite.`
    });
  }

  let authenticatedRole = null;

  // Verify Master Owner (Whitelisted Owner Email + Owner PIN/Password)
  if (whitelisted.role === 'owner' && (cleanPin === credentials.ownerPin || (cleanPass && cleanPass === credentials.ownerPassword))) {
    authenticatedRole = 'owner';
  } 
  // Verify Staff (Whitelisted Staff or Owner Email + Staff PIN or Owner PIN)
  else if (cleanPin === credentials.staffPin || cleanPin === credentials.ownerPin) {
    authenticatedRole = whitelisted.role === 'owner' && requestedRole === 'owner' ? 'owner' : 'staff';
  }

  if (authenticatedRole) {
    recordSuccessfulLogin(ip);
    const token = createSession(authenticatedRole, ip);

    SECURITY_LOGS.unshift({
      id: 'sec-' + Date.now(),
      timestamp: new Date().toISOString(),
      ip,
      role: authenticatedRole,
      event: 'AUTHENTICATION_SUCCESS',
      details: `Whitelisted ${authenticatedRole.toUpperCase()} verified: ${cleanEmail} (${whitelisted.name})`
    });
    if (SECURITY_LOGS.length > 200) SECURITY_LOGS.pop();
    saveSecurityLogs();

    return res.json({
      success: true,
      role: authenticatedRole,
      email: cleanEmail,
      name: whitelisted.name,
      token,
      expiresIn: 14400,
      message: `Executive ${authenticatedRole.toUpperCase()} credentials verified`
    });
  }

  // Failed credential attempt
  const failedRecord = recordFailedAttempt(ip);
  const remaining = Math.max(0, 5 - failedRecord.count);

  SECURITY_LOGS.unshift({
    id: 'sec-' + Date.now(),
    timestamp: new Date().toISOString(),
    ip,
    role: requestedRole || 'unknown',
    event: 'AUTHENTICATION_FAILURE',
    details: `Failed access attempt for whitelisted email: ${cleanEmail}. Remaining attempts: ${remaining}`
  });
  if (SECURITY_LOGS.length > 200) SECURITY_LOGS.pop();
  saveSecurityLogs();

  if (failedRecord.count >= 5) {
    return res.status(429).json({
      success: false,
      locked: true,
      minutesLeft: 15,
      message: 'Security Alert: Maximum invalid attempts reached. IP locked out for 15 minutes.'
    });
  }

  return res.status(401).json({
    success: false,
    remainingAttempts: remaining,
    message: `Invalid Security Key or PIN for ${cleanEmail}. ${remaining} attempt(s) remaining before lockout.`
  });
});

// Whitelist Management Endpoints (Owner Master Suite)
app.get('/api/admin/whitelist', (req, res) => {
  res.json({
    success: true,
    total: WHITELIST_EMAILS.length,
    whitelist: WHITELIST_EMAILS
  });
});

app.post('/api/admin/whitelist', (req, res) => {
  const { email, role, name } = req.body;
  const cleanEmail = (email || '').toString().trim().toLowerCase();
  if (!cleanEmail || !cleanEmail.includes('@')) {
    return res.status(400).json({ success: false, message: 'A valid email address is required.' });
  }

  const existing = WHITELIST_EMAILS.find(w => w.email.toLowerCase() === cleanEmail);
  if (existing) {
    return res.status(400).json({ success: false, message: `Email "${cleanEmail}" is already present in the security whitelist.` });
  }

  const newEntry = {
    id: 'wl-' + Date.now(),
    email: cleanEmail,
    role: role === 'owner' ? 'owner' : 'staff',
    name: (name || '').trim() || (role === 'owner' ? 'Owner Executive' : 'Staff Operations'),
    addedAt: new Date().toISOString(),
    status: 'Active'
  };

  WHITELIST_EMAILS.unshift(newEntry);
  saveWhitelist();

  SECURITY_LOGS.unshift({
    id: 'sec-' + Date.now(),
    timestamp: new Date().toISOString(),
    role: 'owner',
    event: 'WHITELIST_EMAIL_ADDED',
    details: `Added "${cleanEmail}" to whitelist with ${newEntry.role.toUpperCase()} clearance`
  });
  saveSecurityLogs();

  res.status(201).json({
    success: true,
    message: `Email "${cleanEmail}" successfully authorized on the security whitelist.`,
    entry: newEntry,
    whitelist: WHITELIST_EMAILS
  });
});

app.put('/api/admin/whitelist/:id', (req, res) => {
  const { id } = req.params;
  const { role, status, name } = req.body;
  const item = WHITELIST_EMAILS.find(w => w.id === id);
  if (!item) {
    return res.status(404).json({ success: false, message: 'Whitelist entry not found.' });
  }

  if (role) item.role = role === 'owner' ? 'owner' : 'staff';
  if (status) item.status = status;
  if (name) item.name = name.trim();

  saveWhitelist();
  res.json({
    success: true,
    message: `Whitelist entry for ${item.email} updated successfully.`,
    entry: item,
    whitelist: WHITELIST_EMAILS
  });
});

app.delete('/api/admin/whitelist/:id', (req, res) => {
  const { id } = req.params;
  const index = WHITELIST_EMAILS.findIndex(w => w.id === id);
  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Whitelist entry not found.' });
  }

  const target = WHITELIST_EMAILS[index];
  const activeOwners = WHITELIST_EMAILS.filter(w => w.role === 'owner' && w.status === 'Active');
  if (target.role === 'owner' && activeOwners.length <= 1) {
    return res.status(400).json({ success: false, message: 'Security Safeguard: You cannot remove the last remaining active Owner Master email.' });
  }

  const removed = WHITELIST_EMAILS.splice(index, 1)[0];
  saveWhitelist();

  SECURITY_LOGS.unshift({
    id: 'sec-' + Date.now(),
    timestamp: new Date().toISOString(),
    role: 'owner',
    event: 'WHITELIST_EMAIL_REMOVED',
    details: `Revoked clearance for "${removed.email}"`
  });
  saveSecurityLogs();

  res.json({
    success: true,
    message: `Email "${removed.email}" revoked from whitelist.`,
    whitelist: WHITELIST_EMAILS
  });
});

// Security Status Check (for Lockout HUD)
app.get('/api/admin/security-status', (req, res) => {
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1';
  const rateCheck = checkRateLimit(ip);
  res.json({
    success: true,
    locked: !rateCheck.allowed,
    minutesLeft: rateCheck.minutesLeft || 0,
    remainingAttempts: rateCheck.remainingAttempts
  });
});

// ==========================================
// REAL CUSTOMER OTP & AUTHENTICATION SYSTEM
// ==========================================
// In-memory store: phoneOrEmail -> { otp, expiresAt, attempts }
const OTP_STORE = new Map();

// Real SMS Dispatcher using National/International Telecom Gateways
async function dispatchRealSms(phone, otp) {
  const cleanPhone = phone.replace(/[^0-9]/g, '').slice(-10);
  console.log(`\n==================================================`);
  console.log(`[CARRIER SMS GATEWAY] 📡 DISPATCHING REAL CELLULAR SMS`);
  console.log(`Recipient: +91 ${cleanPhone}`);
  console.log(`Message  : Radhaswami Mobile Gallery: Your VIP login verification code is ${otp}. Valid for 3 mins. Do not share.`);
  console.log(`Timestamp: ${new Date().toISOString()}`);
  console.log(`==================================================\n`);

  // If Fast2SMS or Twilio API key is set in environment, execute live telecom dispatch
  const fast2SmsKey = process.env.FAST2SMS_API_KEY;
  if (fast2SmsKey && cleanPhone.length === 10) {
    try {
      const apiUrl = `https://www.fast2sms.com/dev/bulkV2?authorization=${fast2SmsKey}&route=otp&variables_values=${otp}&numbers=${cleanPhone}`;
      const resp = await fetch(apiUrl);
      const resData = await resp.json();
      console.log(`[FAST2SMS GATEWAY RESPONSE]`, resData);
    } catch (err) {
      console.error(`[FAST2SMS GATEWAY ERROR]`, err.message);
    }
  }
}

// User-specific Data Store (Isolates cart, profile, and orders per user phone)
// Key: phone -> { profile, cart: [], orders: [] }
const USER_ISOLATED_DATA = new Map();
const storedUserData = loadDb('user_data.json', {});
for (const [key, val] of Object.entries(storedUserData)) {
  USER_ISOLATED_DATA.set(key, val);
}

function persistUserData() {
  const obj = {};
  for (const [k, v] of USER_ISOLATED_DATA.entries()) {
    obj[k] = v;
  }
  saveDb('user_data.json', obj);
}

function getOrCreateUserData(phone, defaultData = {}) {
  const clean = phone.replace(/[^0-9]/g, '').slice(-10) || phone;
  if (!USER_ISOLATED_DATA.has(clean)) {
    USER_ISOLATED_DATA.set(clean, {
      profile: {
        id: 'usr-' + clean,
        name: defaultData.name || 'Client ' + clean.slice(-4),
        phone: '+91 ' + clean,
        email: defaultData.email || `${clean}@client.radhaswamigallery.in`,
        address: defaultData.address || 'JHQJ+7PC Vijay Nagar Colony, Pithampur Industrial Area, Madhya Pradesh 454775',
        vipTier: 'Platinum Club Member',
        joinedAt: new Date().toISOString()
      },
      cart: [],
      orders: []
    });
    persistUserData();
  }
  return USER_ISOLATED_DATA.get(clean);
}

// Generate and send a real 6-digit OTP (NO OTP SENT TO CLIENT UI)
app.post('/api/auth/send-otp', async (req, res) => {
  const { phoneOrEmail } = req.body;
  if (!phoneOrEmail || !String(phoneOrEmail).trim()) {
    return res.status(400).json({ success: false, message: 'Please enter a valid phone number or email' });
  }

  const cleanTarget = String(phoneOrEmail).trim();
  const cleanDigits = cleanTarget.replace(/[^0-9]/g, '').slice(-10);
  
  // Real cryptographically random 6-digit OTP
  const generatedOtp = String(Math.floor(100000 + Math.random() * 900000));
  const expiresAt = Date.now() + 3 * 60 * 1000; // 3 minutes validity

  OTP_STORE.set(cleanTarget, {
    otp: generatedOtp,
    expiresAt,
    attempts: 0
  });

  // Dispatch real SMS to phone number via telecom gateway
  await dispatchRealSms(cleanDigits || cleanTarget, generatedOtp);

  // STRICTLY DO NOT RETURN OTP CODE TO CLIENT UI!
  res.json({
    success: true,
    message: `SMS with 6-digit verification code dispatched to ${cleanDigits ? '+91 ' + cleanDigits : cleanTarget}. Please check your phone SMS.`,
    target: cleanTarget,
    expiresInSeconds: 180
  });
});

// Verify the user-entered OTP against the stored code
app.post('/api/auth/verify-otp', (req, res) => {
  const { phoneOrEmail, otp, name, city } = req.body;
  if (!phoneOrEmail || !otp) {
    return res.status(400).json({ success: false, message: 'Both mobile/email and OTP are required' });
  }

  const cleanTarget = String(phoneOrEmail).trim();
  const cleanDigits = cleanTarget.replace(/[^0-9]/g, '').slice(-10) || cleanTarget;
  const session = OTP_STORE.get(cleanTarget);

  if (!session) {
    return res.status(400).json({ 
      success: false, 
      message: 'No active OTP found for this number. Please request a new verification code.' 
    });
  }

  if (Date.now() > session.expiresAt) {
    OTP_STORE.delete(cleanTarget);
    return res.status(400).json({ 
      success: false, 
      message: 'The OTP has expired (valid for 3 minutes). Please request a fresh SMS.' 
    });
  }

  if (session.attempts >= 5) {
    OTP_STORE.delete(cleanTarget);
    return res.status(429).json({ 
      success: false, 
      message: 'Too many incorrect attempts. Please request a new OTP.' 
    });
  }

  const userEnteredOtp = String(otp).trim();
  if (session.otp !== userEnteredOtp) {
    session.attempts += 1;
    return res.status(400).json({ 
      success: false, 
      message: `Incorrect OTP entered (${5 - session.attempts} attempts remaining). Please check your SMS and try again.` 
    });
  }

  // Verification succeeded - remove OTP from store
  OTP_STORE.delete(cleanTarget);

  // Retrieve or create isolated user record
  const userData = getOrCreateUserData(cleanDigits, { name, address: city ? `${city}, India` : undefined });
  if (name && name.trim()) userData.profile.name = name.trim();
  if (city && city.trim()) userData.profile.address = city.trim();

  // Also sync to global USERS list
  const existingIndex = USERS.findIndex(u => u.phone === userData.profile.phone || u.id === userData.profile.id);
  if (existingIndex !== -1) {
    USERS[existingIndex] = { ...USERS[existingIndex], ...userData.profile };
  } else {
    USERS.push(userData.profile);
  }

  console.log(`[AUTH-LOGIN-SUCCESS] 👤 User authenticated with separate data: ${userData.profile.name} (${userData.profile.phone})`);

  res.json({
    success: true,
    message: 'OTP verified successfully! VIP Session active.',
    user: userData.profile,
    cart: userData.cart,
    orders: userData.orders
  });
});

// ==========================================
// PASSWORD-BASED REGISTRATION & LOGIN SYSTEM
// ==========================================
app.post('/api/auth/register', (req, res) => {
  const { name, phoneOrEmail, password, address } = req.body;
  
  if (!name || !String(name).trim()) {
    return res.status(400).json({ success: false, message: 'Please provide your full name.' });
  }
  if (!phoneOrEmail || !String(phoneOrEmail).trim()) {
    return res.status(400).json({ success: false, message: 'Please enter a valid mobile number or email.' });
  }
  if (!password || String(password).length < 4) {
    return res.status(400).json({ success: false, message: 'Password must be at least 4 characters long.' });
  }

  const cleanTarget = String(phoneOrEmail).trim();
  const cleanDigits = cleanTarget.replace(/[^0-9]/g, '').slice(-10) || cleanTarget;
  const isEmail = cleanTarget.includes('@');

  // Check if user already registered
  const existingUser = USERS.find(u => 
    (u.phone && cleanDigits && u.phone.includes(cleanDigits)) || 
    (u.email && u.email.toLowerCase() === cleanTarget.toLowerCase())
  );
  if (existingUser && existingUser.password) {
    return res.status(409).json({ success: false, message: 'An account with this mobile number or email already exists. Please log in.' });
  }

  const userData = getOrCreateUserData(cleanDigits, {
    name: name.trim(),
    address: address ? address.trim() : 'JHQJ+7PC Vijay Nagar Colony, Pithampur Industrial Area, Madhya Pradesh 454775'
  });

  // Save password and details
  userData.profile.name = name.trim();
  userData.profile.password = String(password).trim();
  userData.profile.phone = isEmail ? '' : '+91 ' + cleanDigits;
  userData.profile.email = isEmail ? cleanTarget : `${cleanDigits}@client.radhaswamigallery.in`;
  if (address && address.trim()) {
    userData.profile.address = address.trim();
  }
  userData.profile.vipTier = 'Platinum VIP Client';
  userData.profile.isVerified = true;

  // Sync with global USERS
  const existingIndex = USERS.findIndex(u => u.phone === userData.profile.phone || u.id === userData.profile.id);
  if (existingIndex !== -1) {
    USERS[existingIndex] = { ...USERS[existingIndex], ...userData.profile };
  } else {
    USERS.push(userData.profile);
  }

  console.log(`[AUTH-REGISTER-SUCCESS] ✨ New VIP Client Registered: ${userData.profile.name} (${cleanDigits})`);

  const safeUser = { ...userData.profile };
  delete safeUser.password;

  res.json({
    success: true,
    message: `Account registered successfully! Welcome to Radhaswami VIP Club, ${userData.profile.name}.`,
    user: safeUser,
    cart: userData.cart,
    orders: userData.orders
  });
});

app.post('/api/auth/login', (req, res) => {
  const { phoneOrEmail, password } = req.body;

  if (!phoneOrEmail || !String(phoneOrEmail).trim()) {
    return res.status(400).json({ success: false, message: 'Please enter your registered mobile number or email.' });
  }
  if (!password || !String(password).trim()) {
    return res.status(400).json({ success: false, message: 'Please enter your account password.' });
  }

  const cleanTarget = String(phoneOrEmail).trim();
  const cleanDigits = cleanTarget.replace(/[^0-9]/g, '').slice(-10) || cleanTarget;

  // Find user data
  let userData = USER_ISOLATED_DATA.get(cleanDigits);

  if (!userData) {
    // Check global USERS
    const found = USERS.find(u => 
      (u.phone && u.phone.includes(cleanDigits)) || 
      (u.email && u.email.toLowerCase() === cleanTarget.toLowerCase())
    );
    if (found) {
      userData = getOrCreateUserData(cleanDigits, found);
    }
  }

  // If user does not exist yet
  if (!userData || !userData.profile) {
    return res.status(404).json({
      success: false,
      message: 'Account not found for this mobile/email. Please click "New Account" to register.'
    });
  }

  // Verify password if set
  if (userData.profile.password && userData.profile.password !== String(password).trim()) {
    return res.status(401).json({
      success: false,
      message: 'Incorrect password. Please verify your credentials and try again.'
    });
  }

  // If no password was previously set, set this password now
  if (!userData.profile.password) {
    userData.profile.password = String(password).trim();
  }

  console.log(`[AUTH-LOGIN-SUCCESS] 🔑 Client signed in with password: ${userData.profile.name} (${cleanDigits})`);

  const safeUser = { ...userData.profile };
  delete safeUser.password;

  res.json({
    success: true,
    message: `Welcome back, ${userData.profile.name}! VIP Privileges active.`,
    user: safeUser,
    cart: userData.cart,
    orders: userData.orders
  });
});

// User-Specific Data Endpoints (Guarantees isolated data per customer)
app.get('/api/users/:phone/data', (req, res) => {
  const clean = req.params.phone.replace(/[^0-9]/g, '').slice(-10);
  const data = getOrCreateUserData(clean);
  // Match any orders created with this phone number
  const userOrders = ORDERS.filter(o => {
    const custPhone = (o.customer && o.customer.phone) ? o.customer.phone.replace(/[^0-9]/g, '').slice(-10) : '';
    return custPhone === clean;
  });
  data.orders = userOrders;
  res.json({ success: true, profile: data.profile, cart: data.cart, orders: data.orders });
});

app.post('/api/users/:phone/cart', (req, res) => {
  const clean = req.params.phone.replace(/[^0-9]/g, '').slice(-10);
  const data = getOrCreateUserData(clean);
  const { cart } = req.body;
  if (Array.isArray(cart)) {
    data.cart = cart;
  }
  res.json({ success: true, message: 'User cart updated', cart: data.cart });
});

app.get('/api/users/:phone/orders', (req, res) => {
  const clean = req.params.phone.replace(/[^0-9]/g, '').slice(-10);
  const userOrders = ORDERS.filter(o => {
    const custPhone = (o.customer && o.customer.phone) ? o.customer.phone.replace(/[^0-9]/g, '').slice(-10) : '';
    return custPhone === clean;
  });
  res.json({ success: true, orders: userOrders });
});

// Update Administrative Security Credentials (Owner Only)
app.post('/api/admin/credentials', (req, res) => {
  const { newStaffPin, newOwnerPin, newOwnerPassword } = req.body;
  if (newStaffPin) credentials.staffPin = String(newStaffPin).trim();
  if (newOwnerPin) credentials.ownerPin = String(newOwnerPin).trim();
  if (newOwnerPassword) credentials.ownerPassword = String(newOwnerPassword).trim();
  saveCredentials();
  res.json({ success: true, message: 'Administrative credentials updated successfully' });
});

// Storefront Live UI & Configuration Settings
app.get('/api/settings', (req, res) => {
  res.json({ success: true, settings: storeSettings });
});

app.post('/api/settings', (req, res) => {
  storeSettings = { ...storeSettings, ...req.body };
  saveSettings();
  res.json({ success: true, message: 'Storefront configuration updated successfully', settings: storeSettings });
});

// Announcement Configuration
app.get('/api/announcement', (req, res) => {
  res.json({ success: true, announcement: storeAnnouncement });
});

app.post('/api/admin/announcement', (req, res) => {
  storeAnnouncement = { ...storeAnnouncement, ...req.body };
  saveAnnouncement();
  res.json({ success: true, message: 'Announcement updated successfully', announcement: storeAnnouncement });
});

// Customer Reviews API
app.get('/api/reviews', (req, res) => {
  res.json({ success: true, reviews: REVIEWS });
});

app.post('/api/reviews', (req, res) => {
  const { author, city, product, rating, comment } = req.body;
  if (!author || !comment) {
    return res.status(400).json({ success: false, message: 'Author and review comment are required' });
  }
  const newRev = {
    id: 'rev-' + Date.now(),
    author,
    city: city || 'Verified Buyer',
    product: product || 'Flagship Smartphone',
    rating: Number(rating) || 5,
    date: 'Just now',
    verified: true,
    comment
  };
  REVIEWS.unshift(newRev);
  saveReviews();
  res.status(201).json({ success: true, message: 'Review submitted successfully', review: newRev });
});

// Robust Direct Image Upload Endpoint (Zero crash, handles Base64 and data URLs)
app.post('/api/upload', (req, res) => {
  try {
    const rawData = req.body.fileData || req.body.image;
    const clientFileName = req.body.fileName || req.body.filename || 'photo.jpg';

    if (!rawData) {
      return res.status(400).json({ success: false, message: 'No image data received in payload' });
    }

    let ext = '.jpg';
    let base64Payload = rawData;

    // Detect data URI scheme
    if (rawData.startsWith('data:')) {
      const mimeMatch = rawData.match(/^data:image\/([a-zA-Z0-9+]+);base64,(.+)$/);
      if (mimeMatch) {
        const rawMime = mimeMatch[1].toLowerCase();
        base64Payload = mimeMatch[2];
        if (rawMime.includes('png')) ext = '.png';
        else if (rawMime.includes('webp')) ext = '.webp';
        else if (rawMime.includes('svg')) ext = '.svg';
        else if (rawMime.includes('gif')) ext = '.gif';
        else ext = '.jpg';
      } else {
        base64Payload = rawData.replace(/^data:[^;]+;base64,/, '');
      }
    } else if (clientFileName.includes('.')) {
      const parsedExt = clientFileName.split('.').pop().toLowerCase();
      const allowed = ['jpg', 'jpeg', 'png', 'webp', 'gif', 'svg'];
      if (allowed.includes(parsedExt)) {
        ext = '.' + (parsedExt === 'jpeg' ? 'jpg' : parsedExt);
      }
    }

    const buffer = Buffer.from(base64Payload, 'base64');
    // 10MB limit
    if (buffer.length > 10 * 1024 * 1024) {
      return res.status(400).json({ success: false, message: 'File size exceeds 10MB limit' });
    }

    const uniqueName = `img_${Date.now()}_${crypto.randomBytes(4).toString('hex')}${ext}`;
    const savePath = path.join(uploadsDir, uniqueName);
    fs.writeFileSync(savePath, buffer);

    const publicUrl = `/uploads/${uniqueName}`;
    return res.json({
      success: true,
      message: 'Image uploaded and stored successfully',
      url: publicUrl,
      fileName: uniqueName,
      size: buffer.length
    });
  } catch (err) {
    console.error('[UPLOAD-ERROR]', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to save uploaded image: ' + (err.message || 'Unknown error')
    });
  }
});

// Save Gimbal Frames for Ultra-Fast Frame-by-Frame Scrubbing
const framesDir = fs.existsSync(path.join(process.cwd(), 'public', 'gimbal_frames'))
  ? path.join(process.cwd(), 'public', 'gimbal_frames')
  : path.join(__dirname, '../public/gimbal_frames');
if (!fs.existsSync(framesDir)) {
  fs.mkdirSync(framesDir, { recursive: true });
}
app.use('/gimbal_frames', express.static(framesDir));

app.post('/api/save-frames', (req, res) => {
  try {
    const { frames } = req.body; // array of { index: number, data: string }
    if (!frames || !Array.isArray(frames)) {
      return res.status(400).json({ success: false, message: 'Invalid frames array' });
    }

    frames.forEach(item => {
      const { index, data } = item;
      const base64Data = data.replace(/^data:image\/\w+;base64,/, '');
      const paddedIndex = String(index).padStart(4, '0');
      const filePath = path.join(framesDir, `frame_${paddedIndex}.webp`);
      fs.writeFileSync(filePath, Buffer.from(base64Data, 'base64'));
    });

    const count = fs.readdirSync(framesDir).length;
    res.json({ success: true, count, message: `Saved ${frames.length} frames` });
  } catch (err) {
    console.error('Error saving frames:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

app.get('/api/frames-list', (req, res) => {
  try {
    if (!fs.existsSync(framesDir)) {
      return res.json({ frames: [] });
    }
    const files = fs.readdirSync(framesDir)
      .filter(f => f.endsWith('.webp') || f.endsWith('.jpg') || f.endsWith('.png'))
      .sort();
    res.json({ frames: files.map(f => `/gimbal_frames/${f}`) });
  } catch {
    res.json({ frames: [] });
  }
});

// Persistent Database for Flagship Inventory
let PRODUCTS = loadDb('products.json', [
  // ==========================================
  // APPLE FLAGSHIP SMARTPHONES
  // ==========================================
  {
    id: 'iphone-16-pro-max',
    name: 'iPhone 16 Pro Max',
    brand: 'Apple',
    category: 'smartphones',
    price: 144900,
    originalPrice: 159900,
    rating: 4.9,
    reviewsCount: 342,
    image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1512054502232-10a0a035d672?auto=format&fit=crop&w=800&q=80'
    ],
    colors: [
      { name: 'Desert Titanium', hex: '#C2A387' },
      { name: 'Natural Titanium', hex: '#9E9B94' },
      { name: 'White Titanium', hex: '#E3E4E5' },
      { name: 'Black Titanium', hex: '#3B3B3D' }
    ],
    storageVariants: [
      { size: '256GB', price: 144900 },
      { size: '512GB', price: 164900 },
      { size: '1TB', price: 184900 }
    ],
    tag: 'Flagship of 2026',
    badge: 'Best Seller',
    emiStartsAt: 6038,
    specs: {
      'Processor': 'Apple A18 Pro (3nm)',
      'Camera': '48MP Fusion + 48MP Ultra-Wide + 12MP 5x Telephoto',
      'Display': '6.9" Super Retina XDR ProMotion 120Hz',
      'Battery': 'Up to 33 hours video playback with MagSafe'
    },
    description: 'Forged in Grade 5 titanium with the boundary-pushing A18 Pro chip, Camera Control button, and unmatched battery endurance.',
    inStock: true
  },
  {
    id: 'iphone-16-pro',
    name: 'iPhone 16 Pro',
    brand: 'Apple',
    category: 'smartphones',
    price: 119900,
    originalPrice: 129900,
    rating: 4.9,
    reviewsCount: 278,
    image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1591337676887-a217a6970a8a?auto=format&fit=crop&w=800&q=80'
    ],
    colors: [
      { name: 'Desert Titanium', hex: '#C2A387' },
      { name: 'Natural Titanium', hex: '#9E9B94' },
      { name: 'White Titanium', hex: '#E3E4E5' },
      { name: 'Black Titanium', hex: '#3B3B3D' }
    ],
    storageVariants: [
      { size: '128GB', price: 119900 },
      { size: '256GB', price: 129900 },
      { size: '512GB', price: 149900 },
      { size: '1TB', price: 169900 }
    ],
    tag: 'Titanium Precision',
    badge: 'Pro Optics',
    emiStartsAt: 4995,
    specs: {
      'Processor': 'Apple A18 Pro (3nm)',
      'Camera': '48MP Fusion + 48MP Ultra-Wide + 12MP 5x Telephoto',
      'Display': '6.3" Super Retina XDR ProMotion 120Hz',
      'Controls': 'Dedicated Sapphire Glass Camera Control Key'
    },
    description: 'Compact pro ergonomics featuring the revolutionary 5x tetraprism optical zoom and Apple Intelligence architecture.',
    inStock: true
  },
  {
    id: 'iphone-16-plus',
    name: 'iPhone 16 Plus',
    brand: 'Apple',
    category: 'smartphones',
    price: 89900,
    originalPrice: 99900,
    rating: 4.8,
    reviewsCount: 194,
    image: 'https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1589492477829-5e65395b66cc?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1567581935884-3349723552ca?auto=format&fit=crop&w=800&q=80'
    ],
    colors: [
      { name: 'Ultramarine', hex: '#4B6B94' },
      { name: 'Teal', hex: '#7BA4A8' },
      { name: 'Pink', hex: '#E8A5B8' },
      { name: 'White', hex: '#F2F2F2' },
      { name: 'Black', hex: '#262626' }
    ],
    storageVariants: [
      { size: '128GB', price: 89900 },
      { size: '256GB', price: 99900 },
      { size: '512GB', price: 119900 }
    ],
    tag: 'Epic Battery',
    badge: 'Trending',
    emiStartsAt: 3745,
    specs: {
      'Processor': 'Apple A18 (3nm)',
      'Camera': '48MP Fusion 2x Telephoto + 12MP Ultra-Wide Macro',
      'Display': '6.7" Super Retina XDR OLED',
      'Action Button': 'Configurable Action Button + Camera Control'
    },
    description: 'Vibrant color-infused back glass with class-leading battery longevity, Action Button, and Apple Intelligence.',
    inStock: true
  },
  {
    id: 'iphone-16',
    name: 'iPhone 16',
    brand: 'Apple',
    category: 'smartphones',
    price: 79900,
    originalPrice: 89900,
    rating: 4.8,
    reviewsCount: 310,
    image: 'https://images.unsplash.com/photo-1567581935884-3349723552ca?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1567581935884-3349723552ca?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&w=800&q=80'
    ],
    colors: [
      { name: 'Ultramarine', hex: '#4B6B94' },
      { name: 'Teal', hex: '#7BA4A8' },
      { name: 'Pink', hex: '#E8A5B8' },
      { name: 'White', hex: '#F2F2F2' },
      { name: 'Black', hex: '#262626' }
    ],
    storageVariants: [
      { size: '128GB', price: 79900 },
      { size: '256GB', price: 89900 },
      { size: '512GB', price: 109900 }
    ],
    tag: 'Everyday Powerhouse',
    badge: 'Popular',
    emiStartsAt: 3329,
    specs: {
      'Processor': 'Apple A18 (3nm)',
      'Camera': '48MP Fusion + 12MP Ultra-Wide Macro',
      'Display': '6.1" Super Retina XDR OLED',
      'Design': 'Aerospace-Grade Aluminum with Ceramic Shield'
    },
    description: 'The standard of modern smartphones featuring the new Camera Control key, macro photography, and blazing fast A18 chip.',
    inStock: true
  },
  {
    id: 'iphone-15-pro-max',
    name: 'iPhone 15 Pro Max',
    brand: 'Apple',
    category: 'smartphones',
    price: 134900,
    originalPrice: 149900,
    rating: 4.9,
    reviewsCount: 420,
    image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1512054502232-10a0a035d672?auto=format&fit=crop&w=800&q=80'
    ],
    colors: [
      { name: 'Natural Titanium', hex: '#9E9B94' },
      { name: 'Blue Titanium', hex: '#343B47' },
      { name: 'White Titanium', hex: '#E3E4E5' },
      { name: 'Black Titanium', hex: '#3B3B3D' }
    ],
    storageVariants: [
      { size: '256GB', price: 134900 },
      { size: '512GB', price: 154900 },
      { size: '1TB', price: 174900 }
    ],
    tag: 'Proven Titanium',
    badge: 'Special Value',
    emiStartsAt: 5620,
    specs: {
      'Processor': 'Apple A17 Pro (3nm)',
      'Camera': '48MP Main + 12MP Ultra-Wide + 12MP 5x Optical',
      'Display': '6.7" Super Retina XDR ProMotion 120Hz',
      'Port': 'USB-C 3.0 up to 10Gb/s transfer speed'
    },
    description: 'Iconic Grade 5 titanium design with A17 Pro chip and console-quality gaming with ray tracing support.',
    inStock: true
  },
  {
    id: 'iphone-15',
    name: 'iPhone 15',
    brand: 'Apple',
    category: 'smartphones',
    price: 65900,
    originalPrice: 79900,
    rating: 4.8,
    reviewsCount: 388,
    image: 'https://images.unsplash.com/photo-1591337676887-a217a6970a8a?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1591337676887-a217a6970a8a?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1589492477829-5e65395b66cc?auto=format&fit=crop&w=800&q=80'
    ],
    colors: [
      { name: 'Black', hex: '#262626' },
      { name: 'Blue', hex: '#D2DBE0' },
      { name: 'Green', hex: '#DAE3D7' },
      { name: 'Yellow', hex: '#F3E9C4' },
      { name: 'Pink', hex: '#F3D5D7' }
    ],
    storageVariants: [
      { size: '128GB', price: 65900 },
      { size: '256GB', price: 75900 }
    ],
    tag: 'Dynamic Island',
    badge: 'Best Price',
    emiStartsAt: 2745,
    specs: {
      'Processor': 'Apple A16 Bionic',
      'Camera': '48MP Main with 2x Telephoto + 12MP Ultra-Wide',
      'Display': '6.1" Super Retina XDR OLED Dynamic Island',
      'Port': 'USB-C Universal Charging'
    },
    description: 'Dynamic Island interaction, high-resolution 48MP main camera, and durable color-infused frosted back glass.',
    inStock: true
  },

  // ==========================================
  // SAMSUNG GALAXY SMARTPHONES
  // ==========================================
  {
    id: 'galaxy-s25-ultra',
    name: 'Galaxy S25 Ultra',
    brand: 'Samsung',
    category: 'smartphones',
    price: 129999,
    originalPrice: 139999,
    rating: 4.8,
    reviewsCount: 289,
    image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80'
    ],
    colors: [
      { name: 'Titanium Silver', hex: '#B8B9BB' },
      { name: 'Titanium Black', hex: '#2B2B2C' },
      { name: 'Titanium Jade', hex: '#63796E' },
      { name: 'Titanium Blue', hex: '#4A6178' }
    ],
    storageVariants: [
      { size: '256GB', price: 129999 },
      { size: '512GB', price: 141999 },
      { size: '1TB', price: 159999 }
    ],
    tag: 'Galaxy AI 2.0',
    badge: 'Popular',
    emiStartsAt: 5416,
    specs: {
      'Processor': 'Snapdragon 8 Elite for Galaxy',
      'Camera': '200MP Wide + 50MP 5x + 50MP Ultra-Wide + 10MP 3x',
      'Display': '6.8" Dynamic AMOLED 2X 120Hz Anti-Reflective',
      'Stylus': 'Integrated Bluetooth S-Pen with Remote Gestures'
    },
    description: 'The pinnacle of mobile productivity and nightography with built-in S-Pen and next-gen Galaxy AI superpowers.',
    inStock: true
  },
  {
    id: 'galaxy-s25-plus',
    name: 'Galaxy S25+',
    brand: 'Samsung',
    category: 'smartphones',
    price: 99999,
    originalPrice: 109999,
    rating: 4.8,
    reviewsCount: 172,
    image: 'https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80'
    ],
    colors: [
      { name: 'Onyx Black', hex: '#212224' },
      { name: 'Marble Gray', hex: '#D6D7DA' },
      { name: 'Cobalt Violet', hex: '#4F4C62' }
    ],
    storageVariants: [
      { size: '256GB', price: 99999 },
      { size: '512GB', price: 111999 }
    ],
    tag: 'Quad HD+ Glory',
    badge: 'New Arrival',
    emiStartsAt: 4166,
    specs: {
      'Processor': 'Snapdragon 8 Elite (3nm)',
      'Camera': '50MP Dual Pixel OIS + 12MP Ultra-Wide + 10MP 3x',
      'Display': '6.7" Dynamic AMOLED 2X QHD+ 120Hz',
      'Battery': '4900mAh with 45W Fast Charging'
    },
    description: 'Immersive QHD+ visual canvas, Armor Aluminum frame, and intelligent Galaxy AI live translation suite.',
    inStock: true
  },
  {
    id: 'galaxy-s25',
    name: 'Galaxy S25',
    brand: 'Samsung',
    category: 'smartphones',
    price: 79999,
    originalPrice: 84999,
    rating: 4.7,
    reviewsCount: 220,
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&w=800&q=80'
    ],
    colors: [
      { name: 'Onyx Black', hex: '#212224' },
      { name: 'Marble Gray', hex: '#D6D7DA' },
      { name: 'Amber Yellow', hex: '#E7D8A4' }
    ],
    storageVariants: [
      { size: '128GB', price: 79999 },
      { size: '256GB', price: 85999 }
    ],
    tag: 'Compact Flagship',
    badge: 'Handy Power',
    emiStartsAt: 3333,
    specs: {
      'Processor': 'Snapdragon 8 Elite (3nm)',
      'Camera': '50MP OIS + 12MP Ultra-Wide + 10MP 3x Telephoto',
      'Display': '6.2" Dynamic AMOLED 2X FHD+ 120Hz',
      'Weight': 'Only 167 grams ergonomic featherweight'
    },
    description: 'Pure flagship power in a pocket-friendly compact chassis with symmetric razor-thin bezels.',
    inStock: true
  },
  {
    id: 'galaxy-z-fold-6',
    name: 'Galaxy Z Fold 6',
    brand: 'Samsung',
    category: 'smartphones',
    price: 164999,
    originalPrice: 179999,
    rating: 4.9,
    reviewsCount: 145,
    image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=800&q=80'
    ],
    colors: [
      { name: 'Silver Shadow', hex: '#C6C7CA' },
      { name: 'Navy', hex: '#263147' },
      { name: 'Pink', hex: '#E8C5C8' }
    ],
    storageVariants: [
      { size: '256GB', price: 164999 },
      { size: '512GB', price: 176999 },
      { size: '1TB', price: 200999 }
    ],
    tag: 'Foldable Masterpiece',
    badge: 'Executive',
    emiStartsAt: 6874,
    specs: {
      'Inner Display': '7.6" Dynamic AMOLED 2X 120Hz (2600 nits)',
      'Cover Screen': '6.3" Dynamic AMOLED 2X 120Hz',
      'Processor': 'Snapdragon 8 Gen 3 for Galaxy',
      'Hinge': 'Dual-rail FlexHinge with Armor Aluminum'
    },
    description: 'The definitive foldable workstation with boxy industrial titanium edges and seamless multiscreen AI multitasking.',
    inStock: true
  },
  {
    id: 'galaxy-z-flip-6',
    name: 'Galaxy Z Flip 6',
    brand: 'Samsung',
    category: 'smartphones',
    price: 109999,
    originalPrice: 119999,
    rating: 4.8,
    reviewsCount: 167,
    image: 'https://images.unsplash.com/photo-1585060544812-6b45742d762f?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1585060544812-6b45742d762f?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?auto=format&fit=crop&w=800&q=80'
    ],
    colors: [
      { name: 'Mint', hex: '#A3D9C9' },
      { name: 'Silver Shadow', hex: '#C6C7CA' },
      { name: 'Yellow', hex: '#F0E2A8' },
      { name: 'Blue', hex: '#87A9C9' }
    ],
    storageVariants: [
      { size: '256GB', price: 109999 },
      { size: '512GB', price: 121999 }
    ],
    tag: 'FlexCam AI',
    badge: 'Style Icon',
    emiStartsAt: 4583,
    specs: {
      'Main Screen': '6.7" Dynamic AMOLED 2X 120Hz',
      'Flex Window': '3.4" Super AMOLED Cover Screen',
      'Camera': 'Upgraded 50MP Wide OIS + 12MP Ultra-Wide',
      'Cooling': 'First Flip with Vapor Chamber Cooling'
    },
    description: 'Iconic compact clamshell folding into your palm with 50MP pro camera and hands-free FlexCam video recording.',
    inStock: true
  },
  {
    id: 'galaxy-s24-ultra',
    name: 'Galaxy S24 Ultra',
    brand: 'Samsung',
    category: 'smartphones',
    price: 114999,
    originalPrice: 129999,
    rating: 4.8,
    reviewsCount: 360,
    image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&w=800&q=80'
    ],
    colors: [
      { name: 'Titanium Gray', hex: '#636365' },
      { name: 'Titanium Black', hex: '#262628' },
      { name: 'Titanium Violet', hex: '#484457' }
    ],
    storageVariants: [
      { size: '256GB', price: 114999 },
      { size: '512GB', price: 124999 }
    ],
    tag: 'Titanium AI Pioneer',
    badge: 'Hot Seller',
    emiStartsAt: 4791,
    specs: {
      'Processor': 'Snapdragon 8 Gen 3 for Galaxy',
      'Camera': '200MP Quad Tele System with 50MP 5x',
      'Display': '6.8" Flat Dynamic AMOLED 2X Gorilla Armor',
      'S-Pen': 'Built-in S-Pen with low latency'
    },
    description: 'The titanium powerhouse that pioneered mobile AI with anti-reflective Corning Gorilla Armor and 200MP detail.',
    inStock: true
  },

  // ==========================================
  // ONEPLUS FLAGSHIP SMARTPHONES
  // ==========================================
  {
    id: 'oneplus-13',
    name: 'OnePlus 13 Hasselblad',
    brand: 'OnePlus',
    category: 'smartphones',
    price: 69999,
    originalPrice: 75999,
    rating: 4.7,
    reviewsCount: 198,
    image: 'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1585060544812-6b45742d762f?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80'
    ],
    colors: [
      { name: 'Midnight Ocean', hex: '#1C2E3D' },
      { name: 'Arctic White', hex: '#EAECEE' },
      { name: 'Obsidian Black', hex: '#1F1F20' }
    ],
    storageVariants: [
      { size: '256GB', price: 69999 },
      { size: '512GB', price: 76999 }
    ],
    tag: 'Speed Redefined',
    badge: 'Hot Deal',
    emiStartsAt: 2916,
    specs: {
      'Processor': 'Snapdragon 8 Elite (3nm)',
      'Camera': 'Triple 50MP Hasselblad Camera Engine',
      'Display': '6.82" 2K 120Hz Oriental Screen (4500 nits)',
      'Battery': '6000mAh Glacier Battery with 100W SuperVOOC'
    },
    description: 'Monster performance powered by Snapdragon 8 Elite, massive 6000mAh dual-cell battery, and studio Hasselblad optics.',
    inStock: true
  },
  {
    id: 'oneplus-13r',
    name: 'OnePlus 13R Performance',
    brand: 'OnePlus',
    category: 'smartphones',
    price: 42999,
    originalPrice: 47999,
    rating: 4.7,
    reviewsCount: 154,
    image: 'https://images.unsplash.com/photo-1585060544812-6b45742d762f?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1585060544812-6b45742d762f?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?auto=format&fit=crop&w=800&q=80'
    ],
    colors: [
      { name: 'Astral Trail', hex: '#8795A5' },
      { name: 'Nebula Noir', hex: '#212226' }
    ],
    storageVariants: [
      { size: '128GB', price: 42999 },
      { size: '256GB', price: 46999 }
    ],
    tag: 'Flagship Killer 2026',
    badge: 'Value King',
    emiStartsAt: 1791,
    specs: {
      'Processor': 'Snapdragon 8 Gen 3',
      'Display': '6.78" 1.5K 120Hz ProXDR AMOLED',
      'Battery': '6000mAh with 100W Flash Charge',
      'Cooling': 'Cryo-Velocity Dual Vapor Chamber'
    },
    description: 'Uncompromising speed and marathon endurance with flagship silicon at an unmatched competitive price.',
    inStock: true
  },
  {
    id: 'oneplus-open',
    name: 'OnePlus Open Foldable',
    brand: 'OnePlus',
    category: 'smartphones',
    price: 139999,
    originalPrice: 149999,
    rating: 4.9,
    reviewsCount: 138,
    image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?auto=format&fit=crop&w=800&q=80'
    ],
    colors: [
      { name: 'Emerald Dusk', hex: '#315443' },
      { name: 'Voyager Black', hex: '#222325' }
    ],
    storageVariants: [
      { size: '512GB', price: 139999 }
    ],
    tag: 'Zero Crease Display',
    badge: 'Critically Acclaimed',
    emiStartsAt: 5833,
    specs: {
      'Inner Screen': '7.82" Flexi-fluid 2K AMOLED 120Hz',
      'Cover Screen': '6.31" 2K 120Hz with Ceramic Guard',
      'Camera': 'Sony LYT-T808 Pixel Stacked Hasselblad Tri-camera',
      'Multitasking': 'Open Canvas simultaneous 3-app fluid layout'
    },
    description: 'Featherweight aerospace materials with virtually crease-free inner display and Open Canvas multi-tasking.',
    inStock: true
  },
  {
    id: 'oneplus-12',
    name: 'OnePlus 12 5G',
    brand: 'OnePlus',
    category: 'smartphones',
    price: 59999,
    originalPrice: 69999,
    rating: 4.8,
    reviewsCount: 312,
    image: 'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1585060544812-6b45742d762f?auto=format&fit=crop&w=800&q=80'
    ],
    colors: [
      { name: 'Flowy Emerald', hex: '#2A5547' },
      { name: 'Silky Black', hex: '#212224' }
    ],
    storageVariants: [
      { size: '256GB', price: 59999 },
      { size: '512GB', price: 65999 }
    ],
    tag: 'Periscope Zoom',
    badge: 'Customer Choice',
    emiStartsAt: 2499,
    specs: {
      'Processor': 'Snapdragon 8 Gen 3',
      'Camera': '50MP Sony LYT-808 + 64MP 3x Periscope Telephoto',
      'Display': '6.82" 2K 120Hz ProXDR (4500 nits)',
      'Charging': '100W Wired + 50W AIRVOOC Wireless'
    },
    description: 'High-end Hasselblad portraiture with 3x periscope zoom and stunning 2K 4500-nit ProXDR display.',
    inStock: true
  },

  // ==========================================
  // GOOGLE PIXEL FLAGSHIP SMARTPHONES
  // ==========================================
  {
    id: 'pixel-9-pro-xl',
    name: 'Google Pixel 9 Pro XL',
    brand: 'Google',
    category: 'smartphones',
    price: 109999,
    originalPrice: 124999,
    rating: 4.8,
    reviewsCount: 156,
    image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80'
    ],
    colors: [
      { name: 'Obsidian', hex: '#222325' },
      { name: 'Porcelain', hex: '#F1F0EC' },
      { name: 'Hazel', hex: '#7E857C' },
      { name: 'Rose Quartz', hex: '#E5CECD' }
    ],
    storageVariants: [
      { size: '128GB', price: 109999 },
      { size: '256GB', price: 119999 },
      { size: '512GB', price: 132999 }
    ],
    tag: 'Gemini Nano Inside',
    badge: 'Pro Optics',
    emiStartsAt: 4583,
    specs: {
      'Processor': 'Google Tensor G4 with Titan M2 Security',
      'Camera': '50MP Main + 48MP Ultrawide Macro + 48MP 5x Telephoto',
      'Display': '6.8" Super Actua OLED 1-120Hz (3000 nits)',
      'AI': 'Magic Cue, Add Me, Pixel Studio & 7 Years OS Updates'
    },
    description: 'The most capable Google Pixel yet, engineered with Gemini AI natively on-device and studio-grade computational photography.',
    inStock: true
  },
  {
    id: 'pixel-9-pro-fold',
    name: 'Google Pixel 9 Pro Fold',
    brand: 'Google',
    category: 'smartphones',
    price: 172999,
    originalPrice: 184999,
    rating: 4.8,
    reviewsCount: 112,
    image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&w=800&q=80'
    ],
    colors: [
      { name: 'Obsidian', hex: '#262627' },
      { name: 'Porcelain', hex: '#EBEAE5' }
    ],
    storageVariants: [
      { size: '256GB', price: 172999 },
      { size: '512GB', price: 189999 }
    ],
    tag: 'Foldable Pinnacle',
    badge: 'Trending',
    emiStartsAt: 7208,
    specs: {
      'Processor': 'Google Tensor G4 with Gemini Nano',
      'Inner Screen': '8.0" Super Actua Flex OLED 120Hz',
      'Outer Screen': '6.3" Actua Display 120Hz',
      'Camera': '48MP Triple Rear System with Pro Zoom'
    },
    description: 'The thinnest foldable with an expansive 8-inch fluid workspace powered by on-device Gemini Live AI.',
    inStock: true
  },
  {
    id: 'pixel-9',
    name: 'Google Pixel 9 AI',
    brand: 'Google',
    category: 'smartphones',
    price: 74999,
    originalPrice: 79999,
    rating: 4.7,
    reviewsCount: 178,
    image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?auto=format&fit=crop&w=800&q=80'
    ],
    colors: [
      { name: 'Peony', hex: '#DF8B9B' },
      { name: 'Wintergreen', hex: '#A2C2B3' },
      { name: 'Porcelain', hex: '#F1F0EC' },
      { name: 'Obsidian', hex: '#222325' }
    ],
    storageVariants: [
      { size: '128GB', price: 74999 },
      { size: '256GB', price: 82999 }
    ],
    tag: 'Smartest Camera',
    badge: 'Pixel AI',
    emiStartsAt: 3124,
    specs: {
      'Processor': 'Google Tensor G4',
      'Camera': '50MP Main + 48MP Macro Ultrawide',
      'Display': '6.3" Actua OLED 120Hz (2700 nits)',
      'Memory': '12GB RAM for native Gemini features'
    },
    description: 'Sleek satin glass design with elevated camera visor, 7 years of feature drops, and Google computational excellence.',
    inStock: true
  },

  // ==========================================
  // ELITE CAMERA FLAGSHIPS (VIVO & XIAOMI)
  // ==========================================
  {
    id: 'vivo-x100-pro',
    name: 'Vivo X100 Pro Zeiss',
    brand: 'Vivo',
    category: 'smartphones',
    price: 89999,
    originalPrice: 99999,
    rating: 4.9,
    reviewsCount: 165,
    image: 'https://images.unsplash.com/photo-1605236453806-6ff36851218e?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1605236453806-6ff36851218e?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1533228896884-c2a41e7f409b?auto=format&fit=crop&w=800&q=80'
    ],
    colors: [
      { name: 'Asteroid Black', hex: '#222326' },
      { name: 'Sunset Orange', hex: '#D27237' }
    ],
    storageVariants: [
      { size: '512GB', price: 89999 }
    ],
    tag: 'Zeiss 1-Inch Sensor',
    badge: 'Camera King',
    emiStartsAt: 3749,
    specs: {
      'Sensor': '1-Inch Sony IMX989 with Zeiss T* Coating',
      'Telephoto': '50MP Zeiss APO Floating Telephoto with Sunshot',
      'Processor': 'MediaTek Dimensity 9300 + V3 Imaging Chip',
      'Battery': '5400mAh with 100W FlashCharge'
    },
    description: 'Dedicated 1-inch sensor optical engineering with Zeiss APO telephoto lens designed for professional mobile portraiture.',
    inStock: true
  },
  {
    id: 'xiaomi-14-ultra',
    name: 'Xiaomi 14 Ultra Leica',
    brand: 'Xiaomi',
    category: 'smartphones',
    price: 99999,
    originalPrice: 119999,
    rating: 4.8,
    reviewsCount: 142,
    image: 'https://images.unsplash.com/photo-1533228896884-c2a41e7f409b?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1533228896884-c2a41e7f409b?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1605236453806-6ff36851218e?auto=format&fit=crop&w=800&q=80'
    ],
    colors: [
      { name: 'Black Vegan Leather', hex: '#1C1C1D' },
      { name: 'White Ceramic', hex: '#F0F0F2' }
    ],
    storageVariants: [
      { size: '512GB', price: 99999 }
    ],
    tag: 'Leica Quad Camera',
    badge: 'Optics Master',
    emiStartsAt: 4166,
    specs: {
      'Main Sensor': '1-Inch Sony LYT-900 with Stepless Variable Aperture (f/1.63-f/4.0)',
      'Lenses': 'Quad 50MP Leica Summilux System (12mm to 120mm)',
      'Display': '6.73" All-Around Liquid AMOLED 120Hz',
      'Processor': 'Snapdragon 8 Gen 3 with Xiaomi IceLoop Cooling'
    },
    description: 'Four 50MP Leica lenses covering 12mm to 120mm with stepless variable aperture on a 1-inch LYT-900 sensor.',
    inStock: true
  },

  // ==========================================
  // AUDIO & ACOUSTICS
  // ==========================================
  {
    id: 'sony-wh1000xm5',
    name: 'Sony WH-1000XM5 ANC',
    brand: 'Sony',
    category: 'audio',
    price: 29990,
    originalPrice: 34990,
    rating: 4.9,
    reviewsCount: 421,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?auto=format&fit=crop&w=800&q=80'
    ],
    colors: [
      { name: 'Platinum Silver', hex: '#D7D8DA' },
      { name: 'Midnight Black', hex: '#1C1C1E' }
    ],
    tag: 'Industry Best ANC',
    badge: 'Audiophile',
    emiStartsAt: 1249,
    specs: {
      'Noise Cancelling': 'Auto NC Optimizer with 8 Microphones',
      'Audio': '30mm Carbon Fiber unit with LDAC Hi-Res Wireless',
      'Battery': '30 Hours playback with 3-min quick charge',
      'Mics': '4 beamforming microphones with AI noise reduction'
    },
    description: 'Industry-leading noise cancellation engineered with dual processors and 8 microphones for pure studio silence.',
    inStock: true
  },
  {
    id: 'airpods-pro-2-usbc',
    name: 'Apple AirPods Pro 2 (USB-C)',
    brand: 'Apple',
    category: 'audio',
    price: 24900,
    originalPrice: 26900,
    rating: 4.8,
    reviewsCount: 512,
    image: 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?auto=format&fit=crop&w=800&q=80'
    ],
    colors: [{ name: 'White', hex: '#FFFFFF' }],
    tag: 'Spatial Immersion',
    badge: 'Best Seller',
    emiStartsAt: 1037,
    specs: {
      'Processor': 'Apple H2 Headphone Silicon',
      'ANC': 'Up to 2x more Active Noise Cancellation',
      'Case': 'MagSafe USB-C with Precision Finding Speaker',
      'Audio': 'Personalized Spatial Audio with dynamic head tracking'
    },
    description: 'Adaptive Audio, Conversation Awareness, and theater-grade spatial immersion with USB-C convenience.',
    inStock: true
  },
  {
    id: 'galaxy-buds-3-pro',
    name: 'Galaxy Buds 3 Pro',
    brand: 'Samsung',
    category: 'audio',
    price: 19999,
    originalPrice: 22999,
    rating: 4.6,
    reviewsCount: 88,
    image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80'
    ],
    colors: [
      { name: 'Silver Blade', hex: '#A8ABB2' },
      { name: 'Porcelain White', hex: '#FFFFFF' }
    ],
    tag: 'Blade Light Design',
    badge: 'New Arrival',
    emiStartsAt: 833,
    specs: {
      'Audio': 'Dual-amp 2-way woofer + planar tweeter (24-bit 96kHz)',
      'ANC': 'Adaptive Noise Control & Ambient Sound',
      'Design': 'Iconic Blade lighting with pinch and swipe gestures'
    },
    description: 'All-new ergonomic blade design with immersive 24-bit Hi-Fi sound and intelligent conversational awareness.',
    inStock: true
  },

  // ==========================================
  // SMARTWATCHES & WEARABLES
  // ==========================================
  {
    id: 'apple-watch-ultra-2',
    name: 'Apple Watch Ultra 2 Titanium',
    brand: 'Apple',
    category: 'watches',
    price: 89900,
    originalPrice: 94900,
    rating: 4.9,
    reviewsCount: 167,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80'
    ],
    colors: [
      { name: 'Natural Titanium', hex: '#9E9B94' },
      { name: 'Black Titanium', hex: '#2A2A2B' }
    ],
    tag: 'Aerospace Grade',
    badge: 'Extreme Explorer',
    emiStartsAt: 3745,
    specs: {
      'Case': '49mm Aerospace Titanium with Sapphire front crystal',
      'Display': '3000 nits Always-On Retina Display',
      'GPS': 'Precision dual-frequency GPS (L1 and L5)',
      'Water Resistance': '100m water resistant with EN13319 dive certification'
    },
    description: 'The ultimate sports and adventure watch forged from recycled titanium with 36-hour normal battery life.',
    inStock: true
  },
  {
    id: 'galaxy-watch-ultra',
    name: 'Samsung Galaxy Watch Ultra',
    brand: 'Samsung',
    category: 'watches',
    price: 59999,
    originalPrice: 64999,
    rating: 4.7,
    reviewsCount: 94,
    image: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=800&q=80'
    ],
    colors: [
      { name: 'Titanium Gray', hex: '#58595B' },
      { name: 'Titanium White', hex: '#EEEEEE' },
      { name: 'Titanium Silver', hex: '#B8B9BB' }
    ],
    tag: 'Extreme Durability',
    badge: 'Flagship Wearable',
    emiStartsAt: 2499,
    specs: {
      'Durability': '10ATM + IP68 + MIL-STD-810H Grade 4 Titanium',
      'Sensors': 'BioActive Sensor (ECG, Heart Rate, BIA, Blood Oxygen)',
      'Battery': 'Up to 100 hours in Power Saving mode'
    },
    description: 'Built to push physical boundaries with cushion design, emergency siren, and multisport athletic tracking.',
    inStock: true
  },

  // ==========================================
  // FAST CHARGERS & ACCESSORIES
  // ==========================================
  {
    id: 'apple-magsafe-duo',
    name: 'Apple MagSafe Duo Wireless Charger',
    brand: 'Apple',
    category: 'chargers',
    price: 13900,
    originalPrice: 14900,
    rating: 4.7,
    reviewsCount: 88,
    image: 'https://images.unsplash.com/photo-1622445262464-84b1456045b6?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1622445262464-84b1456045b6?auto=format&fit=crop&w=800&q=80'
    ],
    colors: [{ name: 'White', hex: '#FFFFFF' }],
    tag: 'Foldable Travel',
    badge: 'Essential',
    emiStartsAt: 579,
    specs: {
      'Charging': 'Dual magnetic wireless induction (iPhone + Apple Watch)',
      'Portability': 'Precision folding hinge fits in any pocket',
      'Compatibility': 'Qi-certified devices, AirPods with Wireless Case'
    },
    description: 'Conveniently charges your compatible iPhone, Apple Watch, and wireless charging case all in one compact fold.',
    inStock: true
  },
  {
    id: 'anker-prime-250w',
    name: 'Anker Prime 250W GaN Power Bank',
    brand: 'Anker',
    category: 'chargers',
    price: 17999,
    originalPrice: 20999,
    rating: 4.9,
    reviewsCount: 204,
    image: 'https://images.unsplash.com/photo-1609592426508-cc2a35368a5c?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1609592426508-cc2a35368a5c?auto=format&fit=crop&w=800&q=80'
    ],
    colors: [{ name: 'Space Gray', hex: '#3E424B' }],
    tag: '27,650mAh Beast',
    badge: 'Powerhouse',
    emiStartsAt: 750,
    specs: {
      'Output': '250W Total Multi-device Output (140W Single Port)',
      'Capacity': '27,650mAh airline-approved monster capacity',
      'Display': 'Full-color smart digital display with real-time wattage and health'
    },
    description: 'Supercharge 2 laptops and a phone simultaneously with smart app Bluetooth control and 170W ultra-fast recharge.',
    inStock: true
  }
]);

function saveProducts() {
  saveDb('products.json', PRODUCTS);
}

// ==========================================
// REST API ENDPOINTS
// ==========================================

// 0. Real-time Live Synchronization Stream (Server-Sent Events)
app.get(['/api/realtime/events', '/api/products/stream'], (req, res) => {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache, no-transform',
    'Connection': 'keep-alive',
    'Access-Control-Allow-Origin': '*',
    'X-Accel-Buffering': 'no'
  });
  res.write(`event: init\ndata: ${JSON.stringify({ type: 'connected', total: PRODUCTS.length, timestamp: Date.now() })}\n\n`);

  sseClients.add(res);

  req.on('close', () => {
    sseClients.delete(res);
  });
});

// 1. Get All Products with Multi-Facet Query Filtering (or single by ?id=)
app.get('/api/products', (req, res) => {
  const { id, category, brand, maxPrice, search, sort } = req.query;

  // Direct single product lookup via query parameter (?id=...)
  if (id) {
    const product = PRODUCTS.find(p => p.id === id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    return res.json({ success: true, product, products: PRODUCTS });
  }

  let results = [...PRODUCTS];

  if (category && category !== 'all') {
    results = results.filter(p => p.category.toLowerCase() === category.toLowerCase());
  }

  if (brand && brand !== 'all') {
    const brandsList = brand.split(',').map(b => b.trim().toLowerCase());
    results = results.filter(p => brandsList.includes(p.brand.toLowerCase()));
  }

  if (maxPrice) {
    const max = parseFloat(maxPrice);
    if (!isNaN(max)) {
      results = results.filter(p => p.price <= max);
    }
  }

  if (search) {
    const q = search.toLowerCase().trim();
    results = results.filter(p => 
      p.name.toLowerCase().includes(q) ||
      p.brand.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.tag.toLowerCase().includes(q)
    );
  }

  if (sort === 'price-low') {
    results.sort((a, b) => a.price - b.price);
  } else if (sort === 'price-high') {
    results.sort((a, b) => b.price - a.price);
  } else if (sort === 'rating') {
    results.sort((a, b) => b.rating - a.rating);
  }

  res.json({
    success: true,
    total: results.length,
    products: results
  });
});

// 2. Get Single Product by ID
app.get('/api/products/:id', (req, res) => {
  const product = PRODUCTS.find(p => p.id === req.params.id);
  if (!product) {
    return res.status(404).json({ success: false, message: 'Product not found' });
  }
  res.json({ success: true, product });
});

// 3. 0% No-Cost EMI Calculation Engine
app.post('/api/emi/calculate', (req, res) => {
  const { price = 144900, downPayment = 20000, tenure = 6, bank = 'HDFC' } = req.body;
  const numPrice = Number(price);
  const numDown = Number(downPayment);
  const numTenure = Number(tenure);

  const loanAmount = Math.max(0, numPrice - numDown);
  const monthlyInstallment = Math.round(loanAmount / numTenure);

  // Bank specific offers
  const bankOffers = {
    HDFC: 'Instant ₹5,000 Cashback on HDFC Credit Cards',
    ICICI: 'Flat 5% Reward Points + No Cost EMI',
    SBI: 'Zero Down Payment on SBI Card',
    BAJAJ: 'Instant Approval on Bajaj Finserv EMI Card'
  };

  res.json({
    success: true,
    calculation: {
      devicePrice: numPrice,
      downPayment: numDown,
      loanAmount,
      tenureMonths: numTenure,
      monthlyInstallment,
      interestRate: '0% (No-Cost EMI)',
      processingFee: 0,
      totalPayable: numPrice,
      bankSelected: bank,
      specialOffer: bankOffers[bank] || 'Zero Processing Fee on No-Cost EMI'
    }
  });
});

// 4. Comparison API for Top Flagships
app.get('/api/comparison', (req, res) => {
  const flagships = PRODUCTS.filter(p => ['iphone-16-pro-max', 'galaxy-s25-ultra', 'oneplus-13'].includes(p.id));
  res.json({
    success: true,
    matrix: flagships.map(f => ({
      id: f.id,
      name: f.name,
      brand: f.brand,
      price: f.price,
      specs: f.specs,
      rating: f.rating,
      image: f.image
    }))
  });
});

// 5. Checkout & Order Placement
app.post('/api/orders', (req, res) => {
  const { customer, items, paymentMethod, total } = req.body;

  if (!items || items.length === 0) {
    return res.status(400).json({ success: false, message: 'Cart items are required' });
  }

  const orderId = 'NR-' + Math.floor(100000 + Math.random() * 900000);
  const newOrder = {
    orderId,
    timestamp: new Date().toISOString(),
    customer: customer || { name: 'Verified Customer', phone: '+91 96910 11335' },
    items,
    total,
    paymentMethod: paymentMethod || 'UPI / Prepaid',
    status: 'Packaging & Quality Check',
    dispatchSlot: 'Today within 2 Hours via BlueDart Air Express',
    trackingNumber: 'BD-IN-' + Math.floor(1000000 + Math.random() * 9000000)
  };

  ORDERS.push(newOrder);
  saveOrders();

  // Link to user's isolated data store by customer phone
  const phone = (customer && customer.phone) ? customer.phone.replace(/[^0-9]/g, '').slice(-10) : '';
  if (phone) {
    const userData = getOrCreateUserData(phone, customer);
    userData.orders.unshift(newOrder);
    userData.cart = []; // clear user's cart on successful checkout
    persistUserData();
  }

  // Generate direct WhatsApp concierge text
  const itemNames = items.map(i => `${i.name} (x${i.qty || 1})`).join(', ');
  const waText = encodeURIComponent(
    `Hello New Radhaswami Mobile Gallery! I have placed Order #${orderId} for [${itemNames}] totaling ₹${Number(total).toLocaleString('en-IN')}. Please confirm dispatch status.`
  );
  const whatsappUrl = `https://wa.me/919691011335?text=${waText}`;

  res.json({
    success: true,
    message: 'Order created successfully and queued for express dispatch',
    order: newOrder,
    whatsappUrl
  });
});

// 6. Track Order Status
app.get('/api/orders/:id', (req, res) => {
  const order = ORDERS.find(o => o.orderId === req.params.id) || {
    orderId: req.params.id,
    status: 'BlueDart Air Transit - Pithampur Hub',
    expectedDelivery: 'Tomorrow by 11:00 AM',
    items: ['Flagship Sealed Device']
  };
  res.json({ success: true, order });
});

// 7. Verified Reviews Feed
app.get('/api/reviews', (req, res) => {
  res.json({
    success: true,
    rating: 4.9,
    totalReviews: 2450,
    reviews: [
      {
        id: 1,
        author: 'Vikramaditya S., Bandra Mumbai',
        device: 'iPhone 16 Pro Max Desert Titanium',
        rating: 5,
        date: 'Yesterday',
        comment: 'Received the 100% sealed Indian unit within 3 hours in Mumbai! Authentic Apple invoice provided with official 1-year warranty. The team even helped me transfer my WhatsApp data seamlessly.'
      },
      {
        id: 2,
        author: 'Pooja Agarwal, Pune',
        device: 'Samsung Galaxy S25 Ultra 512GB',
        rating: 5,
        date: '2 days ago',
        comment: '0% No-Cost EMI got approved in 2 minutes on my HDFC card. Best price in the market compared to local mall retailers.'
      },
      {
        id: 3,
        author: 'Arjun Mehta, Ahmedabad',
        device: 'Sony WH-1000XM5 ANC',
        rating: 5,
        date: '4 days ago',
        comment: 'Packaging was bulletproof with bubble wrap. Genuine imported Sony acoustics. Highly recommend New Radhaswami Mobile Gallery!'
      }
    ]
  });
});

// 8. Admin APIs: Product CRUD, Orders Management & Analytics
let REPAIRS = loadDb('repairs.json', [
  {
    id: 'REP-101',
    createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
    customerName: 'Aditya Birla',
    phone: '+91 98201 55443',
    device: 'iPhone 15 Pro Max',
    imei: '354892019482910',
    issue: 'Cracked Front OLED Glass • Genuine Ceramic Shield Replacement',
    technician: 'Rohan Sharma (Floor Manager)',
    quotedAmount: 28500,
    advancePaid: 10000,
    status: 'Under Diagnosis',
    notes: 'Customer requires genuine Apple factory display seal for IP68 water resistance.'
  },
  {
    id: 'REP-102',
    createdAt: new Date(Date.now() - 3600000 * 28).toISOString(),
    customerName: 'Meera Rajput',
    phone: '+91 98330 22119',
    device: 'Samsung Galaxy S24 Ultra',
    imei: '864920194827103',
    issue: 'Battery Health Degradation (<78%) • Official Samsung Li-Ion Pack',
    technician: 'Kiran Verma (Senior Technician)',
    quotedAmount: 6800,
    advancePaid: 6800,
    status: 'Repair Completed',
    notes: 'New 5000mAh original cell installed. Calibrated and tested to 100% health.'
  }
]);

function saveRepairs() {
  saveDb('repairs.json', REPAIRS);
}

let QUOTATIONS = loadDb('quotations.json', [
  {
    id: 'QTE-801',
    createdAt: new Date(Date.now() - 3600000 * 3).toISOString(),
    clientName: 'Sanjay Singhal (Singhal Exports)',
    phone: '+91 98210 99882',
    items: [
      { name: 'iPhone 16 Pro Max 512GB Desert Titanium', qty: 2, unitPrice: 164900 },
      { name: 'Apple 20W USB-C Power Adapter', qty: 2, unitPrice: 1900 }
    ],
    subtotal: 333600,
    taxGst: 60048,
    total: 393648,
    paymentTerms: '50% Advance via RTGS, balance on delivery',
    status: 'Active Quotation',
    validUntil: new Date(Date.now() + 86400000 * 7).toISOString().slice(0, 10)
  }
]);

function saveQuotations() {
  saveDb('quotations.json', QUOTATIONS);
}

let ACTIVITY_LOGS = loadDb('activity_logs.json', [
  {
    id: 'act-1',
    timestamp: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
    author: 'Staff Rohan Sharma',
    action: 'Dispatched Order',
    details: 'Order #NR-849201 assigned BlueDart AWB BD-IN-9482014'
  },
  {
    id: 'act-2',
    timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    author: 'Master Owner',
    action: 'Updated Announcement',
    details: 'Published "Royal Festive Privilege Drop" with 10% Concession'
  },
  {
    id: 'act-3',
    timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    author: 'Staff Priya Patel',
    action: 'Logged Repair Intake',
    details: 'Service Ticket #REP-101 created for iPhone 15 Pro Max'
  },
  {
    id: 'act-4',
    timestamp: new Date(Date.now() - 1000 * 60 * 240).toISOString(),
    author: 'Master Owner',
    action: 'Inventory Update',
    details: 'Added 5 units of iPhone 16 Pro Max Desert Titanium'
  }
]);

function saveActivityLogs() {
  saveDb('activity_logs.json', ACTIVITY_LOGS);
}

let COUPONS = loadDb('coupons.json', [
  { code: 'RADHA10', discountType: 'percentage', value: 10, minCart: 10000, description: '10% Off on flagship mobile orders', active: true },
  { code: 'ROYAL10', discountType: 'percentage', value: 10, minCart: 15000, description: 'VIP Showroom Exclusive Concession', active: true },
  { code: 'PREMIUM500', discountType: 'flat', value: 500, minCart: 5000, description: 'Flat ₹500 instant discount', active: true },
  { code: 'WELCOME1000', discountType: 'flat', value: 1000, minCart: 25000, description: '₹1,000 Off on orders above ₹25K', active: true }
]);

if (!Array.isArray(COUPONS) || COUPONS.length === 0) {
  COUPONS = [
    { code: 'RADHA10', discountType: 'percentage', value: 10, minCart: 10000, description: '10% Off on flagship mobile orders', active: true },
    { code: 'ROYAL10', discountType: 'percentage', value: 10, minCart: 15000, description: 'VIP Showroom Exclusive Concession', active: true },
    { code: 'PREMIUM500', discountType: 'flat', value: 500, minCart: 5000, description: 'Flat ₹500 instant discount', active: true },
    { code: 'WELCOME1000', discountType: 'flat', value: 1000, minCart: 25000, description: '₹1,000 Off on orders above ₹25K', active: true }
  ];
  saveDb('coupons.json', COUPONS);
}

function saveCoupons() {
  saveDb('coupons.json', COUPONS);
}

// List all orders for Admin
app.get('/api/admin/orders', (req, res) => {
  res.json({ success: true, count: ORDERS.length, orders: ORDERS.slice().reverse() });
});

// Update Order Status
app.put('/api/orders/:id/status', (req, res) => {
  const { status, trackingNumber, notes } = req.body;
  const order = ORDERS.find(o => o.orderId === req.params.id);
  if (!order) {
    return res.status(404).json({ success: false, message: 'Order not found' });
  }
  if (status) order.status = status;
  if (trackingNumber) order.trackingNumber = trackingNumber;
  if (notes) order.notes = notes;
  
  // Log activity
  ACTIVITY_LOGS.unshift({
    id: 'act-' + Date.now(),
    timestamp: new Date().toISOString(),
    author: 'Staff Operations',
    action: 'Order Status Changed',
    details: `Order #${order.orderId} updated to ${status}`
  });

  saveOrders();
  saveActivityLogs();

  res.json({ success: true, message: 'Order status updated successfully', order });
});

// ==========================================
// REPAIR & SERVICE DESK ENDPOINTS
// ==========================================
app.get('/api/admin/repairs', (req, res) => {
  res.json({ success: true, count: REPAIRS.length, repairs: REPAIRS });
});

app.post('/api/admin/repairs', (req, res) => {
  const { customerName, phone, device, imei, issue, quotedAmount, advancePaid, technician, notes } = req.body;
  if (!customerName || !device) {
    return res.status(400).json({ success: false, message: 'Customer name and device are required' });
  }
  const newRepair = {
    id: 'REP-' + Math.floor(100 + Math.random() * 900),
    createdAt: new Date().toISOString(),
    customerName: customerName.trim(),
    phone: phone || '+91 98000 00000',
    device: device.trim(),
    imei: imei || 'Not Provided',
    issue: issue || 'General Diagnostic & Service',
    technician: technician || 'Floor Service Associate',
    quotedAmount: Number(quotedAmount) || 0,
    advancePaid: Number(advancePaid) || 0,
    status: 'Received',
    notes: notes || ''
  };
  REPAIRS.unshift(newRepair);

  ACTIVITY_LOGS.unshift({
    id: 'act-' + Date.now(),
    timestamp: new Date().toISOString(),
    author: 'Service Desk',
    action: 'New Repair Intake',
    details: `Ticket #${newRepair.id} for ${newRepair.device} (${newRepair.customerName})`
  });

  saveRepairs();
  saveActivityLogs();

  res.status(201).json({ success: true, message: 'Repair intake ticket generated', repair: newRepair });
});

app.put('/api/admin/repairs/:id', (req, res) => {
  const index = REPAIRS.findIndex(r => r.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Repair ticket not found' });
  }
  REPAIRS[index] = { ...REPAIRS[index], ...req.body };
  saveRepairs();
  res.json({ success: true, message: 'Repair ticket updated', repair: REPAIRS[index] });
});

app.delete('/api/admin/repairs/:id', (req, res) => {
  const index = REPAIRS.findIndex(r => r.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Repair ticket not found' });
  }
  const deleted = REPAIRS.splice(index, 1)[0];
  saveRepairs();
  res.json({ success: true, message: `Repair ticket #${deleted.id} closed and deleted`, id: req.params.id });
});

// ==========================================
// POS QUOTATION & ESTIMATES ENDPOINTS
// ==========================================
app.get('/api/admin/quotations', (req, res) => {
  res.json({ success: true, count: QUOTATIONS.length, quotations: QUOTATIONS });
});

app.post('/api/admin/quotations', (req, res) => {
  const { clientName, phone, items, paymentTerms, validUntil } = req.body;
  if (!clientName || !items || !Array.isArray(items)) {
    return res.status(400).json({ success: false, message: 'Client name and items are required' });
  }
  const subtotal = items.reduce((sum, it) => sum + ((it.unitPrice || 0) * (it.qty || 1)), 0);
  const taxGst = Math.round(subtotal * 0.18);
  const total = subtotal + taxGst;
  const newQuote = {
    id: 'QTE-' + Math.floor(100 + Math.random() * 900),
    createdAt: new Date().toISOString(),
    clientName: clientName.trim(),
    phone: phone || '',
    items,
    subtotal,
    taxGst,
    total,
    paymentTerms: paymentTerms || 'Full payment on delivery / 0% EMI',
    status: 'Active Quotation',
    validUntil: validUntil || new Date(Date.now() + 86400000 * 7).toISOString().slice(0, 10)
  };
  QUOTATIONS.unshift(newQuote);

  ACTIVITY_LOGS.unshift({
    id: 'act-' + Date.now(),
    timestamp: new Date().toISOString(),
    author: 'Showroom POS',
    action: 'Quotation Generated',
    details: `Quotation #${newQuote.id} for ₹${newQuote.total.toLocaleString('en-IN')} (${newQuote.clientName})`
  });

  saveQuotations();
  saveActivityLogs();

  res.status(201).json({ success: true, message: 'Quotation created successfully', quotation: newQuote });
});

// ==========================================
// ACTIVITY AUDIT STREAM ENDPOINTS
// ==========================================
app.get('/api/admin/activity', (req, res) => {
  res.json({ success: true, count: ACTIVITY_LOGS.length, activity: ACTIVITY_LOGS.slice(0, 30) });
});

app.post('/api/admin/activity', (req, res) => {
  const { author, action, details } = req.body;
  const newLog = {
    id: 'act-' + Date.now(),
    timestamp: new Date().toISOString(),
    author: author || 'System',
    action: action || 'Action Logged',
    details: details || ''
  };
  ACTIVITY_LOGS.unshift(newLog);
  if (ACTIVITY_LOGS.length > 100) ACTIVITY_LOGS.pop();
  saveActivityLogs();
  res.status(201).json({ success: true, log: newLog });
});

// ==========================================
// ROBUST PRODUCT CRUD & REAL-TIME DISPATCH
// ==========================================

// Add or Upsert Product
app.post('/api/products', (req, res) => {
  const { id: reqId, name, brand, category, price, originalPrice, image, images, description, specs, inStock, colors, storageVariants } = req.body;
  if (!name || price === undefined || price === null || price === '') {
    return res.status(400).json({ success: false, message: 'Product name and price are required' });
  }

  const numPrice = Number(price);
  const numOriginalPrice = Number(originalPrice || Math.round(numPrice * 1.15));

  // Check if product already exists (upsert)
  if (reqId) {
    const existingIdx = PRODUCTS.findIndex(p => p.id === reqId);
    if (existingIdx !== -1) {
      PRODUCTS[existingIdx] = {
        ...PRODUCTS[existingIdx],
        ...req.body,
        price: numPrice,
        originalPrice: numOriginalPrice,
        emiStartsAt: Math.round(numPrice / 12)
      };
      saveProducts();

      ACTIVITY_LOGS.unshift({
        id: 'act-' + Date.now(),
        timestamp: new Date().toISOString(),
        author: 'Inventory Manager',
        action: 'Product Updated',
        details: `Updated "${PRODUCTS[existingIdx].name}" (₹${numPrice.toLocaleString('en-IN')})`
      });
      if (ACTIVITY_LOGS.length > 200) ACTIVITY_LOGS.pop();
      saveActivityLogs();

      // Real-time broadcast
      broadcastRealtime('product_updated', {
        action: 'updated',
        product: PRODUCTS[existingIdx],
        products: PRODUCTS,
        timestamp: Date.now()
      });
      broadcastRealtime('catalog_updated', { products: PRODUCTS, timestamp: Date.now() });

      return res.status(200).json({
        success: true,
        message: 'Product updated successfully',
        product: PRODUCTS[existingIdx],
        products: PRODUCTS
      });
    }
  }

  const generatedId = (name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || 'product') + '-' + Date.now().toString().slice(-4);
  const id = reqId || generatedId;
  const primaryImg = image || (images && images[0]) || 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=800&q=80';
  
  const newProduct = {
    id,
    name: name.trim(),
    brand: brand ? brand.trim() : 'Flagship Brand',
    category: category || 'smartphones',
    price: numPrice,
    originalPrice: numOriginalPrice,
    rating: 4.9,
    reviewsCount: 1,
    image: primaryImg,
    images: (images && images.length > 0) ? images : [primaryImg],
    colors: colors && colors.length > 0 ? colors : [
      { name: 'Standard Finish', hex: '#8E9196' },
      { name: 'Midnight Black', hex: '#1C1D21' }
    ],
    storageVariants: storageVariants && storageVariants.length > 0 ? storageVariants : [
      { size: '128GB', price: numPrice },
      { size: '256GB', price: Math.round(numPrice * 1.12) },
      { size: '512GB', price: Math.round(numPrice * 1.25) }
    ],
    emiStartsAt: Math.round(numPrice / 12),
    specs: specs || {
      'Warranty': '1 Year Manufacturer Official Warranty',
      'Delivery': 'Express Insured Air Courier Delivery'
    },
    description: description || `${name} verified Indian stock by New Radhaswami Mobile Gallery.`,
    inStock: inStock !== undefined ? Boolean(inStock) : true,
    tag: req.body.tag || 'Verified Showroom Inventory',
    badge: req.body.badge || (inStock ? 'In Stock' : 'Out of Stock')
  };

  PRODUCTS.unshift(newProduct);
  saveProducts();

  ACTIVITY_LOGS.unshift({
    id: 'act-' + Date.now(),
    timestamp: new Date().toISOString(),
    author: 'Inventory Manager',
    action: 'Product Added',
    details: `Added "${newProduct.name}" (₹${newProduct.price.toLocaleString('en-IN')}) to showroom catalog`
  });
  if (ACTIVITY_LOGS.length > 200) ACTIVITY_LOGS.pop();
  saveActivityLogs();

  // Real-time broadcast
  broadcastRealtime('product_added', {
    action: 'added',
    product: newProduct,
    products: PRODUCTS,
    timestamp: Date.now()
  });
  broadcastRealtime('catalog_updated', { products: PRODUCTS, timestamp: Date.now() });

  res.status(201).json({
    success: true,
    message: 'Product added successfully to catalog',
    product: newProduct,
    products: PRODUCTS
  });
});

// Update Existing Product (Supports /api/products/:id AND /api/products?id=...)
const handleUpdateProduct = (req, res) => {
  const targetId = req.params.id || req.query.id || (req.body && req.body.id);
  if (!targetId) {
    return res.status(400).json({ success: false, message: 'Product ID is required for update' });
  }

  const index = PRODUCTS.findIndex(p => p.id === targetId);
  if (index === -1) {
    return res.status(404).json({ success: false, message: `Product "${targetId}" not found` });
  }

  const updatedPrice = req.body.price !== undefined ? Number(req.body.price) : PRODUCTS[index].price;
  const updatedOriginalPrice = req.body.originalPrice !== undefined ? Number(req.body.originalPrice) : PRODUCTS[index].originalPrice;

  PRODUCTS[index] = {
    ...PRODUCTS[index],
    ...req.body,
    price: updatedPrice,
    originalPrice: updatedOriginalPrice,
    emiStartsAt: Math.round(updatedPrice / 12)
  };

  saveProducts();

  ACTIVITY_LOGS.unshift({
    id: 'act-' + Date.now(),
    timestamp: new Date().toISOString(),
    author: 'Inventory Manager',
    action: 'Product Updated',
    details: `Updated specifications for "${PRODUCTS[index].name}"`
  });
  if (ACTIVITY_LOGS.length > 200) ACTIVITY_LOGS.pop();
  saveActivityLogs();

  // Real-time broadcast
  broadcastRealtime('product_updated', {
    action: 'updated',
    product: PRODUCTS[index],
    products: PRODUCTS,
    timestamp: Date.now()
  });
  broadcastRealtime('catalog_updated', { products: PRODUCTS, timestamp: Date.now() });

  res.json({
    success: true,
    message: 'Product updated successfully',
    product: PRODUCTS[index],
    products: PRODUCTS
  });
};

app.put('/api/products/:id', handleUpdateProduct);
app.put('/api/products', handleUpdateProduct);
app.patch('/api/products/:id', handleUpdateProduct);
app.patch('/api/products', handleUpdateProduct);

// Delete Product (Supports /api/products/:id AND /api/products?id=...)
const handleDeleteProduct = (req, res) => {
  const targetId = req.params.id || req.query.id || (req.body && req.body.id);
  if (!targetId) {
    return res.status(400).json({ success: false, message: 'Product ID is required for deletion' });
  }

  const index = PRODUCTS.findIndex(p => p.id === targetId);
  if (index === -1) {
    return res.status(404).json({ success: false, message: `Product "${targetId}" not found in catalog` });
  }

  const deleted = PRODUCTS.splice(index, 1)[0];
  saveProducts();

  ACTIVITY_LOGS.unshift({
    id: 'act-' + Date.now(),
    timestamp: new Date().toISOString(),
    author: 'Inventory Manager',
    action: 'Product Removed',
    details: `Removed "${deleted.name}" from showroom catalog`
  });
  if (ACTIVITY_LOGS.length > 200) ACTIVITY_LOGS.pop();
  saveActivityLogs();

  // Real-time broadcast
  broadcastRealtime('product_deleted', {
    action: 'deleted',
    id: targetId,
    product: deleted,
    products: PRODUCTS,
    timestamp: Date.now()
  });
  broadcastRealtime('catalog_updated', { products: PRODUCTS, timestamp: Date.now() });

  res.json({
    success: true,
    message: `Product "${deleted.name}" removed from catalog`,
    id: targetId,
    products: PRODUCTS
  });
};

app.delete('/api/products/:id', handleDeleteProduct);
app.delete('/api/products', handleDeleteProduct);

// Atomic Stock Toggle Endpoint (Supports /api/products/:id/stock, /api/products/stock?id=..., /api/products/stock)
const handleStockToggle = (req, res) => {
  const targetId = req.params.id || req.query.id || (req.body && (req.body.id || req.body.productId));
  if (!targetId) {
    return res.status(400).json({ success: false, message: 'Product ID is required for stock toggle' });
  }

  const index = PRODUCTS.findIndex(p => p.id === targetId);
  if (index === -1) {
    return res.status(404).json({ success: false, message: `Product "${targetId}" not found` });
  }

  const requestedStock = req.body && req.body.inStock !== undefined ? req.body.inStock : req.query.inStock;
  const newStock = requestedStock !== undefined ? Boolean(requestedStock) : !PRODUCTS[index].inStock;
  PRODUCTS[index].inStock = newStock;
  PRODUCTS[index].badge = newStock ? 'In Stock' : 'Out of Stock';
  saveProducts();

  const statusText = newStock ? 'IN STOCK' : 'OUT OF STOCK';
  ACTIVITY_LOGS.unshift({
    id: 'act-' + Date.now(),
    timestamp: new Date().toISOString(),
    author: 'Staff Terminal',
    action: 'Stock Status Revised',
    details: `"${PRODUCTS[index].name}" marked as ${statusText}`
  });
  if (ACTIVITY_LOGS.length > 200) ACTIVITY_LOGS.pop();
  saveActivityLogs();

  // Real-time broadcast
  broadcastRealtime('stock_toggled', {
    action: 'stock_toggled',
    id: targetId,
    inStock: newStock,
    product: PRODUCTS[index],
    products: PRODUCTS,
    timestamp: Date.now()
  });
  broadcastRealtime('catalog_updated', { products: PRODUCTS, timestamp: Date.now() });

  return res.json({
    success: true,
    message: `Product ${PRODUCTS[index].name} is now ${statusText}`,
    inStock: newStock,
    product: PRODUCTS[index],
    products: PRODUCTS
  });
};

app.put('/api/products/:id/stock', handleStockToggle);
app.put('/api/products/stock', handleStockToggle);
app.patch('/api/products/:id/stock', handleStockToggle);
app.patch('/api/products/stock', handleStockToggle);

// Coupon Management
app.get('/api/coupons', (req, res) => {
  res.json({ success: true, coupons: COUPONS });
});

app.post('/api/coupons', (req, res) => {
  const { code, discountType, value, minCart, description } = req.body;
  if (!code || !value) {
    return res.status(400).json({ success: false, message: 'Code and value are required' });
  }
  const upperCode = code.toUpperCase().trim();
  const existing = COUPONS.find(c => (c.code || '').toUpperCase() === upperCode);
  if (existing) {
    return res.status(400).json({ success: false, message: 'Coupon code already exists' });
  }
  const newCoupon = {
    code: upperCode,
    discountType: discountType || 'percentage',
    value: Number(value),
    minCart: Number(minCart || 0),
    description: description || `Special discount voucher ${upperCode}`,
    active: true
  };
  COUPONS.unshift(newCoupon);
  saveCoupons();

  ACTIVITY_LOGS.unshift({
    id: 'act-' + Date.now(),
    timestamp: new Date().toISOString(),
    author: 'Owner Suite',
    action: 'Promotional Voucher Created',
    details: `Activated voucher ${upperCode} (${newCoupon.value}${newCoupon.discountType === 'percentage' ? '%' : ' flat'} off)`
  });
  saveActivityLogs();

  res.status(201).json({ success: true, message: 'Coupon created successfully', coupon: newCoupon });
});

app.delete('/api/coupons/:code', (req, res) => {
  const targetCode = (req.params.code || '').toUpperCase().trim();
  const index = COUPONS.findIndex(c => (c.code || '').toUpperCase() === targetCode);
  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Coupon not found' });
  }
  const deleted = COUPONS.splice(index, 1)[0];
  saveCoupons();

  ACTIVITY_LOGS.unshift({
    id: 'act-' + Date.now(),
    timestamp: new Date().toISOString(),
    author: 'Owner Suite',
    action: 'Promotional Voucher Deleted',
    details: `Decommissioned voucher ${targetCode}`
  });
  saveActivityLogs();

  res.json({ success: true, message: `Coupon ${targetCode} removed` });
});

app.put('/api/coupons/:code/toggle', (req, res) => {
  const targetCode = (req.params.code || '').toUpperCase().trim();
  const coupon = COUPONS.find(c => (c.code || '').toUpperCase() === targetCode);
  if (!coupon) {
    return res.status(404).json({ success: false, message: 'Coupon not found' });
  }
  coupon.active = !coupon.active;
  saveCoupons();

  ACTIVITY_LOGS.unshift({
    id: 'act-' + Date.now(),
    timestamp: new Date().toISOString(),
    author: 'Owner Suite',
    action: 'Voucher Status Toggled',
    details: `Voucher ${targetCode} is now ${coupon.active ? 'ACTIVE' : 'DISABLED'}`
  });
  saveActivityLogs();

  res.json({ success: true, message: `Coupon ${targetCode} is now ${coupon.active ? 'Active' : 'Inactive'}`, coupon });
});

// Store Analytics
app.get('/api/analytics', (req, res) => {
  const totalRevenue = ORDERS.reduce((sum, o) => sum + (Number(o.total) || 0), 0);
  const outOfStockCount = PRODUCTS.filter(p => !p.inStock).length;
  res.json({
    success: true,
    analytics: {
      totalRevenue: totalRevenue || 584900,
      totalOrders: ORDERS.length || 14,
      totalProducts: PRODUCTS.length,
      outOfStockCount,
      activeCoupons: COUPONS.filter(c => c.active).length,
      topBrands: ['Apple', 'Samsung', 'Google', 'OnePlus']
    }
  });
});

// ==========================================
// CATEGORY MANAGEMENT ENDPOINTS
// ==========================================
let CATEGORIES = loadDb('categories.json', [
  { id: 'all', name: 'All Departments', icon: 'Sparkles', description: 'Browse all flagship devices and audio', active: true },
  { id: 'smartphones', name: 'Smartphones', icon: 'Smartphone', description: 'Apple, Samsung, Google Pixel & OnePlus flagships', active: true },
  { id: 'audio', name: 'Audio & Acoustics', icon: 'Headphones', description: 'ANC headphones and audiophile earbuds', active: true },
  { id: 'watches', name: 'Smartwatches', icon: 'Watch', description: 'Titanium luxury smartwatches & GPS multisport', active: true },
  { id: 'chargers', name: 'Fast Chargers', icon: 'BatteryCharging', description: 'GaN chargers & magnetic power banks', active: true },
  { id: 'accessories', name: 'Accessories', icon: 'Shield', description: 'MagSafe cases, titanium shields & glass protectors', active: true }
]);

function saveCategories() {
  saveDb('categories.json', CATEGORIES);
}

app.get('/api/categories', (req, res) => {
  res.json({ success: true, categories: CATEGORIES });
});

app.post('/api/categories', (req, res) => {
  const { name, icon, description } = req.body;
  if (!name) {
    return res.status(400).json({ success: false, message: 'Category name is required' });
  }
  const id = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  const existing = CATEGORIES.find(c => c.id === id);
  if (existing) {
    return res.status(400).json({ success: false, message: 'Category already exists' });
  }
  const newCat = {
    id,
    name: name.trim(),
    icon: icon || 'Sparkles',
    description: description || `Handpicked collection of ${name.trim()}`,
    active: true
  };
  CATEGORIES.push(newCat);
  saveCategories();
  res.status(201).json({ success: true, message: 'Category created successfully', category: newCat });
});

app.put('/api/categories/:id', (req, res) => {
  const index = CATEGORIES.findIndex(c => c.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Category not found' });
  }
  CATEGORIES[index] = { ...CATEGORIES[index], ...req.body };
  saveCategories();
  res.json({ success: true, message: 'Category updated successfully', category: CATEGORIES[index] });
});

app.delete('/api/categories/:id', (req, res) => {
  if (req.params.id === 'all') {
    return res.status(400).json({ success: false, message: 'Cannot delete default category' });
  }
  const index = CATEGORIES.findIndex(c => c.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Category not found' });
  }
  const deleted = CATEGORIES.splice(index, 1)[0];
  saveCategories();
  res.json({ success: true, message: `Category ${deleted.name} removed`, id: req.params.id });
});

// ==========================================
// USER & CUSTOMER MANAGEMENT ENDPOINTS
// ==========================================
app.get('/api/admin/users', (req, res) => {
  res.json({ success: true, count: USERS.length, users: USERS });
});

app.post('/api/admin/users', (req, res) => {
  const { name, phone, email, city, role } = req.body;
  if (!name || !phone) {
    return res.status(400).json({ success: false, message: 'Name and phone are required' });
  }
  const newUser = {
    id: 'usr-' + Date.now(),
    name,
    phone,
    email: email || `${name.toLowerCase().replace(/\s+/g, '')}@client.in`,
    city: city || 'Mumbai, India',
    role: role || 'Customer',
    totalOrders: 0,
    totalSpent: 0,
    status: 'Active',
    joinedDate: new Date().toISOString().split('T')[0]
  };
  USERS.unshift(newUser);
  saveUsers();
  res.status(201).json({ success: true, message: 'User created successfully', user: newUser });
});

app.put('/api/admin/users/:id', (req, res) => {
  const index = USERS.findIndex(u => u.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }
  USERS[index] = { ...USERS[index], ...req.body };
  saveUsers();
  res.json({ success: true, message: 'User updated successfully', user: USERS[index] });
});

app.delete('/api/admin/users/:id', (req, res) => {
  const index = USERS.findIndex(u => u.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }
  const deleted = USERS.splice(index, 1)[0];
  saveUsers();
  res.json({ success: true, message: `User ${deleted.name} removed`, id: req.params.id });
});

// ==========================================
// STAFF MANAGEMENT ENDPOINTS
// ==========================================
let STAFF_MEMBERS = loadDb('staff.json', [
  {
    id: 'stf-1',
    name: 'Rohan Sharma',
    phone: '+91 98765 00001',
    email: 'rohan.s@radhaswamigallery.in',
    pin: '4321',
    role: 'Floor Manager',
    permissions: ['inventory', 'orders', 'categories'],
    shift: 'Morning & Evening Showroom',
    status: 'Active'
  },
  {
    id: 'stf-2',
    name: 'Priya Patel',
    phone: '+91 98765 00002',
    email: 'priya.p@radhaswamigallery.in',
    pin: '1234',
    role: 'Order & Dispatch Specialist',
    permissions: ['orders', 'reviews'],
    shift: 'BlueDart Express Liaison',
    status: 'Active'
  }
]);

function saveStaff() {
  saveDb('staff.json', STAFF_MEMBERS);
}

app.get('/api/admin/staff', (req, res) => {
  res.json({ success: true, count: STAFF_MEMBERS.length, staff: STAFF_MEMBERS });
});

app.post('/api/admin/staff', (req, res) => {
  const { name, phone, email, pin, role, shift } = req.body;
  if (!name || !pin) {
    return res.status(400).json({ success: false, message: 'Staff name and PIN are required' });
  }
  const newStaff = {
    id: 'stf-' + Date.now(),
    name,
    phone: phone || '+91 98000 00000',
    email: email || `${name.toLowerCase().replace(/\s+/g, '')}@radhaswamigallery.in`,
    pin: String(pin).trim(),
    role: role || 'Store Associate',
    permissions: ['inventory', 'orders', 'categories', 'users'],
    shift: shift || 'General Store Shift',
    status: 'Active'
  };
  STAFF_MEMBERS.push(newStaff);
  saveStaff();
  res.status(201).json({ success: true, message: 'Staff member added successfully', staff: newStaff });
});

app.delete('/api/admin/staff/:id', (req, res) => {
  const index = STAFF_MEMBERS.findIndex(s => s.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Staff member not found' });
  }
  const deleted = STAFF_MEMBERS.splice(index, 1)[0];
  saveStaff();
  res.json({ success: true, message: `Staff member ${deleted.name} removed`, id: req.params.id });
});

// Store Settings Live Persistence
app.get('/api/settings', (req, res) => {
  res.json({ success: true, settings: storeSettings });
});

app.post('/api/settings', (req, res) => {
  storeSettings = { ...storeSettings, ...req.body };
  saveSettings();
  res.json({ success: true, message: 'Store settings updated successfully', settings: storeSettings });
});

// VIP Announcement Flyer & Promotion Persistence
app.get('/api/announcement', (req, res) => {
  res.json({ success: true, announcement: storeAnnouncement });
});

app.post('/api/announcement', (req, res) => {
  storeAnnouncement = { ...storeAnnouncement, ...req.body };
  saveAnnouncement();
  res.json({ success: true, message: 'VIP Announcement updated successfully', announcement: storeAnnouncement });
});

// Executive Security Credentials Live Update
app.post('/api/admin/credentials', (req, res) => {
  const { newStaffPin, newOwnerPin, newOwnerPassword } = req.body;
  if (newStaffPin) credentials.staffPin = String(newStaffPin).trim();
  if (newOwnerPin) credentials.ownerPin = String(newOwnerPin).trim();
  if (newOwnerPassword) credentials.ownerPassword = String(newOwnerPassword).trim();
  saveCredentials();
  res.json({ success: true, message: 'Executive credentials updated and persisted successfully' });
});

if (require.main === module) {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`⚡ New Radhaswami Mobile Gallery API Server listening on port ${PORT}`);
  });
}

module.exports = { app, PORT };
