# Section Emojis — Asset Spec

Replace the native-OS emoji placeholder rendering in `components/SectionEmoji.tsx` by dropping PNG assets here, then swap the component's `<span>` for `<img src="/emojis/{id}.png" />`.

## Files expected (one per section)

- `hizmetler.png` — laundry basket (Hizmetler section)
- `nasil.png` — phone with WhatsApp glow (Nasıl çalışır section)
- `fiyatlar.png` — money / coin stack (Fiyatlar section)
- `neden.png` — sparkles / quality mark (Neden YIKAT section)
- `yorumlar.png` — speech bubble (Yorumlar section)
- `sss.png` — question mark (Sorular section)
- `siparis.png` — confetti / celebration (Sipariş section)

## Spec

- **Format:** PNG with transparent background (no halo, no rectangle)
- **Style:** 3D glossy (Apple/Telegram reference), full-color, dimensional — not flat, not line-art
- **Size:** 360×360 px source (= 180px display × 2 for retina)
- **Mobile also uses 360px source** (downscaled to 110px by CSS); no separate mobile asset needed
- **Color profile:** sRGB; if possible avoid pure black/white outlines — soft rim lights are fine
- **File weight:** aim < 80 KB each (use pngquant / tinypng after export)

## Swap procedure

Once PNGs are in place, update `components/SectionEmoji.tsx`:

```tsx
<img
  src={`/emojis/${id}.png`}
  alt={alt}
  width={180}
  height={180}
  className={prefersReducedMotion ? "emoji-static" : "emoji-breathe"}
  style={{ animationDelay: prefersReducedMotion ? undefined : phaseDelay }}
/>
```

Drop the `<span>{emoji}</span>` branch entirely at that point.
