# Sahip Girdisi Bekleyen İşler (owner-blockers)

Dükkan sahibinden girdi gelmeden ilerleyemeyen maddelerin TEK listesi. Bir madde çözülünce
"ne gelince ne yapılacak" adımı uygulanır ve satır buradan silinir. (2026-07-08 itibarıyla derlendi.)

## 1. Fiyat menüsü
- **Bekleyen:** Kategori bazlı gerçek fiyat listesi (spor / deri / süet-nubuk / çocuk).
- **Gelince:** `lib/site.ts` → `priceMenu` içindeki `price: null` alanları `"499 ₺"` formatıyla doldur.
  Fiyat menüsü bölümü ve LocalBusiness `hasOfferCatalog` şeması aynı kaynaktan otomatik güncellenir
  (şemaya fiyat ekleme kararı o gün ayrıca verilir).

## 2. Yeni legal metinler
- **Bekleyen:** Ayakkabı-yıkama modeline uygun KVKK + mesafeli satış (veya hizmet koşulları) metinleri.
- **Gelince:** `/kvkk` ve `/mesafeli-satis-sozlesmesi` sayfa içerikleri değiştirilir. (Eski aggregator
  metinleri BİLİNÇLİ olarak canlı — "eski metin > hiç metin" kararı, CLAUDE.md gotchas.)

## 3. Gerçek Google Maps pin'i (launch-blocker)
- **Bekleyen:** Dükkânın doğrulanmış pin koordinatı (sahip Google Maps'te işletmeyi işaretleyip paylaşacak).
- **Gelince:** `lib/site.ts` → `siteConfig.geo` güncellenir; `mapsPlaceUrl`/`directionsUrl`/`appleDirectionsUrl`
  hedefleri pin'le tutarlı mı kontrol edilir. Statik harita görseli (visit-section placeholder'ının
  gerçek görselle değişimi) BU maddeden sonra üretilir — pin görsele gömüleceği için sıralama zorunlu.

## 4. Google Business Profile (GBP) sahiplenme
- **Bekleyen:** GBP kaydının sahiplenilmesi + doğrulanması; profil URL'si ve place-id.
- **Gelince:** `lib/site.ts` → `socialLinks.googleBusinessProfile` doldur (JSON-LD `sameAs` otomatik
  üretilir); place-id'li "Google'da değerlendir" linki visit-section'a İKİNCİL sessiz link olarak
  eklenir (yorum gösterimi ancak gerçek yorumlar birikince ayrıca tasarlanır).

## 5. MADE Okine Sans font kararı
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

## Sahibe iletilecek açık sorular
1. Fiyat menüsü ne zaman netleşir?
2. GBP kaydını birlikte mi sahiplenelim (10 dk sürer), yoksa erişimi paylaşır mısın?
3. MADE Okine ticari lisansı alınacak mı, font fikrinden vazgeçildi mi?
4. Müşteri fotoğrafı için izin akışı: teslimde sözlü izin + telefon notu yeterli mi, yazılı mı olsun?
