# Playback corrections

The owner reported a glitching washing film, slow/broken four-step animation,
and rejected the Home partnership CTA. Publish these focused corrections.

## Approach

- Keep the established brand objects and composition. Motion weighting:
  Jakub's production polish first, Jhey's object-specific character second.
- Video: start playback directly from the user's gesture with a valid source;
  separate the user's playback intention from temporary offscreen pauses.
  Observe the film itself. Play the short real shot once, hold the final frame,
  and offer replay instead of a jarring 2.7-second hard loop. Preserve lazy
  loading, manual pause, hidden-tab pause, loading feedback and retry.
- Four steps: advance every 1.5 seconds, with a short exit and a 240ms arrival.
  Observe the illustration instead of the entire section. Keep the first order
  state, immediate keyboard choices and manual control. Animate the washer
  drum while cleaning, and reset the progress line without a backwards sweep.
- CTA: “İşini büyüt”, linked to the existing Partners page.

## Verification

Exercise slow-load cancellation, pause/resume across scrolling, clean ending
and replay, rapid manual step changes, all four automatic states, small screens
and reduced motion. Run repository quality gates, inspect the rendered result,
then merge and confirm the deployed commit on the public domain.

Local validation: all five targeted playback/motion regressions passed against
the production build, including retry after media failure, cancelling a pending
download, replay, returning to view, manual pause, every automatic stage, and
320×568 reduced-motion behavior. Typecheck passed; lint has zero errors and the
two existing image warnings. The full run passed 39 checks; one browser worker
stalled and was stopped, and its interrupted keyboard/hydration check then
passed alone. CI must pass the complete suite before merging.

Rollback: return the custom-domain project to deployment
`dpl_9Td2vhUEk3xqyGtoA3sCrJ5B9863` if playback or core navigation regresses.
No environment, schema, service-area or form-intake changes are included.
