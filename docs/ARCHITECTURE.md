# Architecture

## Current architecture

GrainMotion-UI is currently a browser-native custom-element library. It is not a React or Vue component package. Each published control is a plain JavaScript file that registers a custom element and can be loaded through a normal script tag.

The repository now contains twenty-four controls. The original four remain the reference implementations:

- `slider/slider.js` registers `<sand-slider>`.
- `toggle/toggle.js` registers `<sand-toggle>`.
- `signature/signature.js` registers `<sand-signature>`.
- `thinking/thinking.js` registers `<sand-thinking>`.

Phase 1 adds five standalone controls:

- `checkbox/checkbox.js` registers `<sand-checkbox>`.
- `radio-group/radio-group.js` registers `<sand-radio-group>`.
- `segmented/segmented.js` registers `<sand-segmented>`.
- `range/range.js` registers `<sand-range>`.
- `rating/rating.js` registers `<sand-rating>`.

The Phase 1 controls reuse the same shared engine and embed only the sound assets configured for that control in `tools/build.mjs`.

Phase 2 adds five text and structured-input controls:

- `input/input.js` registers `<sand-input>`.
- `textarea/textarea.js` registers `<sand-textarea>`.
- `password/password.js` registers `<sand-password>`.
- `search/search.js` registers `<sand-search>`.
- `otp/otp.js` registers `<sand-otp>`.

Phase 3 adds five native selection/calendar/time controls:

- `select/select.js` registers `<sand-select>`.
- `combobox/combobox.js` registers `<sand-combobox>`.
- `date-picker/date-picker.js` registers `<sand-date-picker>`.
- `date-range/date-range.js` registers `<sand-date-range>`.
- `time-picker/time-picker.js` registers `<sand-time-picker>`.

Phase 3 keeps native `<select>`, `<input list>`, `<input type=date>` and `<input type=time>` elements as the accessible controls. The sand tray is supplemental feedback. Date values use ISO calendar strings and time values use timezone-free HH:MM strings; no local timezone conversion is performed.

Phase 4 adds five progress and activity controls:

- `progress/progress.js` registers `<sand-progress>`.
- `progress-ring/progress-ring.js` registers `<sand-progress-ring>`.
- `steps/steps.js` registers `<sand-steps>`.
- `timer/timer.js` registers `<sand-timer>`.
- `loader/loader.js` registers `<sand-loader>`.

Progress Bar and Progress Ring expose determinate/indeterminate progressbar semantics. Step Indicator uses native buttons for each step and is form-associated. Hourglass Timer uses native action buttons and requestAnimationFrame elapsed-time accounting. Loading Indicator exposes status/aria-busy and holds its rake still when reduced motion is requested.

These five controls create a real browser-native `input` or `textarea` as a child of the custom element and position it above the sand canvases. The sand remains a separate visual layer. Typed content, password characters and OTP digits are not rendered into the sand texture or 2D concept artwork. Each standalone script contains a local `SandNativeField` helper, the shared engine and only its configured sound assets.

## Runtime layers

### 1. Sand simulation and renderer

[`core.js`](../core.js) is the shared engine source. It provides the sand tray, height-field state, relaxation behavior, rendering and shared sound facilities.

The current engine uses:

- A height-field simulation stored in a `Float32Array`.
- A simulation grid sized in relation to CSS dimensions.
- Sand relaxation toward a talus/angle-of-rest threshold.
- A WebGL2 shader for surface lighting and material appearance.
- A 2D overlay canvas for sprites such as tools and other elements.
- Optional stone rendering and shared sound playback via Web Audio.

The engine is intentionally not a public framework abstraction. New components should use the documented GrainMotion-UI skill and inspect the actual engine source before depending on internal members.

### 2. Component custom elements

The existing controls extend the shared `SandTray` base exposed through `window.GrainMotionUI`. The documented lifecycle points are:

- `aspect`: component height relative to width.
- `init()`: set up semantics, keyboard behavior and event listeners.
- `layout()`: initialize component geometry after sizing.
- `step(dt)`: update component state and sand movement.
- `sprites()`: draw non-sand visual elements on the overlay.

The skill documents additional engine helpers such as `relax`, `lines`, `groove`, `push` and stone rendering. These are internal implementation facilities and should be reviewed in source before use.

### 3. Standalone distribution

[`tools/build.mjs`](../tools/build.mjs) stamps the contents of `core.js`, configured audio assets and any configured artwork into each component JavaScript file. As a result, each component file can be loaded independently without a runtime dependency on a separate engine file.

This creates a maintenance obligation: when the shared engine, sounds or embedded art change, generated component files and the skill's copied core need to be rebuilt and checked.

### 4. Specification and generated documentation

[`tools/spec.mjs`](../tools/spec.mjs) is the current source of truth for all twenty-four component descriptions, demos, usage snippets, attributes, interaction narratives and known component-specific limits. The five Phase 1 entries use `manualDocs` because their expanded READMEs and demo pages are maintained as full hand-authored technical documents; their metadata still feeds the generated registry and `llms.txt`.

[`tools/docs.mjs`](../tools/docs.mjs) generates:

- Each component's `README.md`.
- Each component's `index.html` demo page.
- `registry.json` for shadcn CLI distribution.
- `llms.txt` for AI-readable project documentation.

Do not hand-edit generated files without also updating the source specification. Otherwise the next generation run can overwrite the changes.

### 5. Gallery and hosting

- `gallery/index.html` loads all twenty-four component scripts and wires their examples.
- Component demo pages live in their component folders.
- The site is deployed to GitHub Pages by `.github/workflows/pages.yml`.
- The current repository does not define a framework-based bundling pipeline for the controls.

## Expansion architecture targets

The following are recommendations, not current capabilities:

1. **Lifecycle:** define explicit initialization, visibility suspension, disconnection cleanup and re-connection behavior.
2. **Renderer budgeting:** prevent the gallery from starting all expensive WebGL previews at once. Prefer lazy activation and measured limits.
3. **Shared resources:** assess whether multiple components can safely share rendering resources without changing the standalone-file guarantee.
4. **Fallbacks:** controls should preserve useful semantics and operation if WebGL2 or audio is unavailable.
5. **Specification:** extend the existing `SPEC` structure with structured API definitions, accessibility requirements, test cases, asset references, demo metadata and known limitations.
6. **Generated docs:** generate component catalog and registry output from the same validated specification.
7. **Regression:** every shared-engine change must be exercised against all nineteen controls, with particular attention to the original four reference components.

## Safe change sequence

1. Read the current implementation and matching generated specification.
2. Write down the proposed behavior and API before implementation.
3. Create a new component folder rather than replacing an existing control.
4. Implement the smallest meaningful behavior.
5. Test the new component in isolation.
6. Run shared-engine and original-component regression checks.
7. Update the source specification and regenerate docs/registry.
8. Verify generated files and deployment output.
