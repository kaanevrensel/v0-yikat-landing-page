# Service art families and real shop — October 10

Owner correction: remove “Boşver, yıkat”; use a real shop photograph; make new hero service illustrations and distinct supporting versions; retain blue contact glyphs but give their actions a pressable surface.

## Implementation

- Keep the animated water and five service choices. Remove the visible hero slogan, footer slogan and repeated product closing slogan. Keep a concise screen-reader heading.
- Hero family: five new isolated sculptural compositions, crafted in porcelain white and YIKAT blue. Different silhouettes and objects, no repeated boxes or token stars stamped everywhere.
- Supporting family: original two-dimensional illustrations with fine blue outlines and selected enamel-blue surfaces. Use these for the service strip and selected-service ticket/demo, retaining original app assets inside the phone preview.
- Shop: find and verify an actual photograph of the Bakırköy shop. Never substitute a generated storefront photograph.
- Contact actions: substantial rounded rectangular surfaces, shadow/depth, clear hover and pressed states, 44px+ targets. Preserve destinations and accessible names.
- Review desktop and narrow mobile; run existing lint/typecheck/browser checks. Local preview only; no commit, push or deployment.

## Asset provenance and final validation

Implemented all four owner corrections.

- Five transparent hero illustrations generated with the built-in image_gen tool. Final production assets: `public/images/services/hero-v2/{ayakkabi,dry-cleaning,kiloyla,utu,hacimli}.webp`. Each is 640×640 with alpha; combined size is 311,090 bytes. Prompts and source/output mapping: `assets-2026-10-10.json`.
- Five bespoke small-format SVG illustrations: `components/website/service-art.tsx`. Used in Product hero decorations, service strip, order demo, Home service tickets and Partners. Original artwork is confined to the in-app phone preview (and older unmounted components).
- Shop photo: `public/images/shop/bakirkoy-owner-202608.webp`, 1000×1333, 311,506 bytes. Retrieved from Yıkat’s owner-uploaded August 2026 Google Maps gallery. Verified logo, address, website and phone. Full source/provenance in `public/images/shop/SOURCE.md`. No generated changes to the photograph.
- Removed the slogan in Home, Product closing, footer and metadata. Home retains a screen-reader heading. The existing water loop remains continuous.
- Contact buttons have raised faces, clear primary/secondary contrast, immediate pressed states and visible keyboard focus. Directions beneath the photograph also has a button face.

Validation: all 25 Playwright tests passed with two workers. Final typecheck and production build pass. Lint has zero errors and two unchanged legacy image warnings. Native Chrome review covered all three routes, the partner form, the actual photograph, and the service ticket; narrow mobile reviewed at 320×568. Refined the small iron and bedding silhouettes after the initial full suite, then rechecked them visually and rebuilt/typechecked final source. No commit, push or deployment.

Preview: http://127.0.0.1:3210
