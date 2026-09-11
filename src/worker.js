// Cloudflare Worker entry point for newradhaswami
// Handles API routes via Edge Router and serves static assets from dist/
import { onRequest as apiHandler } from '../functions/api/[[catchall]].js';

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // Route API requests to our high-performance Edge API Router
    if (url.pathname.startsWith('/api/') || url.pathname === '/api') {
      const pathPart = url.pathname.replace(/^\/api\/?/, '');
      const segments = pathPart ? pathPart.split('/').filter(Boolean) : [];
      return apiHandler({ request, env, params: { catchall: segments } });
    }

    // Serve static assets with automatic SPA fallback
    if (env.ASSETS && typeof env.ASSETS.fetch === 'function') {
      return env.ASSETS.fetch(request);
    }

    return new Response('Not found', { status: 404 });
  }
};
