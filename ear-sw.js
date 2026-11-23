"use strict";
const SW_VERSION = '2026-11-23.3';
const APP_CACHE = 'ear-app-' + SW_VERSION;
const SAMPLE_CACHE = 'music-samples-v2';

const APP_SHELL = [
  './',
  'manifest.json',
  'icon-180.png?v=6',
  'icon-512.png?v=6'
];

// All 30 Salamander Grand Piano samples (MIDI 21..108, every 3 semitones)
const PIANO_SAMPLES = [];
for (let m = 21; m <= 108; m += 3) {
  PIANO_SAMPLES.push('piano/' + m + '.m4a');
}

const resolveUrl = path => new URL(path, self.registration.scope).href;

self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const appCache = await caches.open(APP_CACHE);
    await Promise.allSettled(
      APP_SHELL.map(async path => {
        const req = new Request(resolveUrl(path), { cache: 'reload' });
        const res = await fetch(req);
        if (res && res.ok) await appCache.put(resolveUrl(path), res);
      })
    );

    // Warm the shared piano sample cache so offline playback works right after first install
    const sampleCache = await caches.open(SAMPLE_CACHE);
    await Promise.allSettled(
      PIANO_SAMPLES.map(async path => {
        const url = resolveUrl(path);
        const hit = await sampleCache.match(url);
        if (hit) return;
        const res = await fetch(url);
        if (res && res.ok) await sampleCache.put(url, res);
      })
    );

    await self.skipWaiting();
  })());
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(
      keys
        .filter(k => k.startsWith('ear-app-') && k !== APP_CACHE)
        .map(k => caches.delete(k))
    );
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  const scopePath = new URL(self.registration.scope).pathname;
  const relPath = url.pathname.startsWith(scopePath)
    ? url.pathname.slice(scopePath.length)
    : null;

  // Only handle Ear Trainer files; leave other apps on this site untouched
  if (relPath === null) return;
  const isEarPage = relPath === '' || relPath === 'index.html';
  const isPianoSample = relPath.startsWith('piano/') && relPath.endsWith('.m4a');
  const isEarAsset = relPath === 'manifest.json' || relPath.startsWith('icon-');
  if (!isEarPage && !isEarAsset) return;

  // Let version checks bypass the cache so updates are always detected promptly
  if (isEarPage && url.searchParams.has('check')) return;

  // 1. Piano samples: cache-first from music-samples-v2 (shared with the app page)
  if (isPianoSample) {
    event.respondWith((async () => {
      const cache = await caches.open(SAMPLE_CACHE);
      const hit = await cache.match(req);
      if (hit) return hit;
      const res = await fetch(req);
      if (res && res.ok) await cache.put(req, res.clone());
      return res;
    })());
    return;
  }

  // 2. App page: network-first when online (updates cache), instant cached fallback offline
  if (isEarPage) {
    event.respondWith((async () => {
      const cache = await caches.open(APP_CACHE);
      const canonical = resolveUrl('./');
      try {
        const res = await fetch(req);
        if (res && res.ok) await cache.put(canonical, res.clone());
        return res;
      } catch (e) {
        const cached = await cache.match(canonical, { ignoreSearch: true });
        if (cached) return cached;
        throw e;
      }
    })());
    return;
  }

  // 3. Icons & manifest next to the app: cache-first, refresh in background
  event.respondWith((async () => {
    const cache = await caches.open(APP_CACHE);
    const hit = await cache.match(req, { ignoreSearch: true });
    const fetchPromise = fetch(req).then(res => {
      if (res && res.ok) cache.put(req, res.clone());
      return res;
    }).catch(() => null);
    return hit || (await fetchPromise);
  })());
});
