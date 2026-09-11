// Vercel Serverless Function: /api/orders/:id/status
// PUT: Atomic real-time status update with BlueDart AWB tracking
import ordersHandler from '../admin/orders.js';

export default async function handler(req, res) {
  if (req.query && req.query.id) {
    req.body = {
      ...(typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {})),
      orderId: req.query.id
    };
  }
  return ordersHandler(req, res);
}
