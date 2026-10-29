#!/usr/bin/env python3
"""Erzeugt den QR-Code für die Teilen-Funktion: share-qr.svg (Anzeige) und share-qr.png (Download/Druck).

Aufruf (nur nötig, wenn sich die Adresse der App ändert):
    pip install segno
    python3 tools/make-qr.py

Die Adresse muss mit APP_URL in share.js übereinstimmen. Schwarz auf Weiß mit 4 Modulen Rand (Quiet Zone),
Fehlerkorrektur Q – das ist am zuverlässigsten für Handykameras.
"""
import segno

URL = "https://mechogh-jpg.github.io/Cor-Deo-cards/?install=1"

qr = segno.make(URL, error="q", micro=False)
qr.save("share-qr.svg", scale=10, border=4, dark="#000000", light="#ffffff", xmldecl=False, svgns=True,
        omitsize=False, nl=False)
qr.save("share-qr.png", scale=16, border=4, dark="#000000", light="#ffffff")
print("OK:", URL, "- Version", qr.version, "-", qr.symbol_size(border=4))
