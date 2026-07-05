# Hero Scrub Video — Onaylı Üretim Manifesti

Onay kuralı: her satır, çıktının kullanıcıya gösterilip onaylandığını belgeler (spec: `2026-07-05-hero-scrub-video-design.md` §2).
Not: `nano_banana_pro` istekleri sunucu tarafından `nano_banana_2`'ye yönlendiriliyor (kayıtlı model = gerçekleşen model).

**Konsept revizyonu (2026-07-05, kullanıcı):** Ayakkabılar giyilmiş (dizden aşağı, yürüyüş anı); arka plan sahneden sahneye yolun devamı; kamera açısı alçak/yan profil. **Stil revizyonu (2026-07-05, kullanıcı):** krem premium deri sneaker + açık gri kumaş pantolon; yıkama sahnesi stilize (giyili ayakkabı üstünde köpük).

## Nihai onaylı keyframe seti (v4 stili)

| Asset | Model | Job/Generation ID | URL | Onay |
|---|---|---|---|---|
| keyframe-sokak | nano_banana_2 (2k, 16:9, edit) | 18f118ca-ccd0-4096-989a-1d1d6c6ef433 | https://d8j0ntlcm91z4.cloudfront.net/user_35R0VUgrrx4UBlj1QR19MdZaZdi/hf_20260705_010052_18f118ca-ccd0-4096-989a-1d1d6c6ef433.png | 2026-07-05 |
| keyframe-camur | nano_banana_2 (2k, 16:9, 2-ref edit) | 880e520f-8bd5-4ffd-acce-7d317424b8ea | https://d8j0ntlcm91z4.cloudfront.net/user_35R0VUgrrx4UBlj1QR19MdZaZdi/hf_20260705_010259_880e520f-8bd5-4ffd-acce-7d317424b8ea.png | 2026-07-05 |
| keyframe-yikat | nano_banana_2 (2k, 16:9, 2-ref edit) | 3bd1ec41-2b6f-45a8-b13e-3ad0b84c53de | https://d8j0ntlcm91z4.cloudfront.net/user_35R0VUgrrx4UBlj1QR19MdZaZdi/hf_20260705_010304_3bd1ec41-2b6f-45a8-b13e-3ad0b84c53de.png | 2026-07-05 |
| keyframe-temiz | nano_banana_2 (2k, 16:9, 2-ref edit) | 7e3dd8d1-fdf5-4aff-a905-0aa22a727f08 | https://d8j0ntlcm91z4.cloudfront.net/user_35R0VUgrrx4UBlj1QR19MdZaZdi/hf_20260705_010306_7e3dd8d1-fdf5-4aff-a905-0aa22a727f08.png | 2026-07-05 |

## Onaylı geçiş klipleri (Seedance 2.0 std 1080p, 4 sn, sessiz)

| Klip | Job ID | URL | Onay |
|---|---|---|---|
| klip 1: sokak→çamur | 13cbfc79-946c-495a-8422-e5e8d3588251 | https://d8j0ntlcm91z4.cloudfront.net/user_35R0VUgrrx4UBlj1QR19MdZaZdi/hf_20260705_011208_13cbfc79-946c-495a-8422-e5e8d3588251.mp4 | 2026-07-05 |
| klip 2: çamur→yıkama (v2, doğal adım döngüsü; v1 kayma nedeniyle reddedildi: ff871a3d-702a-4158-b815-1b20093ca055) | b8d8e370-10ac-477a-b36f-8080debc688a | https://d8j0ntlcm91z4.cloudfront.net/user_35R0VUgrrx4UBlj1QR19MdZaZdi/hf_20260705_012620_b8d8e370-10ac-477a-b36f-8080debc688a.mp4 | 2026-07-05 |
| klip 3: yıkama→temiz | 6fd7ddd9-a7af-4fee-bec7-78c87aee2c3b | https://d8j0ntlcm91z4.cloudfront.net/user_35R0VUgrrx4UBlj1QR19MdZaZdi/hf_20260705_013139_6fd7ddd9-a7af-4fee-bec7-78c87aee2c3b.mp4 | 2026-07-05 |
| klip 1 v3: sokak→çamur (klip 2 hareket referanslı; v2 d7492105 adımlama nedeniyle elendi) | 286f9842-0915-454c-ae78-6183f9fa3a1f | https://d8j0ntlcm91z4.cloudfront.net/user_35R0VUgrrx4UBlj1QR19MdZaZdi/hf_20260705_021114_286f9842-0915-454c-ae78-6183f9fa3a1f.mp4 | 2026-07-05 |
| klip 3 v2: yıkama→temiz (doğal adım döngüsü) | b476003f-39bf-4760-a16d-1370b30d5eaa | https://d8j0ntlcm91z4.cloudfront.net/user_35R0VUgrrx4UBlj1QR19MdZaZdi/hf_20260705_020539_b476003f-39bf-4760-a16d-1370b30d5eaa.mp4 | 2026-07-05 |
| **FINAL hero-scrub.mp4**: klip 1v3 + 2v2 + 3v2, 1080p GOP6 CRF24, 12.13 sn, 9.22 MB — canlı scroll testiyle onaylandı (localhost, doğrusal scrub) | — | public/videos/hero-scrub.mp4 | 2026-07-05 |

## Elenen tek-çekim denemeleri (öğrenilenler)

| Deneme | Job ID | Sonuç |
|---|---|---|
| Kling 3.0 tek çekim 12sn (18 kr) | 3eb6b4b7-f455-4ea3-a26f-54ff198acc09 | Yürüyüş üretemedi |
| Seedance Mini + video referansı (30 kr) | 0d9dcef1-5b14-4409-9390-3959a18f0de3 | Adımlar iyi, anlatı kayboldu (maviye sürüklendi) |
| Seedance Mini + zaman çizelgesi (30 kr) | 6ba44078-f506-4a58-ac4e-ac041dfc572d | Fazlar doğru, geçişlerde yürüyüş bozuldu |
| Kling Motion Control recast | d5c86736 (failed, ücretsiz) | Bacak-only karede karakter tespiti başarısız |

**Nihai mimari kararı (2026-07-05, canlı testle):** 3-klipli birleşik video + **doğrusal** scroll→zaman eşlemesi (parçalı hold eşlemesi kaldırıldı — video scroll ile kesintisiz eş zamanlı akar; klip ek yerleri scroll akışında algılanmıyor). Metin pencereleri videonun gerçek sahne anlarına (%0/%33/%66/%100) hizalandı.

## Geçersiz kılınan ara üretimler (tarihçe)

| Asset | Job ID | Neden |
|---|---|---|
| keyframe-sokak v1 (giyilmemiş ürün karesi) | 645a68d6-6956-4591-9c74-b289304ae832 | Konsept revizyonu (giyilmiş/yürüyüş) |
| keyframe-sokak v2 (iki ayak havada) | d994d543-b952-458a-a5df-d50d59359e89 | Kullanıcı basan-ayak varyantı istedi |
| keyframe-sokak v3 (örgü sneaker + kot) | 6d62a6de-783e-44ee-ac00-a9206425caf2 | Stil revizyonu (deri sneaker + kumaş pantolon) |
| keyframe-camur v2/v3 (örgü sneaker + kot) | ee49d3ee-bb7c-4ea0-bff5-e7552d6885a9, 2323541f-b8e0-4717-8882-9f1ffe816ee3 | Stil revizyonu |
| keyframe-yikat v1 (örgü sneaker + kot) | 85ab35ce-3d4c-4b76-9c7d-ac9d3a3d2fe8 | Stil revizyonu |
| keyframe-temiz v1 (örgü sneaker + kot) | 422f2c6d-b750-441d-82f6-cb752b762e09 | Stil revizyonu |
