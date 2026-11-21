# Phase 1: Original four restoration

**Status:** Automated original-four regression checks pass on GitHub Actions #511. Phase 1 remains in progress pending visual, device and assistive-technology sign-off.

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

## Latest validation evidence

GitHub Actions [#511](https://github.com/Brajesh31/GrainMotion-UI/actions/runs/44885153121) on commit `59b96431c1921c9cd5b5daa01e81be5fdf7c2e9b`:

- Standalone bundle synchronization passed.
- Generated documentation and registry validation passed.
- Structural inventory/assets/registry audit passed.
- No-WebGL setup and visible-pixel checks passed for all four original controls.
- Slider and Toggle public API checks passed in fallback mode.
- Toggle reconnect checks passed.
- Slider, Toggle, Signature undo, Signature clear and Thinking reduced-motion checks passed.
- Full suite reported 246 passing assertions, 3 failures (Tooltip keyboard focus, Tooltip Escape dismissal, Toast polite status announcements).
- No JavaScript runtime errors were reported.

## Validation still required

- Desktop and narrow-mobile visual inspection against approved original running-component references, not just concept art.
- Real touch-device checks and verification in another browser engine.
- Screen-reader/assistive-technology verification.
- Sound/mute review and resize-continuity review.

The automated gates for the original four are passing. Do not claim Phase 1 is fully complete until visual, real-device and accessibility evidence is added. The three unrelated full-suite failures should be tracked in the appropriate later Tooltip/Toast phases, not hidden or waived.

Phase 1 remains **in progress** until these gates have evidence. Do not start Phase 2 or expand components 5-50 as part of this phase.
