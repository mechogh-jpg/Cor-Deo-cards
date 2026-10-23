/* COR DEO – service worker
   - Seite (index.html): zuerst Netzwerk, bei fehlender Verbindung Cache  -> Updates erscheinen sofort, App läuft auch offline.
   - Bilder, Icons, Manifest: zuerst Cache, dann Netzwerk (jede angesehene Karte bleibt offline verfügbar).
   - Alle 120 Kartenbilder werden auf Wunsch der Seite (Nachricht "precache") im Hintergrund vorab geladen,
     damit das ganze Kartenset offline funktioniert. Die Bilder liegen in einem eigenen Cache (IMG_CACHE),
     sodass ein Update der Seite (VERSION erhöhen) die ~7,6 MB nicht erneut herunterlädt.
   - Fremde Adressen (z. B. Google Fonts) werden nicht angefasst.
   Bei Änderungen an diesem Skript: VERSION erhöhen. Bei neuen/geänderten Kartenbildern: IMG_CACHE erhöhen. */
var VERSION = "cordeo-v2";
var IMG_CACHE = "cordeo-img-v1";
var CARD_COUNT = 120;                       // Anzahl der Bilddateien "COR DEO-Karten-001.jpg" … "-120.jpg"
var PRECACHE_PARALLEL = 4;
var SHELL = ["./", "index.html", "manifest.json", "pwa.js",
             "icons/icon-192.png", "icons/icon-512.png", "icons/apple-touch-icon.png", "icons/favicon-32.png"];

self.addEventListener("install", function (e) {
  e.waitUntil(
    caches.open(VERSION).then(function (c) {
      // einzeln hinzufügen: eine fehlende Datei darf die Installation nicht verhindern
      return Promise.all(SHELL.map(function (u) { return c.add(u).catch(function () {}); }));
    }).then(function () { return self.skipWaiting(); })
  );
});

self.addEventListener("activate", function (e) {
  e.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys.filter(function (k) { return k !== VERSION && k !== IMG_CACHE; }).map(function (k) { return caches.delete(k); }));
    }).then(function () { return self.clients.claim(); })
  );
});

self.addEventListener("fetch", function (e) {
  var req = e.request;
  if (req.method !== "GET") return;
  var url = new URL(req.url);
  if (url.origin !== self.location.origin) return;           // nur eigene Dateien

  var isPage = req.mode === "navigate" || /(^|\/)(index\.html)?$/.test(url.pathname) || /pwa\.js$/.test(url.pathname);

  if (isPage) {                                              // Netzwerk zuerst
    e.respondWith(
      fetch(req).then(function (res) {
        if (res && res.ok) { var copy = res.clone(); caches.open(VERSION).then(function (c) { c.put(req, copy); }); }
        return res;
      }).catch(function () {
        return caches.match(req, { ignoreSearch: true }).then(function (hit) { return hit || caches.match("index.html") || caches.match("./"); });
      })
    );
    return;
  }

  var target = /\.jpe?g$/i.test(url.pathname) ? IMG_CACHE : VERSION;
  e.respondWith(                                             // Cache zuerst
    caches.match(req).then(function (hit) {
      if (hit) return hit;
      return fetch(req).then(function (res) {
        if (res && res.ok) { var copy = res.clone(); caches.open(target).then(function (c) { c.put(req, copy); }); }
        return res;
      });
    })
  );
});

/* ---------- Alle Kartenbilder vorab laden (offline-Modus) ---------- */
function cardUrls() {
  var list = [];
  for (var i = 1; i <= CARD_COUNT; i++) {
    var n = ("00" + i).slice(-3);
    list.push(new URL("COR%20DEO-Karten-" + n + ".jpg", self.registration.scope).href);
  }
  return list;
}

function tell(msg) {
  return self.clients.matchAll({ includeUncontrolled: true }).then(function (cs) {
    cs.forEach(function (c) { c.postMessage(msg); });
  });
}

var precaching = null;
function precacheAll() {
  if (precaching) return precaching;                         // läuft schon
  var urls = cardUrls(), total = urls.length, done = 0, failed = 0, next = 0;
  precaching = caches.open(IMG_CACHE).then(function (cache) {
    function one(url) {
      return cache.match(url).then(function (hit) {
        if (hit) return true;
        return fetch(url).then(function (res) {
          if (!res || !res.ok) throw new Error("bad");
          return cache.put(url, res).then(function () { return true; });
        }).catch(function () {
          return fetch(url).then(function (res) {           // ein zweiter Versuch
            if (!res || !res.ok) return false;
            return cache.put(url, res).then(function () { return true; });
          }).catch(function () { return false; });
        });
      });
    }
    function worker() {
      if (next >= total) return Promise.resolve();
      var url = urls[next++];
      return one(url).then(function (ok) {
        if (ok) done++; else failed++;
        return tell({ type: "precache-progress", done: done, failed: failed, total: total });
      }).then(worker);
    }
    var workers = [];
    for (var w = 0; w < PRECACHE_PARALLEL; w++) workers.push(worker());
    return Promise.all(workers);
  }).then(function () {
    precaching = null;
    return tell({ type: "precache-done", done: done, failed: failed, total: total });
  }).catch(function () {
    precaching = null;
    return tell({ type: "precache-done", done: done, failed: total - done, total: total });
  });
  return precaching;
}

self.addEventListener("message", function (e) {
  var d = e.data || {};
  if (d.type === "precache") e.waitUntil(precacheAll());
});
