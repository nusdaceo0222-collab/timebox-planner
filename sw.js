// sw.js (교체본)
const CACHE_NAME = "timebox-planner-v9"; // ✅ 올릴 때마다 v10, v11...

const ASSETS = [
  "/timebox-planner/",
  "/timebox-planner/index.html",
  "/timebox-planner/manifest.webmanifest",
  "/timebox-planner/icon-192.png",
  "/timebox-planner/icon-512.png"
];

self.addEventListener("install", (event) => {
  // ✅ 새 서비스워커를 즉시 활성화 단계로 넘김
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS)).catch(()=>{})
  );
});

self.addEventListener("activate", (event) => {
  // ✅ 기존 캐시들 정리 + 즉시 제어권 획득
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.map(k => (k !== CACHE_NAME ? caches.delete(k) : null)));
    await self.clients.claim();
  })());
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  const url = new URL(req.url);

  // ✅ index.html / 루트는 네트워크 우선(최신 반영), 실패 시 캐시
  if (
    url.pathname === "/timebox-planner/" ||
    url.pathname.endsWith("/timebox-planner/index.html")
  ) {
    event.respondWith((async () => {
      try {
        const fresh = await fetch(req, { cache: "no-store" });
        const cache = await caches.open(CACHE_NAME);
        cache.put(req, fresh.clone());
        return fresh;
      } catch {
        const cached = await caches.match(req);
        return cached || caches.match("/timebox-planner/index.html");
      }
    })());
    return;
  }

  // ✅ 나머지는 캐시 우선
  event.respondWith(
    caches.match(req).then(res => res || fetch(req))
  );
});
