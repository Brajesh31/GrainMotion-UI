# Phase 1: Original four restoration

**Status:** Implementation in progress. This is not a visual sign-off or release approval.

## Scope

This phase covers only Slider (`sand-slider`), Toggle (`sand-toggle`), Signature (`sand-signature`), and Thinking (`sand-thinking`).

## Previous automated evidence

GitHub Actions run #502 passed the then-existing functional checks for all four:

- Slider pointer drag, vertical page scroll, keyboard focus, arrow-key adjustment and Home key.
- Toggle touch tap, Space key and vertical page scroll.
- Signature pointer drawing, PNG export and Backspace undo.
- Thinking status labels for Searching and Ready.

Those checks did not cover no-WebGL rendering or reduced-motion behavior. They were not visual sign-off.

## Phase 1 implementation

1. The four original components retain WebGL2 rendering as the normal path. If WebGL2 cannot initialize, they render the current simulated sand height field through a simplified 2D canvas fallback. This is a degraded compatibility path, not a replacement for the original shader.
2. Slider and Toggle state changes apply immediately when `prefers-reduced-motion: reduce` is active.
3. Signature undo and clear complete immediately under reduced motion.
4. Thinking renders a static state-specific sand motif under reduced motion.
5. The browser suite adds no-WebGL rendering, visible-pixel, reconnection and reduced-motion checks.

## Validation still required

- `node tools/build.mjs --check`, `node tools/docs.mjs --check`, and `node tools/audit.mjs`.
- Full 50-component mobile Chromium suite. Existing failures in other components must remain visible and must not be waived.
- Desktop and narrow-mobile visual inspection against approved original running-component references, not just concept art.
- Real touch-device checks, another browser engine, and assistive-technology verification.
- Sound/mute review and resize-continuity review.

Phase 1 remains **in progress** until these gates have evidence. Do not start Phase 2 or expand components 5-50 as part of this phase.
