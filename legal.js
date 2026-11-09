/* ============================================================================
   COR DEO — Impressum + Datenschutzerklärung
   ----------------------------------------------------------------------------
   • kleine, dezente Links „Impressum · Datenschutz“ ganz unten im Fuß der Seite
   • ein Tipp öffnet ein ruhiges Fenster im Stil der App (Esc oder × schließt)
   • die Texte stehen nur auf Deutsch (rechtlich maßgebliche Fassung)
   • Direktlinks:  …/#impressum   und   …/#datenschutz
   • Diese Datei ist eigenständig; sie braucht nur index.html (Fuß mit class "footer").

   ANGABEN ÄNDERN: nur den Block LEGAL direkt darunter bearbeiten.
   Stand der Texte ändern: LEGAL.stand.
   ============================================================================ */
(function () {
  "use strict";

  /* ---------- Hier die Angaben eintragen ---------- */
  var LEGAL = {
    name: "Michael Ghaly",
    street: "Weißkopfstraße 24",
    city: "86343 Königsbrunn",
    country: "Deutschland",
    mailUser: "mechogh",
    mailHost: "protonmail.com",
    stand: "November 2026"
  };

  var footer = document.querySelector("footer.footer");
  if (!footer) return;

  var mail = LEGAL.mailUser + "@" + LEGAL.mailHost;
  var mailLink = '<a href="mailto:' + mail + '">' + mail + "</a>";
  var address = LEGAL.name + "<br>" + LEGAL.street + "<br>" + LEGAL.city + "<br>" + LEGAL.country;

  /* ---------- Texte ---------- */
  var TEXT = {
    impressum: {
      title: "Impressum",
      html:
        "<h3>Angaben gemäß § 5 DDG</h3>" +
        "<p>" + address + "</p>" +
        "<h3>Kontakt</h3>" +
        "<p>E-Mail: " + mailLink + "</p>" +
        "<h3>Verantwortlich für den Inhalt (§ 18 Abs. 2 MStV)</h3>" +
        "<p>" + LEGAL.name + ", Anschrift wie oben.</p>" +
        "<h3>Urheberrecht</h3>" +
        "<p>Konzept, Gestaltung, Kartenbilder und Texte von COR DEO stammen von " + LEGAL.name + ". " +
        "Eine Verwendung außerhalb dieser Anwendung, insbesondere die Vervielfältigung oder Weitergabe der Karten, " +
        "ist nur mit vorheriger Zustimmung gestattet.</p>" +
        "<h3>Hinweis zum Inhalt</h3>" +
        "<p>Cor Deo ist ein Begleiter, kein Ersatz für Gottes Wort, Gebet und Gemeinde. Prüfe alles an der Heiligen Schrift.</p>" +
        "<h3>Glaubensgrundlage</h3>" +
        "<p>Cor Deo steht auf dem Boden der Heiligen Schrift und des Apostolischen und Nizänischen Glaubensbekenntnisses: " +
        "Es gibt einen Gott in drei Personen, Vater, Sohn und Heiliger Geist. Jesus Christus ist wahrer Gott und wahrer Mensch, " +
        "Gottes eingeborener Sohn. Er starb für unsere Sünden, wurde begraben und ist leiblich auferstanden. " +
        "Er ist zum Vater aufgefahren und wird wiederkommen, um zu richten die Lebenden und die Toten. " +
        "Wir werden allein aus Gnade durch den Glauben gerettet, nicht aus eigenen Werken (Epheser 2,8–9). " +
        "Der Maßstab für alles ist die Bibel; die Grundlage der Evangelischen Allianz (Glaubensbasis) wird geteilt.</p>" +
        "<h3>Bibeltext</h3>" +
        "<p>Bibelstellen auf den Karten: Schlachter 2000, © 2000 Genfer Bibelgesellschaft.</p>" +
        "<h3>Haftung für Links</h3>" +
        "<p>Diese Anwendung enthält keine bewusst gesetzten Links auf fremde Inhalte. Sollten Sie dennoch auf einen " +
        "problematischen Verweis stoßen, bitte ich um einen kurzen Hinweis per E-Mail.</p>"
    },
    datenschutz: {
      title: "Datenschutzerklärung",
      html:
        "<p class=\"lg-lead\">Kurz gesagt: COR DEO hat keine Konten, keine Werbung und keine Auswertung deines Verhaltens. " +
        "Was du in der Anwendung eingibst, bleibt auf deinem Gerät.</p>" +

        "<h3>1. Verantwortlicher</h3>" +
        "<p>" + address + "<br>E-Mail: " + mailLink + "</p>" +

        "<h3>2. Aufruf der Seite (Hosting)</h3>" +
        "<p>COR DEO wird über GitHub Pages bereitgestellt (GitHub, Inc., USA, ein Unternehmen von Microsoft). " +
        "Beim Aufruf verarbeitet GitHub technisch notwendige Daten wie deine IP-Adresse, Datum und Uhrzeit sowie " +
        "Angaben zu Browser und Gerät, um die Seite auszuliefern und die Sicherheit zu gewährleisten. " +
        "Auf diese Daten habe ich als Betreiber keinen Zugriff. " +
        "Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO (sichere und zuverlässige Bereitstellung der Anwendung). " +
        "Weitere Informationen findest du in den Datenschutzhinweisen von GitHub.</p>" +

        "<h3>3. Speicherung auf deinem Gerät</h3>" +
        "<p>Damit du weitermachen kannst, wo du aufgehört hast, speichert die Anwendung Angaben in deinem Browser " +
        "(localStorage): gezogene Karten, Tage der Reflexion, deine Notizen im Tagebuch, Spielstand und Einstellungen wie Sprache oder Farbschema. " +
        "Diese Daten werden nicht an mich oder Dritte übertragen. " +
        "Deine Notizen können sehr persönliche Inhalte enthalten; sie bleiben ausschließlich auf deinem Gerät. " +
        "Außerdem legt ein Service Worker Seitendateien und Kartenbilder im Zwischenspeicher deines Browsers ab, " +
        "damit COR DEO auch ohne Internetverbindung funktioniert. " +
        "Beides ist für die gewünschte Funktion erforderlich (§ 25 Abs. 2 Nr. 2 TDDDG); eine Einwilligung ist daher nicht nötig. " +
        "Du kannst alles jederzeit löschen: im Bereich „Mein Weg“ über „Alles zurücksetzen“ oder in den Einstellungen deines Browsers " +
        "(Website-Daten löschen). Cookies zu Werbe- oder Analysezwecken setze ich nicht ein.</p>" +

        "<h3>4. Schriftarten</h3>" +
        "<p>Die verwendeten Schriften sind in die Anwendung eingebunden und werden von derselben Adresse geladen. " +
        "Es wird keine Verbindung zu Google oder anderen Schriftdiensten aufgebaut.</p>" +

        "<h3>5. Kontakt per E-Mail</h3>" +
        "<p>Wenn du mir schreibst, verarbeite ich deine Nachricht und deine E-Mail-Adresse, um dir zu antworten " +
        "(Art. 6 Abs. 1 lit. f DSGVO, bei Anfragen im Rahmen einer Zusammenarbeit lit. b). " +
        "Ich lösche sie, sobald die Angelegenheit erledigt ist und keine Aufbewahrungspflichten bestehen. " +
        "Mein Postfach wird bei Proton (Schweiz) geführt.</p>" +

        "<h3>6. Einbindung in andere Seiten</h3>" +
        "<p>Wird COR DEO in eine andere Seite eingebettet (zum Beispiel Google Sites), gelten für diese Seite zusätzlich " +
        "die Datenschutzhinweise ihres Betreibers.</p>" +

        "<h3>7. Deine Rechte</h3>" +
        "<p>Du hast das Recht auf Auskunft, Berichtigung, Löschung, Einschränkung der Verarbeitung, Datenübertragbarkeit " +
        "und Widerspruch (Art. 15 bis 21 DSGVO). Wende dich dazu an die oben genannte E-Mail-Adresse. " +
        "Außerdem kannst du dich bei einer Datenschutzaufsichtsbehörde beschweren, zum Beispiel beim " +
        "Bayerischen Landesamt für Datenschutzaufsicht, Promenade 18, 91522 Ansbach.</p>" +

        "<p class=\"lg-stand\">Stand: " + LEGAL.stand + "</p>"
    }
  };

  /* ---------- Stil (nutzt die Farben und Schriften der App, passt sich hell/dunkel an) ---------- */
  var css = document.createElement("style");
  css.textContent =
    ".legal-links{margin:10px 0 0;font-size:.78rem;letter-spacing:.06em;color:var(--text-muted)}" +
    ".legal-links button{all:unset;cursor:pointer;color:inherit;padding:.4rem .5rem;border-radius:6px;opacity:.8;" +
      "text-decoration:underline;text-decoration-color:transparent;text-underline-offset:.28em;transition:opacity .2s,text-decoration-color .2s,color .2s}" +
    ".legal-links button:hover,.legal-links button:focus-visible{opacity:1;color:var(--gold);text-decoration-color:currentColor}" +
    ".legal-links button:focus-visible{outline:2px solid var(--gold);outline-offset:1px}" +
    ".legal-links .lg-dot{opacity:.5}" +
    "dialog.legal-dlg{padding:0;border:1px solid var(--line-strong);border-radius:var(--radius-card,14px);background:var(--bg-1,#0c1230);color:var(--text);" +
      "width:min(38rem,calc(100vw - 24px));max-height:min(82vh,46rem);box-shadow:0 30px 70px -20px rgba(0,0,0,.8);overflow:hidden}" +
    "dialog.legal-dlg[open]{display:flex;flex-direction:column}" +
    "dialog.legal-dlg::backdrop{background:var(--overlay-bg,rgba(4,6,16,.94))}" +
    ".lg-head{display:flex;align-items:center;gap:6px;padding:10px 12px 10px 18px;border-bottom:1px solid var(--line);flex:none}" +
    ".lg-tabs{display:flex;gap:4px;flex:1;min-width:0}" +
    ".lg-tab{all:unset;cursor:pointer;font-family:var(--font-ui);font-size:.82rem;font-weight:500;letter-spacing:.05em;padding:.55rem .8rem;border-radius:999px;color:var(--text-muted);white-space:nowrap}" +
    ".lg-tab[aria-selected=true]{background:var(--surface-strong);color:var(--gold-bright,var(--gold))}" +
    ".lg-tab:hover{color:var(--gold)}.lg-tab:focus-visible,.lg-x:focus-visible{outline:2px solid var(--gold);outline-offset:1px}" +
    ".lg-x{all:unset;cursor:pointer;width:38px;height:38px;border-radius:50%;display:grid;place-items:center;color:var(--text-muted);flex:none}" +
    ".lg-x:hover{background:var(--surface-strong);color:var(--text)}" +
    ".lg-x svg{width:18px;height:18px;fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round}" +
    ".lg-body{overflow:auto;padding:6px 22px 24px;font-family:var(--font-ui);font-size:.9rem;line-height:1.65;overscroll-behavior:contain}" +
    ".lg-body h2{font-family:var(--font-display);font-weight:600;font-size:1.7rem;color:var(--gold-bright,var(--gold));margin:.9rem 0 .2rem}" +
    ".lg-body h3{font-family:var(--font-display);font-weight:600;font-size:1.12rem;color:var(--gold);margin:1.3rem 0 .15rem;letter-spacing:.02em}" +
    ".lg-body p{margin:.3rem 0;color:var(--text)}" +
    ".lg-body a{color:var(--gold);text-underline-offset:.2em;word-break:break-word}" +
    ".lg-lead{font-family:var(--font-display);font-style:italic;font-size:1.12rem;line-height:1.5;color:var(--text-muted)!important;margin:.5rem 0 .2rem!important}" +
    ".lg-stand{margin-top:1.4rem!important;font-size:.78rem;color:var(--text-muted)!important}";
  document.head.appendChild(css);

  /* ---------- Links im Fuß ---------- */
  var links = document.createElement("p");
  links.className = "legal-links";
  links.innerHTML =
    '<button type="button" data-legal="impressum">Impressum</button>' +
    '<span class="lg-dot" aria-hidden="true"> · </span>' +
    '<button type="button" data-legal="datenschutz">Datenschutz</button>';
  footer.appendChild(links);

  /* ---------- Fenster ---------- */
  var dlg = document.createElement("dialog");
  dlg.className = "legal-dlg";
  dlg.setAttribute("aria-labelledby", "lgTitle");
  dlg.innerHTML =
    '<div class="lg-head">' +
      '<div class="lg-tabs" role="tablist" aria-label="Rechtliche Hinweise">' +
        '<button type="button" class="lg-tab" role="tab" data-legal="impressum">Impressum</button>' +
        '<button type="button" class="lg-tab" role="tab" data-legal="datenschutz">Datenschutz</button>' +
      "</div>" +
      '<button type="button" class="lg-x" aria-label="Schließen"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg></button>' +
    "</div>" +
    '<div class="lg-body" id="lgBody" tabindex="-1"></div>';
  document.body.appendChild(dlg);

  var body = dlg.querySelector("#lgBody");
  var tabs = dlg.querySelectorAll(".lg-tab");
  var opener = null;

  function show(which) {
    var t = TEXT[which] || TEXT.impressum;
    which = TEXT[which] ? which : "impressum";
    body.innerHTML = '<h2 id="lgTitle">' + t.title + "</h2>" + t.html;
    body.scrollTop = 0;
    Array.prototype.forEach.call(tabs, function (b) {
      b.setAttribute("aria-selected", b.getAttribute("data-legal") === which ? "true" : "false");
    });
  }

  function open(which, from) {
    opener = from || document.activeElement;
    show(which);
    if (!dlg.open) { if (dlg.showModal) dlg.showModal(); else dlg.setAttribute("open", ""); }
    if (history.replaceState) { try { history.replaceState(null, "", "#" + which); } catch (e) {} }
  }

  function close() {
    if (dlg.open) { if (dlg.close) dlg.close(); else dlg.removeAttribute("open"); }
  }

  dlg.addEventListener("close", function () {
    if (location.hash === "#impressum" || location.hash === "#datenschutz") {
      if (history.replaceState) { try { history.replaceState(null, "", location.pathname + location.search); } catch (e) {} }
    }
    if (opener && opener.focus) { try { opener.focus(); } catch (e) {} }
  });
  dlg.addEventListener("click", function (e) {
    if (e.target === dlg) { close(); return; }                       // Klick auf den Hintergrund
    var x = e.target.closest(".lg-x"); if (x) { close(); return; }
    var t = e.target.closest(".lg-tab"); if (t) show(t.getAttribute("data-legal"));
  });
  links.addEventListener("click", function (e) {
    var b = e.target.closest("button[data-legal]");
    if (b) open(b.getAttribute("data-legal"), b);
  });

  /* Direktlink  …/#impressum  bzw.  …/#datenschutz */
  function fromHash() {
    var h = (location.hash || "").replace("#", "");
    if (TEXT[h]) open(h, links.querySelector('button[data-legal="' + h + '"]'));
  }
  window.addEventListener("hashchange", fromHash);
  if (document.readyState === "complete") fromHash(); else window.addEventListener("load", fromHash);
})();
