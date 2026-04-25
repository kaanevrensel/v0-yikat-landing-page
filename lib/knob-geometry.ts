// lib/knob-geometry.ts
//
// Shared geometry constants for the knob morph + label ring.
// Used by components/Knob.tsx and components/LabelRing.tsx.
// Pure number exports — no React, no MotionValues, no helpers.

/** Container footprint (px, matches viewBox dimension). */
export const BASE_SIZE = 500

/** WashingMachine SVG viewBox dimensions (used for DOMRect → knob-center math). */
export const VIEWBOX_W = 900
export const VIEWBOX_H = 1100

/** Knob center in the WashingMachine viewBox (control panel). */
export const KNOB_LOCAL_X = 450
export const KNOB_LOCAL_Y = 210

/** Old knob diameter in WashingMachine's pre-extraction 100-unit local viewBox.
 *  Used to compute restScale so the rendered knob CSS size matches commit efa011c. */
export const KNOB_DIAMETER = 88

/** scrollY threshold where the morph begins. */
export const MORPH_START = 120

/** scrollY threshold where the morph is fully settled. */
export const MORPH_END = 380

/** Total vertical padding at the scrolled destination (desktop only). */
export const SCROLLED_PADDING = 40

/** Floor for the scrolled destination size (desktop only). */
export const MIN_SCROLLED_SIZE = 420

/** Viewport width threshold (px). At or above = desktop. Below = mobile. */
export const DESKTOP_BREAKPOINT = 1024

/** Marker angle in degrees (CSS angle convention: 0° = east). */
export const MARKER_ANGLE_DESKTOP = 0   // 3 o'clock
export const MARKER_ANGLE_MOBILE = 90   // 6 o'clock

/** Marker tick visual constants. */
export const MARKER_GAP = 6        // px gap between knob outer edge and tick inner end
export const MARKER_LENGTH = 14    // px tick length (radial)
export const MARKER_WIDTH = 2      // px tick width

/** Gap between knob outer edge and label center, in BASE_SIZE units (gets scaled with parent). */
export const LABEL_RING_GAP = 16

/** Visibility gate: morphProgress range over which labels fade in. */
export const VISIBILITY_GATE_START = 0.85
export const VISIBILITY_GATE_END = 1.0

/** Opacity falloff exponent (per UX spec — see plan §2). */
export const OPACITY_FALLOFF_DEG = 110
export const OPACITY_FALLOFF_EXPONENT = 1.4
