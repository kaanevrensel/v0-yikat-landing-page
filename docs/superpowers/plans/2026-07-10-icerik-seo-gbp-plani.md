# İçerik + Yerel SEO + GBP Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Site içeriğini hedef sorgu ailesine hizalayıp teknik SEO'yu araştırma-doğrulanmış en iyi hale getirmek; Google Business Profile + Yandex + Apple kayıtlarını kurup yorum motorunu çalıştırmak.

**Architecture:** Spec: `docs/superpowers/specs/2026-07-10-icerik-seo-gbp-design.md`. Tek sayfa korunur; tüm veri `lib/site.ts` tek kaynağından akar; sahip-girdileri Faz 0'da toplanır, kod işleri Faz 1-2'de, platform kayıtları Faz 3-4'te sahiple oturum halinde, ölçüm Faz 5'te. Faz 6 koşullu (fiyat+gerçek foto sonrası).

**Tech Stack:** Next.js 16, lib/site.ts veri kaynağı, mevcut kalite kapıları (lint/typecheck/Playwright/LHCI) her kod fazının sonunda koşulur.

---

## Faz 0 — Sahip girdileri (kod öncesi, BLOKAJ)

- [ ] **0.1 Fiyat aralıkları**: 4 kategori için (spor/deri/süet-nubuk/çocuk) "X–Y ₺" aralıkları. Pazar çıpası: Armut İstanbul bandı 400-750₺.
- [ ] **0.2 Gerçek Maps pin'i**: dükkânın tam konumu (Google Maps'ten paylaş → koordinat en az 5 ondalık). `siteConfig.geo` + GBP pini + statik harita görevi (owner-blockers #3) buna bağlı.
- [ ] **0.3 Tabela teyidi**: tabelada birebir ne yazıyor? (GBP adı bunun aynısı olacak; tabela fotoğrafı kanıt olarak saklanacak.)
- [ ] **0.4 Deri temizliği teyidi**: "Leather cleaning service" ikincil kategorisi eklenecek mi — hizmet gerçekten bu kapsamda mı?

## Faz 1 — On-page içerik güncellemesi (kod)

**Files:** `lib/site.ts`, `app/layout.tsx` (metadata), `components/hero-scroll-story.tsx`, `components/how-it-works.tsx`, `components/price-menu.tsx`, `components/visit-section.tsx`, `components/value-band.tsx`

- [ ] **1.1** `lib/site.ts`: `PriceItem`'a `priceRange: string | null` ekle; Faz 0.1 aralıklarını gir; kategori notlarına "sneaker" terimini ekle ("Sneaker, kumaş, mesh...").
- [ ] **1.2** `app/layout.tsx` metadata: title `"Ayakkabı Yıkama Bakırköy — Aynı Gün Teslim | YIKAT"`; description'a "aynı gün teslim" + "randevusuz" + "her gün 09:00–20:00" (SERP'te tek ayrıştırıcı vaat); OG/Twitter eşlensin.
- [ ] **1.3** Hero: sahne-1 alt metni "Bakırköy'de profesyonel ayakkabı yıkama — aynı gün teslim" (StaticHero paritesi zaten var); H1 dokunulmaz (marka cümlesi + LCP).
- [ ] **1.4** `price-menu.tsx`: aralık rozetleri ("300–600 ₺" formatı); bölüm intro'suna "Sneaker yıkamadan süet temizliğine..." sorgu-hizalı cümle; `id` yapısı korunur.
- [ ] **1.5** `how-it-works.tsx` / `value-band.tsx`: gövde metinlerinde "sneaker", "süet", "deri" doğal geçişler; CTA mikro-copy: "Aynı gün teslim — her gün 09:00–20:00".
- [ ] **1.6** `visit-section.tsx`: doğal TEK konum paragrafı: "Bakırköy çarşı içi, İskele Caddesi'nde; Ataköy, Yeşilköy, Kartaltepe ve Florya'dan birkaç dakika." (programatik sayfa DEĞİL); NAP düz metin zaten crawlable.
- [ ] **1.7** `lib/site.ts` faqs: sorgu diline hizala + yeni gerçek-bilgi soruları: "Süet ayakkabı yıkanır mı?"(var), "Sneaker yıkama aynı gün teslim edilir mi?", "Ayakkabı yıkama ücreti ne kadar?" (aralık cevabı), "Randevu gerekli mi?"(var). Uydurma bilgi içeren soru YOK.
- [ ] **1.8** Doğrula (tsc+lint+Playwright; FAQ sayısı değiştiyse smoke testindeki `faqs.length` zaten dinamik) + commit.

## Faz 2 — Teknik SEO (kod)

**Files:** `app/layout.tsx` (JSON-LD), `app/sitemap.ts`, `lib/site.ts`

- [ ] **2.1** JSON-LD: `"@type": "DryCleaningOrLaundry"`; `geo` Faz 0.2 pininden ≥5 ondalık; `priceRange` gerçek aralıkla (örn. "300–900 ₺", <100 karakter); `hasOfferCatalog` Offer'larına aralıklı `priceSpecification` (kaynak: priceMenu).
- [ ] **2.2** `app/sitemap.ts`: `changeFrequency`/`priority` sil; `lastModified` ya gerçek içerik tarihi (sabit, elle güncellenen) ya tamamen kaldır.
- [ ] **2.3** Review/aggregateRating şeması EKLENMEDİĞİNİ doğrula (tuzak testi: smoke spec'teki `"price"` sızıntı assertion'ına `"aggregateRating"` de eklenebilir).
- [ ] **2.4** Google Search Console: property zaten doğrulama token'lı — GSC'de sitemap gönder, kapsam raporunu kontrol et (sahiple).
- [ ] **2.5** Doğrula (kapılar + Rich Results Test'te LocalBusiness) + commit.

## Faz 3 — Google Business Profile (sahiple oturum)

> **REVİZYON (2026-07-11):** Sahip daha önce YIKAT için GBP açmış (eski/farklı adreste — muhtemelen
> pivot öncesi dönem). YENİ PROFİL AÇILMAZ (duplicate = çift askı riski); mevcut profil TAŞINIR.
> Yorum/geçmiş varsa korunur. Eski kayıt hizmet-bölgesi (adres gizli) tipindeyse vitrine çevrilir.

- [ ] **3.0** Mevcut profili bul: business.google.com → profil listesi. Erişim varsa 3.1'e; hesap
      farklı/erişim yoksa profil üzerinden "sahiplik talebi" (request ownership) akışı başlatılır.
      Profil askıdaysa önce itiraz/yeniden aktifleştirme.
- [ ] **3.1** Mevcut profilde DÜZENLE → ad: "yıkat" (tabela beyanı; anahtar kelime ekleme YOK);
      adres: `Cevizlik Mah. İskele Cd. No: 15C, Bakırköy/İstanbul` (site formatıyla birebir); pin
      elle 40.977817, 28.877776'ya; "müşteri ziyaret edebilir": Evet (eski kayıt kapıdan-hizmet/adres-gizli
      ise vitrin adresine çevir). Eski kategori kuru temizleme/çamaşır kaldıysa GÜNCELLE (Faz 3.2).
      NOT: adres değişikliği çoğu zaman YENİDEN DOĞRULAMA tetikler — video hazırlığı (3.4) elde olsun.
      Eski profili "kapalı" İŞARETLEME — taşınan işletmede yanlış sinyal; doğrusu adres güncellemek.
- [ ] **3.2** Kategori: birincil "Shoe shining service" TR karşılığı (panelde ara); ikincil yalnız Faz 0.4 onaylıysa "Leather cleaning service". Kategori doldurma YOK.
- [ ] **3.3** Telefon `0850 303 31 93`, site `https://www.yikat.tech`; saatler her gün 09:00–20:00 (+ bayram/özel günleri işle — açık-olma sinyali 5. faktör).
- [ ] **3.4** Doğrulama: Google'ın istediği yöntemle; video isterse tek çekim planı: dış tabela + İskele Cd. sokak kanıtı/komşular + ekipman + kasa/POS. İnceleme ~5 iş günü; profil o güne dek görünmez.
- [ ] **3.5** Doğrulama sonrası: açıklama (≤750 karakter, URL'siz, gerçek bilgiler); Hizmetler bölümüne priceMenu kategorileri (adlarda fiyat/telefon YOK; fiyat alanları aralıkla veya boş); GERÇEK dükkân fotoğrafları (AI görsel YÜKLEME); logo+kapak.
- [ ] **3.6** `lib/site.ts` `socialLinks.googleBusinessProfile` doldur (sameAs otomatik üretilir); GBP kısa yorum linki al → Faz 5.
- [ ] **3.7** İlk "Update" postu (aynı gün teslim değer önerisi; açıklamada telefon YOK).

## Faz 4 — Yandex + Apple + NAP tutarlılığı

- [ ] **4.1** Yandex Business (business.yandex.com.tr, ücretsiz): kayıt + doğrulama + fotoğraf/hizmet; NAP `lib/site.ts` ile birebir. (TR arama %9,8.)
- [ ] **4.2** Apple Business (businessconnect.apple.com → Apple Business): konum claim + place card; Apple Maps/Siri görünürlüğü. (Sitedeki Apple yol tarifi linki zaten var.)
- [ ] **4.3** NAP denetimi: Google/Yandex/Apple/site dört yerde "Cevizlik Mah. İskele Cd. No: 15C" ve "0850 303 31 93" karakteri karakterine aynı mı? (escmedya: "Cd."/"Caddesi" farkı bile tutarsızlık.)
- [ ] **4.4** (Opsiyonel, düşük öncelik) Bing Places + Foursquare — TR'de citation ekosistemi sığ; büyük dizin avına ÇIKMA.

## Faz 5 — Yorum motoru + ölçüm

- [ ] **5.1** QR yorum kartı: GBP kısa linkiyle tezgâh kartı/fiş eki tasarımı (basılabilir PDF — ayrı küçük iş). Kural seti karta değil personele: teşvik yok, dikte yok, başında bekletme yok.
- [ ] **5.2** Yanıt rutini: tüm yorumlara ≤1 hafta içinde kişiye özgü kısa yanıt (şablon yasak). Hedef: 20+ yorum (tüketici eleme eşiği), sonra düzenli akış (%74 son 3 aya bakıyor).
- [ ] **5.3** İzleme döngüsü (aylık): GSC sorgu raporu ("bakırköy" ailesi pozisyonları), GBP performans (arama→arama/yol tarifi), sitedeki `cwv_*` + `nav/visit/footer_directions_click` event'leri. Gerçek yorumlar birikince value-band'e sayı ekleme kararı SAHİP onayıyla (uydurma veri yasağı).
- [ ] **5.4** Lansman sonrası TR-IP/gerçek cihazdan SERP + harita paketi kontrolü (araştırmanın ABD-tabanlı tarama körlüğü notu).

## Faz 6 — KOŞULLU: hizmet sayfası ayrışması

**Tetikleyici:** fiyatlar yayında + 3+ gerçek önce/sonra fotoğrafı.

- [ ] **6.1** `/sneaker-yikama`, `/suet-nubuk-temizleme`, `/deri-ayakkabi-bakimi` — şablon: hizmet+Bakırköy H1, süreç, varyant fiyat, varyant SSS, gerçek foto, tel+tarif CTA; sitemap'e ekle; ana sayfadan bölüm→sayfa linkleri.
- [ ] **6.2** En fazla 2-3 köprü içerik ("Süet evde yıkanır mı? Riskler", "Sneaker makinede yıkanır mı?") — her biri hizmet sayfasına CTA'lı. DIY rehber SERP'i hedeflenmez.
- [ ] **6.3** Mahalle-şablon sayfası HİÇBİR AŞAMADA açılmaz (doorway).

## Yapılmayacaklar listesi (araştırma-gerekçeli)

Kendi siteye review şeması · GBP adına anahtar kelime · kategori doldurma · yorum teşviki · AI görselini GBP'ye yükleme · programatik mahalle sayfaları · FAQ şemasına yatırım · hreflang · sitemap changefreq/priority · her build'de yenilenen lastmod · DIY blog savaşı.
