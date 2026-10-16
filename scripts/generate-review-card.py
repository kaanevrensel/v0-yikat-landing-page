#!/usr/bin/env python3
"""Build a deterministic A5 counter card and its machine-readable review QR.

Uses the existing care-card font source, license, dependency pins and owner logo.
No network requests. The exact review destination comes from lib/review-request.ts.
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
OUTPUT = ROOT / "public/downloads/yikat-google-yorum-karti.pdf"
SVG_OUTPUT = ROOT / "public/images/review-qr.svg"
sys.dont_write_bytecode = True
spec = importlib.util.spec_from_file_location("care_card", ROOT / "scripts/generate-care-card.py")
care = importlib.util.module_from_spec(spec)
spec.loader.exec_module(care)
WIDTH, HEIGHT = A5
MARGIN = 30


def paragraph(c, text, top, size, leading, font="Bricolage", max_height=100):
    p = Paragraph(text, ParagraphStyle("review", fontName=font, fontSize=size,
                  leading=leading, textColor=care.NAVY, alignment=TA_CENTER))
    _, height = p.wrap(WIDTH - MARGIN * 2, 1000)
    if size < 11 or height > max_height or top - height < MARGIN:
        raise ValueError("Review-card text is outside the safe area")
    p.drawOn(c, MARGIN, top - height)


def build():
    match = re.search(r'url:\s*"([^"]+)"', (ROOT / "lib/review-request.ts").read_text())
    url = match.group(1) if match else ""
    if url != "https://g.page/r/CUlueYklLvCeEBM/review":
        raise ValueError("Review destination changed; verify the managed profile first")
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
                          f'role="img" aria-labelledby="title"><title id="title">Yıkat Bakırköy Google yorum QR kodu</title>'
                          f'<rect width="{side}" height="{side}" fill="white"/>'
                          f'<path d="{modules}" fill="#042C53"/></svg>\n')
    c = canvas.Canvas(str(OUTPUT), pagesize=A5, invariant=1, pageCompression=1)
    c.setTitle("Deneyimini paylaş | Yıkat")
    c.setAuthor("Yıkat")
    c.setSubject("Bakırköy dükkânı için isteğe bağlı Google yorumu")
    c.setCreator("Yıkat review-card generator")
    c.setFillColor(white)
    c.rect(0, 0, WIDTH, HEIGHT, fill=1, stroke=0)
    with Image.open(care.LOGO) as im:
        logo_height = 99 * im.height / im.width
    c.drawImage(str(care.LOGO), (WIDTH - 99) / 2, 512, width=99, height=logo_height, mask="auto")
    paragraph(c, "Deneyimini paylaş.", 477, 28, 34, "BricolageBold", 34)
    paragraph(c, "Ayakkabını burada temizlettin mi?<br/>Nasıl geçtiğini kendi sözlerinle anlat.",
              429, 13.5, 19, max_height=38)
    care.draw_qr(c, url, (WIDTH - 190) / 2, 184, 190)
    paragraph(c, f'<link href="{url}">Google’da yorum yaz</link>', 164, 17, 22,
              "BricolageMedium", 22)
    paragraph(c, "Olumlu ya da olumsuz, gerçek deneyimin değerlidir.<br/>Yorum bırakmak isteğe bağlıdır.",
              123, 11.5, 16, max_height=32)
    paragraph(c, '<link href="https://www.yikat.tech/yorum">www.yikat.tech/yorum</link>',
              59, 11, 14, max_height=14)
    c.showPage()
    c.save()
    reader = PdfReader(OUTPUT)
    if len(reader.pages) != 1:
        raise ValueError("Review card must be one A5 page")
    text = reader.pages[0].extract_text()
    for value in ["Deneyimini paylaş.", "kendi sözlerinle", "Olumlu ya da olumsuz", "isteğe bağlıdır."]:
        if value not in text:
            raise ValueError(f"Missing Turkish copy: {value}")
    links = [str(item.get_object().get("/A", {}).get("/URI", ""))
             for item in reader.pages[0].get("/Annots", [])]
    if url not in links or "https://www.yikat.tech/yorum" not in links:
        raise ValueError("Missing clickable review destination")
    print(json.dumps({"output": str(OUTPUT), "qr_svg": str(SVG_OUTPUT), "qr_target": url,
                      "pages": 1, "format": "A5", "minimum_text_pt": 11,
                      "sha256": hashlib.sha256(OUTPUT.read_bytes()).hexdigest(),
                      "svg_sha256": hashlib.sha256(SVG_OUTPUT.read_bytes()).hexdigest()}, indent=2))


if __name__ == "__main__":
    build()
