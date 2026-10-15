# Care-card source assets

- `BricolageGrotesque-variable.ttf`: official Google Fonts source, unchanged.
- `OFL.txt`: original SIL Open Font License1.1, including copyright notice.
- `font-source.json`: original download URL, byte length and SHA-256.
- `requirements.txt`: exact package versions used for the reproducible PDF.
- `qa-preview.png`: ignored local Poppler preview; not a public asset or source image.

The PDF generator reads `public/images/yikat-logo-blue.png` directly. It never generates or edits the logo. Font weights are instantiated in memory and embedded as separate PDF subsets. See `docs/seo/2026-10-15-care-card.md` for content sources and QA.
