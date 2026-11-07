# Before/after gallery and film

November 6, 2026. This extends the customer-case gate in `2026-10-16-local-proof.md`; every rule there still applies.

## What renders, and when

- `/ayakkabi-temizleme/oncesi-sonrasi` lists the reviewed cases by material: sneaker and mesh, suede and nubuck, leather, boots and slippers, children's shoes. Material jump links sit at the top. Each case shows both photos, the title, material and completion date, and the four facts: Geldiğinde, Ne yaptık, Sonuç, Ne kaldı (the receipt's problem, treatment, result and limitations). A closing section links to the material pages and the shop.
- The `CustomerCases` section on `/ayakkabi-temizleme` (`#sonuclar`) shows the heading with the film beside it, up to three `featured` cases, and a link to the full gallery both beside the heading and after the cases.
- Other pages lead into the gallery through `showcaseCases()`, which puts the pairs in the film first (they were picked as the clearest change), then `featured` ones, then gallery order:
  - each material page (`/sneaker-yikama`, `/suet-nubuk-temizleme`, `/deri-ayakkabi-bakimi`, by the service's `caseGroup`) shows up to three pairs of its group after "Sonuçtan ne beklemelisin?", each card opening its pair in the gallery (`#case-<slug>`), and links to the group's section (`#sneaker-file`, `#suet-nubuk`, `#deri`);
  - `/bakirkoy-ayakkabi-temizleme` shows the clearest pair of three groups and links to the whole gallery;
  - the home page's "Nasıl temizliyoruz?" shoe panel has one small card with the clearest pair and the count (`CaseProofLink`, a server component handed to the client home page).
  These pages' sitemap dates move with the newest approval, like the hub's; the home page's does not (one link card is not a substantive change).
- With no publishable case, the section and the strips render nothing, the gallery route returns 404, and neither the route nor the film enters the sitemap. That is the committed state until real permissions exist.
- Both photos are always visible: side by side on wide screens, stacked on phones. A hidden "after" photo behind a switch was rejected because visitors who scroll without tapping would see only dirty shoes.
- JSON-LD is a `CollectionPage` with an `ItemList` of the visible cases (image objects credited to Yıkat) and, when the film is live, a `VideoObject`. Approval metadata never renders. The sitemap date is the newest approval date.

## The film

`caseReel` in `lib/customer-cases.ts` is a short silent film cut only from published derivatives. It shows three to six pairs: the before photo holds, an eased wipe reveals the after photo, then a short crossfade to the next pair. The "Önce" and "Sonra" labels sit top-left so player controls never cover them; the photo labels in the gallery sit top-left too.

- It is withheld unless every case it shows is publishable (`publishableReel`).
- Files are content-addressed under `public/videos/cases/`: `once-sonra-<12hex>.mp4` (H.264, no audio, no metadata), `once-sonra-poster-<12hex>.webp`, and `once-sonra-<12hex>.vtt` captions naming each pair.
- The player shows controls, starts muted, plays inline, uses `preload="none"` and never autoplays. Only the poster downloads before play.
- `/videos/cases/*` is cached for one day, not the site's one-year immutable video rule, so a withdrawal takes effect.
- `publishedOn` is the public first-publication date and becomes the video's upload date.

## Writing the snapshot

The snapshot between `// <case-snapshot>` and `// </case-snapshot>` is generated, not hand-edited. The generator lives outside this repository because it reads production. It is kept in the canonical YIKAT workspace notes. It:

1. reads the founder's panel receipts (`media.case_permission`, version `website-case-v1`) read-only and applies the same state rule as the admin panel: one committed tip, otherwise unresolved;
2. keeps a pair only if its receipt is APPROVED and names exactly the before and after photos the public derivatives were made from;
3. takes material, problem, treatment, result, limitations and completion date from the receipt. Titles, alt texts, material group and `featured` are editorial;
4. writes the snapshot, copies the 1200×900 metadata-free WebP derivatives, recuts the film from approved cases, and deletes public files that are no longer referenced.

A founder can also record a publication decision outside the panel: who decided, when, and the exact words, kept with the generator's notes. With that record the generator also publishes the pairs it names, with draft facts read from the photos, unless the panel already holds a receipt for the pair. An approved receipt supplies the facts; a withdrawn or unresolved one keeps the pair off the site. The first release used such a decision for 24 counter pairs. The gallery's closing note tells customers how to have their pair removed.

It never commits. A person reviews the diff, runs the tests, checks the rendered page on mobile and desktop, and releases.

## Link preview picture

`caseShare` is the gallery's `og:image` and `twitter:image`, so a shared gallery link shows a real before and after instead of the site picture. The publish tool cuts it from the first published pair in its preference list (the film's list, clearest change first): the two 1200×900 photos side by side at 1200×630, labels on either side of the divider so a square chat thumbnail still shows both, metadata-free JPEG under 300 KB (WhatsApp drops larger preview images). It is content-addressed (`/images/cases/once-sonra-paylasim-<12hex>.jpg`), withheld unless its pair is publishable (`publishableShare`), and also the `CollectionPage`'s `primaryImageOfPage`. Every other page keeps the site picture.

## Withdrawal

Withdraw in the panel first, or remove the pair from the founder decision record when it was published on one. Then regenerate the snapshot. The case and its two derivatives leave the site, a film that showed the case is recut without it, or removed when fewer than three cases remain, and a link preview picture cut from it is replaced by the next pair's. The strips on other pages simply show other pairs. Deploy, then check that the old image and film URLs no longer serve. As in the October rule, restrict or remove prior deployment copies that still serve the files. Chat apps keep a link preview they already fetched: when the removed pair was the preview picture, refresh the gallery URL in Meta's Sharing Debugger so Facebook and Instagram fetch the new one.

## Tests

`tests/local-proof.spec.ts` covers:

- the case gate, including material groups;
- the film gate: missing case, wrong paths, empty text, future date;
- shipped image and film files equal the referenced ones and match their content hashes;
- the gallery route and sitemap entry exist only with publishable cases;
- the film's cache header;
- axe and no horizontal overflow on the published gallery at 320 and 1280 px;
- the link preview gate, the shipped picture (content hash, JPEG size and dimensions, no EXIF) and the gallery's meta tags;
- the strips' ordering, the links from the home, Bakırköy and material pages (only while pairs are published, every anchor present in the gallery), and axe and overflow on them at 320 and 1280 px.
