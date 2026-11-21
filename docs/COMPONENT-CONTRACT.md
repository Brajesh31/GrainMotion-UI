# GrainMotion-UI Component Contract

**Status:** Foundation contract for all current and future GrainMotion-UI components.  
**Applies to:** The original four components and all 46 additions.

This contract defines the quality and integration rules every component must meet. It does not pretend every component has an identical API. Each component keeps the API that fits its actual control, while sharing predictable naming, lifecycle, accessibility, documentation and release expectations.

## 1. Component identity and source layout

Every component must have:

- A stable lowercase folder ID.
- One custom-element tag prefixed with `sand-`.
- One standalone browser JavaScript file at `<id>/<id>.js`.
- One working demo at `<id>/index.html`.
- One technical guide at `<id>/README.md`.
- A source-specification entry in `tools/spec.mjs`.
- A build-asset mapping in `tools/build.mjs` when the component needs sound or embedded art.
- A registry entry in `registry.json`.
- Gallery discovery and working navigation.

The original four are protected reference implementations. New components must meet their visual/material quality without copying their interaction metaphor indiscriminately.

## 2. Runtime and loading

- Use native browser APIs and custom elements. Do not add a runtime framework dependency to the browser component layer.
- A documented standalone script path must register its custom element without requiring the host to fetch `core.js` or asset files separately.
- The first loaded component initializes the shared `window.GrainMotionUI` runtime; subsequent component scripts must reuse it safely.
- Shared runtime source changes must be regenerated with `node tools/build.mjs`, then verified with `node tools/build.mjs --check`.
- Do not hand-edit generated copies of the core block inside component bundles.
- Loading the same component script more than once must not cause duplicate custom-element registration errors.
- Components must not require a particular application framework, bundler or CSS reset.

## 3. Public API

Each component guide must distinguish:

- HTML attributes and their defaults.
- JavaScript properties and their read/write behavior.
- Methods, including return values and error/empty-state behavior.
- Events, including event names, detail payloads, and whether they bubble or are composed.
- Form behavior, including `name`, submitted value, disabled state, required validity, reset and restoration when applicable.
- CSS sizing and any supported styling hooks.
- Supported state values and invalid-value handling.

Use familiar platform names such as `value`, `checked`, `disabled`, `required`, `name`, `min`, `max` and `step` where they fit the control. Do not force unrelated components to expose artificial common properties.

Public APIs must be deterministic. Setting a property or attribute must produce the documented state, event sequence and rendered state. Avoid silent coercions that can surprise the host application.

## 4. State and event behavior

- The visual state must follow the actual control state, not act as a separate animation-only state.
- User input must emit the documented input/change or component-specific event at the documented time.
- Programmatic state changes must follow the component's documented event policy.
- Repeated input, rapid state changes and interrupted animation must not desynchronize the API and rendering.
- Invalid values must be clamped, rejected or reported according to the component guide.
- Async callbacks, timers and queued animation work must not update a disconnected or replaced component.

## 5. Accessibility

Every interactive component must provide:

- A correct role or native semantic element.
- A programmatically determinable accessible name.
- Current value/state and relevant descriptions.
- Visible focus indication and logical focus order.
- Keyboard operation for all essential actions.
- Non-drag alternatives for drag-only workflows.
- Appropriate disabled, invalid, required and busy state semantics.
- Reduced-motion behavior that preserves information and functionality.
- No state communicated only through color, sound, texture or motion.
- A usable path when WebGL2, Canvas 2D or Web Audio is unavailable.

Screen-reader claims must name the browser and assistive technology actually tested. Automated ARIA assertions are not a substitute for manual announcement testing.

## 6. Pointer, touch and responsive behavior

- Support pointer input without blocking normal page scrolling unnecessarily.
- Use correct touch-action behavior for the interaction axis.
- Avoid pointer capture or global listeners remaining active after cancellation or disconnection.
- Define how the control behaves during resize, orientation change and viewport zoom.
- Keep touch targets usable and content inside the viewport at narrow widths.
- Every drag interaction must have a keyboard or explicit button alternative when practical.

## 7. Rendering, simulation and lifecycle

- WebGL is progressive visual enhancement, not the source of truth for control state.
- A failed WebGL2 context must produce a readable, usable fallback rather than an empty control.
- Handle shader compilation and context initialization failures with a diagnosable state.
- Define creation and release of WebGL buffers, textures, programs and contexts.
- Define animation-frame ownership and cancel scheduled work on disconnect.
- Disconnect observers and event listeners on teardown; reconnecting must restore one functioning instance without duplicate work.
- Test `webglcontextlost` and restoration behavior, or clearly document an unsupported limitation until fixed.
- Pause or reduce off-screen work and enforce a measured renderer/context budget for gallery usage.
- Do not claim memory or performance limits without measurements.

## 8. Visual and material quality

Every component must:

- Use the established warm sand, walnut, bamboo, river-stone and basalt language where appropriate.
- Have a clear physical metaphor connected to its real interaction.
- Preserve readable edges, shadows, contact points, grain, grooves and displaced material at the target size.
- Render correctly at its supported narrow, medium and wide dimensions.
- Keep labels/readouts legible and outside the sand surface unless they are intentionally part of the physical object.
- Avoid clipping, stretched textures, flat placeholder visuals, inconsistent frames and unexplained layout shifts.
- Have screenshots for initial, active, disabled and other important states.
- Match the original-four visual standard, not just the current implementation average.

## 9. Security and privacy

- Treat host-provided labels, option text, captions, filenames and data as untrusted.
- Prefer `textContent` and safe DOM construction for plain text.
- Validate URLs before assigning navigable or media sources.
- Never evaluate user-provided code or construct executable script from component data.
- Do not log passwords, OTPs, signature payloads or other user-entered values.
- Keep file acceptance validation separate from any server-side security decision; client-side MIME and size checks are not a security boundary.
- Do not embed credentials, tokens or private endpoints in component source or generated bundles.

## 10. Component documentation requirements

Each `<id>/README.md` must contain:

1. Purpose and physical interaction concept.
2. Browser support and prerequisites.
3. Installation/loading snippet.
4. Minimal HTML example.
5. JavaScript usage example.
6. Complete attributes/properties/methods/events reference.
7. Form behavior where relevant.
8. Keyboard and pointer/touch behavior.
9. Accessibility and reduced-motion behavior.
10. Sizing, styling and responsive rules.
11. Known limits and unsupported scenarios.
12. Troubleshooting.
13. Test evidence, including environment and known failures.

Do not document an API feature solely because it was planned. Confirm it against the source and tests.

## 11. Test and audit requirements

Each component must have applicable checks for:

- Registration and duplicate loading.
- Defaults, attributes and property reflection.
- Value/state transitions and events.
- Keyboard, pointer and touch behavior.
- Form submission, reset and validity when applicable.
- Accessible role, name, state and focus.
- Reduced-motion and no-WebGL behavior.
- Resize, disconnect and reconnect lifecycle.
- Empty, invalid, disabled, loading and error states.
- Screenshots at key animation states.
- Performance and resource cleanup.

A component is release-verified only when its own checks and the full shared regression suite pass. Source presence, a demo page, a generated README or a passing build check alone is not verification.

## 12. Change policy

- Change one component phase at a time.
- Preserve public APIs unless a documented breaking change is intentional.
- Any shared-core modification must trigger the full 50-component regression suite.
- Keep the original four in every shared-engine regression run.
- Record defects with severity, reproduction steps, expected behavior, actual behavior and verification evidence.
- Do not mark a phase complete while its release-blocking failures remain open.
