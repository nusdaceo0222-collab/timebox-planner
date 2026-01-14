const CACHE_NAME = "timebox-planner-v2";

const ASSETS = [
  "/timebox-planner/",
  "/timebox-planner/index.html",
  "/timebox-planner/manifest.webmanifest",
  "/timebox-planner/icon-192.png",
  "/timebox-planner/icon-512.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then(
      (response) => response || fetch(event.request)
    )
  );
});
