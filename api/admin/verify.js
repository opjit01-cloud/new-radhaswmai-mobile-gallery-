// Vercel Serverless Function: /api/admin/verify
// Validates whitelisted email & security PIN/password for Owner and Staff

const WHITELIST = [
  { email: 'opjit01@gmail.com', role: 'owner', name: 'Admin (Master Owner)' }
];

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'POST') {
    const { email, pin, password, requestedRole } = req.body || {};
    const cleanEmail = (email || '').trim().toLowerCase();
    const cleanPin = (pin || '').trim();
    const cleanPass = (password || '').trim();

    const matched = WHITELIST.find(w => w.email.toLowerCase() === cleanEmail);
    if (!matched) {
      return res.status(403).json({
        success: false,
        message: `Email "${cleanEmail}" is not authorized on the showroom security whitelist.`
      });
    }

    if (requestedRole === 'owner' && matched.role !== 'owner') {
      return res.status(403).json({
        success: false,
        message: `Email "${cleanEmail}" does not possess Master Owner clearance.`
      });
    }

    // Owner credentials
    if (requestedRole === 'owner') {
      if (cleanPin === '9876' || cleanPass === 'radha@master2026') {
        return res.status(200).json({
          success: true,
          role: 'owner',
          token: `token_owner_master_${Date.now()}`
        });
      }
      return res.status(401).json({
        success: false,
        message: 'Invalid Master Owner PIN. Access Denied.'
      });
    }

    // Staff credentials
    if (requestedRole === 'staff') {
      if (cleanPin === '4321' || cleanPin === '9876') {
        return res.status(200).json({
          success: true,
          role: 'staff',
          token: `token_staff_ops_${Date.now()}`
        });
      }
      return res.status(401).json({
        success: false,
        message: 'Invalid Staff PIN. Access Denied.'
      });
    }

    return res.status(400).json({ success: false, message: 'Invalid role requested' });
  }

  return res.status(405).json({ success: false, error: 'Method not allowed' });
}
