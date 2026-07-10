# Sahip Girdisi Bekleyen İşler (owner-blockers)

Dükkan sahibinden girdi gelmeden ilerleyemeyen maddelerin TEK listesi. Bir madde çözülünce
"ne gelince ne yapılacak" adımı uygulanır ve satır buradan silinir. (2026-07-08 itibarıyla derlendi.)

## 1. Fiyat menüsü — KISMEN ÇÖZÜLDÜ (2026-07-11: genel aralık 400–1000 ₺ yayında, `siteConfig.priceRangeLabel`)
- **Bekleyen:** Kategori bazlı KESİN fiyatlar (spor / deri / süet-nubuk / çocuk).
- **Gelince:** `lib/site.ts` → `priceMenu` içindeki `price: null` alanları `"499 ₺"` formatıyla doldur;
  `hasOfferCatalog` Offer'larına fiyat eklenebilir hale gelir; aralık etiketi kesin menüyle uyumlanır.

## 2. Yeni legal metinler
- **Bekleyen:** Ayakkabı-yıkama modeline uygun KVKK + mesafeli satış (veya hizmet koşulları) metinleri.
- **Gelince:** `/kvkk` ve `/mesafeli-satis-sozlesmesi` sayfa içerikleri değiştirilir. (Eski aggregator
  metinleri BİLİNÇLİ olarak canlı — "eski metin > hiç metin" kararı, CLAUDE.md gotchas.)

## 3. Gerçek Google Maps pin'i — ✅ ÇÖZÜLDÜ (2026-07-11: 40.977817, 28.877776 `siteConfig.geo`'da)
- **Kalan:** Statik harita görseli (visit-section placeholder'ı) artık üretilebilir — pin kesinleşti.
  GBP kaydında harita pini bu koordinata elle oturtulacak (Faz 3.1). Sahip tabela beyanı: "yıkat"
  (küçük harf logo) — GBP işletme adı buna göre girilecek, tabela fotoğrafı kanıt olarak saklanacak.
  Deri ayakkabı YIKANIYOR; GBP'ye "Leather cleaning service" ikincil kategorisi EKLENMEYECEK (sahip kararı).

## 4. Google Business Profile (GBP) sahiplenme
- **Bekleyen:** GBP kaydının sahiplenilmesi + doğrulanması; profil URL'si ve place-id.
- **Gelince:** `lib/site.ts` → `socialLinks.googleBusinessProfile` doldur (JSON-LD `sameAs` otomatik
  üretilir); place-id'li "Google'da değerlendir" linki visit-section'a İKİNCİL sessiz link olarak
  eklenir (yorum gösterimi ancak gerçek yorumlar birikince ayrıca tasarlanır).

## 5. MADE Okine Sans font kararı — BÜYÜK OLASILIKLA GEÇERSİZ (2026-07-10: site yüzü olarak Bricolage Grotesque seçildi, OFL lisanslı; MADE fikrinden vazgeçilecekse public/fonts/ silinmeli)
- **Bekleyen:** Karar — (a) ticari lisans satın al, (b) vazgeç. Dosyalar hâlâ `public/fonts/` altında
  PERSONAL USE lisanslı ve herkese açık URL'den erişilebilir durumda (sahip bilinçli olarak sildirmedi,
  2026-07-08 kararı: dosyalara dokunulmadı).
- **Gelince:** (a) ise lisanslı dosyalarla `next/font/local` display-face entegrasyonu; (b) ise
  `public/fonts/` silinir ve CLAUDE.md font notu düşürülür.

## 6. Gerçek müşteri önce/sonra fotoğrafları
- **Bekleyen:** Müşteri izni alınmış gerçek çiftler (aynı açı/ışıkta önce+sonra) + sahip onayı.
- **Gelince:** `lib/site.ts` → `results` dizisine `representative: false` ile ekle ("Gerçek müşteri
  sonucu" rozeti otomatik). 3+ gerçek çift birikince Carousel/Stack kararı CLAUDE.md gelecek-koşullu
  notundaki şartlara tabi (kıyas kaydırıcısıyla drag çakışması önlenmeli).

## 7. Gerçek sipariş istatistikleri (uzun vadeli)
- **Bekleyen:** Doğrulanabilir sipariş sayıları birikmesi + sahibin siteye rakam koyma onayı (spec değişikliği).
- **Gelince:** Value-band'e Count Up (RB fit analizi koşullu onayı) — bugüne dek SIFIR rakam kuralı geçerli.

## 8. Marka mavisi + beyaz küçük metin (sistemik kontrast kararı)
- **Durum:** `#4A8CFF` üstünde beyaz, 18px altı metinde WCAG AA'yı (4.5:1) geçemiyor (3.23:1).
  2026-07-08 review turlarıyla DÜZ RENK dolgulu tüm küçük-metin yüzeyleri #1f5eb8'e çekildi:
  navbar masaüstü+mobil CTA'ları, hero final CTA'sı, "TEMİZ" rozeti, 404 etiketi+butonu, skip-link.
  #4A8CFF artık yalnız büyük metin/ikon/vurgu ve zemin rollerinde.
- **Bekleyen:** Marka kararı — primer buton dolgusunun sistematik olarak #1f5eb8'e mi kayacağı,
  yoksa #4A8CFF'in yalnız büyük metin/ikon vurgusu olarak mı kalacağı.

## Sahibe iletilecek açık sorular
1. Fiyat menüsü ne zaman netleşir?
2. GBP kaydını birlikte mi sahiplenelim (10 dk sürer), yoksa erişimi paylaşır mısın?
3. MADE Okine ticari lisansı alınacak mı, font fikrinden vazgeçildi mi?
4. Müşteri fotoğrafı için izin akışı: teslimde sözlü izin + telefon notu yeterli mi, yazılı mı olsun?
