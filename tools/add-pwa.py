#!/usr/bin/env python3
"""Fügt die App-Installation (PWA) in eine gebaute index.html ein.

Aufruf (nach jedem Neubau mit build-single-file.py):
    python3 tools/add-pwa.py dist/index.html

Das Skript ist idempotent: läuft es zweimal, passiert beim zweiten Mal nichts.
Es ergänzt nur
  - im <head>:  manifest, Icons und iPhone-Meta-Tags
  - vor </body>: <script src="pwa.js"></script>
Die Dateien manifest.json, sw.js, pwa.js und der Ordner icons/ müssen im Repository neben index.html liegen.
"""
import sys

HEAD = '''  <meta name="theme-color" content="#070a1a">

  <!-- App-Installation (PWA): Symbol auf dem Startbildschirm. Dateien: manifest.json, sw.js, pwa.js, icons/ -->
  <link rel="manifest" href="manifest.json">
  <link rel="icon" type="image/png" sizes="32x32" href="icons/favicon-32.png">
  <link rel="apple-touch-icon" href="icons/apple-touch-icon.png">
  <meta name="mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-title" content="COR DEO">
  <meta name="apple-mobile-web-app-status-bar-style" content="black">'''
HEAD_ANCHOR = '  <meta name="theme-color" content="#070a1a">'
BODY = '  <!-- App-Installation (PWA) -->\n  <script src="pwa.js"></script>\n</body>'


def main(path):
    html = open(path, encoding="utf-8").read()
    changed = False
    if 'rel="manifest"' not in html:
        if HEAD_ANCHOR not in html:
            sys.exit('Fehler: <meta name="theme-color" ...> nicht gefunden – bitte manuell einfügen.')
        html = html.replace(HEAD_ANCHOR, HEAD, 1)
        changed = True
    if 'src="pwa.js"' not in html:
        if html.count("</body>") != 1:
            sys.exit("Fehler: </body> nicht eindeutig gefunden – bitte manuell einfügen.")
        html = html.replace("</body>", BODY, 1)
        changed = True
    if changed:
        open(path, "w", encoding="utf-8").write(html)
        print("PWA-Einträge ergänzt:", path)
    else:
        print("Nichts zu tun – PWA-Einträge sind schon vorhanden:", path)


if __name__ == "__main__":
    if len(sys.argv) != 2:
        sys.exit("Aufruf: python3 tools/add-pwa.py dist/index.html")
    main(sys.argv[1])
