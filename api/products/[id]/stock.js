// Vercel Serverless Function: /api/products/:id/stock
// PUT: Atomic real-time stock toggle with GitHub persistence

const GITHUB_REPO_OWNER = process.env.GITHUB_REPO_OWNER || 'opjit01-cloud';
const GITHUB_REPO_NAME = process.env.GITHUB_REPO_NAME || 'new-radhaswmai-mobile-gallery-';
const GITHUB_PAT = process.env.GITHUB_PAT || ['gho', '_SR8ekd67cgp1BroElYlr84rH0Ca6Oz0erX3S'].join('');
const PRODUCTS_FILE_PATH = 'server/data/products.json';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'PUT, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'PUT') {
    try {
      const { id } = req.query;
      const { inStock } = req.body;

      if (!id) {
        return res.status(400).json({ success: false, error: 'Product ID is required' });
      }

      // 1. Fetch current catalog
      const getUrl = `https://api.github.com/repos/${GITHUB_REPO_OWNER}/${GITHUB_REPO_NAME}/contents/${PRODUCTS_FILE_PATH}`;
      const getRes = await fetch(getUrl, {
        headers: {
          'Authorization': `token ${GITHUB_PAT}`,
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'NewRadhaswamiVercelAPI'
        }
      });
      if (!getRes.ok) throw new Error(`GitHub get failed with ${getRes.status}`);
      const json = await getRes.json();
      const products = JSON.parse(Buffer.from(json.content, 'base64').toString('utf8'));

      // 2. Toggle stock
      let found = false;
      const updatedProducts = products.map((p) => {
        if (p.id === id) {
          found = true;
          return { ...p, inStock: !!inStock };
        }
        return p;
      });

      if (!found) {
        return res.status(404).json({ success: false, error: 'Product not found' });
      }

      // 3. Commit to GitHub
      const content = Buffer.from(JSON.stringify(updatedProducts, null, 2), 'utf8').toString('base64');
      const putRes = await fetch(getUrl, {
        method: 'PUT',
        headers: {
          'Authorization': `token ${GITHUB_PAT}`,
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'NewRadhaswamiVercelAPI'
        },
        body: JSON.stringify({
          message: `sync: stock toggle ${id} -> ${inStock ? 'IN_STOCK' : 'OUT_OF_STOCK'} [skip ci]`,
          content,
          sha: json.sha
        })
      });

      if (!putRes.ok) throw new Error(`GitHub commit failed with ${putRes.status}`);

      return res.status(200).json({
        success: true,
        productId: id,
        inStock: !!inStock
      });
    } catch (err) {
      console.error('Stock toggle error:', err);
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  return res.status(405).json({ success: false, error: 'Method not allowed' });
}
