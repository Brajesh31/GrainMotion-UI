# GrainMotion-UI Design Tokens

`tokens.css` is the provisional shared token source for new implementation work.

## Important

The current components are standalone scripts. They draw most of their appearance through Canvas 2D and WebGL shader code and do not import this stylesheet. Creating this file does not alter their current appearance. Token adoption must happen component by component, with visual regression checks, rather than by applying a global stylesheet that could unintentionally change every control.

## Source and confidence

Interface surface values are the values documented in `docs/DESIGN-SYSTEM.md`. Sand and bamboo shades are also present in the original Slider and Signature drawing code. The walnut, moss and stone material values are approximate shader-derived matches already recorded in the design-system document. Treat those approximate values as a baseline to validate, not as pixel-exact universal values.

## Rules

- Add a token only when its value has a known source or a reviewed visual measurement.
- Prefer semantic names such as `--gm-page` and `--gm-sand-highlight` over component-specific names.
- Do not duplicate token values in new demos when a shared token is applicable.
- Keep shader uniforms and Canvas 2D colors synchronized with the CSS palette when a component is migrated.
- Capture before/after screenshots for every migration.
- Keep reduced-motion behavior functional even when the visual motion is disabled or shortened.
