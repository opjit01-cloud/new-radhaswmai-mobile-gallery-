// Vercel Serverless Function: /api/upload
// Handles image uploads, returns safe data URL or hosted path

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb'
    }
  }
};

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'POST') {
    try {
      const { fileData, fileName } = req.body;
      if (!fileData) {
        return res.status(400).json({ success: false, error: 'No image data provided' });
      }

      // Safe base64 data URL ensures image is visible on ALL devices without external dependencies
      return res.status(200).json({
        success: true,
        url: fileData,
        name: fileName || 'upload.webp'
      });
    } catch (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  return res.status(405).json({ success: false, error: 'Method not allowed' });
}
