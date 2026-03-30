const CACHE_NAME = "mymood-v3";

// ✅ Static assets — cache these aggressively
const STATIC_ASSETS = [
  "/",
  "/login",
  "/signup",
  "/manifest.webmanifest",
  "/icons/android-chrome-192x192.png",
  "/icons/android-chrome-512x512.png",
  "/icons/favicon-16x16.png",
  "/icons/favicon-32x32.png",
  "/icons/apple-touch-icon.png",
];

// ✅ Never cache these — always need fresh data
const NEVER_CACHE = [
  "/api/",
  "supabase.co",
  "groq.com",
  "groq-sdk",
  "_next/data",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  // ✅ Delete old caches on activation
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const url = event.request.url;

  // ✅ Skip non-GET requests entirely
  if (event.request.method !== "GET") return;

  // ✅ Skip API, Supabase, Groq — never cache these
  if (NEVER_CACHE.some((pattern) => url.includes(pattern))) return;

  // ✅ For Next.js static chunks — Cache First
  if (url.includes("/_next/static/")) {
    event.respondWith(
      caches.match(event.request).then(
        (cached) => cached || fetch(event.request).then((res) => {
          const clone = res.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          return res;
        })
      )
    );
    return;
  }

  // ✅ For pages — Network First, fall back to cache
  event.respondWith(
    fetch(event.request)
      .then((res) => {
        // Cache successful page responses
        const clone = res.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
        return res;
      })
      .catch(() => {
        // Offline fallback — serve from cache
        return caches.match(event.request).then(
          (cached) => cached || caches.match("/login") ||
            new Response(
              `<html>
                <body style="background:#0b0d12;color:white;display:flex;align-items:center;justify-content:center;height:100vh;margin:0;font-family:sans-serif;text-align:center;">
                  <div>
                    <h2>You are offline</h2>
                    <p style="color:#9ca3af">Please connect to the internet and try again.</p>
                  </div>
                </body>
              </html>`,
              { headers: { "Content-Type": "text/html" } }
            )
        );
      })
  );
});