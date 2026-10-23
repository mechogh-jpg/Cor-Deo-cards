/* ============================================================================
   COR DEO — App-Installation (PWA)
   ----------------------------------------------------------------------------
   • registriert den Service Worker (sw.js)  -> schneller + offline
   • zeigt eine kleine, schließbare Karte "Als App installieren"
       - Android/Chrome: ein Tipp auf "Installieren"
       - iPhone/Safari:  kurze Anleitung (Teilen -> Zum Home-Bildschirm)
       - im Google-Sites-Rahmen: Button, der die App in einem eigenen Tab öffnet
   • URL-Optionen:  ?pwa=0 blendet die Karte aus  ·  ?install=1 öffnet die Anleitung sofort
   Diese Datei ist eigenständig; sie braucht nur index.html, manifest.json, sw.js und icons/.
   ============================================================================ */
(function () {
  "use strict";

  /* ---------- 1. Service Worker ---------- */
  if ("serviceWorker" in navigator && /^https?:$/.test(location.protocol)) {
    window.addEventListener("load", function () {
      try { navigator.serviceWorker.register("sw.js").catch(function () {}); } catch (e) { /* ignore */ }
    });
  }

  /* ---------- 2. Texte ---------- */
  var SHARE = '<svg class="pwa-share" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3v12"/><path d="M8 7l4-4 4 4"/><path d="M7 11H6a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2h-1"/></svg>';
  var T = {
    de: {
      title: "COR DEO als App auf dem Handy",
      text: "Mit einem Symbol auf dem Startbildschirm öffnest du die Karten wie eine App – ohne langen Link.",
      frameText: "Öffne COR DEO in einem eigenen Tab und installiere es dort als App: Symbol auf dem Startbildschirm, ohne langen Link.",
      frameBtn: "Als App öffnen", install: "Installieren", howto: "So geht’s", hide: "Anleitung ausblenden",
      close: "Schließen", footer: "App installieren", region: "COR DEO installieren",
      ios: ["Tippe unten auf das Teilen-Symbol " + SHARE + ".", "Scrolle und wähle „Zum Home-Bildschirm“.", "Tippe oben rechts auf „Hinzufügen“."],
      iosWebview: "Du hast den Link in einer anderen App geöffnet (z. B. WhatsApp). Öffne ihn zuerst in Safari: Tippe auf Teilen bzw. ⋯ und wähle „In Safari öffnen“. Danach:",
      android: ["Tippe oben rechts auf das Menü ⋮.", "Wähle „App installieren“ (oder „Zum Startbildschirm hinzufügen“).", "Bestätige mit „Installieren“."],
      androidWebview: "Du hast den Link in einer anderen App geöffnet (z. B. WhatsApp)? Tippe auf ⋮ und wähle „Im Browser öffnen“ bzw. „In Chrome öffnen“. Danach:",
      other: ["Öffne das Browser-Menü.", "Wähle „App installieren“ oder „Zum Startbildschirm hinzufügen“."],
      done: "COR DEO wurde installiert – das Symbol findest du auf deinem Startbildschirm.",
      offLoading: "Karten werden für die Offline-Nutzung geladen … ",
      offDone: "✓ Alle {n} Karten sind jetzt auch ohne Internet verfügbar.",
      offPartial: "Offline-Karten: {d} von {n} geladen. Bei der nächsten Verbindung wird der Rest nachgeladen."
    },
    en: {
      title: "COR DEO as an app on your phone",
      text: "Add an icon to your home screen and open the cards like an app – no long link needed.",
      frameText: "Open COR DEO in its own tab and install it there as an app: an icon on your home screen, no long link.",
      frameBtn: "Open as app", install: "Install", howto: "How to", hide: "Hide steps",
      close: "Close", footer: "Install app", region: "Install COR DEO",
      ios: ["Tap the Share icon " + SHARE + " at the bottom.", "Scroll and choose “Add to Home Screen”.", "Tap “Add” at the top right."],
      iosWebview: "You opened the link inside another app (e.g. WhatsApp). Open it in Safari first: tap Share or ⋯ and choose “Open in Safari”. Then:",
      android: ["Tap the menu ⋮ at the top right.", "Choose “Install app” (or “Add to Home screen”).", "Confirm with “Install”."],
      androidWebview: "Opened the link inside another app (e.g. WhatsApp)? Tap ⋮ and choose “Open in browser” or “Open in Chrome”. Then:",
      other: ["Open the browser menu.", "Choose “Install app” or “Add to Home screen”."],
      done: "COR DEO is installed – you will find the icon on your home screen.",
      offLoading: "Loading cards for offline use … ",
      offDone: "✓ All {n} cards are now available without internet.",
      offPartial: "Offline cards: {d} of {n} loaded. The rest will load on the next connection."
    }
  };
  var cfg = window.COR_DEO_CONFIG || {};
  var S = T[cfg.uiLang] || T.de;

  /* ---------- 3. Umgebung erkennen ---------- */
  var ua = navigator.userAgent || "";
  var params = new URLSearchParams(location.search);
  var standalone = (window.matchMedia && window.matchMedia("(display-mode: standalone)").matches) || window.navigator.standalone === true;
  var inFrame = false; try { inFrame = window.self !== window.top; } catch (e) { inFrame = true; }
  var isIOS = /iPad|iPhone|iPod/.test(ua) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  var isAndroid = /Android/i.test(ua);
  var iosWebview = isIOS && !/Safari\//.test(ua);                       // WhatsApp, Facebook … ohne "Safari/"
  var androidWebview = isAndroid && /; wv\)|FBAN|FBAV|Instagram|Line\//.test(ua);

  /* ---------- 3b. Alle Karten für die Offline-Nutzung vorab laden ----------
     Nur wenn die App wirklich installiert ist (Start vom Startbildschirm) oder gerade installiert wurde,
     damit normale Besucher (z. B. im Google-Sites-Rahmen) nicht ~7,6 MB laden.
     Zum Testen im Browser: ?offline=1 */
  var offlineStarted = false, offlineEl = null;
  function offlineLine() {
    if (offlineEl) return offlineEl;
    var foot = document.getElementById("footerText");
    offlineEl = document.createElement("p");
    offlineEl.className = "mini pwa-offline";
    offlineEl.setAttribute("role", "status");
    offlineEl.style.textAlign = "center";
    if (foot && foot.parentNode) foot.parentNode.insertBefore(offlineEl, foot.nextSibling);
    else document.body.appendChild(offlineEl);
    return offlineEl;
  }
  function startOffline() {
    if (offlineStarted || inFrame) return;
    if (!("serviceWorker" in navigator) || !/^https?:$/.test(location.protocol)) return;
    var conn = navigator.connection || {};
    if (conn.saveData && params.get("offline") !== "1") return;            // Datensparmodus respektieren
    offlineStarted = true;
    navigator.serviceWorker.addEventListener("message", function (e) {
      var d = e.data || {};
      if (d.type === "precache-progress") {
        offlineLine().textContent = S.offLoading + d.done + "/" + d.total;
      } else if (d.type === "precache-done") {
        offlineLine().textContent = d.failed ? S.offPartial.replace("{d}", d.done).replace("{n}", d.total)
                                             : S.offDone.replace("{n}", d.total);
      }
    });
    navigator.serviceWorker.ready.then(function (reg) {
      var w = reg.active || navigator.serviceWorker.controller;
      if (w) setTimeout(function () { w.postMessage({ type: "precache" }); }, 1500);   // erst die Seite, dann die Karten
    }).catch(function () {});
  }
  window.addEventListener("appinstalled", startOffline);
  if (standalone || params.get("offline") === "1") {
    if (document.readyState === "complete") startOffline();
    else window.addEventListener("load", startOffline);
  }

  if (standalone || params.get("pwa") === "0") return;                   // schon installiert / bewusst aus

  /* ---------- 4. Speicher (darf nie Fehler werfen) ---------- */
  var KEY = "cordeo.pwa.hideUntil";
  function getHide() { try { return +window.localStorage.getItem(KEY) || 0; } catch (e) { return 0; } }
  function setHide(ms) { try { window.localStorage.setItem(KEY, String(ms)); } catch (e) { /* ignore */ } }

  /* ---------- 5. Stil (nutzt die vorhandenen Farben der App) ---------- */
  var css = document.createElement("style");
  css.textContent =
    ".pwa-wrap{margin-top:14px}" +
    ".pwa-card{position:relative;display:flex;gap:14px;align-items:flex-start;padding:14px 44px 14px 14px;" +
      "background:var(--surface-strong);border:1px solid var(--line);border-radius:var(--radius-ui)}" +
    ".pwa-ico{flex:none;width:46px;height:46px;border-radius:11px;box-shadow:0 0 0 1px var(--line-strong)}" +
    ".pwa-body{min-width:0;flex:1}" +
    ".pwa-title{display:block;font-family:var(--font-display);font-size:1.2rem;line-height:1.2;color:var(--gold-bright)}" +
    ".pwa-text{margin:6px 0 0;font-size:.9rem;color:var(--text-muted)}" +
    ".pwa-steps{margin:10px 0 0;padding-left:1.25em;font-size:.92rem;color:var(--text)}" +
    ".pwa-steps li{margin:4px 0}" +
    ".pwa-share{vertical-align:-3px;color:var(--gold-bright)}" +
    ".pwa-note{margin:10px 0 0;font-size:.85rem;color:var(--text-muted)}" +
    ".pwa-actions{display:flex;flex-wrap:wrap;gap:8px;margin-top:12px}" +
    ".pwa-x{position:absolute;top:6px;right:6px;width:34px;height:34px;display:grid;place-items:center;border:0;border-radius:50%;" +
      "background:transparent;color:var(--text-muted);cursor:pointer}" +
    ".pwa-x:hover{background:var(--surface);color:var(--text)}" +
    ".pwa-link{background:none;border:0;padding:6px 8px;color:var(--gold);font:inherit;letter-spacing:inherit;text-decoration:underline;cursor:pointer}" +
    ".pwa-open{text-decoration:none}";
  document.head.appendChild(css);

  /* ---------- 6. Karte aufbauen ---------- */
  var wrap = document.createElement("div");
  wrap.className = "container pwa-wrap";
  wrap.hidden = true;
  wrap.innerHTML =
    '<aside class="pwa-card" role="region" aria-label="' + S.region + '">' +
      '<img class="pwa-ico" src="icons/apple-touch-icon.png" alt="" width="46" height="46">' +
      '<div class="pwa-body">' +
        '<strong class="pwa-title">' + S.title + '</strong>' +
        '<p class="pwa-text"></p>' +
        '<p class="pwa-note" hidden></p>' +
        '<ol class="pwa-steps" hidden></ol>' +
        '<div class="pwa-actions">' +
          '<a class="btn btn-primary btn-sm pwa-open" target="_blank" rel="noopener" hidden></a>' +
          '<button type="button" class="btn btn-primary btn-sm pwa-install" hidden>' + S.install + '</button>' +
          '<button type="button" class="btn btn-ghost btn-sm pwa-howto" hidden>' + S.howto + '</button>' +
        '</div>' +
      '</div>' +
      '<button type="button" class="pwa-x" aria-label="' + S.close + '">' +
        '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>' +
      '</button>' +
    '</aside>';

  var $ = function (sel) { return wrap.querySelector(sel); };
  var elText = $(".pwa-text"), elNote = $(".pwa-note"), elSteps = $(".pwa-steps"),
      btnOpen = $(".pwa-open"), btnInstall = $(".pwa-install"), btnHowto = $(".pwa-howto"),
      btnX = $(".pwa-x");

  var deferred = null;          // Android: gespeichertes beforeinstallprompt-Ereignis
  var stepsOpen = false;

  function fillSteps() {
    var list = isIOS ? S.ios : (isAndroid ? S.android : S.other);
    var note = isIOS ? (iosWebview ? S.iosWebview : "") : (androidWebview ? S.androidWebview : "");
    elSteps.innerHTML = "";
    list.forEach(function (t) { var li = document.createElement("li"); li.innerHTML = t; elSteps.appendChild(li); });
    elNote.textContent = note;
    elNote.hidden = !note || !stepsOpen;
  }

  function render() {
    // Im Google-Sites-Rahmen kann man nicht installieren -> eigenen Tab öffnen.
    if (inFrame) {
      elText.textContent = S.frameText;
      btnOpen.textContent = S.frameBtn;
      btnOpen.href = location.origin + location.pathname + "?install=1";
      btnOpen.hidden = false; btnInstall.hidden = true; btnHowto.hidden = true;
      elSteps.hidden = true; elNote.hidden = true;
      return;
    }
    elText.textContent = S.text;
    btnOpen.hidden = true;
    if (deferred) {                                   // Android/Chrome: direkt installieren
      btnInstall.hidden = false; btnHowto.hidden = true;
      elSteps.hidden = true; elNote.hidden = true;
      return;
    }
    btnInstall.hidden = true; btnHowto.hidden = false;  // iPhone & Co.: Anleitung
    fillSteps();
    elSteps.hidden = !stepsOpen;
    btnHowto.textContent = stepsOpen ? S.hide : S.howto;
  }

  function show(scroll) {
    wrap.hidden = false;
    render();
    if (scroll && wrap.scrollIntoView) wrap.scrollIntoView({ behavior: "smooth", block: "start" });
  }
  function dismiss() {
    wrap.hidden = true;
    setHide(Date.now() + 14 * 24 * 3600 * 1000);       // 14 Tage Ruhe
  }

  /* ---------- 7. Ereignisse ---------- */
  window.addEventListener("beforeinstallprompt", function (e) {
    e.preventDefault();
    deferred = e;
    if (!wrap.hidden) render();
  });
  window.addEventListener("appinstalled", function () {
    deferred = null;
    wrap.hidden = true;
    var live = document.getElementById("live"); if (live) live.textContent = S.done;
  });

  btnInstall.addEventListener("click", function () {
    if (!deferred) return;
    var p = deferred; deferred = null;
    p.prompt();
    if (p.userChoice && p.userChoice.then) p.userChoice.then(function (r) {
      if (r && r.outcome === "accepted") wrap.hidden = true; else render();
    });
  });
  btnHowto.addEventListener("click", function () { stepsOpen = !stepsOpen; render(); });
  btnX.addEventListener("click", dismiss);

  /* ---------- 8. Einbauen ---------- */
  var tabbar = document.getElementById("tabbar");
  if (tabbar && tabbar.parentNode) tabbar.parentNode.insertBefore(wrap, tabbar);
  else document.body.insertBefore(wrap, document.body.firstChild);

  // dauerhafter kleiner Link im Fuß der Seite
  var foot = document.getElementById("footerText");
  if (foot && foot.parentNode) {
    var p = document.createElement("p");
    var b = document.createElement("button");
    b.type = "button"; b.className = "pwa-link"; b.textContent = S.footer;
    b.addEventListener("click", function () { if (!inFrame && !deferred) stepsOpen = true; show(true); });
    p.appendChild(b); foot.parentNode.insertBefore(p, foot.nextSibling);
  }

  var forced = params.get("install") === "1";
  if (forced && !inFrame) stepsOpen = true;
  if (forced || Date.now() > getHide()) show(false);
})();
