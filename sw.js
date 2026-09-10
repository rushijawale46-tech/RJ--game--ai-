const CACHE = "rj-game-india-v1.1.1";

self.addEventListener("install", event => {
  self.skipWaiting();

  event.waitUntil(
    caches.open(CACHE).then(cache =>
      cache.addAll([
        "./",
        "./manifest.webmanifest",
        "./virat-kohli.png"
      ])
    )
  );
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.map(key => {
          if (key !== CACHE) {
            return caches.delete(key);
          }
        })
      )
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", event => {

  /* HTML हमेशा network से नया version ले */
  if (
    event.request.mode === "navigate" ||
    event.request.url.endsWith("index.html")
  ) {
    event.respondWith(
      fetch(event.request, { cache: "no-store" })
        .catch(() => caches.match("./"))
    );
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});
