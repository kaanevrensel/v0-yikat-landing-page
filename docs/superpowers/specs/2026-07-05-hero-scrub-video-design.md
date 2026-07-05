# Hero Scrub Video — Tasarım Spec'i

Tarih: 2026-07-05 · Durum: onaylı tasarım (implementasyon planı ayrı yazılacak)
Revize ettiği karar: `2026-07-05-ayakkabi-pivot-design.md` §4'teki "Tam video scrub değil — katmanlı görüntü seti" cümlesi. Kullanıcı, interaktif davranış demosunu inceledikten sonra masaüstünde scroll-scrub videoya karar verdi; mobilde statik keyframe crossfade seçildi.

## 1. Karar özeti

| Bağlam | Deneyim |
|---|---|
| Masaüstü (md+, video hazır) | Scroll-scrub video — `scrollYProgress` → `video.currentTime` |
| Masaüstü (video buffer'lanmadı / hata) | Statik keyframe crossfade (mobille aynı kod yolu); video `canplaythrough` sonrası opacity ile üstüne biner |
| Mobil (<md) | Statik keyframe crossfade — bugünkü katman mimarisi, gerçek kompozit karelerle. Mobil hiç video indirmez. |
| `prefers-reduced-motion` | `StaticHero` (değişmiyor) |

Metin, CTA'lar ve scroll ipucu **her zaman DOM'da** kalır (H1/SEO, tıklanabilirlik, analytics eventleri videodan bağımsız). Statik katman kod yolu tek: hem mobil deneyim hem masaüstü yükleme fallback'i. Video saf progressive enhancement'tır.

## 2. Higgsfield üretim hattı

Üretim, kadraj tutarlılığını karelerle kilitler; video tek seferde üretilmez:

1. **Temel kompozit kare**: sokak sahnesinde temiz ayakkabı, sabit kadraj, 16:9 (masaüstü keyframe #1).
2. **Edit zinciri** ile aynı kareden 3 kompozit varyant: çamurlu zemin+çamurlu ayakkabı → mavi yıkama+köpük → şık mekan+ışıl ışıl. Kadraj ve ayakkabı kimliği edit zinciriyle korunur ("same shoe, same camera angle" üretim değil edit problemi olur).
3. **3 geçiş klibi** (image-to-video, start_image+end_image = elimizdeki keyframe'ler): sokak→çamur, çamur→yıkama, yıkama→temiz. Her klip ~4 sn, sabit kamera, sessiz. Geçişler pikselde kilitli; drift riski klip içiyle sınırlı.
4. **ffmpeg birleştirme + encode**: tek `hero-scrub.mp4` (~12 sn), scrub için keyframe-yoğun (GOP ≤ 4) H.264, 1920×1080, hedef ≤ 10 MB.
5. **Mobil dikey set**: masaüstü keyframe'lerden `outpaint`/`reframe` ile dikey varyant (kadraj birebir korunur), 828×1104 WebP.

Asset yeniden kullanımı: keyframe'ler → mobil katmanlar + `StaticHero` finali + `og:image` kaynağı. Video pipeline'ı mobil seti bedavaya üretir.

### Üretim kuralları (kullanıcı talimatı, bağlayıcı)

- **Onay kapısı:** Her Higgsfield üretiminden sonra çıktı kullanıcıya gösterilir; kullanıcı onaylamadan hattın sonraki adımına geçilmez. Reddedilen çıktı yeni prompt/seed ile tekrarlanır.
- **Model politikası:** Plan (Plus) kapsamında **unlimited** olan en yüksek kaliteli modellere öncelik verilir. 2026-07-05 envanterinden adaylar: görsel → **Nano Banana Pro** (4K, image-to-image) / Nano Banana 2; video → **Seedance 2.0** (`mode=std`, ≥1080p, start+end frame, `generate_audio=false`). Unlimited kapsamı üretim anında doğrulanır; unlimited olmayan model gerekiyorsa kredi maliyeti onay sırasında kullanıcıya bildirilir. (Bakiye 2026-07-05: 654 kredi.)

## 3. Kod mimarisi

- `hero-scroll-story.tsx`: gradyan `bg` + emoji ayakkabı + CSS overlay sistemi (çamur blob'ları, köpük dalgası, ✨) **tamamen kalkar**. Yerine 4 kompozit keyframe `<Image>` katmanı — bugünkü fade-in-only opacity mimarisi (`useSceneBgOpacity`) aynen kalır; ayrı ayakkabı katmanı artık yok (kompozit karede gömülü).
- Yeni `HeroScrubVideo` alt bileşeni (`components/hero-scrub-video.tsx`): `muted playsInline preload="auto" aria-hidden`; SSR'da render edilmez (mount + md media query + `canplaythrough` sonrası girer — hydration güvenli).
- **Scrub eşlemesi — `WINDOWS` değişmez.** Video yalnız 3 geçişten oluştuğu için scroll→zaman eşlemesi parçalı doğrusaldır: hold aralıklarında video keyframe'de durur, crossfade pencerelerinde ilgili klip oynar:
  `useTransform(scrollYProgress, [0.19, 0.25, 0.44, 0.50, 0.69, 0.75], [0, 4, 4, 8, 8, 12])` (klip süreleri stitch sonrası ölçülüp sabitlenir).
  `useMotionValueEvent` hedef zamanı yazar; rAF döngüsü `currentTime`'ı lerp'le sürer (seek gecikmesi maskelenir).
- Metin/CTA zamanlaması (`WINDOWS`, `CTA_GATE`) ve analytics eventleri değişmez.

## 4. Performans bütçesi

- LCP elemanı statik keyframe görselidir (ilk boyada görünen şey); video LCP'ye girmez, arkada yüklenir.
- Mobil video indirmez → Lighthouse mobil ≥ 90 hedefi korunur (pivot planındaki gate aynen geçerli).
- Masaüstü payload (~10 MB) yalnız md+ cihazlara; `canplaythrough` gelene kadar statik katmanlar tam deneyim sunar.
- Doğrulama: `pnpm build` + `npx tsc --noEmit` + Lighthouse mobil ≥ 90 + masaüstünde gerçek scrub kontrolü (ileri/geri).

## 5. Dosya envanteri

| Dosya | İçerik |
|---|---|
| `public/images/hero/keyframe-{sokak,camur,yikat,temiz}.webp` | 1920×1080 kompozit kareler (masaüstü katman + fallback + StaticHero) |
| `public/images/hero/keyframe-{sokak,camur,yikat,temiz}-mobile.webp` | 828×1104 dikey varyantlar (mobil katmanlar) |
| `public/videos/hero-scrub.mp4` | ~12 sn birleşik geçiş videosu (yalnız md+) |
| `public/images/og.png` | `keyframe-temiz`den türetilir (1200×630) — pivot planı Görev 18 |

Pivot planındaki Faz 2 hero satırları (ayrı `bg-*` + transparan `shoe-*` seti) bu envanterle değişir; before/after, harita ve og entegrasyon görevleri planlandığı gibi kalır.

## 6. Riskler

- **Klip içi drift** (start/end kilitli ama ara karelerde ayakkabı bozulabilir): onay kapısı + yeniden üretim ile yönetilir.
- **Payload/scrub kalitesi**: keyframe-yoğun encode dosyayı büyütür; 10 MB aşılırsa 1600×900'e düşülür veya klipler kısaltılır (kullanıcıyla birlikte karar).
- **macOS Safari scrub**: masaüstü Safari'de test edilir; sorun çıkarsa lerp katsayısı düşürülür (daha yumuşak, daha gecikmeli).

## 7. Kapsam dışı

- Ses (hero videosu sessiz, `generate_audio=false`).
- Mobilde video (bilinçli karar — ileride tek bileşen değişikliğiyle denenebilir).
- Before/after gerçek fotoğrafları, fiyat menüsü, yasal metinler (pivot planı Faz 3).
