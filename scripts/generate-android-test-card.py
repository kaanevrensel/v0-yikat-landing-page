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
QR_SIZE = 172


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
    c.setTitle("Android’de ilk sen dene | Yıkat")
    c.setAuthor("Yıkat")
    c.setSubject("Yıkat Gitsin Android kapalı testine isteğe bağlı katılım")
    c.setCreator("Yıkat android-test-card generator")
    c.setFillColor(white)
    c.rect(0, 0, WIDTH, HEIGHT, fill=1, stroke=0)
    with Image.open(care.LOGO) as im:
        logo_height = 99 * im.height / im.width
    c.drawImage(str(care.LOGO), (WIDTH - 99) / 2, 512, width=99, height=logo_height, mask="auto")
    paragraph(c, "Android’de ilk sen dene.", 477, 28, 34, "BricolageBold", 34)
    paragraph(c, "Yıkat Gitsin Google Play’de kapalı testte.<br/>14 gün deneyerek herkese açılmasına yardım edebilirsin.",
              431, 13.5, 19, max_height=38)
    qr_y = 196
    care.draw_qr(c, url, (WIDTH - QR_SIZE) / 2, qr_y, QR_SIZE)
    bottom = paragraph(c, f'<link href="{url}">www.yikat.tech/android</link>', qr_y - 6, 17, 22,
                       "BricolageMedium", 22)
    bottom = paragraph(c, "1. Test grubuna katıl.<br/>2. Aynı hesapla “Testçi ol” düğmesine dokun.<br/>"
                          "3. Google Play’den yükle, 14 gün testte kal.",
                       bottom - 12, 12, 17, max_height=51)
    paragraph(c, "Takılırsan tezgâhta bize sor. Katılmak tamamen isteğe bağlı.<br/>"
                 "iPhone’da gerek yok, uygulama App Store’da.",
              bottom - 14, 11, 15, max_height=30)
    c.showPage()
    c.save()

    reader = PdfReader(OUTPUT)
    if len(reader.pages) != 1:
        raise ValueError("Android card must be one A5 page")
    page = reader.pages[0]
    if [round(float(v)) for v in page.mediabox[2:]] != [round(WIDTH), round(HEIGHT)]:
        raise ValueError("Android card must be A5")
    text = page.extract_text()
    for value in ["Android’de ilk sen dene.", "kapalı testte", "www.yikat.tech/android",
                  "Test grubuna katıl.", "Testçi ol", "14 gün testte kal.", "isteğe bağlı", "App Store"]:
        if value not in text:
            raise ValueError(f"Missing Turkish copy: {value}")
    links = [str(item.get_object().get("/A", {}).get("/URI", "")) for item in page.get("/Annots", [])]
    if not links or set(links) != {url}:
        raise ValueError(f"Card links must all point to {url}: {links}")
    if group and group in text:
        raise ValueError("The card must not print the Google Group address")
    print(json.dumps({"output": str(OUTPUT), "qr_svg": str(SVG_OUTPUT), "qr_target": url,
                      "pages": 1, "format": "A5", "minimum_text_pt": 11, "links": links,
                      "sha256": hashlib.sha256(OUTPUT.read_bytes()).hexdigest(),
                      "svg_sha256": hashlib.sha256(SVG_OUTPUT.read_bytes()).hexdigest()}, indent=2))


if __name__ == "__main__":
    build()
