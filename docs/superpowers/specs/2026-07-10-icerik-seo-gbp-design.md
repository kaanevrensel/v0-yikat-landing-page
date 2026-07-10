# İçerik Güncelleme + Yerel SEO + GBP — Strateji ve Kararlar

**Tarih:** 2026-07-10 · **Durum:** Sahip kararlarıyla onaylı (fiyat=aralık modeli, mimari=araştırmaya göre öneri, GBP=hesap+pin hazır, malzeme=mevcut bilgiyle)
**Araştırma:** 6 ajanlık tur (Google resmi dokümanları, Whitespark 2026, BrightLocal 2026, gerçek SERP/rakip taraması, schema dokümanları, TR pazarı). Ham çıktı: session tasks `wdnl0m0yb.output`.

## Araştırmanın plan-belirleyici bulguları

1. **Local Pack ağırlıkları (Whitespark 2026):** GBP sinyalleri %32, yorumlar %20 (yükselişte), on-page %15. Yerel ORGANİK'te on-page %33 ile lider. → En büyük kaldıraç site değil GBP; site tarafında kazanç hedefli kopya revizyonunda.
2. **"Aynı gün teslim" SERP'te boş:** İlk sayfada bu vaadi veren SIFIR işletme (Tezal 3-7 iş günü, temiz.co çok günlük). YIKAT'ın ana değer önerisi aynı zamanda en güçlü SERP ayrıştırıcısı.
3. **Organik çıta çok düşük:** "ayakkabı yıkama bakırköy" lideri Yeşilyurt Lostra ~60 kelimelik, fiyatsız/şemasız sayfa. Hiçbir rakipte LocalBusiness/FAQPage JSON-LD yok. Armut'un tek üstünlüğü 621 gerçek yorum + fiyat aralığı içeriği (400-750₺ bandı — sahip fiyatlaması için pazar çıpası).
4. **FAQPage rich result ÖLDÜ:** Mayıs 2026'dan beri hiç gösterilmiyor, dokümanı silindi. Şema zararsız ama yatırım GÖRÜNÜR SSS metnine yapılır (accordion içeriği SSR'da — forceMount işi bunu zaten sağladı).
5. **Yorum eşikleri (BrightLocal 2026):** Tüketicilerin %47'si 20'den az yorumlu işletmeyi elemekte; %74'ü son 3 aya bakıyor; şablon yanıt %50'yi soğutuyor. AI araçları yorum-okuma kanalı olarak %45'e fırladı → yorum tabanı AI görünürlüğünün de girdisi.
6. **Saat sinyali yükseldi:** "Arama anında açık olmak" Local Pack'te 5. faktör. YIKAT'ın her gün 09:00-20:00 açık olması gerçek sıralama avantajı — GBP saatleri birebir doğru girilmeli.
7. **TR pazarı:** Google %87,7 / Yandex %9,8 / Bing %1,3. Yandex Business + Apple Business (Nisan 2026'dan beri tek platform, ücretsiz, TR açık) kayıtları GBP'den sonraki 2. ve 3. iş. Instagram (18+ nüfusun %92'si) TR'de fiilî yerel keşif kanalı — bu planın kapsamı dışında ama gelecek not.
8. **NAP mikro-tutarlılık:** "İskele Cd." / "İskele Caddesi" farkı bile tutarsızlık sayılabiliyor — tüm platformlarda `lib/site.ts` formatı karakteri karakterine kullanılacak.

## Mimari kararı (sahip delegasyonuyla, gerekçeli)

**ŞİMDİLİK TEK SAYFA — Faz 6'da koşullu ayrışma.** Gerekçe: (a) tek hizmet ailesi + tek lokasyon + tek dönüşüm hedefi, tek sayfanın savunulabilir olduğu tam senaryo; (b) organik çıta 60 kelime — kazanmak için sayfa değil hedefli kopya gerekiyor; (c) hizmet sayfası ancak kendine özgü GERÇEK içerikle (fiyat + gerçek foto + varyant SSS) değer üretir, o malzeme henüz yok; (d) mahalle-şablon sayfaları Google'ın doorway tanımına giriyor — temiz.co modeli taklit EDİLMEZ. Faz 6 tetikleyicisi: fiyatlar yayında + 3+ gerçek önce/sonra fotoğrafı → `/sneaker-yikama`, `/suet-nubuk-temizleme`, `/deri-ayakkabi-bakimi` (getpassionfruit şablonu: hizmet+Bakırköy başlık, süreç, varyant fiyatı, varyant SSS, gerçek foto).

## Fiyat kararı: aralık modeli

Sahip kesin menü yerine kategori başına ARALIK verecek (örn. "300–600₺"). Uygulama: `PriceItem`'a `priceRange` alanı; UI'da "X–Y ₺" rozeti; şemada `priceRange` (100 karakter altı) + `hasOfferCatalog` Offer'larına `priceSpecification` aralığı; SSS'deki fiyat cevabı aralıkla güncellenir. Kesin menü gelirse aynı tek kaynaktan kesin fiyata döner. Mevcut `₺₺` bir seviye iddiası — gerçek aralık gelene dek kalır, gelince değişir.

## İçerik ilkeleri

- Uydurma veri yasağı aynen: sayı/yorum/iddia yok; içerik yalnız doğrulanmış gerçeklerle (aynı gün, her gün 09:00-20:00, randevusuz, nakit+kart, malzeme-bazlı yöntem, Bakırköy çarşı/İskele Cd. konumu).
- Hedef sorgu hizası kopya düzeyinde: title/H1'de "Ayakkabı Yıkama Bakırköy" + "Aynı Gün Teslim" birlikte; gövdede "sneaker", "spor ayakkabı", "süet", "deri" terimleri ID'li bölüm başlıklarında; visit-section'a çevre mahalleler (Ataköy, Yeşilköy, Kartaltepe, Florya) DOĞAL tek paragrafla.
- DIY sorgularına ("süet nasıl temizlenir") saldırılmaz — o SERP perakendeci bloglarının; kazanılabilir alan hizmet-niyetli uzun kuyruk + SSS eşleşmeleri.
- Blog: bu fazda YOK; Faz 6'da en fazla 2-3 "köprü" içerik (DIY riski → profesyonel süreç açısı).

## Teknik şema kararları

- `@type`: `LocalBusiness` → **`DryCleaningOrLaundry`** (en yakın spesifik alt-tip; ShoeCleaning tipi yok; `additionalType` desteklenmiyor).
- `geo`: gerçek pinden **en az 5 ondalık** (Google şartı; mevcut 4 hane + yaklaşık).
- Kendi sitemize **review/aggregateRating ASLA** (Google: kendi yorumunu kontrol eden varlığa yıldız yok — gömülü widget besleme dahil).
- `app/sitemap.ts`: `changeFrequency`/`priority` silinir (Google yok sayıyor); `lastModified: new Date()` kaldırılır → gerçek içerik-değişim tarihi (her build'de yenilenen tarih sinyal güvenini bozar).
- FAQPage JSON-LD kalır (zararsız, bakım yatırımı yapılmaz). hreflang eklenmez (tek dil).

## GBP kararları (askı riskine karşı kurallar)

- **Ad**: yalnız tabeladaki gerçek hali ("YIKAT"; tabelada farklıysa tabela fotoğrafı kanıt olarak saklanır). "YIKAT Ayakkabı Yıkama Bakırköy" gibi doldurma = en yaygın askı tetikleyicisi, YAPILMAZ.
- **Kategori**: "Shoe cleaning service" diye kategori YOK (Mayıs 2026 dökümü). Birincil aday: "Shoe shining service" TR karşılığı; ikincil: "Leather cleaning service" (gerçekten sunuluyorsa). Kategori doldurma (Dry cleaner vb.) YAPILMAZ.
- **Fotoğraf**: GBP'ye YALNIZ gerçek dükkân/iş fotoğrafı (720×720+); sitedeki AI-kompozit görseller YÜKLENMEZ (politika riski).
- **Doğrulama**: yöntemi Google seçer; video istenme ihtimaline tek seferlik çekim planı hazır (dış tabela + sokak kanıtı, ekipman, kasa/POS). Profil doğrulanana dek görünmez — takvim buna göre.
- **Yorum motoru**: resmi kısa link/QR; teşvik KESİNLİKLE yasak (indirim karşılığı yorum = askı riski); dükkânda başında bekletme/dikte yok; tüm yorumlara ≤1 hafta içinde kişiye özgü kısa yanıt. Hedef: 20+ yorum, sonra sürekli akış.
- **Posts**: açıklamada telefon YOK (red nedeni); hizmet adlarında fiyat/telefon YOK (otomatik red); 6 ayda bir tazeleme.

## Kapsam dışı

Programatik mahalle/semt sayfaları (doorway); review şeması; hreflang; FAQ şeması genişletme; Instagram stratejisi (ayrı iş); ücretli reklam; legal sayfa metinleri (owner-blocker #2 aynen).
