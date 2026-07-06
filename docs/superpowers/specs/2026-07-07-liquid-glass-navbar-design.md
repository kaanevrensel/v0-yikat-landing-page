# Gerçek Liquid Glass — Pill Nav Portu

**Tarih:** 2026-07-07 · **Durum:** Sahip talebi ("Apple developer dokümanlarını inceleyip gerçek liquid glass'ı işleyelim"), 5-ajanlık araştırma turu tamamlandı.
**Kaynaklar:** Apple HIG Materials, "Adopting Liquid Glass" (Technology Overviews), WWDC25 219 "Meet Liquid Glass" + 356 (concentricity), kube.io/shuding/webtricks/rdev web-port analizleri. Araştırma çıktısı: `wza073cpa.output` (session tasks).

## Araştırmanın kilit bulguları

1. **Lensing malzemenin kimliği**: Liquid Glass ışığı dağıtmaz, kenarlarda gerçek zamanlı büker (refraction). Belirme/kaybolma fade değil, lens yoğunluğu modülasyonudur.
2. **Regular varyant = blur + lüminans ayarı**; katmanlı sistem: highlight + gölge + tint, her biri bağımsız adapte olur. Clear varyant yalnız medya üstünde + %35 dimming ister.
3. **Kurallar**: cam yalnız navigasyon/kontrol katmanında (içerik kartlarında DEĞİL); cam-üstüne-cam yasak (iç öğeler düz fill/opacity katmanı olur); kapsül radius = yükseklik/2, iç öğe radius = ebeveyn − padding (concentricity); az kullan.
4. **Etkileşim**: basışta içten parıltı + jel esneme (Reduced Motion'da elastiklik kapalı); boyut/durum geçişlerinde morph.
5. **Tarayıcı gerçeği**: `backdrop-filter: url(#svgFilter)` YALNIZ Chromium (spec'te bile yok; WebKit bug 245510 "not planned", Firefox desteklemiyor, w3c/svgwg #1142 açık). Safari `@supports`'ta YANLIŞ-POZİTİF verir → kapı UA/motor tespiti olmalı (`navigator.userAgentData.brands` yalnız Chromium'da var).
6. **Hap geometrisi için lens haritası**: dairesel simetri yetmez; SDF (signed distance function) tabanlı rounded-rect haritası gerekir — lens bandı kenar konturunu eşit kalınlıkta sarar. Kodlama: R=128+dx·127, G=128+dy·127; feDisplacementMap scale = maks. kayma. `colorInterpolationFilters="sRGB"` şart; feImage boyutu elemanla birebir (resize'da harita yeniden üretilir; yalnız `scale` ucuz anime edilir).
7. **Video üstü performans**: backdrop her video karesinde yeniden filtrelenir; blur yarıçapını ANİME ETME (durum geçişinde sabit tut), katmanı `translateZ(0)` ile izole et, lens'i yalnız md+ Chromium'da aç.

## Tasarım: "blur-first, lens-enhancement"

**Hedef yüzeyler:** pill nav + mobil cam menü kartı (Apple kuralı gereği içerik kartlarına YAYILMAZ; coming-soon/how-it-works kartları mevcut standart malzemede kalır).

### Temel katman (tüm tarayıcılar) — Apple regular varyantının portu
- Frost: `backdrop-filter: blur(14px) saturate(170%)` — iki scroll durumu arasında blur SABİT (perf bulgusu #7); durumlar yalnız background alfası (0.35↔0.75), gölge ve kenarlıkla ayrışır.
- Lüminans/speküler rim: 4-kenar inset highlight (üst 1px güçlü beyaz, alt/yanlar zayıf) + dış derinlik gölgesi.
- Sheen: 135° speküler süpürme gradyanı (statik).
- Concentricity: hap kapsül (`rounded-full`); içteki liquid vurgu hapı düz fill katmanı (cam-üstüne-cam yasağına uygun — ikinci backdrop YOK).
- Jel basış: link/CTA/hamburger'da `active:scale-[0.96]` + 150ms ease-out; `motion-reduce`'ta kapalı. İçten parıltı karşılığı mevcut `cta-ripple`.
- Erişilebilirlik kemerleri (`.liquid-glass` sınıfı): `prefers-reduced-transparency: reduce` → backdrop kapalı, ~%96 opak beyaz; `prefers-contrast: more` → opak + koyu kenarlık (Apple'ın otomatik adaptasyonlarının karşılığı).

### Lens iyileştirmesi (yalnız Chromium + md+)
- `components/liquid-lens.tsx`: SDF tabanlı hap displacement haritası canvas'ta üretilir (kenar bandı ~20px, maks. kayma ~26px, merkez berrak), data-URL `feImage` + `feDisplacementMap(xChannelSelector=R, yChannelSelector=G, scale=maksKayma)` olarak gizli inline SVG'de yaşar. ResizeObserver hap boyutu değişince haritayı yeniden üretir.
- Kapı: `navigator.userAgentData?.brands` Chromium tespiti (varlığı zaten Chromium'a özgü) + `(min-width: 768px)`. `@supports` KULLANILMAZ (Safari yanlış-pozitifi).
- Lens aktifken deklarasyon zinciri: `backdrop-filter: url(#yikat-lens) blur(2px) saturate(165%) brightness(1.05)`; background alfası düşürülür (üstte ~0.22 / kaydırınca ~0.6) ki kırılma görünsün, lüminans ayarı okunabilirliği korur.
- Hap katmanı `translateZ(0)` ile izole edilir.

### Kapsam dışı
Progressive-blur scroll-edge şeridi (kopuk hapta gereksiz, video üstünde ek maliyet); kromatik aberasyon; imleç-tepkili lens deformasyonu; içerik kartlarına cam; hero scrub videosuna dokunuş.

## Doğrulama
tsc + build + headless Chrome (Chromium olduğundan lens yolu gerçek test edilir): computed `backdrop-filter` `url("#yikat-lens")` içermeli, SVG feImage boyutu hap boyutuna eşit olmalı, 390px'te lens kapalı/temel cam açık, reduced-transparency emülasyonunda opak zemin. Görsel: hero üstünde kenar kırılması ekran görüntüsüyle. Ardından superpowers:code-reviewer.
