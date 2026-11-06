# Before/after gallery and film

November 6, 2026. This extends the customer-case gate in `2026-10-16-local-proof.md`; every rule there still applies.

## What renders, and when

- `/ayakkabi-temizleme/oncesi-sonrasi` lists the reviewed cases by material: sneaker and mesh, suede and nubuck, leather, boots and slippers, children's shoes. Material jump links sit at the top. Each case shows both photos, the title, material and completion date, and the four facts: Geldiğinde, Ne yaptık, Sonuç, Ne kaldı (the receipt's problem, treatment, result and limitations). A closing section links to the material pages and the shop.
- The `CustomerCases` section on `/ayakkabi-temizleme` (`#sonuclar`) shows the heading with the film beside it, up to three `featured` cases, and a link to the full gallery both beside the heading and after the cases.
- With no publishable case, the section renders nothing, the gallery route returns 404, and neither the route nor the film enters the sitemap. That is the committed state until real permissions exist.
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

## Withdrawal

Withdraw in the panel first, or remove the pair from the founder decision record when it was published on one. Then regenerate the snapshot. The case and its two derivatives leave the site, and a film that showed the case is recut without it, or removed when fewer than three cases remain. Deploy, then check that the old image and film URLs no longer serve. As in the October rule, restrict or remove prior deployment copies that still serve the files.

## Tests

`tests/local-proof.spec.ts` covers:

- the case gate, including material groups;
- the film gate: missing case, wrong paths, empty text, future date;
- shipped image and film files equal the referenced ones and match their content hashes;
- the gallery route and sitemap entry exist only with publishable cases;
- the film's cache header;
- axe and no horizontal overflow on the published gallery at 320 and 1280 px.
