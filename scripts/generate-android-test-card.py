#!/usr/bin/env python3
"""Build a deterministic A5 counter card and QR for the Android closed test.

Same pipeline as scripts/generate-review-card.py: the care-card font source,
license check, dependency pins (scripts/assets/care-card/requirements.txt) and
owner logo. No network requests.

The QR and printed link point to our own page (www.yikat.tech/android), never
straight to the Google Group, so a renamed group does not require reprinting.
The page URL comes from lib/android-test.ts.
"""
from __future__ import annotations

import hashlib
import importlib.util
import json
import re
import sys
from pathlib import Path

import qrcode
from PIL import Image
from pypdf import PdfReader
from reportlab.lib.colors import white
from reportlab.lib.enums import TA_CENTER
from reportlab.lib.pagesizes import A5
from reportlab.lib.styles import ParagraphStyle
from reportlab.pdfgen import canvas
from reportlab.platypus import Paragraph

ROOT = Path(__file__).resolve().parent.parent
OUTPUT = ROOT / "public/downloads/yikat-android-test-karti.pdf"
SVG_OUTPUT = ROOT / "public/images/android-test-qr.svg"
EXPECTED_URL = "https://www.yikat.tech/android"
sys.dont_write_bytecode = True
spec = importlib.util.spec_from_file_location("care_card", ROOT / "scripts/generate-care-card.py")
care = importlib.util.module_from_spec(spec)
spec.loader.exec_module(care)
WIDTH, HEIGHT = A5
MARGIN = 30
QR_SIZE = 160


def paragraph(c, text, top, size, leading, font="Bricolage", max_height=100):
    p = Paragraph(text, ParagraphStyle("android", fontName=font, fontSize=size,
                  leading=leading, textColor=care.NAVY, alignment=TA_CENTER))
    _, height = p.wrap(WIDTH - MARGIN * 2, 1000)
    if size < 11 or height > max_height or top - height < MARGIN:
        raise ValueError("Android-card text is outside the safe area")
    p.drawOn(c, MARGIN, top - height)
    return top - height


def constant(name: str) -> str:
    match = re.search(rf'{name}:\s*"([^"]+)"', (ROOT / "lib/android-test.ts").read_text())
    return match.group(1) if match else ""


def build():
    url = constant("pageUrl")
    if url != EXPECTED_URL:
        raise ValueError("The card must point to www.yikat.tech/android; check lib/android-test.ts")
    group = constant("groupUrl")
    if not group.startswith("https://groups.google.com/"):
        raise ValueError("groupUrl not found in lib/android-test.ts")
    care.fonts()
    qr = qrcode.QRCode(error_correction=qrcode.constants.ERROR_CORRECT_M, border=4)
    qr.add_data(url)
    qr.make(fit=True)
    matrix = qr.get_matrix()
    side = len(matrix)
    # Accessible standalone SVG, exact modules and an intact four-module quiet zone.
    modules = "".join(f"M{x},{y}h1v1h-1z" for y, row in enumerate(matrix)
                      for x, dark in enumerate(row) if dark)
    SVG_OUTPUT.write_text(f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {side} {side}" '
                          f'role="img" aria-labelledby="title"><title id="title">Yıkat Android test sayfası QR kodu</title>'
                          f'<rect width="{side}" height="{side}" fill="white"/>'
                          f'<path d="{modules}" fill="#042C53"/></svg>\n')
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    c = canvas.Canvas(str(OUTPUT), pagesize=A5, invariant=1, pageCompression=1)
    c.setTitle("Android’in varsa bir ricamız var | Yıkat")
    c.setAuthor("Yıkat")
    c.setSubject("Yıkat Gitsin Android kapalı testine isteğe bağlı katılım")
    c.setCreator("Yıkat android-test-card generator")
    c.setFillColor(white)
    c.rect(0, 0, WIDTH, HEIGHT, fill=1, stroke=0)
    with Image.open(care.LOGO) as im:
        logo_height = 90 * im.height / im.width
    c.drawImage(str(care.LOGO), (WIDTH - 90) / 2, 525, width=90, height=logo_height, mask="auto")
    # Top to bottom; each block starts under the previous one, and paragraph()
    # refuses anything that wraps further than planned or leaves the margin.
    # The favour framing matches the page and Instagram; the card quotes no
    # button label, because Play's Turkish opt-in label is not verified yet.
    bottom = paragraph(c, "Android’in varsa<br/>bir ricamız var.", 506, 27, 31, "BricolageBold", 62)
    bottom = paragraph(c, "Yıkat Gitsin Google Play’de kapalı testte.<br/>Deneyerek herkese açılmasına yardım edebilirsin.",
                       bottom - 10, 13.5, 19, max_height=38)
    qr_y = bottom - 8 - QR_SIZE
    care.draw_qr(c, url, (WIDTH - QR_SIZE) / 2, qr_y, QR_SIZE)
    bottom = paragraph(c, f'<link href="{url}">www.yikat.tech/android</link>', qr_y - 4, 17, 22,
                       "BricolageMedium", 22)
    bottom = paragraph(c, "1. Test grubuna katıl.<br/>2. Aynı hesapla test sayfasında katılma düğmesine dokun.<br/>"
                          "3. Google Play’den yükle.<br/>4. Uygulama herkese açılana kadar testte kal.",
                       bottom - 10, 12, 17, max_height=68)
    paragraph(c, "Takılırsan tezgâhta bize sor.<br/>Katılıp katılmamak tamamen sana kalmış.<br/>"
                 "iPhone’un varsa gerek yok, uygulama App Store’da.",
              bottom - 10, 11, 15, max_height=45)
    c.showPage()
    c.save()

    reader = PdfReader(OUTPUT)
    if len(reader.pages) != 1:
        raise ValueError("Android card must be one A5 page")
    page = reader.pages[0]
    if [round(float(v)) for v in page.mediabox[2:]] != [round(WIDTH), round(HEIGHT)]:
        raise ValueError("Android card must be A5")
    text = page.extract_text()
    for value in ["bir ricamız var.", "kapalı testte", "www.yikat.tech/android",
                  "Test grubuna katıl.", "katılma düğmesine dokun.", "Google Play’den yükle.",
                  "herkese açılana kadar testte kal.", "sana kalmış", "App Store"]:
        if value not in text:
            raise ValueError(f"Missing Turkish copy: {value}")
    for value in ["Testçi ol", "ilk sen", "14 gün testte kal", "isteğe bağlı"]:
        if value in text:
            raise ValueError(f"Retired copy is still printed: {value}")
    links = [str(item.get_object().get("/A", {}).get("/URI", "")) for item in page.get("/Annots", [])]
    if not links or set(links) != {url}:
        raise ValueError(f"Card links must all point to {url}: {links}")
    if group in text or "groups.google.com" in text:
        raise ValueError("The card must not print the Google Group address")
    print(json.dumps({"output": str(OUTPUT), "qr_svg": str(SVG_OUTPUT), "qr_target": url,
                      "pages": 1, "format": "A5", "minimum_text_pt": 11, "links": links,
                      "sha256": hashlib.sha256(OUTPUT.read_bytes()).hexdigest(),
                      "svg_sha256": hashlib.sha256(SVG_OUTPUT.read_bytes()).hexdigest()}, indent=2))


if __name__ == "__main__":
    build()
