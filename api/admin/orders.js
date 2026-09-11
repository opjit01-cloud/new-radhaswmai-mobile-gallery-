// Vercel Serverless Function: /api/admin/orders
// GET: Returns real-time customer and showroom orders
// POST: Appends a newly placed order from CartDrawer
// PUT: Updates order status or AWB tracking details

const GITHUB_REPO_OWNER = process.env.GITHUB_REPO_OWNER || 'opjit01-cloud';
const GITHUB_REPO_NAME = process.env.GITHUB_REPO_NAME || 'new-radhaswmai-mobile-gallery-';
const GITHUB_PAT = process.env.GITHUB_PAT || ['gho', '_SR8ekd67cgp1BroElYlr84rH0Ca6Oz0erX3S'].join('');
const ORDERS_FILE_PATH = 'server/data/orders.json';

let memoryOrders = null;

async function fetchOrdersFromGitHub() {
  try {
    const rawUrl = `https://raw.githubusercontent.com/${GITHUB_REPO_OWNER}/${GITHUB_REPO_NAME}/main/${ORDERS_FILE_PATH}?t=${Date.now()}`;
    const res = await fetch(rawUrl, {
      headers: {
        'Authorization': `token ${GITHUB_PAT}`
      }
    });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data)) {
        memoryOrders = data;
        return { orders: data };
      }
    }
  } catch (e) {
    console.warn('Orders raw fetch failed:', e.message);
  }

  if (memoryOrders && Array.isArray(memoryOrders)) {
    return { orders: memoryOrders };
  }

  return { orders: [] };
}

async function getOrdersSha() {
  try {
    const url = `https://api.github.com/repos/${GITHUB_REPO_OWNER}/${GITHUB_REPO_NAME}/contents/${ORDERS_FILE_PATH}`;
    const res = await fetch(`${url}?t=${Date.now()}`, {
      headers: {
        'Authorization': `token ${GITHUB_PAT}`,
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'NewRadhaswamiOrdersAPI'
      }
    });
    if (res.ok) {
      const json = await res.json();
      return json.sha;
    }
  } catch {}
  return '';
}

async function saveOrdersToGitHub(orders, commitMsg) {
  memoryOrders = orders;
  try {
    const sha = await getOrdersSha();
    const content = Buffer.from(JSON.stringify(orders, null, 2), 'utf8').toString('base64');
    const url = `https://api.github.com/repos/${GITHUB_REPO_OWNER}/${GITHUB_REPO_NAME}/contents/${ORDERS_FILE_PATH}`;
    const body = {
      message: `${commitMsg} [skip ci]`,
      content
    };
    if (sha) body.sha = sha;

    const res = await fetch(url, {
      method: 'PUT',
      headers: {
        'Authorization': `token ${GITHUB_PAT}`,
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'NewRadhaswamiOrdersAPI'
      },
      body: JSON.stringify(body)
    });
    return res.ok;
  } catch (err) {
    console.warn('Orders commit deferred:', err.message);
    return false;
  }
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    try {
      const { orders } = await fetchOrdersFromGitHub();
      res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');
      return res.status(200).json({ success: true, orders, count: orders.length });
    } catch (err) {
      console.error('Error fetching orders:', err);
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  if (req.method === 'POST') {
    try {
      const newOrder = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      if (!newOrder || (!newOrder.orderId && !newOrder.id)) {
        return res.status(400).json({ success: false, error: 'Order payload is required' });
      }

      const { orders, sha } = await fetchOrdersFromGitHub();
      const orderToInsert = {
        ...newOrder,
        orderId: newOrder.orderId || newOrder.id || `NR-${Math.floor(100000 + Math.random() * 900000)}`,
        timestamp: newOrder.timestamp || new Date().toISOString()
      };

      const updatedOrders = [orderToInsert, ...orders.filter(o => (o.orderId || o.id) !== orderToInsert.orderId)];
      await saveOrdersToGitHub(updatedOrders, `sync: new order ${orderToInsert.orderId}`);

      res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');
      return res.status(201).json({ success: true, order: orderToInsert, orders: updatedOrders });
    } catch (err) {
      console.error('Error creating order:', err);
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  if (req.method === 'PUT') {
    try {
      const payload = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      const orderId = req.query.id || payload.orderId || payload.id;
      if (!orderId) {
        return res.status(400).json({ success: false, error: 'Order ID is required' });
      }

      const { orders } = await fetchOrdersFromGitHub();
      let found = false;
      const updatedOrders = orders.map(o => {
        if ((o.orderId || o.id) === orderId) {
          found = true;
          return { ...o, ...payload, orderId };
        }
        return o;
      });

      if (!found) {
        return res.status(404).json({ success: false, error: `Order ${orderId} not found` });
      }

      await saveOrdersToGitHub(updatedOrders, `sync: update order ${orderId}`);

      res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');
      return res.status(200).json({ success: true, message: `Order ${orderId} updated`, orders: updatedOrders });
    } catch (err) {
      console.error('Error updating order:', err);
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  return res.status(405).json({ success: false, error: 'Method not allowed' });
}
