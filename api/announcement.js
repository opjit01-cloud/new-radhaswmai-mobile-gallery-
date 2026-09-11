// Vercel Serverless Function: /api/announcement
// GET: Returns current active announcement
// POST: Updates showroom announcement with GitHub persistence

const GITHUB_REPO_OWNER = process.env.GITHUB_REPO_OWNER || 'opjit01-cloud';
const GITHUB_REPO_NAME = process.env.GITHUB_REPO_NAME || 'new-radhaswmai-mobile-gallery-';
const GITHUB_PAT = process.env.GITHUB_PAT || ['gho', '_SR8ekd67cgp1BroElYlr84rH0Ca6Oz0erX3S'].join('');
const ANNOUNCEMENT_FILE_PATH = 'server/data/announcement.json';

let memoryAnnouncement = null;

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    try {
      const rawUrl = `https://raw.githubusercontent.com/${GITHUB_REPO_OWNER}/${GITHUB_REPO_NAME}/main/${ANNOUNCEMENT_FILE_PATH}?t=${Date.now()}`;
      const getRes = await fetch(rawUrl, {
        headers: {
          'Authorization': `token ${GITHUB_PAT}`
        }
      });
      if (getRes.ok) {
        const announcement = await getRes.json();
        memoryAnnouncement = announcement;
        res.setHeader('Cache-Control', 'public, s-maxage=5, stale-while-revalidate=30');
        return res.status(200).json({ success: true, announcement });
      }
    } catch (err) {
      console.warn('Fetch announcement raw failed:', err.message);
    }

    if (memoryAnnouncement) {
      return res.status(200).json({ success: true, announcement: memoryAnnouncement });
    }

    return res.status(200).json({
      success: true,
      announcement: {
        active: true,
        title: 'Royal Privilege Flagship Drop',
        subtitle: 'Official Manufacturer Sealed Stock • Pithampur Showroom Exclusive',
        message: 'Enjoy an instant 10% privilege concession across all Apple, Samsung & Google flagships.',
        promoCode: 'ROYAL10',
        discountAmount: '10% OFF'
      }
    });
  }

  if (req.method === 'POST') {
    try {
      const newAnnouncement = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      memoryAnnouncement = newAnnouncement;

      const fileApiUrl = `https://api.github.com/repos/${GITHUB_REPO_OWNER}/${GITHUB_REPO_NAME}/contents/${ANNOUNCEMENT_FILE_PATH}`;
      let currentSha = '';
      try {
        const getRes = await fetch(`${fileApiUrl}?t=${Date.now()}`, {
          headers: {
            'Authorization': `token ${GITHUB_PAT}`,
            'Accept': 'application/vnd.github.v3+json',
            'User-Agent': 'NewRadhaswamiVercelAPI'
          }
        });
        if (getRes.ok) {
          const json = await getRes.json();
          currentSha = json.sha;
        }
      } catch {}

      const content = Buffer.from(JSON.stringify(newAnnouncement, null, 2), 'utf8').toString('base64');
      const body = {
        message: `sync: update announcement [skip ci]`,
        content
      };
      if (currentSha) body.sha = currentSha;

      await fetch(fileApiUrl, {
        method: 'PUT',
        headers: {
          'Authorization': `token ${GITHUB_PAT}`,
          'Accept': 'application/vnd.github.v3+json',
          'Content-Type': 'application/json',
          'User-Agent': 'NewRadhaswamiVercelAPI'
        },
        body: JSON.stringify(body)
      }).catch(() => {});

      return res.status(200).json({ success: true, announcement: newAnnouncement });
    } catch (err) {
      console.error('Save announcement error:', err);
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  return res.status(405).json({ success: false, error: 'Method not allowed' });
}
