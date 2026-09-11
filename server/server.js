const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// In-Memory Database for Flagship Inventory
const PRODUCTS = [
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
    description: 'Forged in titanium with the boundary-pushing A18 Pro chip, Camera Control button, and unmatched battery endurance.',
    inStock: true
  },
  {
    id: 'galaxy-s25-ultra',
    name: 'Samsung Galaxy S25 Ultra',
    brand: 'Samsung',
    category: 'smartphones',
    price: 129999,
    originalPrice: 139999,
    rating: 4.8,
    reviewsCount: 289,
    image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=800&q=80',
    colors: [
      { name: 'Titanium Silver', hex: '#B8B9BB' },
      { name: 'Titanium Black', hex: '#2B2B2C' },
      { name: 'Titanium Jade', hex: '#63796E' }
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
      'Camera': '200MP Wide + 50MP 5x + 50MP Ultra-Wide',
      'Display': '6.8" Dynamic AMOLED 2X 120Hz Anti-Reflective',
      'Stylus': 'Built-in Bluetooth S-Pen with Remote Gestures'
    },
    description: 'The pinnacle of mobile productivity and nightography with built-in S-Pen and next-gen Galaxy AI superpowers.',
    inStock: true
  },
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
      'Camera': 'Triple 50MP Hasselblad Camera System',
      'Display': '6.82" 2K 120Hz Oriental Screen 4500 nits',
      'Battery': '6000mAh Glacier Battery with 100W SUPERVOOC'
    },
    description: 'Monster performance with massive 6000mAh battery, 2K Oriental Screen, and Hasselblad color mastery.',
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
    id: 'apple-watch-ultra-2',
    name: 'Apple Watch Ultra 2',
    brand: 'Apple',
    category: 'watches',
    price: 89900,
    originalPrice: 94900,
    rating: 4.9,
    reviewsCount: 164,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
    colors: [
      { name: 'Natural Titanium', hex: '#9E9B94' },
      { name: 'Black Titanium', hex: '#28282A' }
    ],
    tag: 'Rugged Titanium',
    badge: 'Pro Pick',
    emiStartsAt: 3745,
    specs: {
      'Case': '49mm Aerospace Grade Titanium',
      'Display': '3000 nits brightest display with Night Mode',
      'GPS': 'Precision dual-frequency GPS (L1 and L5)',
      'Battery': 'Up to 72 hours in Low Power Mode'
    },
    description: 'The ultimate sports and adventure smartwatch with dual-frequency GPS, 100m water resistance, and EN13319 dive computer certification.',
    inStock: true
  },
  {
    id: 'galaxy-watch-ultra',
    name: 'Galaxy Watch Ultra LTE',
    brand: 'Samsung',
    category: 'watches',
    price: 59999,
    originalPrice: 64999,
    rating: 4.7,
    reviewsCount: 94,
    image: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=800&q=80',
    colors: [
      { name: 'Titanium Gray', hex: '#7E8085' },
      { name: 'Titanium White', hex: '#ECEEF1' }
    ],
    tag: 'Outdoor Extreme',
    badge: 'LTE Ready',
    emiStartsAt: 2499,
    specs: {
      'Case': 'Grade 4 Titanium with Cushion Protection',
      'Connectivity': 'Standalone 4G LTE Calling & Data',
      'Sensors': 'BioActive sensor with sleep apnea & energy score',
      'Rating': '10ATM Water Resistance'
    },
    description: 'Military-grade endurance smartwatch with standalone 4G calling and AI-driven energy performance metrics.',
    inStock: true
  },
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
    colors: [
      { name: 'Silver Blade', hex: '#A8ABB2' },
      { name: 'White Blade', hex: '#FAFAFC' }
    ],
    tag: 'Blade Light Design',
    badge: 'New Launch',
    emiStartsAt: 833,
    specs: {
      'Acoustic': 'Dual amplifier + 2-way coaxial planar speakers',
      'Design': 'Blade Lights with tactile pinch gesture control',
      'AI': 'Live Interpreter mode translation directly in ear',
      'Audio': '24-bit 96kHz Hi-Fi studio master streaming'
    },
    description: 'Distinctive blade lighting design with dual amplifiers for studio master audio and real-time live interpretation.',
    inStock: true
  },
  {
    id: 'anker-100w-gan-charger',
    name: 'Anker Prime 100W GaN Wall Charger',
    brand: 'Anker',
    category: 'accessories',
    price: 5499,
    originalPrice: 6999,
    rating: 4.8,
    reviewsCount: 142,
    image: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=800&q=80',
    colors: [{ name: 'Space Grey', hex: '#3B3D44' }],
    tag: '100W Ultra Compact',
    badge: 'Pro Accessory',
    emiStartsAt: 229,
    specs: {
      'Output': '100W Max Fast Multi-Device Delivery (PD 3.0)',
      'Ports': '2x USB-C + 1x USB-A Simultaneous Charging',
      'Safety': 'ActiveShield 2.0 temperature monitoring 3M times/day',
      'Form Factor': '43% smaller than original Apple 96W brick'
    },
    description: 'Simultaneously charge your laptop, smartphone, and smartwatch from a tiny plug that fits in your palm.',
    inStock: true
  },
  {
    id: 'apple-magsafe-powerbank',
    name: 'Apple MagSafe Battery Pack Pro',
    brand: 'Apple',
    category: 'accessories',
    price: 9900,
    originalPrice: 10900,
    rating: 4.7,
    reviewsCount: 184,
    image: 'https://images.unsplash.com/photo-1609081219090-a6d81d3085bf?auto=format&fit=crop&w=800&q=80',
    colors: [{ name: 'Matte White', hex: '#F5F5F7' }],
    tag: 'Magnetic Snap',
    badge: 'Apple Official',
    emiStartsAt: 412,
    specs: {
      'Magnets': 'Precision N52 Neodymium Magnetic Alignment',
      'Pass-Through': 'Simultaneous Phone + Pack Fast Charging',
      'Integration': 'Native iOS lock screen battery widget status',
      'Finish': 'Silky matte soft-touch white shell'
    },
    description: 'Effortless magnetic snap charging on the move without cables dangling from your pockets.',
    inStock: true
  },
  {
    id: 'titanium-shield-case',
    name: 'Radhaswami Titanium Shield MagSafe Case',
    brand: 'Radhaswami',
    category: 'accessories',
    price: 1899,
    originalPrice: 2499,
    rating: 4.8,
    reviewsCount: 96,
    image: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=800&q=80',
    colors: [
      { name: 'Frosted Matte', hex: '#2E323D' },
      { name: 'Smokey Titanium', hex: '#1C1F26' }
    ],
    tag: 'Military Grade',
    badge: 'Store Special',
    emiStartsAt: 79,
    specs: {
      'Drop Protection': 'MIL-STD-810H 15-foot impact certified',
      'Camera': 'Raised brushed titanium protective lens bezel',
      'Back': 'Anti-scratch fingerprint-resistant matte back',
      'Magnets': 'Embedded 15W MagSafe magnetic alignment ring'
    },
    description: 'Maximum rugged defense with tactile textured grips and premium titanium camera ring protection.',
    inStock: true
  }
];

// In-Memory Order Storage
const ORDERS = [];

// ==========================================
// REST API ENDPOINTS
// ==========================================

// 1. Get All Products with Multi-Facet Query Filtering
app.get('/api/products', (req, res) => {
  const { category, brand, maxPrice, search, sort } = req.query;
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
    customer: customer || { name: 'Verified Customer', phone: '+91 98765 43210' },
    items,
    total,
    paymentMethod: paymentMethod || 'UPI / Prepaid',
    status: 'Packaging & Quality Check',
    dispatchSlot: 'Today within 2 Hours via BlueDart Air Express',
    trackingNumber: 'BD-IN-' + Math.floor(1000000 + Math.random() * 9000000)
  };

  ORDERS.push(newOrder);

  // Generate direct WhatsApp concierge text
  const itemNames = items.map(i => `${i.name} (x${i.qty || 1})`).join(', ');
  const waText = encodeURIComponent(
    `Hello New Radhaswami Mobile Gallery! I have placed Order #${orderId} for [${itemNames}] totaling ₹${Number(total).toLocaleString('en-IN')}. Please confirm dispatch status.`
  );
  const whatsappUrl = `https://wa.me/919876543210?text=${waText}`;

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
    status: 'BlueDart Air Transit - Mumbai Hub',
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

app.listen(PORT, () => {
  console.log(`⚡ New Radhaswami Mobile Gallery API Server listening on port ${PORT}`);
});
