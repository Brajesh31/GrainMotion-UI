# Asset Catalog and Asset Standards

## Current repository assets

This catalog records assets found in the current repository tree. It does not assert that every asset is used by every component.

### Main artwork and concepts

| Path | Format | Current role / description |
|---|---|---|
| `gallery/title.jpg` | JPEG | Existing gallery title artwork; retained in repository. |
| `gallery/title.svg` | SVG | GrainMotion-UI branded hero graphic currently referenced by the README and gallery social preview metadata. |
| `art/rock.webp` | WebP | Rock artwork embedded by the Thinking component build configuration. |
| `making-of/concept/01-set.webp` | WebP | Early control-set concept artwork. |
| `making-of/concept/02-toggle.webp` | WebP | Toggle concept artwork. |
| `making-of/concept/03-slider.webp` | WebP | Slider concept artwork. |
| `making-of/concept/05-check-radio.webp` | WebP | Checkbox and radio concept exploration. |
| `making-of/concept/09-board-toggle.webp` | WebP | Board/toggle visual exploration. |
| `making-of/concept/13-camera-panel.webp` | WebP | Composition/panel exploration. |
| `making-of/concept/concept-1.webp` | WebP | Additional early concept artwork. |
| `making-of/concept/rocks.webp` | WebP | Rock shape and material exploration. |

### Audio assets

The following files exist under `sounds/`:

| Path | Format | Notes |
|---|---|---|
| `sounds/drift-loop.wav` | WAV | Loop asset configured for Thinking. |
| `sounds/flow-loop.wav` | WAV | Loop asset configured for Thinking. |
| `sounds/rake-loop.wav` | WAV | Loop asset configured for the original rake-based controls. |
| `sounds/reach.mp3`, `sounds/reach-b.mp3` | MP3 | Paired sound takes configured for Thinking. |
| `sounds/scratch.mp3`, `sounds/scratch-b.mp3` | MP3 | Paired sound takes configured for Thinking. |
| `sounds/settle.mp3`, `sounds/settle-b.mp3` | MP3 | Paired settling sounds. |
| `sounds/stone.mp3`, `sounds/stone-b.mp3` | MP3 | Paired stone sounds. |
| `sounds/sweep.mp3` | MP3 | Sweep sound. |
| `sounds/tap.mp3`, `sounds/tap-b.mp3` | MP3 | Paired tap sounds. |

Exact per-component embedding is configured in [tools/build.mjs](../tools/build.mjs). Review that file before changing an asset assignment.

## Asset categories to add as the library grows

- **Material imagery:** sand grain, walnut, bamboo, basalt, river stones and mineral pigments.
- **Tool sprites:** rakes, styluses, markers, dividers and other objects that must render above the sand.
- **Component-specific sprites:** calendars, hourglass parts, upload tiles, media frames and other elements that cannot be convincingly drawn from the existing stone/rake primitives.
- **Sound:** component-specific contact, drag, impact, settle, open/close and completion events.
- **Documentation imagery:** genuine screenshots of working demos, API diagrams and design studies.

## Asset creation rules

1. Create assets for an actual component requirement, not just to decorate a folder.
2. Keep the original palette and material language.
3. Prefer transparent WebP or PNG for sprites that must overlay the sand; use SVG for crisp simple diagrams and icons.
4. Keep high-resolution source art where appropriate and produce optimized runtime variants.
5. Never use a concept render as proof of a working component. Label design studies as concepts.
6. Use real screenshots for implementation documentation only after the component is running.
7. Keep filenames descriptive, lowercase and hyphenated.
8. Record the source, creator, license/usage rights, intended component and optimization details for every external or generated asset.
9. Do not embed enormous unnecessary assets in every standalone control. Embed only what that component needs.
10. Avoid repeated sound triggers and overly loud effects. Provide a reliable mute option.

## Required asset manifest fields

When the library grows, maintain a manifest with at least:

| Field | Description |
|---|---|
| `id` | Stable asset identifier |
| `path` | Repository path |
| `type` | image, texture, sprite, sound, diagram or screenshot |
| `component` | Component using it, or shared |
| `purpose` | What it contributes to the design or behavior |
| `format` | File format |
| `dimensions_or_duration` | Image dimensions or audio duration |
| `size_bytes` | Actual file size |
| `source_and_rights` | Provenance and usage permission |
| `runtime_embedded` | Whether it is embedded in a standalone component |
