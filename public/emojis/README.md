# Section Emojis — Asset Spec

Replace the native-OS emoji placeholder rendering in `components/SectionEmoji.tsx` by dropping PNG assets here, then adding the section id to `PNG_SECTIONS` in that file.

## Files expected (one per section)

- `hizmetler.png` ✅ — duffle bag with YIKAT star (Hizmetler section)
- `nasil.png` ✅ — phone with yıkat lock screen (Nasıl çalışır section)
- `fiyatlar.png` — money / coin stack (Fiyatlar section)
- `neden.png` — sparkles / quality mark (Neden YIKAT section)
- `yorumlar.png` — speech bubble (Yorumlar section)
- `sss.png` — question mark (Sorular section)
- `siparis.png` — confetti / celebration (Sipariş section)

## Spec

- **Format:** PNG with transparent background (no halo, no rectangle)
- **Style:** 3D glossy (Apple/Telegram reference), full-color, dimensional — not flat, not line-art
- **Source dimensions:** 512×512 px at 72 ppi (provides 4× retina for 120px desktop target)
- **Color profile:** sRGB. No pure-black outlines — soft rim lights are fine
- **File weight:** aim < 80 KB each (use sharp / pngquant / tinypng after export)
- **Target display sizes:** 120px desktop (≥768px), 80px mobile

## Adding a new PNG

1. Drop the PNG here at `/public/emojis/{section-id}.png`
2. Add the section id to `PNG_SECTIONS` in `components/SectionEmoji.tsx`:
   ```ts
   const PNG_SECTIONS = new Set(["hizmetler", "nasil", "your-new-id"] as const)
   ```
   That's all. The component picks it up automatically.

When all 7 sections have PNGs, the `PNG_SECTIONS` Set and the `<span>` fallback branch in `SectionEmoji.tsx` can be deleted — switch to always-`<img>`.
