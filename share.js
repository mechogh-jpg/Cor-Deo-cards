/* ============================================================================
   COR DEO — Teilen (Link + QR-Code)
   ----------------------------------------------------------------------------
   • kleiner Button „Teilen“ oben rechts im Kopfbereich (Masthead)
   • ein Tipp öffnet ein Fenster mit großem QR-Code (schwarz auf weiß, mit Rand),
     „Link kopieren“ und – wo das Gerät es kann – „Teilen …“ (WhatsApp usw. über das Systemmenü)
   • ohne Tipp bleibt die App unverändert
   • URL-Option:  ?share=0 blendet den Button aus (mit ?compact=1 ist der Kopfbereich ohnehin ausgeblendet)
   • Der QR-Code ist eine feste Datei (share-qr.svg / share-qr.png), erzeugt mit tools/make-qr.py.
     Ändert sich die Adresse der App, dort und unten bei APP_URL anpassen.
   Diese Datei ist eigenständig; sie braucht nur index.html, share-qr.svg und share-qr.png.
   ============================================================================ */
(function () {
  "use strict";

  var params = new URLSearchParams(location.search);
  if (params.get("share") === "0") return;

  /* Direkte Adresse der App (GitHub Pages) – nicht die Google-Sites-Adresse und nicht location.href,
     denn im Google-Sites-Rahmen lässt sich die App nicht installieren. */
  var APP_URL = "https://mechogh-jpg.github.io/Cor-Deo-cards/";
  /* Kopieren und Teilen verwenden dieselbe Adresse wie der QR-Code (mit ?install=1),
     damit auch dort sofort die Installationsschritte für das eigene Gerät erscheinen. */
  var SHARE_URL = APP_URL + "?install=1";

  var T = {
    de: {
      btn: "Teilen", btnLabel: "COR DEO teilen – QR-Code und Link",
      title: "COR DEO teilen",
      lead: "Scanne den Code mit der Handykamera, um COR DEO zu öffnen.",
      qrAlt: "QR-Code, der COR DEO auf dem Handy öffnet",
      copy: "Link kopieren", share: "Teilen …", save: "QR-Code speichern",
      copied: "Link kopiert ✓", copyFail: "Kopieren nicht möglich – bitte den Link unten markieren.",
      close: "Schließen", shareText: "COR DEO – interaktives Kartenset für Gebet und Reflexion",
      howTitle: "So kommt COR DEO auf den Startbildschirm",
      howAndroid: "<b>Android:</b> Link in Chrome öffnen, dann Menü ⋮ → „Zum Startbildschirm hinzufügen“.",
      howIos: "<b>iPhone:</b> Link in Safari öffnen, dann Teilen-Symbol → „Zum Home-Bildschirm“."
    },
    en: {
      btn: "Share", btnLabel: "Share COR DEO – QR code and link",
      title: "Share COR DEO",
      lead: "Scan the code with your phone camera to open COR DEO.",
      qrAlt: "QR code that opens COR DEO on a phone",
      copy: "Copy link", share: "Share …", save: "Save QR code",
      copied: "Link copied ✓", copyFail: "Copying not possible – please select the link below.",
      close: "Close", shareText: "COR DEO – interactive card deck for prayer and reflection",
      howTitle: "How to put COR DEO on your home screen",
      howAndroid: "<b>Android:</b> open the link in Chrome, then menu ⋮ → “Add to Home screen”.",
      howIos: "<b>iPhone:</b> open the link in Safari, then the Share icon → “Add to Home Screen”."
    }
  };
  var cfg = window.COR_DEO_CONFIG || {};
  var S = T[cfg.uiLang] || T.de;

  var masthead = document.getElementById("masthead");
  if (!masthead) return;

  /* ---------- Stil (nutzt die vorhandenen Farben der App) ---------- */
  var css = document.createElement("style");
  css.textContent =
    ".masthead{position:relative}" +
    ".share-open{position:absolute;top:10px;right:var(--gutter,16px);z-index:2;gap:6px}" +
    ".share-open svg{flex:none}" +
    ".share-dlg{width:min(92vw,380px);max-height:92vh;margin:auto;padding:0;overflow:auto;color:var(--text);" +
      "background:linear-gradient(180deg,var(--bg-1),var(--bg-0));border:1px solid var(--line-strong);" +
      "border-radius:18px;box-shadow:0 30px 80px -20px rgba(0,0,0,.8)}" +
    ".share-dlg::backdrop{background:var(--overlay-bg,rgba(4,6,16,.9));backdrop-filter:blur(3px)}" +
    ".share-in{position:relative;padding:22px 20px 20px;text-align:center}" +
    ".share-title{margin:0 28px 6px;font-family:var(--font-display);font-weight:600;font-size:1.7rem;line-height:1.15;color:var(--gold-bright)}" +
    ".share-lead{margin:0 0 14px;font-size:.92rem;color:var(--text-muted)}" +
    ".share-qr{display:block;width:min(72vw,280px);height:auto;aspect-ratio:1;margin:0 auto;background:#fff;" +
      "border-radius:12px;box-shadow:0 0 0 1px var(--line-strong),0 14px 34px -14px rgba(0,0,0,.7);image-rendering:pixelated}" +
    ".share-url{display:block;margin:12px 0 0;font-size:.82rem;color:var(--text-muted);word-break:break-all;user-select:all}" +
    ".share-actions{display:flex;flex-wrap:wrap;justify-content:center;gap:8px;margin-top:14px}" +
    ".share-msg{min-height:1.2em;margin:4px 0 0;font-size:.9rem;color:var(--gold-bright)}" +
    ".share-save{display:inline-block;margin-top:2px;padding:6px 8px;color:var(--gold);font-size:.85rem;text-decoration:underline}" +
    ".share-how{margin:14px 0 0;padding-top:12px;border-top:1px solid var(--line);text-align:left;font-size:.85rem;color:var(--text-muted)}" +
    ".share-how-title{display:block;margin-bottom:4px;color:var(--text);font-weight:600}" +
    ".share-how p{margin:4px 0}.share-how b{color:var(--gold-bright);font-weight:600}" +
    ".share-x{position:absolute;top:8px;right:8px;width:38px;height:38px;display:grid;place-items:center;border:0;border-radius:50%;" +
      "background:transparent;color:var(--text-muted);cursor:pointer}" +
    ".share-x:hover{background:var(--surface);color:var(--text)}" +
    ":root[data-compact=\"1\"] .share-open{display:none}";
  document.head.appendChild(css);

  /* ---------- Button im Kopfbereich ---------- */
  var ICON = '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
             '<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/>' +
             '<path d="M14 14h3v3h-3zM20 14v.01M14 20h3M20 17v4"/></svg>';
  var btn = document.createElement("button");
  btn.type = "button";
  btn.className = "btn btn-ghost btn-sm share-open";
  btn.setAttribute("aria-label", S.btnLabel);
  btn.setAttribute("aria-haspopup", "dialog");
  btn.innerHTML = ICON + "<span>" + S.btn + "</span>";
  masthead.insertBefore(btn, masthead.firstChild);

  /* ---------- Fenster (wird erst beim ersten Öffnen gebaut) ---------- */
  var dlg = null, msg = null, timer = 0;
  var canShare = typeof navigator.share === "function";

  function say(text) {
    if (!msg) return;
    msg.textContent = text;
    clearTimeout(timer);
    if (text) timer = setTimeout(function () { msg.textContent = ""; }, 3500);
  }

  function copyLink() {
    function fallback() {
      var ta = document.createElement("textarea");
      ta.value = SHARE_URL; ta.setAttribute("readonly", "");
      ta.style.cssText = "position:fixed;top:0;left:0;opacity:0";
      dlg.appendChild(ta); ta.select();
      var ok = false; try { ok = document.execCommand("copy"); } catch (e) { ok = false; }
      dlg.removeChild(ta);
      say(ok ? S.copied : S.copyFail);
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(SHARE_URL).then(function () { say(S.copied); }, fallback);
    } else fallback();
  }

  function nativeShare() {
    navigator.share({ title: "COR DEO", text: S.shareText, url: SHARE_URL }).catch(function () { /* abgebrochen */ });
  }

  function build() {
    dlg = document.createElement("dialog");
    dlg.className = "share-dlg";
    dlg.setAttribute("aria-labelledby", "shareTitle");
    dlg.innerHTML =
      '<div class="share-in">' +
        '<h2 class="share-title" id="shareTitle">' + S.title + '</h2>' +
        '<p class="share-lead">' + S.lead + '</p>' +
        '<img class="share-qr" src="share-qr.svg" width="280" height="280" alt="' + S.qrAlt + '">' +
        '<span class="share-url">' + APP_URL.replace(/^https?:\/\//, "") + '</span>' +
        '<div class="share-actions">' +
          '<button type="button" class="btn btn-primary btn-sm share-copy">' + S.copy + '</button>' +
          (canShare ? '<button type="button" class="btn btn-ghost btn-sm share-native">' + S.share + '</button>' : '') +
        '</div>' +
        '<a class="share-save" href="share-qr.png" download="COR-DEO-QR.png">' + S.save + '</a>' +
        '<p class="share-msg" role="status" aria-live="polite"></p>' +
        '<div class="share-how"><span class="share-how-title">' + S.howTitle + '</span>' +
          '<p>' + S.howAndroid + '</p><p>' + S.howIos + '</p></div>' +
        '<button type="button" class="share-x" aria-label="' + S.close + '">' +
          '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>' +
        '</button>' +
      '</div>';
    document.body.appendChild(dlg);
    msg = dlg.querySelector(".share-msg");
    dlg.querySelector(".share-copy").addEventListener("click", copyLink);
    var nat = dlg.querySelector(".share-native");
    if (nat) nat.addEventListener("click", nativeShare);
    dlg.querySelector(".share-x").addEventListener("click", function () { dlg.close(); });
    // Klick auf den abgedunkelten Hintergrund schließt (Esc schließt das <dialog> von selbst)
    dlg.addEventListener("click", function (e) { if (e.target === dlg) dlg.close(); });
    dlg.addEventListener("close", function () { say(""); });
  }

  btn.addEventListener("click", function () {
    if (!dlg) build();
    if (typeof dlg.showModal === "function") dlg.showModal();
    else dlg.setAttribute("open", "");          // sehr alte Browser: ohne Abdunkeln
    var first = dlg.querySelector(".share-copy"); if (first) first.focus();
  });
})();
