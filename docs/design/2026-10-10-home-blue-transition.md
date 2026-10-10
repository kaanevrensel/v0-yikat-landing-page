# Continuous blue background

The homepage hero now deepens from its existing pale sky into the app section's
exact blue, `#2388df`. Both sections share one color token. Only the moving water
fades out at the boundary, leaving the color continuous even when motion is
reduced or JavaScript has not loaded.

Native Chrome review covers the desktop section join and the 400px mobile
layout. Service objects and raised action buttons retain their contrast.
Existing wave timing, offscreen pause and reduced-motion behavior are unchanged.

Rollback reference: production deployment `dpl_GGM77yyNgkVAY2aTnJX8hxu47rfT`.
