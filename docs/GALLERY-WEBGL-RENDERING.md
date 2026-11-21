# Gallery preview rendering and WebGL context budget

## Production symptom

The deployed gallery showed large blank white preview trays. On several controls, a sprite such as the Slider rake or Thinking rock still appeared over the white tray. This is consistent with the component's overlay canvas remaining visible while its WebGL sand canvas has lost a usable context.

## Root cause

Every one of the fifty custom elements was inserted into the gallery DOM during initial page load. Each connected `SandTray` created its own WebGL2 context and animation loop. Browsers impose a finite context budget. Mounting fifty live previews can evict contexts from earlier elements, leaving their sand layer blank.

This is a gallery lifecycle and renderer-budget problem, not a CSS-only issue. Making the canvas white/transparent or hiding the sprite layer would conceal the symptom rather than restore the sand.

## Fix

1. `gallery/index.html` now keeps every catalogue card in the document but creates each live custom element from a template only when its card is close to the viewport.
2. The gallery caps simultaneously mounted previews at eight.
3. When a card moves outside the active area or is evicted by the budget, the custom element is removed. Its resize observer is disconnected, its animation stops, and the gallery calls `WEBGL_lose_context` where available to release the GPU context.
4. On re-entry, the preview is mounted again from its original HTML template and its demo wiring is restored.
5. Gallery script URLs carry a version query to prevent stale component bundles from being reused after deployment.
6. The shared `SandTray` core now has a 2D compatibility renderer. If WebGL2 is unavailable, initialization fails, or the context is lost, it paints the current simulated sand height field, material frame and stone imagery on a Canvas 2D layer. The original WebGL2 shader remains the primary renderer.
7. WebGL context-restoration events rebuild the shader program and sand texture, then return rendering to the WebGL canvas.

## Standalone component behavior

Each component file still embeds the shared core and remains independently loadable. The change is not a new external runtime dependency. Applications that mount many component instances directly must still budget their connected WebGL canvases; the eight-preview cap applies to the project's live gallery.

## Regression coverage

The mobile Chromium test runner checks:

- All fifty gallery cards exist while no more than eight preview elements are mounted.
- Off-screen preview elements are actually unmounted.
- All four original controls and a later component can paint visible pixels through the 2D fallback when WebGL2 is unavailable.
- Slider and Toggle public APIs remain usable in fallback mode.
- A simulated WebGL context loss activates the fallback and a restoration event returns to the GPU canvas.
- Existing pointer, keyboard, form serialization, lifecycle and component interaction checks still run.

The compatibility renderer preserves a meaningful sand image and interaction but is not intended to match the exact lighting and texture of the full WebGL2 shader.
