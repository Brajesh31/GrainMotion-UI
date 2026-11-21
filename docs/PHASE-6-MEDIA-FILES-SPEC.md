# Phase 6: Media, File and Visual Components

> Status: implementation in progress on `main`. The requirements below define behavior and release gates. A roadmap entry is not considered complete until the full CI workflow passes.

## Design direction

Keep the same physical language used by the original controls: simulated sand height fields, walnut frames, raked channels, real river-stone markers and quiet contact sounds. Media elements must display real supplied assets and interact with real browser APIs. Concept SVGs are design studies, not runtime screenshots.

## Shared implementation contract

- Every element is a standalone JavaScript file, built with the current `tools/build.mjs` stamping pipeline and the shared `SandTray` renderer.
- No external runtime framework or new dependency.
- Use actual HTML controls and browser APIs for file selection, media seeking, dialog semantics and color selection.
- Preserve keyboard and touch access. Add explicit labels and useful alt text. Keep visible focus and disabled states.
- Treat host-owned resources honestly: file dropzone selects files but does not upload; upload queue exposes lifecycle events but does not implement transport; carousel/lightbox display supplied image URLs; scrubber binds to an existing audio/video element.
- Ensure component reconnect/disconnect does not leave event listeners stale, focus trapped or controls detached.
- Respect reduced-motion settings for decorative motion while keeping state changes and input behavior immediate.
- Keep each demo specific and interactive. Do not use mock screenshots as proof of runtime functionality.

## Component 30: File Dropzone

**Element:** `sand-dropzone`

**Material concept:** A file tile lands in a recessed walnut tray. The accepting edge brightens during drag-over and sand settles when a valid file is accepted.

**API:** `accept`, `multiple`, `max-size` (bytes), `disabled`, `label`; `files`, `addFiles(files)`, `clear()`; `files-change` and `file-reject` events.

**Acceptance:** Native picker works by keyboard/touch; MIME wildcard, exact MIME and extension filtering work; individual size limit is enforced; clear and disabled states work; rejected files have readable reasons; no network upload is implied.

## Component 31: Upload Queue

**Element:** `sand-upload-queue`

**Material concept:** Each file is a tile in a walnut transfer channel with its own progress ridge and state.

**API:** `addFiles(files)`, `update(id, {status, progress, error})`, `remove(id)`, `clear()`; states are queued, uploading, complete, error and cancelled; events include `upload-request`, `upload-cancel`, `retry-request` and `queue-change`.

**Acceptance:** Multiple files retain independent IDs and progress; progress clamps to 0–100; 100% uploading completes the item; cancel and retry requests reach the host; clear and remove are deterministic. The component does not perform HTTP requests.

## Component 32: Image Carousel

**Element:** `sand-carousel`

**Material concept:** Real photographs sit in framed walnut plates. A stone marker tracks the current frame along a shallow sand channel.

**API:** `items = [{src, alt, caption}]`, `index`, `go(index)`; `change` event.

**Acceptance:** Safe HTTP(S), blob and data:image sources only; useful alt text; previous/next and indexed dots; wrap behavior; Left/Right keyboard navigation; touch swipe; disabled state and empty state.

## Component 33: Lightbox Gallery

**Element:** `sand-lightbox`

**Material concept:** Thumbnail plates sit in a walnut tray. A selected photograph lifts into a full-screen viewing frame.

**API:** `items = [{src, alt, caption}]`, `openAt(index, opener)`, `close()`; `open`, `change` and `close` events.

**Acceptance:** Real thumbnail images with accessible labels; native `dialog.showModal()`; previous/next and arrow keys; Escape, Close and backdrop dismissal; focus restoration to the original opener; preserve thumbnail focus while changing the displayed image.

## Component 34: Media Scrubber

**Element:** `sand-scrubber`

**Material concept:** A raked channel represents the timeline. A stone marks playhead position and a lighter ridge shows buffered media.

**API:** Assign `media = HTMLMediaElement`; the element reads duration, currentTime and buffered ranges; delegates play/pause; emits `seek` and `seeked`.

**Acceptance:** Binds to an actual audio/video element; range input supports keyboard and touch; play/pause delegates to the media element; seeking updates currentTime; time/buffer state tracks native media events; listeners are rebound on reconnect and removed on disconnect.

## Component 35: Color Picker

**Element:** `sand-color-picker`

**Material concept:** Mineral pigment stones sit beside a sample well. The selected mineral updates the sample and color value.

**API:** `value`, `format=hex|rgb|hsl`, `label`, `name`, `disabled`; native color input; `input` and `change` events; form-associated value support.

**Acceptance:** Native browser color dialog; usable preset swatches; normalized 6-digit hexadecimal; hex/RGB/HSL readout; disabled state; keyboard focus; ElementInternals form submission and reset.

## Phase-level definition of done

1. All six standalone bundles match the build manifest and contain only their required embedded sounds and shared engine.
2. Each component has a working demo, component guide, gallery card, registry entry and concept SVG.
3. The generated documentation and `llms.txt` match `tools/spec.mjs`.
4. The automated mobile Chromium suite covers file filtering/size, queue lifecycle events, image navigation, dialog focus restoration, media seek and reconnect, color formats, disabled state and form submission.
5. The original 29 components continue to pass all regression checks.
6. GitHub Actions build synchronization, docs generation and 35-component browser suite pass on the final `main` commit.
7. Manual screen-reader, physical-device and broader cross-browser checks are recorded separately; a headless Chromium pass does not prove them.
