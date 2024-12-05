const cdkh = "cdkh_invesetment_pwa_v1"
const assets = [
  "/",
  "/futures.html",
  "/index.html",
  "/KakaoTalk_20241205_142214954.jpg"
]

self.addEventListener("install", installEvent => {
  installEvent.waitUntil(
    caches.open(cdkh).then(cache => {
      cache.addAll(assets)
    })
  )
})

self.addEventListener("fetch", fetchEvent => {
    fetchEvent.respondWith(
      caches.match(fetchEvent.request).then(res => {
        return res || fetch(fetchEvent.request)
      })
    )
  })