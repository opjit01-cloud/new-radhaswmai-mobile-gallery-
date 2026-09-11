// Vercel Serverless Function: /api/products/:id
// Delegates directly to the resilient zero-rate-limit handler

import handler from './index.js';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '15mb'
    }
  }
};

export default handler;

