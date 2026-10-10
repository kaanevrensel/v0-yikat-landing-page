# Image-first homepage

Local preview only. Preserve the three existing routes and shared floating navigation.

The visitor is on a bright phone screen, deciding what to clean. They should touch
an object immediately, not read an explanation. Keep the original app artwork,
Bricolage Grotesque, white, YIKAT blue #269AFF, ink #102C42, action #1A68C1 and
pale blue #F3F8FF. The established identity takes precedence over new-font defaults.

```
                 floating navigation
                    Boşver, yıkat
          [shoe] [garment] [laundry] [iron] [duvet]
             WhatsApp           Yol tarifi

              chosen image opens action sheet
                [Uygulamayı aç] [Uygulamayı indir]
                [WhatsApp]      [shop directions]
```

Desktop: the original objects form an open fan, with shoes the dominant center
object. Mobile: compact touchable image choices, all visible in the first screen,
with the same labels and next actions. Never depend on hover or dragging.
One quick, staggered arrival introduces the objects; subsequent motion follows
input. Jakub polish and selective Jhey expression, with Emil restraint on repeated
controls. Keyboard and reduced-motion interactions are immediate.

Remove the cleaning-scene demonstration, long service descriptions, process
paragraphs and repeated app explanations from Home. Product remains the place
for exploring the full app example. No copied card-plus-icon marketing grid.
The objects themselves are the controls; text is limited to names, destinations
and the currently necessary notice that app collection is paused.

A native dialog contains selected-service actions, closes by Escape/backdrop,
traps focus, and restores focus to the object. WhatsApp links carry the chosen
service as a user-editable draft; nothing is automatically sent. App links use
existing routes only. No invented prices, hours, address-unit certainty or Android
release date. Preserve legal and contact routes. No production deployment.

## Local acceptance

- Production build, typecheck and 24 browser tests passed. Lint has zero errors
  and two existing image warnings in legacy service/visit components.
- Checked all five choices, exact WhatsApp service drafts, download-dialog handoff,
  Escape and focus restoration, reduced motion and no-JavaScript contact exits.
- Touch controls and overflow passed at 320/390/430/768px; visually inspected
  320×568, 390×844 and 1440×900. Original service art is eager-loaded.
- Preview: http://127.0.0.1:3210. No commit, push or deployment.

## October 10 refinement

Keep the approved service artwork, blue #269AFF / action #1A68C1, ink #102C42,
water #DCEEFF, white and Bricolage Grotesque. The visitor should recognize every
object as an action without instructional copy: give each label a tactile pill
and a visible next-step chevron, with the entire object remaining the button.

One blue water wash behind the objects supplies the requested background motion.
Use layered flowing contours, not floating unrelated ornaments. The opening
settles within five seconds; fine-pointer movement gently changes its position.
This preserves a quiet resting state without adding a pause control. Motion
weighting remains Jakub primary, Jhey for the water material, Emil for controls.
Reduced motion and keyboard interaction are immediate. No new dependency.

Partners: promote the supplied two sentences to heading/supporting hero copy,
remove the old headline, audience note, panel caption and introductory three-step
application section. The form heading becomes “Başvur”; remove the paragraph and
preview banner above its fields. Keep the existing local-only submission guard
and truthful local receipt after submission. No production intake or deployment.

Acceptance: existing typecheck/lint/browser suite plus desktop/mobile visual
inspection, service-button affordance, still reduced-motion backdrop, pointer
response, compact partner hero and a direct, usable application form.

Refinement verified: typecheck and production build pass; all 24 browser tests
pass, including service dialogs, responsive layouts and reduced-motion flows.
Lint has zero errors and the same two legacy image warnings. Native Chrome
visual inspection confirms the homepage and partner hero at desktop and
320×568, plus the direct “Başvur” form without the removed copy or banner.
The local preview is left open at http://127.0.0.1:3210. No commit, push or deploy.
