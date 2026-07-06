# İmza Motion Paketi — BubbleCursor + Hero ScrollFloat + Liquid-Glass PillNav

**Tarih:** 2026-07-06 · **Durum:** Onaylandı (sahip, sohbet içi 3 soruluk karar turu)
**Bağlam:** RB fit analizi (2026-07-06) imleç oyuncaklarını genel kategori olarak reddetmişti; sahip baloncuk-imleci açıkça istedi ve baloncuk marka kimliğinin (su/köpük: foam-divider, cta-ripple, navy kart kabarcıkları) doğrudan uzantısı olduğundan "fısıltı dozunda imza efekt" olarak onaylandı. ScrollFloat ve PillNav de sahip talebi.

## Ortak kurallar (paketin anayasası)

- **Temiz-oda**: React Bits kaynağı kopyalanmaz (MIT+Commons Clause); dosya başında ilham atfı (blur-text/magnet/spotlight-card emsali). ScrollFloat'un gsap+ScrollTrigger orijinali framer-motion'a yeniden tasarlanır; PillNav MCP kataloğunda yok — desen sıfırdan kendi cam dilimizle.
- **Sıfır yeni bağımlılık**: framer-motion 11 + CSS. gsap/ogl/three kurulmaz.
- **Reduced-motion çift emniyet**: JS kapısı (`useReducedMotion`, blur-text'in mounted hydration deseniyle) + CSS kemeri (`@media (prefers-reduced-motion: reduce)` / `motion-reduce:`).
- **Boşluk dersi**: karakter/kelime span'leri `inline-block whitespace-pre` (2026-07-06 BlurText hatasının tekrarı yasak).
- **SVG displacement yasak** (navbar.tsx:39-41'de belgeli jank); cam hissi katmanlı CSS.

## 1. BubbleCursor — `components/bubble-cursor.tsx`

**Amaç:** İmleç hareket ettikçe sabun baloncukları çıksın — tüm sitede, fısıltı dozunda imza efekt.

- Mount: `app/page.tsx` içinde bir kez (legal sayfalarda yok). Sabit (fixed) `inset-0 pointer-events-none` overlay, `z-40` (navbar z-50'nin altında, tüm içerik üstünde).
- Spawn: `window` üzerinde `pointermove`; kat edilen mesafe birikimi ≥ ~90px olunca imleç konumunda (±8px rastgele ofset) 1 baloncuk. Eşzamanlı tavan 10 — doluysa spawn atlanır. `e.pointerType !== "mouse"` ise çık (hibrit ekran guard'ı, spotlight emsali).
- Baloncuk: 6–14px rastgele çap; sabun görünümü tek `<span>` ile: şeffaf gövde + `rgba(255,255,255,0.4)` halka (border) + sol-üst radyal beyaz parlama vurgusu + çok hafif primer tını. Hem açık hem navy zeminde okunur.
- Animasyon: CSS keyframe `bubble-rise` (globals.css): translateY 0→-36px, scale 0.6→1, opacity 0→0.8 (hızlı)→0 (yavaş); süre 1.1–1.4s arası rastgele (inline `animationDuration`). `animationend`'de node DOM'dan silinir.
- Performans: imperatif DOM (spawn başına React render yok, state yok), rAF döngüsü yok — imleç durunca maliyet sıfır. Transform+opacity-only.
- Kapılar: `(hover:hover) and (pointer:fine)` matchMedia + `!useReducedMotion` → değilse bileşen null döner (dokunmatik/mobilde hiç var olmaz). CSS kemeri: reduced-motion'da `.bubble-rise` animasyonu kapalı/gizli.
- Rastgelelik `Math.random` ile yalnız istemcide, mount sonrası pointer olayında üretilir — SSR/hydration'a değmez.

## 2. Hero ScrollFloat — `components/scroll-float-text.tsx` + `hero-scroll-story.tsx` reworku

**Amaç:** Hero sahne başlıkları karakter karakter, scroll'a scrub'lı süzülerek gelsin (yumuşatılmış doz — RB'nin scaleY 2.3 squash'ı ve back-overshoot'u bilinçle yok).

- Kapsam: yalnız sahne 1-3 başlıkları ("Sokak zor.", "YIKAT yıkar.", "Aynı gün tertemiz teslim."). **Sahne 0 başlığı statik kalır** (LCP/ilk kare; giriş penceresi yok; StaticHero paritesi). Alt metinler (sub) ve CTA'lar mevcut davranışta.
- `ScrollFloatText` API: `{ text, progress: MotionValue<number>, range: [start, end], className }`. Karakterlere bölünür; karakter i, `[start + i·slice, start + i·slice + charWindow]` alt aralığında `y: 0.6em→0` ve `opacity: 0→1` transform'larıyla girer (stagger toplamı pencereye sığar; son karakter `end`'de tam görünür). Hafif `scaleY 1.12→1, transform-origin: bottom` — squash yok.
- Erişilebilirlik: parent `aria-label={text}`, karakter span'leri kapsayıcısı `aria-hidden`; span'ler `inline-block whitespace-pre`.
- Sahne bloğu reworku: blok-seviyesi `filter: blur` başlıklı sahnelerde bloktan alınıp YALNIZ sub paragrafına taşınır (karakter kaskadı blur altında çamurlaşmasın); blok opacity+y aynen kalır (sahne ortak giriş/çıkış jesti — çıkış bütün blok halinde, giriş>çıkış korunur).
- Hook disiplini: sabit sahne sayısı (3 float başlık) — MotionValue'lar map içinde değil, sabit sırada üretilir (dosyadaki mevcut kural). ~48 karakter × 2 MV kabul edilebilir; görsel/ölçüm sorunlarında kelime-bazına düşme fallback'i.
- `text-balance` char-span'lerle sınanacak; mobilde "Aynı gün tertemiz teslim." sarması çirkinleşirse kelime-bazı fallback devreye girer.
- Reduced-motion: hero zaten `StaticHero`'ya düşüyor — ScrollFloat render yolu hiç çalışmaz.

## 3. Liquid-Glass PillNav — `components/navbar.tsx` yeniden biçim

**Amaç:** Tam-genişlik header yerine üstte kenarlardan kopuk, yüzen liquid-glass hap navigasyon.

- Yerleşim: `fixed top-3 inset-x-3 z-50` (mobil) / md+: içerik-sarmal (`max-w-fit mx-auto`) ortalanmış tek hap: logo + 4 link + telefon ikonu + "Yol Tarifi" CTA (rounded-full). `html { scroll-padding-top: 5rem }` mevcut değeriyle uyumlu (hap ~56px + 12px boşluk).
- Cam dili: mevcut kanıtlanmış katmanlar taşınır — `backdrop-filter: blur+saturate` (kaydırınca yoğunlaşan iki durum), inset rim ışığı, üst sheen gradyanı, alt specular çizgi; hap formunda `rounded-full` + `overflow-hidden`. SVG displacement yok.
- **"Liquid" davranış**: link grubunun arkasında `layoutId="nav-liquid-pill"` tek vurgu hapı — hover'da imlecin altındaki linke, hover yokken aktif bölüme spring'le (bounce 0) akar. Hero'dayken (aktif bölüm yok) vurgu hapı görünmez.
- Aktif bölüm: IntersectionObserver, 4 anchor hedefi (#nasil-calisir, #sonuclar, #fiyatlar, #sss), viewport-orta bias'lı rootMargin.
- Mobil: yüzen kompakt hap (logo + hamburger); menü hap ALTINA kopuk cam kart (rounded-2xl, aynı cam katmanları) olarak `AnimatePresence` ile açılır; linkler + Yol Tarifi/Ara CTA'ları. Escape kapatır, `aria-expanded/controls` korunur.
- Korunanlar: tüm analytics event adları (`nav_call_click`, `nav_directions_click`, `*_mobile`), link seti, dönüşüm CTA'ları. Navbar'ı kullanan diğer sayfalar (varsa legal) aynı bileşeni alır — beyaz zeminde solid cam durumu devreye girer.

## Doğrulama

`npx tsc --noEmit` + `pnpm build` + headless Chrome sürüşü (scratchpad drive deseni): baloncuk spawn/tavan/temizlik, hero char-float scrub'ı (progress ilerletilerek), pill nav hover-slide + aktif bölüm + mobil menü, reduced-motion'da üçünün de kapalı olduğu. Sonra superpowers:code-reviewer.

## Kapsam dışı

Sahne 0 başlığına float; alt metinlere/CTA'lara karakter animasyonu; SVG displacement; bubble'da tıklama patlaması (cta-ripple zaten var); navbar'da yeni link/CTA.
