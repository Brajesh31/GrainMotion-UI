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

GitHub Actions [#519](https://github.com/Brajesh31/GrainMotion-UI/actions/runs/44889040870) on latest main commit `1bb8a7ebc7ff44f14ef16f83c66e9e0f27880cdc`:

- Standalone bundle synchronization passed.
- Generated documentation and registry validation passed.
- Structural inventory/assets/registry audit passed.
- All four original components initialized in the no-WebGL fallback path.
- All four fallback canvases painted visible sand pixels.
- Slider and Toggle fallback API assertions passed (`value: 72`, `target: 0.72`, `checked: true`).
- Toggle reconnect checks passed.
- Slider, Toggle, Signature undo, Signature clear and Thinking reduced-motion checks passed.
- Full suite reported 233 passing assertions and 21 failures, all in other components or the Scrubber media test harness. No original-four interaction or fallback assertion failed.
- GitHub Pages deployment [#620](https://github.com/Brajesh31/GrainMotion-UI/actions/runs/44889040845) successfully deployed this commit.

The separate [gallery rendering report](GALLERY-WEBGL-RENDERING.md) documents the white-preview issue, WebGL context budget fix and verification. The gallery-specific tests pass on this current commit.
## Validation still required

- Desktop and narrow-mobile visual inspection against approved original running-component references, not just concept art.
- Real touch-device checks and verification in another browser engine.
- Screen-reader/assistive-technology verification.
- Sound/mute review and resize-continuity review.

The automated gates for the original four are passing. Do not claim Phase 1 is fully complete until visual, real-device and accessibility evidence is added. The three unrelated full-suite failures should be tracked in the appropriate later Tooltip/Toast phases, not hidden or waived.

Phase 1 remains **in progress** until these gates have evidence. Do not start Phase 2 or expand components 5-50 as part of this phase.


## Gallery-wide rendering correction

The deployed gallery previously mounted all fifty previews at once, exhausting the browser's WebGL context budget. The shared core and gallery were corrected as recorded in [GALLERY-WEBGL-RENDERING.md](GALLERY-WEBGL-RENDERING.md). The gallery now caps active previews at eight, unmounts off-screen controls and releases their GPU contexts. A shared 2D renderer preserves visible sand when WebGL2 is absent or lost.

On GitHub Actions #517, the four original controls passed their regular interaction and reduced-motion checks. All five sampled no-WebGL fallback controls painted visible sand. One fallback API assertion for Slider/Toggle remains open. Manual reference-image, real-device, cross-browser and assistive-technology sign-off also remains open.
