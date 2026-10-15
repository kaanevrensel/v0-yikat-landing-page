#!/usr/bin/env python3
"""Build the one-page Turkish Yıkat care card from checked-in source assets.

Dependencies: reportlab, fonttools, qrcode, pillow, pypdf.
Run from any directory: python scripts/generate-care-card.py
The PDF is deterministic. Shop facts come directly from lib/site.ts.
"""

from __future__ import annotations

import hashlib
import io
import json
import re
from pathlib import Path
from xml.sax.saxutils import escape

import qrcode
from fontTools.ttLib import TTFont as SourceFont
from fontTools.varLib.instancer import instantiateVariableFont
from PIL import Image
from pypdf import PdfReader
from reportlab.lib.colors import HexColor, white
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfgen import canvas
from reportlab.platypus import Paragraph

ROOT = Path(__file__).resolve().parent.parent
ASSETS = ROOT / "scripts/assets/care-card"
OUTPUT = ROOT / "public/downloads/yikat-ayakkabi-bakim-karti.pdf"
VARIABLE_FONT = ASSETS / "BricolageGrotesque-variable.ttf"
EXPECTED_FONT_SHA = "413e7357809ddd12fd80a96a8a396de0e401638d4acd3cb3e37532f0472ac682"
LOGO = ROOT / "public/images/yikat-logo-blue.png"
CLARKS = "https://clarks.com.au/pages/shoe-care-guide"
NIKE = "https://www.nike.com/a/can-you-put-shoes-in-the-washer"

NAVY = HexColor("#042C53")
BLUE = HexColor("#1F5EB8")
LIGHT = HexColor("#E6F1FB")
LINE = HexColor("#D4E1ED")
MUTED = HexColor("#40576D")
WIDTH, HEIGHT = A4
MARGIN = 40
CONTENT_WIDTH = WIDTH - MARGIN * 2


def normalize_dashes(value: str) -> str:
    return re.sub(r"[\u2010-\u2015\u2212]", "-", value)


def site_facts() -> dict[str, str]:
    source = (ROOT / "lib/site.ts").read_text()

    def one(pattern: str) -> str:
        result = re.search(pattern, source, re.S)
        if not result:
            raise ValueError(f"Missing site fact: {pattern}")
        return normalize_dashes(result.group(1))

    return {
        "url": one(r'url:\s*"([^"]+)"'),
        "phone": one(r'phone:\s*"([^"]+)"'),
        "phone_href": one(r'phoneHref:\s*"([^"]+)"'),
        "address": one(r'full:\s*"([^"]+)"'),
        "hours": one(r'hours:\s*\{\s*label:\s*"([^"]+)"'),
    }


def fonts() -> None:
    if hashlib.sha256(VARIABLE_FONT.read_bytes()).hexdigest() != EXPECTED_FONT_SHA:
        raise ValueError("The reviewed Google Fonts source has changed")
    if "SIL OPEN FONT LICENSE Version 1.1" not in (ASSETS / "OFL.txt").read_text():
        raise ValueError("Font redistribution requires the original OFL file")
    for name, weight in (("Bricolage", 400), ("BricolageMedium", 600), ("BricolageBold", 700)):
        source = SourceFont(VARIABLE_FONT, recalcTimestamp=False)
        instance = instantiateVariableFont(source, {"opsz": 14, "wdth": 100, "wght": weight}, inplace=False)
        instance.recalcTimestamp = False
        # ReportLab deduplicates embedded faces by their PostScript name. Give
        # each static instance a distinct name so body/medium/bold do not all
        # silently reuse the first registered variable-font instance.
        style_name = {400: "Regular", 600: "Medium", 700: "Bold"}[weight]
        for platform, encoding, language in ((3, 1, 0x409), (1, 0, 0)):
            for name_id, value in ((1, "Yikat Bricolage"), (2, style_name),
                                   (4, "Yikat Bricolage " + style_name),
                                   (6, "YikatBricolage-" + style_name)):
                instance["name"].setName(value, name_id, platform, encoding, language)
        buf = io.BytesIO()
        instance.save(buf)
        buf.seek(0)
        pdfmetrics.registerFont(TTFont(name, buf))


def paragraph(c: canvas.Canvas, text: str, x: float, top: float, width: float,
              size: float = 11.3, leading: float = 15.5,
              font: str = "Bricolage", color=NAVY, max_height: float | None = None) -> float:
    if size < 10:
        raise ValueError("All visible text must be at least 10pt")
    style = ParagraphStyle("card", fontName=font, fontSize=size, leading=leading,
                           textColor=color, alignment=TA_LEFT, spaceAfter=0,
                           allowWidows=0, allowOrphans=0)
    p = Paragraph(text, style)
    _, height = p.wrap(width, 1000)
    if max_height is not None and height > max_height + 0.01:
        raise ValueError(f"Copy does not fit its reserved area: {text!r}; {height} > {max_height}")
    if x < MARGIN or x + width > WIDTH - MARGIN + 0.1 or top - height < 20:
        raise ValueError("Text falls outside page safe area")
    p.drawOn(c, x, top - height)
    return height


def rule(c: canvas.Canvas, y: float) -> None:
    c.setStrokeColor(LINE)
    c.setLineWidth(0.65)
    c.line(MARGIN, y, WIDTH - MARGIN, y)


def material(c: canvas.Canvas, number: str, title: str, text: str, top: float) -> None:
    paragraph(c, number, MARGIN, top, 36, size=12, leading=15,
              font="BricolageMedium", color=BLUE, max_height=15)
    paragraph(c, title, MARGIN + 46, top + 1, CONTENT_WIDTH - 46, size=16,
              leading=20, font="BricolageMedium", max_height=20)
    paragraph(c, text, MARGIN + 46, top - 26, CONTENT_WIDTH - 46,
              max_height=46.5)
    rule(c, top - 78)


def draw_qr(c: canvas.Canvas, url: str, x: float, y: float, size: float) -> None:
    qr = qrcode.QRCode(error_correction=qrcode.constants.ERROR_CORRECT_M, border=4)
    qr.add_data(url)
    qr.make(fit=True)
    matrix = qr.get_matrix()
    module = size / len(matrix)
    c.setFillColor(white)
    c.rect(x, y, size, size, stroke=0, fill=1)
    c.setFillColor(NAVY)
    # Exact square modules, generous 4-module quiet zone; no logo obscures QR data.
    for row, values in enumerate(matrix):
        for col, dark in enumerate(values):
            if dark:
                c.rect(x + col * module, y + (len(matrix) - row - 1) * module,
                       module, module, stroke=0, fill=1)
    c.linkURL(url, (x, y, x + size, y + size), relative=0, thickness=0)


def build() -> None:
    facts = site_facts()
    guide = facts["url"] + "/rehber"
    fonts()
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    c = canvas.Canvas(str(OUTPUT), pagesize=A4, pageCompression=1, invariant=1)
    c.setTitle("Ayakkabı bakım kartı | Yıkat")
    c.setAuthor("Yıkat")
    c.setSubject("Malzemeye göre evde ayakkabı bakımı ve ne zaman durulması gerektiği")
    c.setCreator("Yıkat care-card generator")
    c.setFillColor(white)
    c.rect(0, 0, WIDTH, HEIGHT, stroke=0, fill=1)

    # Existing owner artwork, original aspect ratio, no generated imagery.
    with Image.open(LOGO) as im:
        ratio = im.height / im.width
    c.drawImage(str(LOGO), MARGIN, 753, width=96, height=96 * ratio, mask="auto")
    paragraph(c, "BAKIM KARTI", WIDTH - MARGIN - 112, 796, 112,
              size=10, leading=13, font="BricolageMedium", color=MUTED)
    paragraph(c, "Bakırköy", WIDTH - MARGIN - 112, 778, 112,
              size=11, leading=14, color=MUTED)

    paragraph(c, "Ayakkabına iyi bak.", MARGIN, 727, CONTENT_WIDTH,
              size=32, leading=37, font="BricolageBold", max_height=37)
    paragraph(c, "Önce modelinin bakım talimatını oku. Malzemeyi bilmiyorsan<br/>"
              "işlem yapmadan sor; aynı çiftte farklı yüzeyler bulunabilir.",
              MARGIN, 681, CONTENT_WIDTH, size=11.5, leading=16, max_height=32)

    c.setFillColor(NAVY)
    c.roundRect(MARGIN, 580, CONTENT_WIDTH, 53, 11, fill=1, stroke=0)
    paragraph(c, "Çamaşır veya kurutma makinesine atma.", MARGIN + 16, 621,
              CONTENT_WIDTH - 32, size=14, leading=18, font="BricolageMedium", color=white, max_height=18)
    paragraph(c, "Evde bakımda doğrudan ısı ve sert ovalamadan kaçın.",
              MARGIN + 16, 600, CONTENT_WIDTH - 32, size=10.5, leading=14, color=white, max_height=14)

    material(c, "01", "Kumaş, file ve sneaker",
             "Gevşek kiri yumuşak fırça veya bezle al. Ayakkabıyı suya<br/>"
             "doyurma; karışık malzemeyi tek bir yüzey gibi değerlendirme.", 558)
    material(c, "02", "Düz deri",
             "Yumuşak bez veya fırçayla yüzey kirini al. Bakım ürününün<br/>"
             "deri türüne uygunluğunu kontrol et; süetle karıştırma.", 465)
    material(c, "03", "Süet ve nubuk",
             "Bu yüzeylere uygun fırçayla nazik çalış. Kumaş veya düz deri<br/>"
             "için seçtiğin ürünü doğrudan bu yüzeylere uygulama.", 372)

    paragraph(c, "<font name='BricolageMedium'>Kuruturken:</font> Doğrudan ısı verme. Hava alan bir yerde tamamen<br/>"
              "kurumasını bekle; nemliyken kapalı çantaya veya dolaba kaldırma.",
              MARGIN, 280, CONTENT_WIDTH, size=11.3, leading=15.5, max_height=31)

    c.setFillColor(LIGHT)
    c.roundRect(MARGIN, 177, CONTENT_WIDTH, 61, 11, fill=1, stroke=0)
    paragraph(c, "Burada dur, fotoğrafla sor.", MARGIN + 16, 227, CONTENT_WIDTH - 32,
              size=14, leading=17, font="BricolageMedium", max_height=17)
    paragraph(c, "Renk veriyorsa, yüzey soyuluyorsa veya taban açılıyorsa ovalamayı<br/>"
              "sürdürme. Daha önce uyguladığın ürünleri de not et.",
              MARGIN + 16, 206, CONTENT_WIDTH - 32, size=10.5, leading=13, max_height=26)

    paragraph(c, "Bakırköy dükkânı", MARGIN, 158, 370,
              size=12.5, leading=16, font="BricolageMedium", max_height=16)
    address = facts["address"].replace(", 34142", "<br/>34142")
    paragraph(c, address, MARGIN, 137, 388, size=10.2, leading=13, max_height=26)
    hours = escape(facts["hours"]).replace(", Pazar", "<br/>Pazar")
    paragraph(c, hours, MARGIN, 105, 388, size=10.2, leading=13, max_height=26)
    paragraph(c, f'<link href="{facts["phone_href"]}" color="#042C53">{facts["phone"]}</link>',
              MARGIN, 73, 240, size=10.5, leading=13, font="BricolageMedium", max_height=13)
    draw_qr(c, guide, WIDTH - MARGIN - 80, 82, 80)
    paragraph(c, '<link href="' + guide + '" color="#042C53">Tüm rehberler</link>',
              WIDTH - MARGIN - 80, 76, 80, size=10, leading=13, max_height=13)

    rule(c, 54)
    paragraph(c, f'Kaynaklar: <link href="{CLARKS}" color="#1F5EB8">Clarks bakım rehberi</link>'
              f' · <link href="{NIKE}" color="#1F5EB8">Nike ayakkabı bakımı</link>',
              MARGIN, 44, CONTENT_WIDTH, size=10, leading=12, max_height=12)
    paragraph(c, f'15 Ekim 2026 · <link href="{guide}" color="#40576D">www.yikat.tech/rehber</link>',
              MARGIN, 32, CONTENT_WIDTH, size=10, leading=12, color=MUTED, max_height=12)
    c.showPage()
    c.save()

    # Document integrity checks, not a substitute for rendered visual inspection.
    reader = PdfReader(OUTPUT)
    if len(reader.pages) != 1:
        raise ValueError("Care card must remain exactly one A4 page")
    text = reader.pages[0].extract_text()
    required = ["Ayakkabına iyi bak.", "Süet ve nubuk", "Çamaşır veya kurutma makinesine atma.",
                "08:30", "20:30", "10:00", "İskele Caddesi No:15-B", facts["phone"]]
    for value in required:
        if value not in text:
            raise ValueError(f"PDF text did not preserve required Turkish content: {value}")
    if any(x in text for x in ["\ufffd", "\u25a0"]):
        raise ValueError("Broken replacement glyph in PDF text")
    links = [str(a.get_object().get("/A", {}).get("/URI", "")) for a in reader.pages[0].get("/Annots", [])]
    for link in [guide, CLARKS, NIKE, facts["phone_href"]]:
        if link not in links:
            raise ValueError(f"Missing required clickable destination: {link}")
    embedded_faces = []
    for font in reader.pages[0]["/Resources"]["/Font"].values():
        font = font.get_object()
        descriptor = font.get("/FontDescriptor")
        if descriptor and "/FontFile2" in descriptor.get_object():
            embedded_faces.append(str(font["/BaseFont"]))
    if len(embedded_faces) != 3 or not all(any(style in face for face in embedded_faces)
                                         for style in ["Regular", "Medium", "Bold"]):
        raise ValueError("All three distinct Bricolage faces must be embedded")
    print(json.dumps({"output": str(OUTPUT), "pages": 1, "bytes": OUTPUT.stat().st_size,
                      "sha256": hashlib.sha256(OUTPUT.read_bytes()).hexdigest(),
                      "source_facts": facts, "qr_target": guide,
                      "links": sorted(set(links)), "minimum_text_pt": 10}, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    build()
