# Site Cilası & Motion Paketleri — Tasarım Spec'i

Tarih: 2026-07-05 · Durum: kullanıcı seçimiyle kapsam onaylı (4 paket) · Ağırlık: Jakub birincil (üretim cilası), Jhey ikincil (seçili dokunuşlar), Emil CTA/nav'da (kısıtlama)

**İlkeler:** Sayfanın yıldızı hero — diğer bölümler sessiz-akıcı kalır. Tüm animasyonlar yalnız `transform`/`opacity`/`filter`; hepsi `prefers-reduced-motion`'da sakinleşir (MotionConfig `reducedMotion="user"` zaten global). Kredi harcaması yalnız istenirse ileride ikinci b/a çifti için.

**Bileşen tedarik stratejisi (kullanıcı kararı, 2026-07-05):** React Bits bileşenleri **gerçek kaynak kodla vendorlanır** — resmi repo `DavidHDev/react-bits`'ten TS+Tailwind varyantları `components/reactbits/{blur-text,magnet,circular-text}.tsx` olarak alınır (dosya başına kaynak URL + lisans notu yorum satırı; repo lisansı vendorlamadan önce doğrulanır). Magic UI parçaları (Marquee, Ripple) resmî shadcn registry'sinden (`magicui.design/r/*`) `components/ui/` altına alınır. Vendorlanan bileşenlere yalnız marka ayarı yapılır (renk/token/props); iç mantığa dokunulmaz — upstream'den güncellenebilirlik korunur. RB/MUI'de karşılığı olmayan özel parçalar (köpük ayracı, köpük patlaması, akan çizgi, açık/kapalı nabzı, ıslak cam) bizim bileşenlerimiz olarak yazılır. WebGL bileşenleri (`ogl` gerektirenler) kapsam dışı kalmaya devam eder.

## Paket 1 — Gerçek before/after (TEK kart) + köpük patlaması

- Kaynak hazır ve kullanıcı demosuyla onaylı: `.hero-work/ba-camur.webp` + `ba-temiz.webp` (1200×900, çamur/temiz keyframe'lerden aynı pencereyle kırpıldı) → `public/images/results/spor-{once,sonra}.webp`.
- `before-after.tsx`: `ShoePanel` (emoji) silinir; `CompareCard` iki `<Image fill>` katmanı alır (mevcut clip-path mimarisi aynen). **İkinci kart ("Süet bot") kaldırılır** — grid tek karta döner (`max-w-2xl` ortalanır); gerçek müşteri fotoğrafları gelince geri gelir (Faz 3 kalemi güncellenir). "Temsili görsel" ibaresi kalır.
- **Köpük patlaması:** sürükleme sırasında ayırıcı çizgi üzerinde 5-14px beyaz kabarcıklar belirir (70ms throttle, 2'li grup, ~700ms yukarı sürüklenip söner; yalnız `transform`+`opacity`, DOM'da kısa ömürlü span'ler ≤12 eşzamanlı). `useReducedMotion` true ise hiç üretilmez. Klavye kullanımında (ok tuşları) üretilmez — yalnız pointer sürüklemesinde.

## Paket 2 — Su kimliği

- **Köpük ayracı ×2:** yalnız iki anahtar geçişte (hero→value-band, before-after→price-menu) 40-56px yüksekliğinde statik SVG kabarcık/dalga kenarı (`components/foam-divider.tsx`, `aria-hidden`, `currentColor` ile üstteki bölümün zeminini alır). Scroll parallax YOK (Jakub: fark edilmeyecek kadar sade); sadece whileInView'da kabarcıklarda tek seferlik 300ms opacity dalgası.
- **CTA ripple:** `globals.css @theme`'e `--animate-ripple` + keyframe; `HeroCtas` ve visit CTA pill'lerine tıklama anında içten dışa tek halka (~400ms, `motion` tap variant değil saf CSS `:active` + pseudo-element — yüksek frekanslı öğede JS yok). Reduced-motion'da kapalı (`@media` bloğu).
- **Navbar ıslak cam:** scroll > 8px → `backdrop-blur-md bg-background/70` + alt kenar 1px `from-white/40` gradyan ışıltısı; 200ms geçiş. Mevcut navbar scroll state'i varsa ona bağlanır, yoksa `useScroll` ile eklenir.

## Paket 3 — Akış & canlılık

- **How-it-works akan çizgi:** md+ ekranda 3 kartın arkasında yatay SVG çizgi; `whileInView`'da `pathLength` 0→1 (1.1s, easeInOut), kart ikonları çizginin varış sırasına göre spring stagger (`bounce: 0.25` — tek oynak dokunuş, delay 0.15×i). Mobilde çizgi yok (dikey grid), kartların mevcut stagger'ı kalır.
- **"Şu an açık" nabzı (visit-section):** Europe/Istanbul saatiyle 09:00-20:00 kontrolü; açıkken yeşil nokta + "Şu an açık — 20:00'ye kadar bırakabilirsin", kapalıyken nötr nokta + "Yarın 09:00'da açılıyor". Hydration güvenliği: SSR'da nötr metin ("Her gün 09:00–20:00"), mount sonrası güncellenir. Nabız: 2s'de bir scale 1→1.6 + opacity söner (yalnız açıkken; reduced-motion'da statik nokta).
- **FAQ mikro-cila:** accordion içeriği açılırken Jakub enter reçetesi (opacity 0→1, y 6px, blur 4px→0, 250ms). Chevron mevcutsa 180° dönüş kalır — damla ikonu denemesi YOK (mevcut Radix yapısını bozmaya değmez; YAGNI).

## Paket 4 — Şerit & rozet

- **Coming-soon Marquee:** `coming-soon-band.tsx` yeniden yazılır: "Kapıdan alım · Kuru temizleme · Çamaşır · Ütü · Hacimli tekstil" öğeleri + her öğede küçük "yakında" rozeti, MUI marquee keyframe'iyle (`--animate-marquee`, ~40s, hover'da durur). Reduced-motion'da animasyon durur, içerik statik tek satır fallback. `aria-label` ile tam metin erişilebilir; dekoratif kopya `aria-hidden`.
- **CircularText rozeti:** before-after bölümünün sağ üst köşesine dönen damga: "AYNI GÜN TESLİM • YIKAT • AYNI GÜN TESLİM • " (SVG `textPath`, 30s linear sonsuz dönüş, ~96px, amber vurgu). Reduced-motion'da dönmez. md+ only (mobilde kalabalık).
- **BlurText başlıklar:** tüm bölüm h2'leri (`how-it-works`, `before-after`, `price-menu`, `visit`, `faq`) vendorlanan RB `BlurText` ile kelime bazlı blur-reveal'e geçer (kelime başına ~60ms, blur→0, yukarıdan; `threshold` viewport'a göre ayarlanır, tek sefer). Hero metin diliyle aynı aksan. Reduced-motion'da düz görünür.
- **Magnet CTA:** yalnız masaüstü (pointer: fine) hero + visit ana CTA'sında vendorlanan RB `Magnet` (düşük şiddet: magnitude ~0.2, maxDistance ~120). Emil kuralı: dönüşüm butonunda gecikme yaratmaz, yalnız transform.

## Dosya haritası

| Dosya | İş |
|---|---|
| `public/images/results/spor-{once,sonra}.webp` | onaylı b/a çifti (yeni) |
| `components/before-after.tsx` | gerçek görseller, tek kart, köpük patlaması |
| `components/reactbits/blur-text.tsx` (vendor) | RB BlurText — h2 reveal'ler bunu sarar |
| `components/reactbits/magnet.tsx` (vendor) | RB Magnet — CTA sarmalayıcı |
| `components/reactbits/circular-text.tsx` (vendor) | RB CircularText — dönen damga |
| `components/ui/marquee.tsx` (vendor) | MUI Marquee — coming-soon şeridi |
| `components/foam-divider.tsx` (yeni, özel) | SVG ayraç |
| `components/coming-soon-band.tsx` | marquee yeniden yazımı |
| `components/how-it-works.tsx` | akan çizgi + ikon stagger + BlurText |
| `components/visit-section.tsx` | açık/kapalı nabzı + ripple CTA + BlurText |
| `components/navbar.tsx` | ıslak cam scroll state |
| `components/faq-section.tsx` | içerik enter reçetesi + BlurText |
| `components/price-menu.tsx` | BlurText (yalnız başlık) |
| `components/hero-scroll-story.tsx` | HeroCtas ripple sınıfı + Magnet (yalnız CTA sarmalayıcı — hero mimarisine DOKUNULMAZ) |
| `app/page.tsx` | FoamDivider yerleşimi (2 nokta) |
| `app/globals.css` | ripple + marquee keyframe'leri (`@theme inline`) |

## Kapsam dışı / korunanlar

- Hero scroll mimarisi değişmez (yalnız CTA sarmalayıcıları).
- WebGL yok, imleç efekti yok, CountUp yok (gerçek sayı yokken sayaç yok — "sıfır eski veri" kuralı).
- İkinci b/a kartı gerçek müşteri fotoğrafına kadar yok; süet çifti üretimi ileride istenirse (~4 kredi, onay kapılı).
- Doğrulama: `npx tsc --noEmit` + `pnpm build` + görsel kontrol + Lighthouse mobilde gerileme yok (mevcut 82 taban; marquee/rozet GPU-only olduğundan beklenmez) + reduced-motion smoke testi.
