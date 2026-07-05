# YIKAT Ayakkabı Yıkama Pivotu — Site Tasarım Spec'i

**Tarih:** 2026-07-05
**Durum:** Kullanıcı onayı bekliyor
**Kapsam:** yikat.tech'in fiziki ayakkabı yıkama dükkanı sitesine tam pivotu (mobil app çıkana kadar geçerli dönem)

## 1. Özet ve amaç

YIKAT, mobil uygulama yayına girene kadar tek hizmet olarak **Bakırköy'deki fiziki dükkanda ayakkabı yıkama** sunacak. Mevcut site (kuru temizleme aggregator anlatısı) tamamen değiştirilir: **yeni site sıfırdan üretilir**, eski sayfalara ihtiyaç yok. Master plan (app + aggregator) iptal değil; kod git geçmişinde durur, sitede tek bir "yakında" şeridiyle temsil edilir.

**Dükkan bilgileri (kesinleşmiş):**
- Adres: Cevizlik Mah. İskele Cd. 15C, 34142 Bakırköy/İstanbul
- Çalışma saatleri: **her gün 09:00–20:00** (pazar dahil)
- Telefon: 0850 303 31 93 (mevcut hat)
- Hizmet modeli: **sadece dükkana getirme** (kurye/kapıdan alım yok)
- Teslim: **aynı gün** (ana değer önerisi)
- Ödeme: nakit + kart
- Site yayına girdiğinde dükkan açık olacak ("yakında açılıyoruz" durumu YOK)

## 2. İçerik kuralları (kullanıcı kararları)

1. **Eski veri sıfır:** Çekmeköy, Anadolu Yakası, 1.500+ sipariş, 400+ müşteri, 12+ partner, 18+ mahalle — hiçbiri yeni sitede geçmez.
2. **Rakamsız başlangıç:** Güven, sayılarla değil değer önerileriyle kurulur: aynı gün teslim, YIKAT Garantisi (memnun kalmazsan ücretsiz tekrar yıkama), malzeme uzmanlığı (süet/deri/spor). Gerçek ayakkabı siparişleri birikince rakam eklenebilir.
3. **"Aynı gün tertemiz" ana vurgu:** Hero finali, güven şeridi ve SSS'te tekrarlanır.
4. Tüm metinler Türkçe; ton mevcut marka sesiyle uyumlu (samimi, net, abartısız).

## 3. Sayfa mimarisi (tek sayfa + yasal)

Yeni site tek sayfalık ana sayfa + yasal sayfalardan oluşur:

| # | Bölüm | İçerik |
|---|-------|--------|
| 0 | Navbar | Logo · Nasıl Çalışır · Sonuçlar · Fiyatlar · SSS · birincil CTA: **Yol Tarifi** + telefon ikonu. Scroll'da cam efektli sabit header (mevcut kalıp korunur). App CTA'sı yok. |
| 1 | **Hero — Scroll Hikayesi** | Aşağıda §4'te detaylı. |
| 2 | Güven şeridi | 3 değer önerisi kartı: Aynı Gün Teslim · YIKAT Garantisi · Süet/Deri/Spor Uzmanlığı. Rakam yok. |
| 3 | Nasıl Çalışır | 3 adım: **Getir (01) → Yıkayalım (02) → Aynı gün teslim al (03)**. Bakırköy çarşı konumu vurgusu ("beklerken işini gör"). |
| 4 | Sonuçlar — Önce/Sonra | Sürüklenebilir kirli/temiz karşılaştırma kartları (brainstorm B konsepti). Gerçek fotoğraflar gelene kadar Higgsfield üretimi örnekler, "temsili" ibaresiyle. |
| 5 | Fiyat Menüsü | Kategori kartları: Spor · Deri · Süet/Nubuk · Çocuk. Fiyat alanları placeholder ("menü yakında"); menü netleşince `lib/site.ts`ten doldurulur. |
| 6 | Konum & Ziyaret | Lacivert (navy) dönüşüm bölümü: statik harita görseli (tıklayınca Google Maps açılır — iframe embed yerine, performans/çerez nedeniyle), adres, saatler, **Yol Tarifi Al** (Google/Apple Maps deep link) + **Ara** butonları. |
| 7 | SSS | Ayakkabı odaklı ~8 soru: hangi türler, süet/deri olur mu, kaç saatte/günde, garanti, saatler, ödeme (nakit+kart), fiyat nerede, konum. Accordion kalıbı korunur. |
| 8 | "Yakında" şeridi | Tek satır sakin bant: "Kapıdan alım ve tüm tekstil bakımı YIKAT uygulamasıyla geliyor." Sayfanın odağını çalmaz. |
| 9 | Footer | Adres · saatler · telefon · KVKK · Mesafeli Satış linkleri. Sosyal ikonlar gerçek hesap bağlanana kadar yok. |

**Eski rotaların kaderi:**
- `/hizmetler`, `/nasil-calisir`, `/partnerlik`, `/sss`, `/iletisim` → `next.config.mjs` ile ana sayfaya **301**.
- `/kvkk` ve `/mesafeli-satis-sozlesmesi` **geçici olarak canlı kalır** (yasal zorunluluk; footer'dan linkli). Kullanıcı yeni yasal metinleri gönderince içerikleri değiştirilir. İçlerindeki eski iş modeli anlatımı bilinen bir eksik, yeni metinlerle çözülecek.
- Eski bileşenler ve API rotaları (`/api/contact` stub, `/api/partner` Resend) yeni sitede kullanılmaz; form yok, Resend bağımlılığı kalkar. Kod git geçmişinde korunur.

## 4. Hero — Scroll Hikayesi spec'i

**Konsept (kullanıcının vizyonu, aynen):** Odak **her zaman ayakkabıda**, **kamera açısı sabit** — yalnızca arka plan ve ayakkabının durumu değişir.

| Sahne | Arka plan | Ayakkabı durumu | Metin |
|-------|-----------|-----------------|-------|
| 1 · Sokak | Kaldırım/sokak | Temiz, yürüyüş adımı | H1: "Ayakkabın ilk günkü gibi." + görünür alt satır (p): "Bakırköy'de profesyonel ayakkabı yıkama" — sayfanın tek H1'i budur, yerel anahtar kelimeyi alt satır taşır |
| 2 · Çamur | Çamurlu/pis su birikintili zemin | Basış anı: sıçrama, kir birikir | "Sokak zor: çamur, toz, leke." |
| 3 · YIKAT | Marka mavisi (#4A8CFF) yıkama sahnesi, köpük/su | Yıkanıyor | "YIKAT yıkar." |
| 4 · Şık mekan | Zarif iç mekan (restoran/lobi zemini) | Tertemiz, ışıltılı, adım atıyor | "Aynı gün tertemiz teslim." + CTA: **Yol Tarifi Al** · **Ara** |

**Teknik yaklaşım:**
- Bölüm ~2.2 ekran boyu; içerik `position: sticky` ile sabitlenir, framer-motion `useScroll` + `useTransform` sahne geçişlerini scroll'a bağlar (scrub — kullanıcı hızı kontrol eder).
- Katmanlı görsel mimari: sabit çerçevede ayakkabı katmanı (durum varyantları crossfade) + arka plan katmanı (crossfade/parallax-hafif). ~~Tam video scrub değil — katmanlı görüntü seti (performans ve kontrol daha iyi).~~ **Revize (2026-07-05):** masaüstünde scroll-scrub video, mobilde statik keyframe crossfade — bkz. `2026-07-05-hero-scrub-video-design.md`.
- Görseller: **Higgsfield MCP** ile üretilir (Soul/tutarlı obje). Gereken set: aynı kadraj/açıyla 4 sahne × (ayakkabı durumu + arka plan). İlk implementasyon **placeholder görsellerle** yapılır; Higgsfield kareleri hazır olunca dosya değişimiyle güncellenir.
- `prefers-reduced-motion`: pin ve animasyon yok; statik final sahnesi (temiz ayakkabı + başlık + CTA) gösterilir.
- Mobil: aynı akış, kısaltılmış pin (~1.6 ekran), düşük çözünürlüklü görsel seti; 60fps hedefi, sadece transform/opacity anime edilir.
- Sahne metinleri Jakub kalıbıyla girer (opacity + translateY + blur, spring bounce: 0).

## 5. SEO spec'i

- **Title:** `Ayakkabı Yıkama Bakırköy — YIKAT | Aynı Gün Teslim`
- **Description:** Aynı gün teslim + İskele Caddesi/Bakırköy + garanti vurgusu (~150 karakter, tıklama odaklı).
- **Hedef kelimeler:** ayakkabı yıkama bakırköy, ayakkabı temizleme, sneaker yıkama/temizleme, süet ayakkabı temizliği, deri ayakkabı bakımı.
- **JSON-LD (app/layout.tsx):** Eski 3 blok kaldırılır; yerine: (1) `LocalBusiness` — ad YIKAT, adres Cevizlik Mah. İskele Cd. 15C Bakırköy, geo koordinatları, `openingHours Mo-Su 09:00-20:00`, telefon, `areaServed` Bakırköy/İstanbul; (2) `FAQPage` — yeni SSS'ten 4 soru. 5 hizmetlik eski katalog gider.
- **Sitemap/robots:** statik dosyalar silinir → dinamik `app/sitemap.ts` + `app/robots.ts` (yalnız `/`, `/kvkk`, `/mesafeli-satis-sozlesmesi`).
- **og:image:** Higgsfield'dan temiz-ayakkabı final karesiyle 1200×630 üretilir (şu an sitede hiç yok).
- **301'ler:** eski rotalar ana sayfaya (§3) — mevcut indeks gücü ana sayfada toplanır.
- Google Search Console doğrulama token'ı korunur. Vercel Analytics korunur; gtag olayları yeni CTA'lara göre: `hero_directions_click`, `hero_call_click`, `visit_directions_click` vb.
- **Site dışı not:** Açılışta Google Business Profile kaydı (kullanıcı aksiyonu) — yerel aramanın en büyük kaldıracı.

## 6. Tasarım sistemi ve teknik zemin

- **Korunur:** Next.js 16 App Router, Tailwind v4 (`app/globals.css` token'ları), marka paleti (primary #4A8CFF, navy #042C53, accent #E6F1FB, amber), radius/section kalıpları, shadcn/ui altyapısı, framer-motion, Inter fontu.
- **Font:** Şimdilik Inter; Okine (veya başka display font) kararı ayrı bir işte ele alınacak (kullanıcı kararı, lisans kontrolü dahil).
- **Motion dili:** design-motion-principles ağırlıkları — Jakub (production polish) birincil, Jhey (ifade gücü, hero'da) ikincil, Emil (nav/CTA hızı) seçici. Tüm giriş animasyonları mevcut whileInView kalıbıyla uyumlu; hero dışında gösterişli motion yok.
- **Görsel iş akışı:** Higgsfield MCP kurulu (`~/.claude.json`, proje kapsamı) — asset üretimi yeni Claude oturumunda OAuth sonrası yapılır.
- `images.unoptimized: true` gözden geçirilir: hero görsel seti için boyutlandırılmış WebP/AVIF üretilir (LCP hedefi ≤2.5s).

## 7. Git / yayın akışı

- Çalışma dalı: **`pivot-ayakkabi`** (main'den açılır). Tüm geliştirme burada; kullanıcı `pnpm dev` ile lokalde önizler.
- main'e merge yalnızca kullanıcı onayıyla; merge = canlıya çıkış (Vercel).
- Bu spec ve CLAUDE.md güncellemeleri commit'lenir; CLAUDE.md'deki "agregatör altyapısını silme" notu bu spec'le güncellenir (yeni karar: site sıfırdan, eski kod git geçmişinde).

## 8. Kapsam dışı (bu projede YOK)

- Online sipariş/ödeme, form (iletişim/partner dahil), mobil app özellikleri
- Gerçek fiyatlar (menü gelene kadar placeholder)
- Yasal metin yeniden yazımı (kullanıcı gönderecek)
- Font değişimi (ayrı iş)
- Blog/çoklu sayfa içerik SEO'su (ileride değerlendirilebilir)

## 9. Açık kalemler ve sahipleri

| Kalem | Sahip | Durum |
|-------|-------|-------|
| Yeni KVKK + mesafeli satış metinleri | Kullanıcı | Bekleniyor; gelene kadar eski sayfalar canlı |
| Fiyat menüsü | Kullanıcı | Bekleniyor; placeholder tasarım hazır olacak |
| Gerçek önce/sonra fotoğrafları | Kullanıcı | Bekleniyor; Higgsfield temsili görseller kullanılacak |
| Higgsfield OAuth girişi (yeni oturumda /mcp) | Kullanıcı + Claude | Asset üretim aşamasında |
| Google Business Profile kaydı | Kullanıcı | Açılışta |

## 10. Başarı ölçütleri

- Lighthouse: Performance ≥ 90 (mobil), SEO ≥ 95; LCP ≤ 2.5s
- Hero hikayesi mobilde 60fps'e yakın akar; reduced-motion'da tam işlevsel statik sürüm
- Google'da "ayakkabı yıkama bakırköy" için indekslenme (GBP ile birlikte yerel pakette görünürlük)
- Tüm eski rotalar 301 ile ana sayfaya düşer, 404 yok
