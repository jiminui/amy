/**
 * Cloudflare Worker — CORS Proxy
 *
 * 배포 방법:
 *   1. Cloudflare Dashboard > Workers & Pages > Create Worker
 *   2. 이 파일 내용을 붙여넣기 후 Deploy
 *   또는 wrangler CLI:
 *     npx wrangler deploy workers/cors-proxy.js --name cors-proxy
 *
 * 사용법:
 *   GET https://<worker>.workers.dev/?url=<encoded-url>
 */

const ALLOWED_ORIGINS = [
  'https://jiminyu.com',
  'https://www.jiminyu.com',
  'http://localhost',
  'http://127.0.0.1',
  'null',  // file:// protocol
];

function isOriginAllowed(origin) {
  if (!origin) return false;
  return ALLOWED_ORIGINS.some(ao => origin === ao || origin.startsWith(ao + ':'));
}

function corsHeaders(origin) {
  return {
    'Access-Control-Allow-Origin': origin === 'null' ? '*' : origin,
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };
}

export default {
  async fetch(request) {
    const origin = request.headers.get('Origin') || '';

    // Preflight
    if (request.method === 'OPTIONS') {
      if (!isOriginAllowed(origin)) {
        return new Response('Forbidden', { status: 403 });
      }
      return new Response(null, { status: 204, headers: corsHeaders(origin) });
    }

    if (request.method !== 'GET') {
      return new Response('Method not allowed', { status: 405 });
    }

    const url = new URL(request.url);
    const target = url.searchParams.get('url');

    if (!target) {
      return new Response('Missing ?url= parameter', { status: 400 });
    }

    // Origin check (allow no-origin for direct browser/curl testing)
    if (origin && !isOriginAllowed(origin)) {
      return new Response('Origin not allowed', { status: 403 });
    }

    try {
      const resp = await fetch(target, {
        headers: { 'User-Agent': 'Mozilla/5.0 (compatible; CORSProxy/1.0)' },
        cf: { cacheTtl: 300 },
      });

      const body = await resp.arrayBuffer();
      const headers = new Headers(corsHeaders(origin || '*'));
      headers.set('Content-Type', resp.headers.get('Content-Type') || 'text/plain');
      headers.set('Cache-Control', 'public, max-age=300');

      return new Response(body, { status: resp.status, headers });
    } catch (err) {
      return new Response(`Fetch error: ${err.message}`, {
        status: 502,
        headers: corsHeaders(origin || '*'),
      });
    }
  },
};
