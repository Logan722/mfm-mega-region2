import http from 'node:http'; import fs from 'node:fs'; import path from 'node:path';
import { handle } from '../../../netlify/functions/leaderboard.mjs';
import { handle as liveHandle } from '../../../netlify/functions/live.mjs';
const ROOT = process.argv[2] || new URL('../../..', import.meta.url).pathname.replace(/\/$/,''), PORT = +(process.argv[3] || 8097);
const mem = new Map();
const store = { async get(k, o) { const v = mem.get(k); return v === undefined ? null : JSON.parse(v); }, async setJSON(k, v) { mem.set(k, JSON.stringify(v)); }, async list({ prefix }) { return { blobs: [...mem.keys()].filter((k) => k.startsWith(prefix)).map((key) => ({ key })) }; }, async delete(k) { mem.delete(k); } };
globalThis.__store = mem;
const types = { '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.svg': 'image/svg+xml', '.mp4': 'video/mp4', '.woff2': 'font/woff2' };
http.createServer(async (req, res) => {
  const u = new URL(req.url, 'http://localhost');
  if (u.pathname === '/.netlify/functions/leaderboard') {
    const body = await new Promise((r) => { let b = ''; req.on('data', (c) => (b += c)); req.on('end', () => r(b)); });
    const r = await handle(new Request('http://localhost' + req.url, { method: req.method, headers: req.headers, body: req.method === 'POST' ? body : undefined }), store, req.socket.remoteAddress + (req.headers['x-test-ip'] || ''));
    const txt = await r.text(); if (r.status >= 400) console.log('LB', r.status, body, txt); res.writeHead(r.status, Object.fromEntries(r.headers)); res.end(txt); return;
  }
  if (u.pathname === '/.netlify/functions/live') {
    const body = await new Promise((r) => { let b = ''; req.on('data', (c) => (b += c)); req.on('end', () => r(b)); });
    const load = async (p) => JSON.parse(fs.readFileSync(path.join(ROOT, p), 'utf8'));
    const r = await liveHandle(new Request('http://localhost' + req.url, { method: req.method, headers: req.headers, body: req.method === 'POST' ? body : undefined }), store, { load });
    const txt = await r.text(); if (r.status >= 400) console.log('LIVE', r.status, body.slice(0, 200), txt); res.writeHead(r.status, Object.fromEntries(r.headers)); res.end(txt); return;
  }
  if (u.pathname === '/__dump') { res.writeHead(200, { 'Content-Type': 'application/json' }); res.end(JSON.stringify([...mem.keys()])); return; }
  let f = path.join(ROOT, decodeURIComponent(u.pathname)); if (fs.existsSync(f) && fs.statSync(f).isDirectory()) f = path.join(f, 'index.html');
  if (!fs.existsSync(f) && fs.existsSync(f + '.html')) f += '.html';
  if (!fs.existsSync(f)) { res.writeHead(404); res.end('nf'); return; }
  res.writeHead(200, { 'Content-Type': types[path.extname(f)] || 'application/octet-stream' }); fs.createReadStream(f).pipe(res);
}).listen(PORT, () => console.log('up', PORT));
