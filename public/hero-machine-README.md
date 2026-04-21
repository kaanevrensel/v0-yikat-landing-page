# Hero Machine Photograph — Asset Spec

Target file: `/public/hero-machine.jpg` (overwrite the placeholder).

## Subject

Close-up of a modern front-load washing machine. The shot must prominently feature:
- **A single round control knob** — the layout overlays a real SVG knob on top of it, so the photograph's knob must be the primary visual anchor on one side of the composition.
- **The drum window (circular door)** — visible, because a CSS-animated drum rotates slowly inside it during hero state.

Background should be neutral/soft — laundry room, kitchen corner, soft window daylight. Avoid busy scenes.

## Technical

- **Dimensions:** ≥ 1600px wide (we serve at 1600 desktop / 800 mobile). 3:2 or 4:3 aspect ratio works; 2:1 (wide banner) is too thin.
- **Format:** JPEG, quality 85 (balance file size vs detail on the knob)
- **File size target:** < 300 KB
- **Color:** sRGB. Complements `#FAFAF7` page background (warm neutrals, soft blues, wood tones all good; avoid hard magenta/teal)

## Composition notes

- Knob on the RIGHT side of the image (~65-80% horizontally). The CSS overlay places our SVG knob at roughly that horizontal offset; we can tweak CSS to match your image.
- Drum window occupying roughly the central 40-50% area.
- Enough negative space to the LEFT of the machine for the headline + body text to breathe (alternatively, text sits on top of the page background and the photo is a contained column; current layout = photo is a contained column on the left, text column on the right).

## Swap procedure

Replace `/public/hero-machine.jpg` with the final file. If aspect ratio differs meaningfully from the placeholder, update the `aspect-ratio` CSS in `components/HeroMachine.tsx` accordingly.
