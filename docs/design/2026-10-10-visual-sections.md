# Visual-first website expansion — October 10, 2026

## Owner direction

Increase desktop service spacing, move the contact actions lower, expand Home to
four or five varied sections, use Kaan's shared Google Drive material, and lead
Product and Partners with visuals instead of large text headings. Keep the
existing blue/white identity, sculptural hero and continuous water motion.

## Composition

- Home: four sections — service objects with more air; a blue app pocket with
  an animated camera; the actual shop/map with day/night photos and a walking
  route film; a separate hanging partnership invitation. Raw workshop footage
  was reviewed but not used because the selected takes were largely blurred.
- Product: a central app preview with illustrated camera, scheduling and care
  controls. No visible headline in the opening. Condense explanatory copy and
  retain functional order exploration and essential availability disclosure.
- Partners: a visual service rail and workboard first, followed by distinct
  map/calendar art and the existing application. No visible opening headline.
- Original animated vector objects: camera with a photo print, a sealed care
  parcel, and a hanging partnership tag. Movement conveys each object's role,
  not a repeated floating animation on every component.

Motion: Jhey's playful physical mechanisms, Jakub's restrained easing and
materials, instant keyboard interaction. Honor reduced motion and pause media
and decorative work offscreen or when the tab is hidden. Controls remain still.

## Assets and boundaries

Kaan's shared YIKAT Drive was opened through the authenticated emre@yikat.tech
Chrome profile. The installed Gmail connector belongs to another business and
was not used. Raw, ready, published and Meta content was reviewed. Only selected
relevant assets were downloaded; no sharing permissions changed.
No fabricated before/after pair, private customer data or invented claims.
Work stays uncommitted at localhost:3210; no push or deployment.

The night image is 255 KB at 1000px wide. The route film is 49.46 seconds,
540 × 960, H.264 at 24fps, 14.4 MB, with no audio stream. It uses `preload=none`,
an optimized poster, native playback controls and Turkish descriptive captions.
Sources and derivatives are recorded in `public/images/shop/SOURCE.md`.

Native review caught inherited illustration padding, an oversized Product
opening and a form receipt focus race. SVG padding is reset, the desktop
composition is smaller, mobile controls precede the phone, and the receipt
focus/scroll runs after React commits the success state. The blue section's
availability line uses dark navy to meet AA contrast.

## Validation

- Production build and final TypeScript check pass. ESLint has zero errors and
  the same two pre-existing image warnings in the legacy service/visit files.
- All 32 browser checks pass in separate batches: eight responsive checks and
  24 interaction, accessibility, route and account-deletion checks. The initial
  combined run stalled during a worker handoff; the final interaction batch
  completed every test, then stalled in worker shutdown. Its already-finished
  worker was terminated, after which Playwright reported 24 passed and exited 0.
  This was runner cleanup, not an omitted or retried failing assertion.
- Native Chrome review covered Home, Product and Partners at desktop and
  320 × 568, service and stage controls, the day/night switch, explicit video
  playback, keyboard focus, reduced motion and the local partner form. A
  synthetic local application was written and its saved receipt was verified;
  the receipt focus/viewport regression also passes with a mocked response.
- The test server on port 3211 was stopped. The existing local preview on
  port 3210 remains open on the desktop homepage in Emre's YIKAT Chrome window.
  No commit, push, deployment, production form submission or sharing change.
