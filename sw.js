/* COR DEO – service worker
   - Seite (index.html): zuerst Netzwerk, bei fehlender Verbindung Cache  -> Updates erscheinen sofort, App läuft auch offline.
   - Bilder, Icons, Manifest: zuerst Cache, dann Netzwerk (jede angesehene Karte bleibt offline verfügbar).
   - Fremde Adressen (z. B. Google Fonts) werden nicht angefasst.
   Bei Änderungen an diesem Skript: VERSION erhöhen. */
var VERSION = "cordeo-v1";
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
      return Promise.all(keys.filter(function (k) { return k !== VERSION; }).map(function (k) { return caches.delete(k); }));
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

  e.respondWith(                                             // Cache zuerst
    caches.match(req).then(function (hit) {
      if (hit) return hit;
      return fetch(req).then(function (res) {
        if (res && res.ok) { var copy = res.clone(); caches.open(VERSION).then(function (c) { c.put(req, copy); }); }
        return res;
      });
    })
  );
});
