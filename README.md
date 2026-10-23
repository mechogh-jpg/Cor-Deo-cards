# COR DEO — Interactive Card Deck

A premium, responsive 3D flip-card deck (60 cards, 120 images) built with plain HTML, CSS and JavaScript.
No frameworks, no build step. Made to be hosted on GitHub Pages and embedded in Google Sites.

## Folder structure

```
cor-deo/
├── index.html
├── css/styles.css
├── js/cards-data.js     ← the only file you edit
├── js/app.js
├── images/              ← optional: your JPGs, if you host them in this repo
└── README.md
```

## 1. Add your images

Open `js/cards-data.js` and paste your 120 URLs into `window.COR_DEO_IMAGES`, one per line, in this order:

```
front of card 1, back of card 1, front of card 2, back of card 2, … back of card 60
```

Alternative: upload the JPGs to the `images/` folder as `1.jpg … 120.jpg`, leave the array empty, and set
`imagePattern: "images/{n}.jpg"` in the settings at the top of the same file.

**Where should the images live?** Hosting them in the same GitHub repo (`images/` folder) is the most reliable choice.
Google Drive "share" links are converted automatically, but Drive can throttle many simultaneous image requests.

While the array is empty the page shows 60 sample cards, so you can preview the design first.

Optional: add card titles/keywords in `COR_DEO_META` so visitors can search by words, not only by number.

## 2. Publish on GitHub Pages

1. Create a repository (e.g. `cor-deo`) and upload everything in this folder (keep the folder structure).
2. Repository → **Settings → Pages** → Source: *Deploy from a branch* → branch `main`, folder `/ (root)` → Save.
3. After a minute your site is live at `https://YOUR-USERNAME.github.io/cor-deo/`.

## 3. Embed in Google Sites

1. In Google Sites choose **Insert → Embed → By URL**.
2. Paste `https://YOUR-USERNAME.github.io/cor-deo/` and click Insert.
3. Resize the embed to full width and make it tall (drag the handles). The deck scrolls inside its own frame,
   so a height of roughly 700–900 px works well. For a full-page feel, place the embed alone in a section.

URL options (add to the end of the address):

| Option | Effect |
|---|---|
| `?compact=1` | hides the big COR DEO heading (if your page already has one) |
| `?theme=light` / `?theme=dark` / `?theme=auto` | colour theme |
| `?bg=transparent` | lets your Google Sites background show through |
| `?card=12` | opens card 12 in the viewer straight away |

Combine with `&`, e.g. `…/cor-deo/?compact=1&theme=light`.

## How to use the deck

- **Tap / click** a card: flips it. Tap again: flips back.
- **Double-click, long-press, or the small expand button**: opens the full-screen viewer.
- In the viewer: tap the card to flip, swipe or use ← → to browse, **Esc** closes, **F** toggles native full screen.
- **Search** by number (`7`, `#7`, `10-20`, `3, 8, 12`) or by title/keywords you add.
- **Random Card** picks one card, scrolls to it, highlights it and reveals it.
- **Card of the Day** changes at local midnight; every card appears once before any repeats.

## Troubleshooting

- *A card shows "Image unavailable"*: the URL is wrong, not public, or blocked. Use **Retry**, and test the URL in a browser tab.
- *Nothing changes after editing*: hard refresh (Ctrl/Cmd + Shift + R). GitHub Pages can take a minute to update.
- *Odd number of URLs*: the app warns you and ignores the last one.

## App auf dem Handy installieren (PWA)

Neben dem Einbetten in Google Sites kann COR DEO als **App-Symbol** auf dem Startbildschirm installiert werden
(ohne Adressleiste, ohne langen Link, nach dem ersten Öffnen auch offline).

Dateien (alle im Repository neben `index.html`): `manifest.json`, `sw.js`, `pwa.js`, Ordner `icons/`.

| Gerät | So geht's |
|---|---|
| Android (Chrome) | Seite öffnen → Karte „Installieren“ antippen (oder Menü ⋮ → „App installieren“) |
| iPhone (Safari) | Seite öffnen → Teilen-Symbol → „Zum Home-Bildschirm“ → „Hinzufügen“ |

- Direkt-Link zum Installieren: `https://mechogh-jpg.github.io/Cor-Deo-cards/?install=1` (öffnet die Anleitung sofort).
- Links aus WhatsApp öffnen auf dem iPhone oft in einem Mini-Browser: dort zuerst „In Safari öffnen“ wählen.
- Im Google-Sites-Rahmen kann man nicht installieren; dort erscheint der Button „Als App öffnen“, der die App in einem eigenen Tab öffnet.
- `?pwa=0` blendet die Installations-Karte aus (z. B. für die Einbettung in Google Sites, falls sie dort stören sollte).
- Neue Version einer Änderung an `sw.js`: in der ersten Zeile `VERSION` erhöhen.

**Nach jedem Neubau** mit `tools/build-single-file.py`:

```
python3 tools/add-pwa.py dist/index.html
```

Das ergänzt die PWA-Zeilen in der gebauten Datei (nur wenn sie fehlen). Danach `dist/index.html` als `index.html` hochladen.
